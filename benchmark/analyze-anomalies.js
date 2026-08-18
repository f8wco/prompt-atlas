'use strict';
/* Anomaly mining over aggregated benchmark data (per advisor review):
   A) dead weight    adherence>=80 & baseline>=50  — "写不写都一样"
   B) strong switch  adherence>=80 & baseline<30   — 真正的强控制词
   C) family split   max-min modelScore >= 25      — Model Adapter 的数据来源，不许平均掉
   D) scene dep.     per-scene lift spread (max-min >= 1.0 with >=2 nonzero-diff scenes)
   Usage: node benchmark/analyze-anomalies.js --runs image-baseline-001,image-baseline-002,image-baseline-003[,004]
   Output: results/anomalies-<label>.json + console tables */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function argVal(name, fallback) { const i = args.indexOf(name); return i !== -1 && args[i + 1] ? args[i + 1] : fallback; }
const runIds = argVal('--runs', 'image-baseline-001,image-baseline-002,image-baseline-003').split(',');
const label = runIds.join('+');

const summary = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'summary-' + label + '.json'), 'utf8'));

// scene-level lift per atom from per-run evaluations (last-wins dedupe)
const sceneData = {}; // atom -> scene -> {treat:[], ctrl:[]}
for (const run of runIds) {
  const evals = fs.readFileSync(path.join(__dirname, 'results', 'evaluations-' + run + '.jsonl'), 'utf8')
    .trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
  const last = {};
  evals.forEach(e => { last[e.observationKey] = e; });
  Object.values(last).forEach(e => {
    sceneData[e.atomId] = sceneData[e.atomId] || {};
    sceneData[e.atomId][e.sceneTemplate] = sceneData[e.atomId][e.sceneTemplate] || { treat: 0, treatN: 0, ctrl: 0, ctrlN: 0 };
    const c = sceneData[e.atomId][e.sceneTemplate];
    if (e.condition === 'treatment') { c.treat += e.judgment; c.treatN++; } else { c.ctrl += e.judgment; c.ctrlN++; }
  });
}

const out = { runs: runIds, generatedAt: new Date().toISOString(), categories: { deadWeight: [], strongSwitch: [], familySplit: [], sceneDependent: [] } };

Object.keys(summary.atoms).forEach(name => {
  const a = summary.atoms[name];
  if (typeof a.atlasScore !== 'number') return;
  const meanA = Object.values(a.models).reduce((t, m) => t + m.A, 0) / Object.keys(a.models).length;
  const meanB = Object.values(a.models).reduce((t, m) => t + m.B, 0) / Object.keys(a.models).length;
  const scores = Object.values(a.models).map(m => m.modelScore);
  const spread = Math.max(...scores) - Math.min(...scores);

  if (meanA >= 0.8 && meanB >= 0.5) out.categories.deadWeight.push({ atom: name, adherence: Math.round(meanA * 100), baseline: Math.round(meanB * 100), lift: Math.round((meanA - meanB) * 100) });
  if (meanA >= 0.8 && meanB < 0.3) out.categories.strongSwitch.push({ atom: name, adherence: Math.round(meanA * 100), baseline: Math.round(meanB * 100), lift: Math.round((meanA - meanB) * 100) });
  if (spread >= 25) out.categories.familySplit.push({
    atom: name, spread,
    perModel: Object.keys(a.models).map(m => m.split('-').slice(-1)[0] + ':' + a.models[m].modelScore).join(' ')
  });
  const sd = sceneData[name];
  if (sd) {
    const lifts = Object.keys(sd).map(s => sd[s].treatN && sd[s].ctrlN ? (sd[s].treat / sd[s].treatN - sd[s].ctrl / sd[s].ctrlN) : null).filter(v => v !== null);
    if (lifts.length >= 3) {
      const lmax = Math.max(...lifts), lmin = Math.min(...lifts);
      if (lmax - lmin >= 0.5) out.categories.sceneDependent.push({
        atom: name,
        scenes: Object.keys(sd).map(s => sd[s].treatN && sd[s].ctrlN ? s + ':' + Math.round((sd[s].treat / sd[s].treatN - sd[s].ctrl / sd[s].ctrlN) * 100) : null).filter(Boolean).join(' ')
      });
    }
  }
});

const outFile = path.join(__dirname, 'results', 'anomalies-' + label + '.json');
fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n', 'utf8');

const show = (title, arr, fmt) => {
  console.log('\n== ' + title + ' (' + arr.length + ') ==');
  arr.forEach(x => console.log('  ' + fmt(x)));
};
console.log('anomalies written: ' + path.basename(outFile));
show('A 死重词（写了白写）', out.categories.deadWeight, x => x.atom.padEnd(24) + 'adherence ' + x.adherence + '% baseline ' + x.baseline + '% lift +' + x.lift);
show('B 强控制开关', out.categories.strongSwitch, x => x.atom.padEnd(24) + 'adherence ' + x.adherence + '% baseline ' + x.baseline + '% lift +' + x.lift);
show('C 家族分裂（Model Adapter 数据）', out.categories.familySplit, x => x.atom.padEnd(24) + 'spread ' + x.spread + ' | ' + x.perModel);
show('D 场景依赖', out.categories.sceneDependent, x => x.atom.padEnd(24) + x.scenes);
