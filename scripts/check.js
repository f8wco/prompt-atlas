'use strict';
/* CLI for agent workflows: deterministic Control Profile + optimization report.
   Usage: node scripts/check.js "<prompt>" [image|video]
   The SKILL.md workflow B instructs agents to run this for reproducible results. */

const fs = require('fs');
const path = require('path');

const ATLAS = require(path.join(__dirname, '..', 'web', 'core-data.js'));
const lib = require(path.join(__dirname, '..', 'web', 'core-lib.js'));

const text = process.argv[2] || '';
const mode = process.argv[3] === 'image' ? 'image' : 'video';
if (!text) {
  console.error('usage: node scripts/check.js "<prompt>" [image|video]');
  process.exit(2);
}

const r = lib.analyze(ATLAS, text, mode);
const opt = lib.buildOptimized(ATLAS, r);

console.log('== PROMPT CONTROL PROFILE ==');
console.log('mode: ' + mode);
console.log('Reliability:  ' + (r.reliability === null ? '—' : r.reliability + '/100'));
console.log('Coverage:     ' + r.covered.length + '/' + r.applicable.length);
console.log('Consistency:  ' + r.consistency + '/100');
console.log('Freedom:      ' + r.freedom + '/' + r.applicable.length);
console.log('ControlLevel: ' + r.controlLevel);
if (r.evidence && r.evidence.total > 0) {
  console.log('Evidence:     ' + r.evidence.benchmarked + '/' + r.evidence.total + ' benchmarked · floor ' + r.evidence.confidenceFloor);
}
const SHORT = { 'doubao-seedream-4-0-250828': 'Seedream4.0', 'doubao-seedream-4-5-251128': 'Seedream4.5', 'zhipu-cogview-4': 'CogView' };
r.found.forEach(function (a) {
  if (a.score && a.score.byModel && Object.keys(a.score.byModel).length) {
    const per = Object.keys(a.score.byModel).map(m => (SHORT[m] || m) + ':' + a.score.byModel[m]).join(' ');
    console.log('  per-model   ' + a.en + ' -> ' + per);
  }
});
console.log('counts: macros=' + r.macroCount + ' hardConflicts=' + r.hardConflicts.length + ' softTensions=' + r.tensions.length + ' redundant=' + r.redundants.length);

console.log('\n== SLOTS ==');
ATLAS.slots.forEach(function (s) {
  const found = r.perSlot[s.id] || [];
  const implied = r.impliedBySlot[s.id] || [];
  const isNA = r.notApplicable.some(function (x) { return x.id === s.id; });
  const detail = r.missingDetail.find(function (d) { return d.slot.id === s.id; });
  let line = '  ' + s.zh + '/' + s.en + ': ';
  if (found.length) line += 'SPECIFIED ' + found.map(function (a) { return a.zh + '(' + a.en + ')'; }).join(', ');
  else if (isNA) line += 'NOT_APPLICABLE';
  else if (detail && detail.maybe) line += 'FREE_TEXT';
  else line += 'UNSPECIFIED';
  if (implied.length) line += ' [implied: ' + implied.map(function (a) { return a.en; }).join(',') + ']';
  console.log(line);
});

if (r.modalityMismatches.length) console.log('\nmodalityMismatch: ' + r.modalityMismatches.map(function (a) { return a.en; }).join(', '));
if (r.hardConflicts.length) console.log('hardConflicts: ' + r.hardConflicts.map(function (p) { return p.a.en + '<->' + p.b.en; }).join('; '));
if (r.tensions.length) console.log('softTensions: ' + r.tensions.map(function (p) { return p.a.en + '<->' + p.b.en; }).join('; '));
if (r.redundants.length) console.log('redundant: ' + r.redundants.map(function (p) { return p.a.en + '<=' + p.b.en; }).join('; '));

console.log('\n== OPTIMIZED ==');
console.log(opt.en);
if (opt.added.length) console.log('added: ' + opt.added.map(function (a) { return a.en; }).join(', '));
if (opt.noSuggestion.length) console.log('noSuggestion: ' + opt.noSuggestion.join(', '));
if (opt.maybeSlots.length) console.log('maybeSlots: ' + opt.maybeSlots.join(', '));
