'use strict';
/* Re-analysis of already-paid benchmark data (no API calls):
   per-atom baseline rate B, per-scene lift, per-model deltas.
   Usage: node benchmark/analyze-baseline.js --run image-baseline-001 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function argVal(name, fallback) { const i = args.indexOf(name); return i !== -1 && args[i + 1] ? args[i + 1] : fallback; }
const runId = argVal('--run', 'image-baseline-001');

const evFile = path.join(__dirname, 'results', 'evaluations-' + runId + '.jsonl');
const sumFile = path.join(__dirname, 'results', 'summary-' + runId + '.json');
const ev = fs.readFileSync(evFile, 'utf8').trim().split('\n').map(JSON.parse);

// last-wins dedupe (consistent with aggregate.js)
const byKey = {};
ev.forEach(e => { byKey[e.observationKey] = e; });
const rows = Object.keys(byKey).map(k => byKey[k]);

const m = {};
rows.forEach(e => {
  const a = e.atomId, sc = e.sceneTemplate;
  m[a] = m[a] || {}; m[a][sc] = m[a][sc] || { control: 0, controlN: 0, treatment: 0, treatmentN: 0 };
  const c = m[a][sc];
  c[e.condition] += e.judgment;
  c[e.condition + 'N'] += 1;
});

console.log('=== B = baseline（不加词时模型自己画出来的比例）===');
Object.keys(m).sort().forEach(a => {
  let cb = 0, cn = 0;
  Object.keys(m[a]).forEach(sc => { cb += m[a][sc].control; cn += m[a][sc].controlN; });
  const B = Math.round(cb / cn * 100);
  const hot = Object.keys(m[a]).filter(sc => m[a][sc].control / m[a][sc].controlN >= 0.5).join(',');
  console.log(a.padEnd(24), 'B=' + String(B).padStart(3) + '%', hot ? '  基线高发场景: ' + hot : '');
});

console.log('');
console.log('=== 场景级 lift（treatment - control）===');
Object.keys(m).sort().forEach(a => {
  const cells = Object.keys(m[a]).map(sc => {
    const c = m[a][sc];
    const lift = Math.round((c.treatment / c.treatmentN - c.control / c.controlN) * 100);
    return sc + ':' + (lift > 0 ? '+' : '') + lift;
  });
  console.log(a.padEnd(24), cells.join('  '));
});

if (fs.existsSync(sumFile)) {
  const s = JSON.parse(fs.readFileSync(sumFile, 'utf8'));
  console.log('');
  console.log('=== 各模型 modelScore ===');
  Object.keys(s.atoms).forEach(k => {
    const a = s.atoms[k];
    const parts = Object.keys(a.models).map(mm => mm.split('-').slice(-2).join('-') + ':' + a.models[mm].modelScore);
    console.log(k.padEnd(24), parts.join('  '), '| Atlas=' + a.atlasScore, 'conf=' + a.confidence);
  });
} else {
  console.log('\n(no summary file for this run)');
}
