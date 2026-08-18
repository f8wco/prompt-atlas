'use strict';
/* Video smoke generator: Ark contents/generations API (task-based, poll until done).
   4 motion atoms x 2 model families x 2 scenes x 2 conditions = 32 clips x 5s.
   Resume-safe (skips existing files). Records observations like image runs.
   Usage: node benchmark/run-video-smoke.js [--limit N] */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const KEY = env.match(/ARK_API_KEY=(.+)/)[1].trim();
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', 'video-smoke-001.json'), 'utf8'));
const runId = manifest.runId;

const args = process.argv.slice(2);
function argVal(name, fallback) { const i = args.indexOf(name); return i !== -1 && args[i + 1] ? args[i + 1] : fallback; }
const limit = parseInt(argVal('--limit', '999'), 10);

const vidDir = path.join(__dirname, 'results', 'videos', runId);
fs.mkdirSync(vidDir, { recursive: true });
const obsFile = path.join(__dirname, 'results', 'observations-' + runId + '.jsonl');

function req(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({
      hostname: 'ark.cn-beijing.volces.com', path: apiPath, method: method,
      headers: Object.assign({ Authorization: 'Bearer ' + KEY }, data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}),
      timeout: 180000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d || '{}') }); } catch (e) { resolve({ status: res.statusCode, body: { raw: String(d).slice(0, 200) } }); } });
    });
    r.on('error', reject);
    r.on('timeout', () => r.destroy(new Error('timeout')));
    if (data) r.write(data);
    r.end();
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const r = https.get({ hostname: u.hostname, path: u.pathname + u.search, timeout: 300000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) { res.resume(); return download(res.headers.location, dest).then(resolve, reject); }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on('finish', () => ws.close(resolve));
      ws.on('error', reject);
    });
    r.on('error', reject);
    r.on('timeout', () => r.destroy(new Error('download timeout')));
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function generateOne(model, prompt, id) {
  // Ark video: POST /api/v3/contents/generations -> task id -> poll
  const r = await req('POST', '/api/v3/contents/generations/tasks', {
    model: model,
    content: [{ type: 'text', text: prompt + ' --resolution 720p --duration 5' }]
  });
  if (r.status !== 200 || !r.body.id) {
    const msg = (r.body.error && r.body.error.message) || JSON.stringify(r.body).slice(0, 200);
    throw new Error('submit ' + r.status + ' ' + msg);
  }
  const taskId = r.body.id;
  for (let poll = 0; poll < 80; poll++) {
    await sleep(5000);
    const p = await req('GET', '/api/v3/contents/generations/tasks/' + taskId, null);
    const st = p.body.status;
    if (st === 'succeeded') {
      const url = p.body.content && p.body.content.video_url;
      if (!url) throw new Error('succeeded but no video_url');
      return { url, requestId: taskId };
    }
    if (st === 'failed') throw new Error('task failed: ' + JSON.stringify(p.body.error || {}).slice(0, 200));
    // still running/queued
  }
  throw new Error('poll timeout for ' + id);
}

(async () => {
  const tasks = [];
  manifest.models.forEach(model => {
    manifest.atoms.forEach(atom => {
      manifest.scenes.forEach(scene => {
        manifest.conditions.forEach(cond => {
          const prompt = cond === 'treatment' ? scene.prompt + ', ' + atom : scene.prompt;
          tasks.push({ model, atom, scene, cond, prompt });
        });
      });
    });
  });
  console.log('video smoke: ' + tasks.length + ' clips (limit ' + limit + ')');
  let done = 0, skipped = 0, failed = 0;
  for (const t of tasks.slice(0, limit)) {
    const id = [t.model.split('-').slice(-2).join(''), t.atom.replace(/[^a-z0-9]+/g, '-'), t.scene.id, t.cond].join('__');
    const file = path.join(vidDir, id + '.mp4');
    if (fs.existsSync(file) && fs.statSync(file).size > 100000) { skipped++; continue; }
    try {
      console.log('SUBMIT ' + id);
      const g = await generateOne(t.model, t.prompt, id);
      await download(g.url, file);
      const sha = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
      fs.appendFileSync(obsFile, JSON.stringify({
        benchmarkVersion: manifest.benchmarkVersion, runId: runId, atomId: t.atom,
        modality: 'video', model: t.model, sceneTemplate: t.scene.id, condition: t.cond,
        seed: 1, duration: manifest.duration, prompt: t.prompt,
        videoFile: id + '.mp4', videoSha256: sha,
        requestId: g.requestId, createdAt: new Date().toISOString()
      }) + '\n');
      done++;
      console.log('OK ' + id + ' (' + (fs.statSync(file).size / 1048576).toFixed(1) + ' MB)');
    } catch (e) {
      failed++;
      console.error('FAIL ' + id + ' -> ' + e.message);
      fs.appendFileSync(path.join(__dirname, 'results', 'failures-' + runId + '.jsonl'), JSON.stringify({
        runId: runId, atomId: t.atom, model: t.model, sceneTemplate: t.scene.id, condition: t.cond,
        generationStatus: /balance|quota|limit/i.test(e.message) ? 'provider_error' : 'provider_error',
        message: String(e.message).slice(0, 300), loggedAt: new Date().toISOString()
      }) + '\n');
      if (/balance|quota|insufficient/i.test(e.message)) { console.error('STOPPING: balance'); break; }
    }
    await sleep(2000);
  }
  console.log('DONE ok=' + done + ' skipped=' + skipped + ' failed=' + failed);
  process.exit(failed > 0 ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
