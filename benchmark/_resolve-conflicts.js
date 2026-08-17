'use strict';
/* Human-audit resolution for the 4 conflicting evaluation keys (2026-08-17).
   Audited by human review of the actual images (see benchmark/results/images/).
   Sets the audited judgment on ALL lines of the conflicting keys so dedupe
   (last-wins) becomes unambiguous, and stamps the resolution provenance. */

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'results', 'evaluations-image-baseline-001.jsonl');
const RESOLUTIONS = {
  'volumetric light__doubao-seedream-4-0-250828__street__control': {
    judgment: 0,
    note: 'human-audit 2026-08-17: sunlight + lens flare only, no distinct light shafts'
  },
  'volumetric light__doubao-seedream-4-0-250828__animal__control': {
    judgment: 0,
    note: 'human-audit 2026-08-17: warm window light/glow, no visible beams in air'
  },
  'close-up__doubao-seedream-4-5-251128__animal__control': {
    judgment: 0,
    note: 'human-audit 2026-08-17: medium-wide framing, full-body cat + environment, subject does not fill frame'
  },
  'shallow depth of field__doubao-seedream-4-5-251128__architecture__treatment': {
    judgment: 1,
    note: 'human-audit 2026-08-17: strong blur on upper facade vs sharp lower structure, shallow DOF clearly visible'
  }
};

const lines = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean);
const recs = lines.map(l => JSON.parse(l));
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
