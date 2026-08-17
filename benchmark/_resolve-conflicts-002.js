'use strict';
/* Human-audit resolution for the 12 conflicting evaluation keys in run 002 (2026-08-17).
   Audited by human review of the actual images (benchmark/results/images/image-baseline-002/). */

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'results', 'evaluations-image-baseline-002.jsonl');
const RESOLUTIONS = {
  'close-up__doubao-seedream-4-0-250828__portrait__control__s3': { judgment: 0, note: 'human-audit: half-body portrait, subject does not fill frame' },
  'close-up__doubao-seedream-4-0-250828__product__control__s3': { judgment: 1, note: 'human-audit: mug fills most of the frame, tight product framing' },
  'close-up__doubao-seedream-4-0-250828__animal__control__s3': { judgment: 0, note: 'human-audit: full-body cat + environment, not close-up' },
  'symmetrical composition__doubao-seedream-4-0-250828__street__treatment__s2': { judgment: 1, note: 'human-audit: centered vanishing point, mirrored flanks' },
  'symmetrical composition__doubao-seedream-4-0-250828__architecture__control__s2': { judgment: 1, note: 'human-audit: head-on facade, centered doorway, mirrored windows' },
  'shallow depth of field__doubao-seedream-4-0-250828__street__treatment__s2': { judgment: 0, note: 'human-audit: scene essentially sharp throughout' },
  'close-up__doubao-seedream-4-5-251128__product__control__s3': { judgment: 0, note: 'human-audit: mug small within wide table setting' },
  'close-up__doubao-seedream-4-5-251128__environment__treatment__s3': { judgment: 0, note: 'human-audit: wide vista of forest clearing' },
  'symmetrical composition__doubao-seedream-4-5-251128__animal__treatment__s3': { judgment: 0, note: 'human-audit: cat off to one side, casual composition' },
  'shallow depth of field__doubao-seedream-4-5-251128__street__control__s3': { judgment: 1, note: 'human-audit: strong background blur, sharp foreground cyclist (baseline occurrence)' },
  'volumetric light__doubao-seedream-4-5-251128__portrait__control__s2': { judgment: 0, note: 'human-audit: soft glow only, no distinct beams' },
  'rule of thirds__doubao-seedream-4-5-251128__architecture__control__s2': { judgment: 1, note: 'human-audit: entrance clearly on left third' }
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
