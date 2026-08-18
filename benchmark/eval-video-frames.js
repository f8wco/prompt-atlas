'use strict';
/* Video smoke evaluation: extract frames with ffmpeg, then VLM-judge FRAME SEQUENCES
   (6 frames per clip) per the temporal criteria in docs/BENCHMARK.md 4.2.
   Red line: video terms are judged on CONTINUOUS FRAMES, never a single mid-frame.
   dolly zoom requires BOTH subject-scale stability AND background perspective change.
   Usage: node benchmark/eval-video-frames.js */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const KEY = env.match(/ARK_API_KEY=(.+)/)[1].trim();
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', 'video-smoke-001.json'), 'utf8'));
const runId = manifest.runId;
const vidDir = path.join(__dirname, 'results', 'videos', runId);
const frameDir = path.join(__dirname, 'results', 'video-frames', runId);
fs.mkdirSync(frameDir, { recursive: true });
const evalFile = path.join(__dirname, 'results', 'evaluations-' + runId + '.jsonl');

const obs = fs.readFileSync(path.join(__dirname, 'results', 'observations-' + runId + '.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const done = {};
if (fs.existsSync(evalFile)) {
  fs.readFileSync(evalFile, 'utf8').trim().split('\n').filter(Boolean).forEach(l => { done[JSON.parse(l).observationKey] = true; });
}

const FPS = 24, DUR = manifest.duration, N_FRAMES = manifest.evaluator.framesPerClip;

function extractFrames(videoFile, clipId) {
  const outDir = path.join(frameDir, clipId);
  if (fs.existsSync(outDir) && fs.readdirSync(outDir).filter(f => f.endsWith('.jpg')).length >= N_FRAMES) return outDir;
  fs.mkdirSync(outDir, { recursive: true });
  // 6 evenly-spaced frames across 5s
  const interval = DUR / N_FRAMES;
  for (let i = 0; i < N_FRAMES; i++) {
    const t = (i * interval + interval / 2).toFixed(2);
    try {
      execSync(`ffmpeg -y -ss ${t} -i "${videoFile}" -frames:v 1 -q:v 2 "${outDir}/f${i}.jpg"`, { stdio: 'pipe' });
    } catch (e) { console.error('  ffmpeg err t=' + t + ': ' + e.message.slice(0, 100)); }
  }
  return outDir;
}

function judgeFrames(b64Frames, question) {
  return new Promise((resolve, reject) => {
    const content = [{ type: 'text', text: question }];
    b64Frames.forEach((b64, i) => {
      content.push({ type: 'text', text: 'Frame ' + (i + 1) + ' of ' + b64Frames.length + ':' });
      content.push({ type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + b64 } });
    });
    const body = JSON.stringify({ model: 'doubao-seed-2-0-lite-260215', messages: [{ role: 'user', content }] });
    const req = https.request({
      hostname: 'ark.cn-beijing.volces.com', path: '/api/v3/chat/completions', method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY, 'Content-Length': Buffer.byteLength(body) },
      timeout: 180000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d || '{}');
          if (!j.choices || !j.choices[0]) return resolve({ err: 'status ' + res.statusCode });
          const ans = String(j.choices[0].message.content || '').trim().toUpperCase();
          resolve({ judgment: ans.indexOf('YES') !== -1 ? 1 : 0, raw: ans.slice(0, 200) });
        } catch (e) { resolve({ err: 'parse' }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.write(body); req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('clips to evaluate: ' + obs.filter(o => !done[o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition]).length);
  let ok = 0, fail = 0;
  for (const o of obs) {
    const key = o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition;
    if (done[key]) continue;
    const videoFile = path.join(vidDir, o.videoFile);
    if (!fs.existsSync(videoFile)) { console.error('MISSING video ' + o.videoFile); fail++; continue; }
    const q = manifest.evaluator.questions[o.atomId];
    if (!q) { console.error('no question for ' + o.atomId); fail++; continue; }
    const clipId = o.videoFile.replace('.mp4', '');
    try {
      console.log('EVAL ' + clipId);
      const dir = extractFrames(videoFile, clipId);
      const frames = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
      if (frames.length < 3) { console.error('  too few frames: ' + frames.length); fail++; continue; }
      const b64s = frames.map(f => fs.readFileSync(path.join(dir, f)).toString('base64'));
      const r = await judgeFrames(b64s, q);
      if (r.err) { console.error('FAIL ' + key + ' ' + r.err); fail++; continue; }
      fs.appendFileSync(evalFile, JSON.stringify({
        benchmarkVersion: manifest.benchmarkVersion, runId, observationKey: key,
        atomId: o.atomId, model: o.model, sceneTemplate: o.sceneTemplate, condition: o.condition,
        question: q, evaluator: { type: 'frame-sequence-vlm', model: 'doubao-seed-2-0-lite-260215', frames: frames.length },
        rawAnswer: r.raw, judgment: r.judgment, createdAt: new Date().toISOString()
      }) + '\n');
      done[key] = true; ok++;
      console.log('OK ' + key + ' => ' + r.judgment + ' (' + r.raw.slice(0, 80) + ')');
    } catch (e) { fail++; console.error('ERR ' + key + ' ' + e.message); }
    await sleep(500);
  }
  console.log('DONE evaluated=' + ok + ' failed=' + fail);
  // summary
  const evals = fs.readFileSync(evalFile, 'utf8').trim().split('\n').map(JSON.parse);
  const byAtom = {};
  evals.forEach(e => {
    const a = e.atomId; byAtom[a] = byAtom[a] || { treat: 0, treatN: 0, ctrl: 0, ctrlN: 0 };
    if (e.condition === 'treatment') { byAtom[a].treat += e.judgment; byAtom[a].treatN++; }
    else { byAtom[a].ctrl += e.judgment; byAtom[a].ctrlN++; }
  });
  console.log('\n=== VIDEO SMOKE SUMMARY ===');
  Object.keys(byAtom).sort().forEach(a => {
    const s = byAtom[a];
    const A = s.treatN ? Math.round(100 * s.treat / s.treatN) : '-';
    const B = s.ctrlN ? Math.round(100 * s.ctrl / s.ctrlN) : '-';
    console.log(a.padEnd(16), 'adherence=' + A + '%', 'baseline=' + B + '%', 'lift=+' + (A !== '-' && B !== '-' ? A - B : '-'));
  });
})().catch(e => { console.error(e); process.exit(1); });
