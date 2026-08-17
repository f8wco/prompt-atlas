'use strict';
/* Deterministic regression tests for the engine (Matcher 2.0 / Optimizer 2.0 / Control Profile).
   Run: node tests/run-tests.js   (CI runs this on every push) */

const fs = require('fs');
const path = require('path');

global.window = {};
const root = path.join(__dirname, '..');

eval(fs.readFileSync(path.join(root, 'web', 'core-data.js'), 'utf8'));
const ATLAS = window.PROMPT_ATLAS;
const lib = require(path.join(root, 'web', 'core-lib.js'));

let passed = 0;
let failures = 0;
function check(cond, msg) {
  if (cond) { passed++; }
  else { failures++; console.error('  ✗ FAIL: ' + msg); }
}

/* ---------- Matcher fixtures ---------- */
console.log('== Matcher ==');
const matcherCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'matcher.fixtures.json'), 'utf8'));
matcherCases.forEach(function (c, i) {
  const r = lib.analyze(ATLAS, c.text, c.mode || 'video');
  const found = r.found.map(function (a) { return a.id; });
  (c.expectFound || []).forEach(function (id) {
    check(found.indexOf(id) !== -1, 'matcher#' + i + ' "' + c.text + '" should find ' + id + ' (found: ' + found.join(',') + ')');
  });
  (c.expectNot || []).forEach(function (id) {
    check(found.indexOf(id) === -1, 'matcher#' + i + ' "' + c.text + '" must NOT find ' + id + ' (found: ' + found.join(',') + ')');
  });
  (c.expectImplied || []).forEach(function (imp) {
    const got = (r.impliedBySlot[imp.slot] || []).map(function (a) { return a.id; });
    check(got.indexOf(imp.atom) !== -1, 'matcher#' + i + ' "' + c.text + '" should imply ' + imp.atom + ' in slot ' + imp.slot + ' (got: ' + got.join(',') + ')');
  });
  (c.expectMismatch || []).forEach(function (id) {
    const got = r.modalityMismatches.map(function (a) { return a.id; });
    check(got.indexOf(id) !== -1, 'matcher#' + i + ' "' + c.text + '" should flag modality mismatch ' + id + ' (got: ' + got.join(',') + ')');
  });
  (c.expectNotApplicable || []).forEach(function (slot) {
    const got = r.notApplicable.map(function (s) { return s.id; });
    check(got.indexOf(slot) !== -1, 'matcher#' + i + ' "' + c.text + '" slot ' + slot + ' should be N/A (got: ' + got.join(',') + ')');
  });
  (c.expectTensions || []).forEach(function (pair) {
    const got = r.tensions.map(function (p) { return p.a.id + '↔' + p.b.id; });
    check(got.indexOf(pair) !== -1 || got.indexOf(pair.split('↔').reverse().join('↔')) !== -1, 'matcher#' + i + ' "' + c.text + '" should detect tension ' + pair + ' (got: ' + got.join(',') + ')');
  });
  (c.expectRedundants || []).forEach(function (pair) {
    const got = r.redundants.map(function (p) { return p.a.id + '↔' + p.b.id; });
    check(got.indexOf(pair) !== -1 || got.indexOf(pair.split('↔').reverse().join('↔')) !== -1, 'matcher#' + i + ' "' + c.text + '" should detect redundancy ' + pair + ' (got: ' + got.join(',') + ')');
  });
  if (c.expectMacroCount !== undefined) {
    check(r.macroCount === c.expectMacroCount, 'matcher#' + i + ' "' + c.text + '" macroCount should be ' + c.expectMacroCount + ' (got: ' + r.macroCount + ')');
  }
  if (c.expectReliability !== undefined) {
    check(r.reliability === c.expectReliability, 'matcher#' + i + ' "' + c.text + '" reliability should be ' + c.expectReliability + ' (got: ' + r.reliability + ')');
  }
  if (c.expectConsistency !== undefined) {
    check(r.consistency === c.expectConsistency, 'matcher#' + i + ' "' + c.text + '" consistency should be ' + c.expectConsistency + ' (got: ' + r.consistency + ')');
  }
});

/* ---------- Optimizer fixtures ---------- */
console.log('== Optimizer ==');
const optCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'optimizer.fixtures.json'), 'utf8'));
optCases.forEach(function (c, i) {
  const r = lib.analyze(ATLAS, c.text, c.mode);
  const opt = lib.buildOptimized(ATLAS, r);
  const addedIds = opt.added.map(function (a) { return a.id; });
  (c.expectAdded || []).forEach(function (id) {
    check(addedIds.indexOf(id) !== -1, 'opt#' + i + ' "' + c.name + '" should add ' + id + ' (added: ' + addedIds.join(',') + ')');
  });
  (c.expectNotAdded || []).forEach(function (id) {
    check(addedIds.indexOf(id) === -1, 'opt#' + i + ' "' + c.name + '" must NOT add ' + id + ' (added: ' + addedIds.join(',') + ')');
  });
  (c.expectMaybeSlots || []).forEach(function (id) {
    check(opt.maybeSlots.indexOf(id) !== -1, 'opt#' + i + ' "' + c.name + '" slot ' + id + ' should be maybe (maybe: ' + opt.maybeSlots.join(',') + ')');
  });
  const perSlot = {};
  opt.added.forEach(function (a) { perSlot[a.slot] = (perSlot[a.slot] || 0) + 1; });
  const max = c.maxAddedPerSlot || 1;
  Object.keys(perSlot).forEach(function (s) {
    check(perSlot[s] <= max, 'opt#' + i + ' "' + c.name + '" slot ' + s + ' added ' + perSlot[s] + ' terms (max ' + max + ')');
  });
  if (c.mode === 'image') {
    check(r.notApplicable.map(function (s) { return s.id; }).indexOf('camera') !== -1, 'opt#' + i + ' image mode: camera must be N/A');
    check(r.applicable.map(function (s) { return s.id; }).indexOf('camera') === -1, 'opt#' + i + ' image mode: camera must not be applicable');
  }
});

console.log('\n' + passed + ' passed, ' + failures + ' failed');
process.exit(failures ? 1 : 0);
