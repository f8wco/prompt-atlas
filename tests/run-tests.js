'use strict';
/* Deterministic regression tests for Matcher 2.0 / Optimizer 2.0.
   Run: node tests/run-tests.js   (CI runs this on every push) */

const fs = require('fs');
const path = require('path');

global.window = {};
const root = path.join(__dirname, '..');

// load generated dictionary (single source of truth: core.json -> build.ps1)
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
  const r = lib.analyze(ATLAS, c.text, 'video');
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
  // image mode: camera never applicable
  if (c.mode === 'image') {
    check(r.notApplicable.map(function (s) { return s.id; }).indexOf('camera') !== -1, 'opt#' + i + ' image mode: camera must be N/A');
    check(r.applicable.map(function (s) { return s.id; }).indexOf('camera') === -1, 'opt#' + i + ' image mode: camera must not be applicable');
  }
});

console.log('\n' + passed + ' passed, ' + failures + ' failed');
process.exit(failures ? 1 : 0);
