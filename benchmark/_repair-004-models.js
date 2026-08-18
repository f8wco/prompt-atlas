'use strict';
/* Repairs run 004 observations: the zhipu stage mislabeled its records as
   manifest.models[0] (seedream-4-0) due to a parametrization bug. The CogView
   generations are identifiable deterministically by their imageFile prefix
   (cogview4__) — rewrite their `model` to the true generator: zhipu-cogview-4.
   Original file is backed up. No data is discarded; every image keeps its
   true provenance (API called: CogView-4, size 1440x1440, imageFile prefix). */

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'results', 'observations-image-baseline-004.jsonl');
const lines = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean);
const recs = lines.map(l => JSON.parse(l));

let fixed = 0;
const byModel = {};
recs.forEach(r => {
  if (/^cogview4__/.test(r.imageFile) && r.model !== 'zhipu-cogview-4') {
    r.model = 'zhipu-cogview-4';
    r.provenanceNote = 'model relabeled by _repair-004-models: generated via CogView-4 API (imageFile prefix cogview4__, size 1440x1440)';
    fixed++;
  }
  byModel[r.model] = (byModel[r.model] || 0) + 1;
});

const cells = new Set(recs.map(r => r.atomId + '|' + r.model + '|' + r.sceneTemplate + '|' + r.condition + '|' + r.seed));
const dupes = recs.length - cells.size;

const bak = file + '.pre-repair-' + Date.now();
fs.copyFileSync(file, bak);
fs.writeFileSync(file, recs.map(r => JSON.stringify(r)).join('\n') + '\n', 'utf8');

console.log('repaired ' + fixed + ' records (cogview4__ prefix -> zhipu-cogview-4)');
console.log('per model:', JSON.stringify(byModel));
console.log('records:', recs.length, '| unique cells:', cells.size, '| duplicate-cell records:', dupes);
console.log('backup: ' + path.basename(bak));
if (dupes !== 0) { console.error('UNEXPECTED duplicates — inspect before proceeding'); process.exit(1); }
