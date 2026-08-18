'use strict';
/* Injects per-model modelScores (score.byModel) into core.json for all benchmarked
   atoms, from the combined 4-run summary. Display labels are handled in UI. */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const summary = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'summary-image-baseline-001+image-baseline-002+image-baseline-003+image-baseline-004.json'), 'utf8'));
const core = JSON.parse(fs.readFileSync(path.join(root, 'core.json'), 'utf8'));
const byEn = {};
core.atoms.forEach(a => { byEn[a.en] = a; });

let n = 0;
Object.keys(summary.atoms).forEach(name => {
  const atom = byEn[name];
  const s = summary.atoms[name];
  if (!atom || !s.models || atom.score.status !== 'benchmarked') return;
  const byModel = {};
  Object.keys(s.models).forEach(m => { byModel[m] = s.models[m].modelScore; });
  atom.score.byModel = byModel;
  n++;
});
fs.writeFileSync(path.join(root, 'core.json'), JSON.stringify(core, null, 2) + '\n', 'utf8');
console.log('byModel injected into ' + n + ' benchmarked atoms');
