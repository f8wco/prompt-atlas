'use strict';
/* Deterministic regression tests for the engine (Matcher 2.0 / Optimizer 2.0 / Control Profile).
   Run: node tests/run-tests.js   (CI runs this on every push) */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const ATLAS = require(path.join(root, 'web', 'core-data.js'));
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

/* ---------- Recipe Profile (no single score, ever) ---------- */
console.log('== RecipeProfile ==');
(function () {
  const rp = lib.recipeProfile(ATLAS, {
    subject: 'a young woman', action: 'walking in the rain', scene: 'a cyberpunk city street',
    picks: { lighting: 'neon', shot: 'close-up', color: 'teal-orange' }, mode: 'video'
  });
  const foundIds = rp.profile.found.map(a => a.id);
  check(foundIds.indexOf('neon') !== -1, 'recipeProfile should find neon in assembled prompt');
  check(foundIds.indexOf('close-up') !== -1, 'recipeProfile should find close-up');
  check(foundIds.indexOf('cyberpunk-style') !== -1, 'recipeProfile should pick up "cyberpunk" from free scene text');
  check(rp.profile.covered.length === 4, 'recipeProfile coverage should be 4 slots (3 picks + style from scene, got ' + rp.profile.covered.length + ')');
  check(rp.profile.reliability !== null && typeof rp.profile.reliability === 'number', 'recipeProfile reliability should be a number');
  check(rp.profile.consistency === 100, 'recipeProfile consistency should be 100 without conflicts');
  check(rp.profile.evidence && rp.profile.evidence.total === 4, 'recipeProfile evidence total should be 4 found atoms');
  check(rp.profile.evidence.benchmarked === 3, 'recipeProfile evidence: close-up+teal-orange+neon benchmarked, cyberpunk-style macro is not (got ' + (rp.profile.evidence && rp.profile.evidence.benchmarked) + ')');
  check(rp.profile.evidence.confidenceFloor === 'heuristic', 'recipeProfile evidence floor should be heuristic when a heuristic macro atom is present');
  check(rp.en.indexOf('neon glow') !== -1, 'recipeProfile EN prompt should contain neon glow');
  check(!('score' in rp) && !('score' in rp.profile), 'recipeProfile must NOT return a single score');
})();

/* ---------- Evidence-aware Recommendation (rec-data.js + recommendAtoms) ---------- */
console.log('== Evidence Rec ==');
(function () {
  const rec = require('../web/rec-data.js');
  const core = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'core.json'), 'utf8'));
  const COG = 'zhipu-cogview-4';

  check(!!(rec && rec.atoms) && Object.keys(rec.atoms).length === 20, 'rec-data should cover 20 benchmarked atoms');
  check(rec.models.length === 3 && rec.scenes.length === 6, 'rec-data should have 3 models x 6 scenes');
  check(rec.atoms['close-up'].byScene.portrait.lift === 44, 'close-up portrait lift must match anomalies sceneDependent (44)');
  check(rec.atoms['rule-of-thirds'].flags && rec.atoms['rule-of-thirds'].flags.whiteout === true, 'rule-of-thirds must be flagged whiteout');
  check(rec.atoms['ink-wash'].flags && rec.atoms['ink-wash'].flags.familySplit === 67, 'ink-wash familySplit spread must be 67');

  // invariant: rec byModel == core.json score.byModel for every benchmarked atom
  let drift = 0;
  core.atoms.forEach(a => {
    if (!(a.score && a.score.status === 'benchmarked')) return;
    const entry = rec.atoms[a.id];
    if (!entry) { drift++; return; }
    Object.keys(a.score.byModel || {}).forEach(m => { if (entry.byModel[m] !== a.score.byModel[m]) drift++; });
  });
  check(drift === 0, 'rec byModel must equal core.json byModel for all benchmarked atoms (drift: ' + drift + ')');

  // model mismatch sinks the offender with a typed reason
  let r = lib.recommendAtoms(ATLAS, rec, { mode: 'video', model: COG });
  let styleSlot = r.slots.find(s => s.slot.id === 'style');
  const styleIds = styleSlot.candidates.map(c => c.atom.id);
  check(styleIds[styleIds.length - 1] === 'ink-wash', 'ink-wash must sink last in style under CogView (order: ' + styleIds.join(',') + ')');
  const lastCand = styleSlot.candidates[styleSlot.candidates.length - 1];
  check(lastCand.tier === 0 && lastCand.reasons.some(x => x.type === 'model-mismatch'), 'ink-wash under CogView must be tier0 with model-mismatch reason');
  check(styleSlot.candidates[0].atom.id === 'anime' && styleSlot.candidates[0].base === 100, 'anime must top style slot under CogView with base 100');
  check(styleIds.indexOf('cyberpunk-style') === -1, 'macro atoms must be excluded from recommendations');

  // scene context: dead scene vs boosted scene
  r = lib.recommendAtoms(ATLAS, rec, { mode: 'video', scene: 'portrait' });
  const lightSlot = r.slots.find(s => s.slot.id === 'lighting');
  const gh = lightSlot.candidates.find(c => c.atom.id === 'golden-hour');
  check(gh.tier === 0 && gh.reasons.some(x => x.type === 'scene-dead'), 'golden-hour must be tier0 scene-dead in portrait (measured lift 0)');
  const neon = lightSlot.candidates.find(c => c.atom.id === 'neon');
  check(neon.tier === 2 && neon.reasons.some(x => x.type === 'scene-fit'), 'neon must be tier2 scene-fit in portrait');
  check(lightSlot.candidates[0].tier >= neon.tier, 'tier2 candidates must rank above tier1 in lighting');

  // whiteout applies even without any context
  r = lib.recommendAtoms(ATLAS, rec, { mode: 'video' });
  const compSlot = r.slots.find(s => s.slot.id === 'composition');
  const rot = compSlot.candidates.find(c => c.atom.id === 'rule-of-thirds');
  check(rot.tier === 0, 'rule-of-thirds must be tier0 (whiteout) even without model/scene context');
  const heur = compSlot.candidates.find(c => c.atom.id === 'leading-lines');
  check(heur.tier === 1 && heur.reasons.some(x => x.type === 'heuristic-fallback'), 'heuristic atom must stay tier1 with heuristic-fallback reason');
  check(heur.base === lib.readScore(heur.atom), 'heuristic atom base must equal its score.value');

  // conflict flag against picked atoms (teal-orange <-> monochrome is a hardConflict pair)
  r = lib.recommendAtoms(ATLAS, rec, { mode: 'video', picks: { color: 'monochrome' } });
  const colorSlot = r.slots.find(s => s.slot.id === 'color');
  const teal = colorSlot.candidates.find(c => c.atom.id === 'teal-orange');
  check(teal && teal.conflict === true, 'teal-orange must be conflict-flagged when monochrome is picked');

  // image mode drops camera; output deterministic
  r = lib.recommendAtoms(ATLAS, rec, { mode: 'image' });
  check(!r.slots.some(s => s.slot.id === 'camera'), 'image mode must exclude the camera slot');
  const r1 = lib.recommendAtoms(ATLAS, rec, { mode: 'video', model: COG, scene: 'product' });
  const r2 = lib.recommendAtoms(ATLAS, rec, { mode: 'video', model: COG, scene: 'product' });
  check(JSON.stringify(r1) === JSON.stringify(r2), 'recommendAtoms must be deterministic for identical opts');
  check(lib.readRec(rec, 'no-such-atom') === null, 'readRec must return null for unknown atom id');
})();

/* ---------- P0: evidence type model + invalid words + analytics ---------- */
console.log('== P0 Evidence/Invalid/Analytics ==');
(function () {
  const AN = require('../web/analytics.js');
  const rec = require('../web/rec-data.js');
  const atomById = id => ATLAS.atoms.find(a => a.id === id);

  // P0-001 evidenceInfo: level and freshness are separate axes
  check(lib.evidenceInfo(atomById('leading-lines')).level === 'heuristic', 'heuristic atom should map to level heuristic');
  check(lib.evidenceInfo(atomById('anime')).level === 'benchmarked', 'benchmarked B atom (anime) should map to level benchmarked');
  check(lib.evidenceInfo({ score: { status: 'benchmarked', confidence: 'A', updatedAt: '2026-08' } }).level === 'verified', 'confidence A should map to level verified');
  const staleInfo = lib.evidenceInfo({ score: { status: 'benchmarked', confidence: 'A', stale: true } });
  check(staleInfo.level === 'verified' && staleInfo.freshness.status === 'stale', 'stale flips freshness but PRESERVES the level');
  check(lib.evidenceInfo(atomById('anime')).freshness.status === 'fresh', 'current data should be fresh');

  // P0-005 invalidWords without context: whiteout + benchmarked < 60
  let r = lib.analyze(ATLAS, 'a girl in a city, macro shot, rule of thirds, telephoto compression, close-up', 'video');
  let ids = lib.invalidWords(rec, r.found, null, null).map(x => x.atom.id);
  check(ids.indexOf('macro') !== -1, 'macro (3 pts) must be invalid without context');
  check(ids.indexOf('rule-of-thirds') !== -1, 'rule-of-thirds whiteout must be invalid without context');
  check(ids.indexOf('telephoto') !== -1, 'telephoto (59 < 60, benchmarked) must be invalid without context');
  check(ids.indexOf('close-up') === -1, 'close-up (61) must NOT be flagged without context');
  // with a model: tier0 rule takes over
  r = lib.analyze(ATLAS, 'ink wash painting of a mountain, anime style', 'image');
  ids = lib.invalidWords(rec, r.found, 'zhipu-cogview-4', null).map(x => x.atom.id);
  check(ids.indexOf('ink-wash') !== -1, 'ink-wash must be invalid on CogView (model-mismatch)');
  check(ids.indexOf('anime') === -1, 'anime must NOT be flagged on CogView');
  // with a scene: scene-dead rule
  r = lib.analyze(ATLAS, 'golden hour portrait with neon glow', 'image');
  ids = lib.invalidWords(rec, r.found, null, 'portrait').map(x => x.atom.id);
  check(ids.indexOf('golden-hour') !== -1, 'golden-hour must be invalid in portrait (scene-dead, lift 0)');
  check(ids.indexOf('neon') === -1, 'neon must NOT be flagged in portrait');

  // P0-002 analytics: filter is the Prompt-safety mechanism
  check(AN.filterEvent('no_such_event', {}) === null, 'unknown event kind must be rejected entirely');
  check(AN.filterEvent('check_started', { mode: 'video', promptLength: 20, promptText: 'a girl in a city' }).promptText === undefined, 'non-whitelisted fields must be stripped');
  check(AN.filterEvent('check_started', { mode: 'x'.repeat(80) }) === null, 'strings > 60 chars must invalidate the event (Prompt can never pass)');
  check(AN.filterEvent('export_clicked', { kind: 'recipe_card' }) === null, 'share kind must NEVER count as export');
  check(AN.filterEvent('share_created', { kind: 'recipe' }) === null, 'export kind must NEVER count as share');
  check(AN.filterEvent('export_clicked', { kind: 'optimized_prompt' }).kind === 'optimized_prompt', 'valid export kind passes');
  // consent gate: nothing before opt-in, nothing after opting out
  const mem = (() => { const s = {}; return { getItem: k => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, removeItem: k => { delete s[k]; }, dump: () => s }; })();
  AN.init({ storage: mem, send: false });
  check(AN.track('page_view', { path: '/' }) === false, 'no event before consent (opt-in)');
  AN.setConsent('local');
  check(AN.track('page_view', { path: '/' }) === false, 'no event after choosing local-only');
  AN.setConsent('granted');
  check(AN.track('check_started', { mode: 'video', promptLength: 42 }) === true, 'valid event passes after consent');
  const store = mem.dump();
  check(store['atlas-consent'] === 'granted' && !!store['atlas-aid'], 'consent + random analysis id stored after opt-in');
  AN.setConsent('local');
  check(!mem.dump()['atlas-aid'], 'opting out must delete the analysis id immediately');
  AN.init({ storage: (() => { const s = {}; return { getItem: k => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, removeItem: k => { delete s[k]; } }; })(), send: false });
})();

/* ---------- P0 D10: weekly funnel ---------- */
console.log('== P0 Weekly Funnel ==');
(function () {
  const funnel = require('../scripts/weekly-funnel.js');
  const lines = fs.readFileSync(path.join(__dirname, 'funnel-fixtures.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  const res = funnel.computeFunnel(lines);
  check(res.weeks.length === 2, 'fixture should cover exactly 2 weeks (got ' + res.weeks.length + ')');
  const w1 = res.weeks[0].stats, w2 = res.weeks[1].stats;
  check(w1.uniqueCheckUsers === 4, 'week1 unique CHECK users should be 4 (A,B,C,D)');
  check(w1.checkCompletion.abs === 3 && w1.checkCompletion.of === 4, 'week1 completion should be 3/4');
  check(w1.evidenceView.abs === 3 && w1.evidenceView.of === 3, 'week1 evidence view should be 3/3');
  check(w1.recApplied.abs === 1 && w1.recApplied.of === 3, 'week1 recommendation applied should be 1/3');
  check(w1.eae.abs === 1 && w1.eae.users === 1 && w1.eae.exportsTotal === 2, 'week1 EAE should be 1 (D export is 30min late, outside the 10min window); total exports 2');
  const r1 = res.weeks[0].retention;
  check(r1.abs === 1 && r1.of === 3, 'week1->week2 CHECK retention should be 1/3 (A returns, B/D do not)');
  check(w2.uniqueCheckUsers === 2, 'week2 unique CHECK users should be 2 (A,C)');
  const md = funnel.renderMarkdown(res);
  check(md.includes('Evidence-Assisted Export') && md.includes('1 次 / 1 人'), 'markdown report should render EAE with absolute counts');
  // atom-level tables (next-review deliverables): Top CHECK atoms + feedback summary
  const as1 = w1.atomStats;
  check(as1.macro && as1.macro.checks === 3, 'macro should be top-checked atom (3 checks in week1)');
  check(as1.anime && as1.anime.checks === 2 && as1.anime.views === 1, 'anime: 2 checks, 1 view');
  check(as1.neon && as1.neon.applies === 1, 'neon: 1 recommendation applied');
  check(as1.macro.up === 0 && as1.macro.down === 1 && as1['close-up'].up === 1, 'feedback votes aggregated per atom');
  check(md.includes('| macro |') && md.includes('👎'), 'markdown should include Top CHECK Atoms table with feedback columns');
  check(md.includes('不一致集中：macro'), 'markdown should highlight disagreed atoms');
  check(md.includes('检查频率 × 证据不确定性'), 'markdown should carry the benchmark priority formula note');
})();

console.log('\n' + passed + ' passed, ' + failures + ' failed');
process.exit(failures ? 1 : 0);
