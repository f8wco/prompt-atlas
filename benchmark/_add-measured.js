'use strict';
/* Inject per-atom measured detail (adherence / baseline / lift, cross-model means)
   into core.json for the 8 benchmarked atoms. Source: combined B summary.
   Values: adherence A = treatment adherence; baseline B = control occurrence;
   lift L = max(0, A-B) per model, then averaged across models. */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const summaryFile = process.argv[2] || 'summary-image-baseline-001+image-baseline-002.json';
const summary = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', summaryFile), 'utf8'));

const ID_MAP = {
  'close-up': 'close-up', 'monochrome': 'monochrome', 'golden hour': 'golden-hour',
  'symmetrical composition': 'symmetry', 'shallow depth of field': 'shallow-dof',
  'anime style': 'anime', 'volumetric light': 'volumetric', 'rule of thirds': 'rule-of-thirds',
  // run 004 (12 targeted atoms, manifest names = core `en` values)
  'macro': 'macro', 'telephoto compression': 'telephoto', 'fisheye lens': 'fisheye',
  'rim light': 'rim', 'backlit silhouette': 'backlit', 'neon glow': 'neon',
  'teal and orange': 'teal-orange', 'film grain': 'film-grain', 'pastel colors': 'pastel',
  'ink wash painting': 'ink-wash', 'blue hour': 'blue-hour', 'negative space': 'negative-space'
};

const core = JSON.parse(fs.readFileSync(path.join(root, 'core.json'), 'utf8'));
const byId = {}; core.atoms.forEach(a => { byId[a.id] = a; });

let updated = 0;
for (const [name, id] of Object.entries(ID_MAP)) {
  const atom = byId[id];
  const s = summary.atoms[name];
  if (!atom || !s) continue;
  const ms = Object.keys(s.models).map(m => s.models[m]);
  const mean = k => Math.round(100 * ms.reduce((t, x) => t + x[k], 0) / ms.length);
  atom.score.measured = { adherence: mean('A'), baseline: mean('B'), lift: mean('L') };
  updated++;
  console.log(id.padEnd(16), JSON.stringify(atom.score.measured));
}
fs.writeFileSync(path.join(root, 'core.json'), JSON.stringify(core, null, 2) + '\n', 'utf8');
console.log('core.json updated: measured detail added to ' + updated + ' atoms');
