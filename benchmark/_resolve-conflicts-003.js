'use strict';
/* Human-audit resolution for the 11 conflicting evaluation keys in run 003 (2026-08-17). */

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'results', 'evaluations-image-baseline-003.jsonl');
const RESOLUTIONS = {
  'close-up__zhipu-cogview-4__portrait__treatment': { judgment: 0, note: 'human-audit: half-body portrait with environment, subject does not fill frame' },
  'close-up__zhipu-cogview-4__street__treatment': { judgment: 0, note: 'human-audit: wide street vista, cyclist small, no close-up' },
  'close-up__zhipu-cogview-4__street__treatment__s2': { judgment: 1, note: 'human-audit: tight framing, subject fills most of frame' },
  'close-up__zhipu-cogview-4__street__treatment__s3': { judgment: 0, note: 'human-audit: wide street vista, cyclist small' },
  'close-up__zhipu-cogview-4__animal__treatment': { judgment: 0, note: 'human-audit: full-body cat + windowsill environment' },
  'golden hour__zhipu-cogview-4__environment__control__s2': { judgment: 0, note: 'human-audit: cool morning mist, neutral/blue tones, no warm golden light' },
  'symmetrical composition__zhipu-cogview-4__portrait__treatment': { judgment: 1, note: 'human-audit: centered subject, mirrored flanks — dominant symmetry' },
  'symmetrical composition__zhipu-cogview-4__architecture__treatment__s3': { judgment: 0, note: 'human-audit: off-center casual framing, no mirror balance' },
  'shallow depth of field__zhipu-cogview-4__portrait__treatment': { judgment: 0, note: 'human-audit: only slight background softening, not strong blur' },
  'anime style__zhipu-cogview-4__product__treatment__s3': { judgment: 1, note: 'human-audit: clear anime/cartoon illustration with bold outlines' },
  'volumetric light__zhipu-cogview-4__street__treatment__s3': { judgment: 1, note: 'human-audit: distinct beams/rays of light between buildings' }
};

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
