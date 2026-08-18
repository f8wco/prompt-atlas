'use strict';
/* Seeds historical generation-failure records from gen logs (audit trail per review:
   provider filter / provider error / timeout must never be silently erased by retries). */

const fs = require('fs');
const path = require('path');

const MODEL_BY_TAIL = { '250828': 'doubao-seedream-4-0-250828', '251128': 'doubao-seedream-4-5-251128', 'cogview4': 'zhipu-cogview-4' };

function parseId(id) {
  const parts = id.split('__');
  const seedTag = parts[4] && parts[4].startsWith('s') ? parseInt(parts[4].slice(1), 10) : 1;
  return { model: MODEL_BY_TAIL[parts[0]] || parts[0], atomId: parts[1], scene: parts[2], cond: parts[3], seed: seedTag };
}

function seed(runId, logFile) {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', runId + '.json'), 'utf8'));
  const nameBySlug = {};
  manifest.atoms.forEach(n => { nameBySlug[n.replace(/[^a-z0-9]+/g, '-')] = n; });
  const out = path.join(__dirname, 'results', 'failures-' + runId + '.jsonl');
  const existing = fs.existsSync(out) ? fs.readFileSync(out, 'utf8').trim().split('\n').filter(Boolean) : [];
  const have = new Set(existing.map(l => { const r = JSON.parse(l); return [r.atomId, r.model, r.sceneTemplate, r.condition, r.seed].join('|'); }));
  let added = 0;
  const log = fs.readFileSync(path.join(__dirname, 'results', logFile), 'utf8');
  log.split('\n').forEach(line => {
    const m = line.match(/^(FAIL|ERR) (\S+) -> (.*?)(?:\s*$)/);
    if (!m) return;
    const info = parseId(m[2]);
    const atomName = nameBySlug[info.atomId] || info.atomId;
    const key = [atomName, info.model, info.scene, info.cond, info.seed].join('|');
    if (have.has(key)) return;
    const detail = m[3];
    const status = m[1] === 'ERR' ? 'timeout'
      : (/sensitive|filter|moderation/i.test(detail) ? 'provider_filter' : 'provider_error');
    existing.push(JSON.stringify({
      runId: runId, atomId: atomName, model: info.model, sceneTemplate: info.scene,
      condition: info.cond, seed: info.seed, generationStatus: status,
      httpStatus: m[1] === 'FAIL' ? parseInt((detail.match(/^(\d+)/) || [])[1], 10) || null : null,
      message: detail.slice(0, 300), source: 'gen-log', loggedAt: new Date().toISOString()
    }));
    added++;
  });
  fs.writeFileSync(out, existing.join('\n') + (existing.length ? '\n' : ''), 'utf8');
  console.log(runId + ': +' + added + ' failure records (total ' + existing.length + ')');
}

seed('image-baseline-004', 'gen-004-log.txt');
seed('image-baseline-002', 'gen-002-log.txt');
