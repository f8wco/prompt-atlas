'use strict';
/* Aggregate benchmark observations + VLM judgments into Model Score / Atlas Score / Confidence.
   Formulas (benchmarkVersion 0.1):
     A = treatment adherence, B = baseline occurrence, L = max(0, A-B)
     Model Score = 100 x (0.7A + 0.3L)
     Atlas Score = 0.8 x mean(Model Scores) + 0.2 x min(Model Scores)
   Confidence: observations = models x scenes (>=12 -> C, >=36 -> B, >=72 -> A)
   Usage: node benchmark/aggregate.js
   Output: benchmark/results/summary-image-baseline-001.json */

const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', 'image-baseline-001.json'), 'utf8'));
const runId = manifest.runId;

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(function (l) { return JSON.parse(l); });
}

const obs = readJsonl(path.join(__dirname, 'results', 'observations-' + runId + '.jsonl'));
const evals = readJsonl(path.join(__dirname, 'results', 'evaluations-' + runId + '.jsonl'));

if (!obs.length) { console.error('no observations'); process.exit(2); }
if (evals.length < obs.length) {
  console.error('WARNING: evaluations incomplete (' + evals.length + '/' + obs.length + '). Aggregating what exists.');
}

const byKey = {};
evals.forEach(function (e) { byKey[e.observationKey] = e.judgment; });

const summary = {
  benchmarkVersion: manifest.benchmarkVersion,
  runId: runId,
  aggregatedAt: new Date().toISOString(),
  note: 'Confidence C run: 2 models x 6 scenes = 12 paired observations per atom. Not intended for main-leaderboard A scores.',
  atoms: {}
};

manifest.atoms.forEach(function (atomId) {
  const atom = { atomId: atomId, observations: 0, models: {} };
  manifest.models.forEach(function (model) {
    const cells = { treatment: [], control: [] };
    manifest.scenes.forEach(function (scene) {
      ['treatment', 'control'].forEach(function (cond) {
        const key = atomId + '__' + model + '__' + scene.id + '__' + cond;
        if (byKey[key] === undefined) { atom.observations += 0; return; }
        cells[cond].push(byKey[key]);
        atom.observations++;
      });
    });
    if (cells.treatment.length === 0) return;
    const A = cells.treatment.reduce(function (s, v) { return s + v; }, 0) / cells.treatment.length;
    const B = cells.control.reduce(function (s, v) { return s + v; }, 0) / cells.control.length;
    const L = Math.max(0, A - B);
    const modelScore = Math.round(100 * (0.7 * A + 0.3 * L));
    atom.models[model] = { A: Math.round(A * 100) / 100, B: Math.round(B * 100) / 100, L: Math.round(L * 100) / 100, modelScore: modelScore };
  });
  const scores = Object.keys(atom.models).map(function (m) { return atom.models[m].modelScore; });
  if (scores.length) {
    const mean = scores.reduce(function (s, v) { return s + v; }, 0) / scores.length;
    const min = Math.min.apply(null, scores);
    atom.atlasScore = Math.round(0.8 * mean + 0.2 * min);
    atom.confidence = atom.observations >= 72 ? 'A' : (atom.observations >= 36 ? 'B' : (atom.observations >= 12 ? 'C' : 'heuristic'));
    atom.sampleSize = atom.observations;
    atom.modelsList = manifest.models;
  }
  summary.atoms[atomId] = atom;
});

fs.writeFileSync(path.join(__dirname, 'results', 'summary-' + runId + '.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
console.log('summary written: benchmark/results/summary-' + runId + '.json');
Object.keys(summary.atoms).forEach(function (id) {
  const a = summary.atoms[id];
  console.log('  ' + id.padEnd(26) + ' Atlas=' + a.atlasScore + ' conf=' + a.confidence + ' obs=' + a.sampleSize +
    ' | ' + Object.keys(a.models).map(function (m) { return m.split('-').pop() + ':' + a.models[m].modelScore; }).join(' '));
});
