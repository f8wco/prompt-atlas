'use strict';
/* Aggregate benchmark observations + VLM judgments into Model Score / Atlas Score / Confidence.
   Formulas (benchmarkVersion 0.1):
     A = treatment adherence, B = baseline occurrence, L = max(0, A-B)
     Model Score = 100 x (0.7A + 0.3L)
     Atlas Score = 0.8 x mean(Model Scores) + 0.2 x min(Model Scores)
   Confidence (per docs/BENCHMARK.md): pairs = models x scenes x seeds with BOTH conditions judged.
     A: pairs >= 72 AND >= 3 models AND >= 4 scenes | B: pairs >= 36 | C: pairs >= 12 | else heuristic
   Usage: node benchmark/aggregate.js --runs image-baseline-001,image-baseline-002
   Output: benchmark/results/summary-<runs joined by +>.json */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function argVal(name, fallback) { const i = args.indexOf(name); return i !== -1 && args[i + 1] ? args[i + 1] : fallback; }
const runIds = argVal('--runs', 'image-baseline-001').split(',').map(s => s.trim()).filter(Boolean);

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
}

const manifests = {};
const byKey = {}; // observationKey -> judgment (last wins, merged across runs)
let totalObs = 0, totalEval = 0;

for (const runId of runIds) {
  const m = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', runId + '.json'), 'utf8'));
  manifests[runId] = m;
  const obs = readJsonl(path.join(__dirname, 'results', 'observations-' + runId + '.jsonl'));
  const ev = readJsonl(path.join(__dirname, 'results', 'evaluations-' + runId + '.jsonl'));
  totalObs += obs.length; totalEval += ev.length;
  if (ev.length < obs.length) console.error('WARNING: run ' + runId + ' evaluations incomplete (' + ev.length + '/' + obs.length + ').');
  ev.forEach(e => { byKey[e.observationKey] = e.judgment; });
}

if (!totalObs) { console.error('no observations'); process.exit(2); }

const manifest0 = manifests[runIds[0]];
const allModels = [...new Set(runIds.flatMap(r => manifests[r].models))];
const allScenes = [...new Set(runIds.flatMap(r => manifests[r].scenes.map(s => s.id)))];
const allSeeds = [...new Set(runIds.flatMap(r => (manifests[r].seeds && manifests[r].seeds.length) ? manifests[r].seeds : [1]))];

const label = runIds.join('+');
const summary = {
  benchmarkVersion: manifest0.benchmarkVersion,
  runs: runIds,
  aggregatedAt: new Date().toISOString(),
  models: allModels,
  scenes: allScenes,
  seeds: allSeeds,
  counts: { observations: totalObs, evaluationLines: totalEval, uniqueJudgedKeys: Object.keys(byKey).length },
  atoms: {}
};

manifest0.atoms.forEach(function (atomId) {
  const atom = { atomId: atomId };
  let pairs = 0, images = 0;
  allModels.forEach(function (model) {
    const cells = { treatment: [], control: [] };
    allScenes.forEach(function (scene) {
      allSeeds.forEach(function (seed) {
        const suffix = seed > 1 ? '__s' + seed : '';
        const kt = atomId + '__' + model + '__' + scene + '__treatment' + suffix;
        const kc = atomId + '__' + model + '__' + scene + '__control' + suffix;
        const hasT = byKey[kt] !== undefined, hasC = byKey[kc] !== undefined;
        if (hasT) { cells.treatment.push(byKey[kt]); images++; }
        if (hasC) { cells.control.push(byKey[kc]); images++; }
        if (hasT && hasC) pairs++;
      });
    });
    if (!cells.treatment.length) return;
    const A = cells.treatment.reduce((s, v) => s + v, 0) / cells.treatment.length;
    const B = cells.control.length ? cells.control.reduce((s, v) => s + v, 0) / cells.control.length : 0;
    const L = Math.max(0, A - B);
    const modelScore = Math.round(100 * (0.7 * A + 0.3 * L));
    atom.models = atom.models || {};
    atom.models[model] = { A: Math.round(A * 100) / 100, B: Math.round(B * 100) / 100, L: Math.round(L * 100) / 100, modelScore: modelScore };
  });
  const scores = Object.keys(atom.models || {}).map(m => atom.models[m].modelScore);
  if (scores.length) {
    const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
    const min = Math.min.apply(null, scores);
    atom.atlasScore = Math.round(0.8 * mean + 0.2 * min);
    const modelsJudged = scores.length, scenesJudged = allScenes.length;
    atom.confidence = (pairs >= 72 && modelsJudged >= 3 && scenesJudged >= 4) ? 'A' : (pairs >= 36 ? 'B' : (pairs >= 12 ? 'C' : 'heuristic'));
    atom.pairs = pairs;
    atom.sampleSize = images;
    atom.modelsList = Object.keys(atom.models);
  }
  summary.atoms[atomId] = atom;
});

const outFile = path.join(__dirname, 'results', 'summary-' + label + '.json');
fs.writeFileSync(outFile, JSON.stringify(summary, null, 2) + '\n', 'utf8');
console.log('summary written: benchmark/results/summary-' + label + '.json');
Object.keys(summary.atoms).forEach(function (id) {
  const a = summary.atoms[id];
  console.log('  ' + id.padEnd(26) + ' Atlas=' + a.atlasScore + ' conf=' + a.confidence + ' pairs=' + a.pairs + ' imgs=' + a.sampleSize +
    ' | ' + Object.keys(a.models).map(function (m) { return m.split('-').pop() + ':' + a.models[m].modelScore; }).join(' '));
});
