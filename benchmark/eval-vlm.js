'use strict';
/* VLM evaluator: judges adherence for every generated image (control AND treatment).
   Reads ARK_API_KEY from env. Model: doubao-seed-2-0-lite-260215 (multimodal).
   Usage: node benchmark/eval-vlm.js [--limit N] [--model <id>]
   Outputs: benchmark/results/evaluations-<runId>.jsonl (raw judgments, committed) */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.ARK_API_KEY;
if (!API_KEY) { console.error('ARK_API_KEY env var is required'); process.exit(2); }

const manifestPath = path.join(__dirname, 'manifests', 'image-baseline-001.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const runId = manifest.runId;

const args = process.argv.slice(2);
function argVal(name, fallback) { const i = args.indexOf(name); return i !== -1 && args[i + 1] ? args[i + 1] : fallback; }
const limit = parseInt(argVal('--limit', '999999'), 10);
const VLM_MODEL = argVal('--model', 'doubao-seed-2-0-lite-260215');

const obsFile = path.join(__dirname, 'results', 'observations-' + runId + '.jsonl');
const evalFile = path.join(__dirname, 'results', 'evaluations-' + runId + '.jsonl');
const imgDir = path.join(__dirname, 'results', 'images', runId);

if (!fs.existsSync(obsFile)) { console.error('no observations file: ' + obsFile); process.exit(2); }
const observations = fs.readFileSync(obsFile, 'utf8').trim().split('\n').filter(Boolean).map(function (l) { return JSON.parse(l); });

// already evaluated?
const done = {};
if (fs.existsSync(evalFile)) {
  fs.readFileSync(evalFile, 'utf8').trim().split('\n').filter(Boolean).forEach(function (l) {
    const e = JSON.parse(l);
    done[e.observationKey] = true;
  });
}

function postChat(b64, question) {
  return new Promise(function (resolve, reject) {
    const body = JSON.stringify({
      model: VLM_MODEL,
      messages: [{ role: 'user', content: [
        { type: 'text', text: question },
        { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + b64 } }
      ] }]
    });
    const u = new URL('https://ark.cn-beijing.volces.com/api/v3/chat/completions');
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + API_KEY, 'Content-Length': Buffer.byteLength(body) },
      timeout: 120000
    }, function (res) {
      let d = '';
      res.on('data', function (c) { d += c; });
      res.on('end', function () {
        try { resolve({ status: res.statusCode, body: JSON.parse(d || '{}') }); }
        catch (e) { resolve({ status: res.statusCode, body: { raw: d } }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', function () { req.destroy(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

async function main() {
  let doneCount = 0, failed = 0;
  const todo = observations.filter(function (o) { return !done[o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition]; }).slice(0, limit);
  console.log('VLM model: ' + VLM_MODEL + ' | to evaluate: ' + todo.length + ' (already done: ' + (observations.length - todo.length) + ')');

  for (const o of todo) {
    const key = o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition;
    const imgPath = path.join(imgDir, o.imageFile);
    if (!fs.existsSync(imgPath)) { console.error('MISSING image ' + o.imageFile); failed++; continue; }
    const question = manifest.evaluator.questions[o.atomId];
    if (!question) { console.error('no question for ' + o.atomId); failed++; continue; }
    try {
      const b64 = fs.readFileSync(imgPath).toString('base64');
      const r = await postChat(b64, question);
      if (r.status !== 200 || !r.body.choices || !r.body.choices[0]) {
        failed++;
        console.error('FAIL ' + key + ' -> ' + r.status + ' ' + JSON.stringify(r.body).slice(0, 200));
        await sleep(2000);
        continue;
      }
      const answer = String(r.body.choices[0].message.content || '').trim().toUpperCase();
      const judgment = answer.indexOf('YES') !== -1 ? 1 : 0;
      const rec = {
        benchmarkVersion: manifest.benchmarkVersion,
        runId: runId,
        observationKey: key,
        atomId: o.atomId,
        model: o.model,
        sceneTemplate: o.sceneTemplate,
        condition: o.condition,
        question: question,
        evaluator: { type: manifest.evaluator.type, model: VLM_MODEL },
        rawAnswer: answer,
        judgment: judgment,
        usage: r.body.usage || null,
        createdAt: new Date().toISOString()
      };
      fs.appendFileSync(evalFile, JSON.stringify(rec) + '\n');
      done[key] = true;
      doneCount++;
      console.log('OK ' + key + ' => ' + judgment);
    } catch (e) {
      failed++;
      console.error('ERR ' + key + ' -> ' + e.message);
    }
    await sleep(300);
  }
  console.log('DONE evaluated=' + doneCount + ' failed=' + failed);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });
