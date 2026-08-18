'use strict';
/* Cross-judge validation: re-judges a deterministic sample of a run's observations
   with an INDEPENDENT vendor VLM (Zhipu GLM-4V-Flash, free tier) and reports
   agreement against the final (deduped + audited) doubao judgments.
   Purpose: quantify judge bias risk (generator=Seedream, judge=doubao, same vendor).
   Usage: node benchmark/cross-judge.js --run image-baseline-004 --sample 100 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const args = process.argv.slice(2);
function argVal(name, fallback) { const i = args.indexOf(name); return i !== -1 && args[i + 1] ? args[i + 1] : fallback; }
const runId = argVal('--run', 'image-baseline-004');
const sampleN = parseInt(argVal('--sample', '100'), 10);
const MODEL = argVal('--model', 'glm-4v-flash');

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const ZHIPU_KEY = env.match(/ZHIPU_API_KEY=(.+)/)[1].trim();

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', runId + '.json'), 'utf8'));
const obs = fs.readFileSync(path.join(__dirname, 'results', 'observations-' + runId + '.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const evLines = fs.readFileSync(path.join(__dirname, 'results', 'evaluations-' + runId + '.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const final = {};
evLines.forEach(e => { final[e.observationKey] = e.judgment; });

// deterministic sample: sort by key, take every k-th
const keys = obs.map(o => ({
  key: o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition + (o.seed > 1 ? '__s' + o.seed : ''),
  o
})).filter(x => final[x.key] !== undefined).sort((a, b) => a.key < b.key ? -1 : 1);
const step = Math.max(1, Math.floor(keys.length / sampleN));
const sample = keys.filter((_, i) => i % step === 0).slice(0, sampleN);

function judge(b64, question) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: [
        { type: 'text', text: question },
        { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + b64 } }
      ] }]
    });
    const req = https.request({
      hostname: 'open.bigmodel.cn', path: '/api/paas/v4/chat/completions', method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + ZHIPU_KEY, 'Content-Length': Buffer.byteLength(body) },
      timeout: 120000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d || '{}');
          if (!j.choices || !j.choices[0]) return resolve({ err: 'status ' + res.statusCode + ' ' + String(d).slice(0, 120) });
          const ans = String(j.choices[0].message.content || '').trim().toUpperCase();
          resolve({ judgment: ans.indexOf('YES') !== -1 ? 1 : 0, raw: ans.slice(0, 60) });
        } catch (e) { resolve({ err: 'parse: ' + String(d).slice(0, 120) }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.write(body); req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let agree = 0, disagree = 0, errs = 0;
  const disagreements = [];
  for (let i = 0; i < sample.length; i++) {
    const s = sample[i];
    const q = manifest.evaluator.questions[s.o.atomId];
    if (!q) { errs++; continue; }
    try {
      const b64 = fs.readFileSync(path.join(__dirname, 'results', 'images', runId, s.o.imageFile)).toString('base64');
      const r = await judge(b64, q);
      if (r.err) { errs++; console.error('ERR ' + s.key + ' ' + r.err); }
      else if (r.judgment === final[s.key]) agree++;
      else { disagree++; disagreements.push({ key: s.key, doubao: final[s.key], glm: r.judgment, glmRaw: r.raw }); console.log('DISAGREE ' + s.key + ' doubao=' + final[s.key] + ' glm=' + r.judgment); }
    } catch (e) { errs++; console.error('ERR ' + s.key + ' ' + e.message); }
    await sleep(600);
    if ((i + 1) % 10 === 0) console.log('progress ' + (i + 1) + '/' + sample.length);
  }
  const total = agree + disagree;
  const report = {
    crossJudge: MODEL, runId, sampleSize: sample.length, judged: total,
    agree, disagree, errors: errs,
    agreement: total ? Math.round(100 * agree / total) : null,
    disagreements, generatedAt: new Date().toISOString(),
    note: 'Independent-vendor judge (Zhipu GLM-4V) vs final doubao judgments (post dual-pass + human audit). Quantifies same-vendor judge-bias risk.'
  };
  fs.writeFileSync(path.join(__dirname, 'results', 'cross-judge-' + runId + '.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log('\nCROSS-JUDGE RESULT: ' + agree + '/' + total + ' agree (' + report.agreement + '%) | ' + disagree + ' disagree | ' + errs + ' errors');
  console.log('written: results/cross-judge-' + runId + '.json');
})().catch(e => { console.error(e); process.exit(1); });
