'use strict';
/* Human-audit resolution for the 38 conflicting evaluation keys in run 004 (2026-08-18).
   All 38 audited by image review; notes summarize the ground truth observed. */

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'results', 'evaluations-image-baseline-004.jsonl');
const R = [
  ['telephoto compression__doubao-seedream-4-0-250828__environment__treatment__s2', 1, 'stacked flattened layers + blurred background'],
  ['fisheye lens__doubao-seedream-4-0-250828__portrait__treatment', 0, 'no barrel curvature; straight lines normal'],
  ['rim light__doubao-seedream-4-0-250828__product__control', 0, 'subtle edge only, no glowing outline'],
  ['backlit silhouette__doubao-seedream-4-0-250828__architecture__control', 1, 'bright light behind creates silhouette edge'],
  ['teal and orange__doubao-seedream-4-0-250828__environment__control', 0, 'neutral gray/green mist, no teal-orange pair'],
  ['film grain__doubao-seedream-4-0-250828__street__control__s3', 0, 'digitally clean, no grain structure'],
  ['negative space__doubao-seedream-4-0-250828__architecture__treatment', 1, 'vast empty sky dominates, small isolated building'],
  ['macro__doubao-seedream-4-5-251128__environment__treatment__s2', 0, 'wide clearing view, not close-up'],
  ['telephoto compression__doubao-seedream-4-5-251128__portrait__treatment__s3', 1, 'strong background blur isolates subject'],
  ['telephoto compression__doubao-seedream-4-5-251128__street__control__s3', 0, 'wide sharp street, no compression'],
  ['telephoto compression__doubao-seedream-4-5-251128__architecture__treatment__s3', 0, 'sharp full-frame facade, no flattening'],
  ['rim light__doubao-seedream-4-5-251128__architecture__control__s3', 0, 'normal edges, no glowing outline'],
  ['backlit silhouette__doubao-seedream-4-5-251128__product__control__s2', 0, 'front/side studio light'],
  ['backlit silhouette__doubao-seedream-4-5-251128__architecture__control', 1, 'glowing edge against brighter sky'],
  ['teal and orange__doubao-seedream-4-5-251128__environment__control', 0, 'neutral mist'],
  ['teal and orange__doubao-seedream-4-5-251128__architecture__control__s3', 0, 'gray/blue concrete'],
  ['pastel colors__doubao-seedream-4-5-251128__animal__control__s2', 0, 'natural saturated fur'],
  ['pastel colors__doubao-seedream-4-5-251128__architecture__control', 0, 'neutral concrete'],
  ['pastel colors__doubao-seedream-4-5-251128__architecture__control__s3', 0, 'gray/beige concrete'],
  ['blue hour__doubao-seedream-4-5-251128__architecture__control__s3', 0, 'daytime pale sky'],
  ['negative space__doubao-seedream-4-5-251128__product__control__s2', 1, 'small mug in vast empty table space'],
  ['negative space__doubao-seedream-4-5-251128__architecture__treatment', 0, 'facade fills frame'],
  ['telephoto compression__zhipu-cogview-4__portrait__treatment', 1, 'strong background blur'],
  ['telephoto compression__zhipu-cogview-4__portrait__treatment__s2', 1, 'strong background blur'],
  ['telephoto compression__zhipu-cogview-4__environment__control', 1, 'natively compressed layers + blur'],
  ['telephoto compression__zhipu-cogview-4__environment__control__s3', 0, 'wide clear landscape'],
  ['telephoto compression__zhipu-cogview-4__environment__treatment__s2', 0, 'wide landscape, no compression'],
  ['rim light__zhipu-cogview-4__product__control', 0, 'no glowing outline'],
  ['rim light__zhipu-cogview-4__environment__treatment__s2', 0, 'misty glow, no distinct outline'],
  ['rim light__zhipu-cogview-4__architecture__treatment__s2', 1, 'distinct bright edge outline'],
  ['teal and orange__zhipu-cogview-4__product__control__s2', 0, 'warm wood tones only'],
  ['teal and orange__zhipu-cogview-4__product__control__s3', 0, 'beige/wood, no teal-orange'],
  ['film grain__zhipu-cogview-4__portrait__control', 0, 'digitally smooth'],
  ['film grain__zhipu-cogview-4__animal__treatment__s2', 1, 'visible fine grain structure'],
  ['pastel colors__zhipu-cogview-4__product__control__s2', 0, 'natural saturated colors'],
  ['pastel colors__zhipu-cogview-4__environment__control__s3', 0, 'natural forest greens'],
  ['pastel colors__zhipu-cogview-4__animal__control', 0, 'natural saturated fur'],
  ['negative space__zhipu-cogview-4__street__treatment', 1, 'vast empty sky/road, small subject']
].map(([k, j, note]) => [k, j, 'human-audit 2026-08-18: ' + note]);

const RESOLUTIONS = {};
R.forEach(([k, j, note]) => { RESOLUTIONS[k] = { judgment: j, note: note }; });

const recs = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
let patched = 0;
for (const r of recs) {
  const res = RESOLUTIONS[r.observationKey];
  if (!res) continue;
  r.judgment = res.judgment;
  r.evaluator = r.evaluator || {};
  r.evaluator.auditResolved = res.note;
  patched++;
}
const bak = file + '.pre-audit-' + Date.now();
fs.copyFileSync(file, bak);
fs.writeFileSync(file, recs.map(r => JSON.stringify(r)).join('\n') + '\n', 'utf8');
console.log('patched ' + patched + ' lines across ' + Object.keys(RESOLUTIONS).length + ' keys');
console.log('backup: ' + path.basename(bak));
