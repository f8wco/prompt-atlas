'use strict';
/* Dedupe evaluations jsonl: keep LAST judgment per observationKey (matches aggregate.js last-wins).
   Backs up the original first. Reports any key whose judgments differ across lines. */
const fs = require('fs');
const path = require('path');

const base = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(base, 'manifests', 'image-baseline-001.json'), 'utf8'));
const runId = manifest.runId;
const file = path.join(base, 'results', 'evaluations-' + runId + '.jsonl');

const lines = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean);
const recs = lines.map(l => JSON.parse(l));

const last = new Map();      // key -> record (last wins)
const judgments = new Map(); // key -> Set of judgments seen
for (const r of recs) {
  last.set(r.observationKey, r);
  if (!judgments.has(r.observationKey)) judgments.set(r.observationKey, new Set());
  judgments.get(r.observationKey).add(r.judgment);
}

let inconsistent = 0;
for (const [k, set] of judgments) {
  if (set.size > 1) { inconsistent++; console.log('INCONSISTENT ' + k + ' -> judgments ' + [...set].join(',')); }
}
console.log('total lines: ' + recs.length + ' | unique keys: ' + last.size + ' | inconsistent keys: ' + inconsistent);

if (inconsistent > 0) {
  console.error('Refusing to dedupe while inconsistencies exist.');
  process.exit(2);
}

const bak = file + '.bak-' + Date.now();
fs.copyFileSync(file, bak);
const out = [...last.values()].map(r => JSON.stringify(r)).join('\n') + '\n';
fs.writeFileSync(file, out, 'utf8');
console.log('backup written: ' + path.basename(bak));
console.log('deduped file written: ' + recs.length + ' -> ' + last.size + ' lines');
