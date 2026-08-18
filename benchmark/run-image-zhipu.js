'use strict';
/* Benchmark generator: Zhipu CogView (third model family).
   Same record format as run-image-baseline.js so eval/aggregate work unchanged.
   Reads ZHIPU_API_KEY from benchmark/.env.local (never committed).
   Usage: node benchmark/run-image-zhipu.js [--limit N]
   Outputs images + observations-image-baseline-003.jsonl. Resume-safe. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const API_KEY = (env.match(/ZHIPU_API_KEY=(.+)/) || [])[1].trim();

const args0 = process.argv.slice(2);
function argVal0(name, fallback) { const i = args0.indexOf(name); return i !== -1 && args0[i + 1] ? args0[i + 1] : fallback; }
const runIdArg = argVal0('--run', 'image-baseline-003');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', runIdArg + '.json'), 'utf8'));
// the zhipu runner ALWAYS generates with CogView-4; the labeled model must be the
// zhipu entry of the manifest — never manifest.models[0] (multi-family manifests put seedream first)
const MODEL = manifest.models.filter(function (m) { return m.indexOf('zhipu') === 0; })[0];
if (!MODEL) { console.error('manifest ' + runIdArg + ' has no zhipu-* model entry'); process.exit(2); }
const API_MODEL = 'cogview-4';
const seeds = manifest.seeds;
const runId = manifest.runId;

const args = process.argv.slice(2);
function argVal(name, fallback) { const i = args.indexOf(name); return i !== -1 && args[i + 1] ? args[i + 1] : fallback; }
const limit = parseInt(argVal('--limit', '999999'), 10);
// CogView-4 hard cap: max 2^21 px per side pair — downgrade oversize manifests and record honestly
const API_SIZE = (parseInt(manifest.size.split('x')[0], 10) > 1440) ? '1440x1440' : manifest.size;

const imgDir = path.join(__dirname, 'results', 'images', runId);
fs.mkdirSync(imgDir, { recursive: true });
const obsFile = path.join(__dirname, 'results', 'observations-' + runId + '.jsonl');

function postJson(body) {
  return new Promise(function (resolve, reject) {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'open.bigmodel.cn', path: '/api/paas/v4/images/generations', method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + API_KEY, 'Content-Length': Buffer.byteLength(data) },
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
    req.write(data); req.end();
  });
}

function download(url, dest) {
  return new Promise(function (resolve, reject) {
    const u = new URL(url);
    const req = https.get({ hostname: u.hostname, path: u.pathname + u.search, timeout: 120000 }, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return download(res.headers.location, dest).then(resolve, reject);
      }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on('finish', function () { ws.close(resolve); });
      ws.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', function () { req.destroy(new Error('download timeout')); });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const tasks = [];
  manifest.atoms.forEach(atomId => {
    manifest.scenes.forEach(scene => {
      manifest.conditions.forEach(cond => {
        seeds.forEach(seed => {
          const prompt = cond === 'treatment' ? scene.prompt + ', ' + atomId : scene.prompt;
          tasks.push({ atomId, scene, cond, seed, prompt });
        });
      });
    });
  });
  console.log('model: ' + MODEL + ' (' + API_MODEL + ') | seeds: ' + seeds.join(',') + ' | tasks: ' + tasks.length + ' (limit ' + limit + ')');
  let done = 0, skipped = 0, failed = 0;

  for (const t of tasks.slice(0, limit)) {
    const seedTag = t.seed > 1 ? '__s' + t.seed : '';
    const id = 'cogview4__' + t.atomId.replace(/[^a-z0-9]+/g, '-') + '__' + t.scene.id + '__' + t.cond + seedTag;
    const imgFile = path.join(imgDir, id + '.jpg');
    if (fs.existsSync(imgFile) && fs.statSync(imgFile).size > 10000) { skipped++; continue; }
    try {
      const r = await postJson({ model: API_MODEL, prompt: t.prompt, size: API_SIZE });
      if (r.status !== 200 || !r.body.data || !r.body.data[0] || !r.body.data[0].url) {
        failed++;
        const msg = (r.body.error && r.body.error.message) || JSON.stringify(r.body);
        console.error('FAIL ' + id + ' -> ' + r.status + ' ' + msg);
        fs.appendFileSync(path.join(__dirname, 'results', 'failures-' + runId + '.jsonl'), JSON.stringify({
          runId: runId, atomId: t.atomId, model: MODEL, sceneTemplate: t.scene.id, condition: t.cond, seed: t.seed,
          generationStatus: (/敏感|sensitive|filter|moderation|content/i.test(msg) ? 'provider_filter' : 'provider_error'),
          httpStatus: r.status, message: String(msg).slice(0, 300), loggedAt: new Date().toISOString()
        }) + '\n');
        if (/balance|quota|limit|insufficient/i.test(String(msg))) { console.error('STOPPING: balance/quota'); break; }
        await sleep(3000); continue;
      }
      await download(r.body.data[0].url, imgFile);
      const sha = crypto.createHash('sha256').update(fs.readFileSync(imgFile)).digest('hex');
      const rec = {
        benchmarkVersion: manifest.benchmarkVersion, runId: runId, atomId: t.atomId,
        modality: 'image', model: MODEL, sceneTemplate: t.scene.id, condition: t.cond,
        seed: t.seed, size: API_SIZE, prompt: t.prompt,
        imageFile: id + '.jpg', imageSha256: sha,
        requestId: r.body.id || null, createdAt: new Date().toISOString()
      };
      fs.appendFileSync(obsFile, JSON.stringify(rec) + '\n');
      done++;
      console.log('OK ' + id + ' (' + (fs.statSync(imgFile).size / 1024).toFixed(0) + ' KB)');
    } catch (e) { failed++; console.error('ERR ' + id + ' -> ' + e.message); }
    await sleep(1200);
  }
  console.log('DONE model=' + MODEL + ' ok=' + done + ' skipped=' + skipped + ' failed=' + failed);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
