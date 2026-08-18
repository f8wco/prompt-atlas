'use strict';
/* Benchmark generator: Volcano Ark (Seedream) image A/B baseline.
   Reads ARK_API_KEY from env (NEVER committed to the repo).
   Usage: node benchmark/run-image-baseline.js --model <model-id> [--limit N]
   Outputs:
     benchmark/results/images/<runId>/<id>.jpg   (gitignored)
     benchmark/results/observations-<runId>.jsonl (raw records, committed)
   Records partial progress after every image; safe to resume/kill. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const API_KEY = process.env.ARK_API_KEY;
if (!API_KEY) {
  console.error('ARK_API_KEY env var is required');
  process.exit(2);
}

const args = process.argv.slice(2);
function argVal(name, fallback) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}
const runIdArg = argVal('--run', 'image-baseline-001');
const manifestPath = path.join(__dirname, 'manifests', runIdArg + '.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const seeds = manifest.seeds && manifest.seeds.length ? manifest.seeds : [1];
const model = argVal('--model', null);
const limit = parseInt(argVal('--limit', '999999'), 10);

if (!model || manifest.models.indexOf(model) === -1) {
  console.error('usage: node benchmark/run-image-baseline.js --model <' + manifest.models.join('|') + '> [--limit N]');
  process.exit(2);
}

const runId = manifest.runId;
const imgDir = path.join(__dirname, 'results', 'images', runId);
fs.mkdirSync(imgDir, { recursive: true });
const obsFile = path.join(__dirname, 'results', 'observations-' + runId + '.jsonl');

function postJson(url, body) {
  return new Promise(function (resolve, reject) {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_KEY,
        'Content-Length': Buffer.byteLength(data)
      },
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
    req.write(data);
    req.end();
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

const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

async function main() {
  const tasks = [];
  manifest.atoms.forEach(function (atomId) {
    const atom = { en: atomId };
    manifest.scenes.forEach(function (scene) {
      manifest.conditions.forEach(function (cond) {
        seeds.forEach(function (seed) {
          const prompt = cond === 'treatment'
            ? scene.prompt + ', ' + atom.en
            : scene.prompt;
          tasks.push({ atomId: atomId, scene: scene, cond: cond, seed: seed, prompt: prompt });
        });
      });
    });
  });
  console.log('model: ' + model + ' | seeds: ' + seeds.join(',') + ' | tasks: ' + tasks.length + ' (limit ' + limit + ')');
  let done = 0, skipped = 0, failed = 0;

  for (const t of tasks.slice(0, limit)) {
    const seedTag = t.seed > 1 ? '__s' + t.seed : '';
    const id = [model.split('-').pop(), t.atomId.replace(/[^a-z0-9]+/g, '-'), t.scene.id, t.cond].join('__') + seedTag;
    const imgFile = path.join(imgDir, id + '.jpg');
    const recPath = id + '.jpg';
    if (fs.existsSync(imgFile) && fs.statSync(imgFile).size > 10000) {
      skipped++; continue;
    }
    const body = {
      model: model,
      prompt: t.prompt,
      size: manifest.size,
      response_format: 'url',
      watermark: false
    };
    try {
      const r = await postJson('https://ark.cn-beijing.volces.com/api/v3/images/generations', body);
      if (r.status !== 200 || !r.body.data || !r.body.data[0] || !r.body.data[0].url) {
        failed++;
        const msg = (r.body.error && r.body.error.message) || JSON.stringify(r.body);
        console.error('FAIL ' + id + ' -> ' + r.status + ' ' + msg);
        fs.appendFileSync(path.join(__dirname, 'results', 'failures-' + runId + '.jsonl'), JSON.stringify({
          runId: runId, atomId: t.atomId, model: model, sceneTemplate: t.scene.id, condition: t.cond, seed: t.seed,
          generationStatus: (/sensitive|filter|moderation|content/i.test(msg) ? 'provider_filter'
            : (r.status >= 500 || r.status === 429 ? 'provider_error' : 'provider_error')),
          httpStatus: r.status, message: String(msg).slice(0, 300), loggedAt: new Date().toISOString()
        }) + '\n');
        if (r.status === 429 || /balance|quota|limit/i.test(msg)) {
          console.error('STOPPING: likely rate/balance limit reached');
          break;
        }
        await sleep(3000);
        continue;
      }
      const url = r.body.data[0].url;
      await download(url, imgFile);
      const sha = crypto.createHash('sha256').update(fs.readFileSync(imgFile)).digest('hex');
      const rec = {
        benchmarkVersion: manifest.benchmarkVersion,
        runId: runId,
        atomId: t.atomId,
        modality: 'image',
        model: model,
        sceneTemplate: t.scene.id,
        condition: t.cond,
        seed: t.seed,
        size: manifest.size,
        prompt: t.prompt,
        imageFile: recPath,
        imageSha256: sha,
        requestId: r.body.id || null,
        createdAt: new Date().toISOString()
      };
      fs.appendFileSync(obsFile, JSON.stringify(rec) + '\n');
      done++;
      console.log('OK ' + id + ' (' + (fs.statSync(imgFile).size / 1024).toFixed(0) + ' KB)');
    } catch (e) {
      failed++;
      console.error('ERR ' + id + ' -> ' + e.message);
    }
    await sleep(1200);
  }
  console.log('DONE model=' + model + ' ok=' + done + ' skipped=' + skipped + ' failed=' + failed);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });
