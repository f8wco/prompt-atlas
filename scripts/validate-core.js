'use strict';
/* Validates core.json v2: schema, uniqueness, references, alias collisions,
   relation integrity, macro rules, score status rules.
   Run: node scripts/validate-core.js   (CI runs this on every push) */

const fs = require('fs');
const path = require('path');
const corePath = path.join(__dirname, '..', 'core.json');

let errors = [];
function err(msg) { errors.push(msg); }

let core;
try { core = JSON.parse(fs.readFileSync(corePath, 'utf8')); }
catch (e) { console.error('core.json is not valid JSON: ' + e.message); process.exit(1); }

const slotIds = new Set();
(core.slots || []).forEach(function (s, i) {
  ['id', 'zh', 'en', 'desc', 'descEn'].forEach(function (f) {
    if (typeof s[f] !== 'string' || !s[f]) err('slots[' + i + '].' + f + ' missing or empty');
  });
  if (typeof s.order !== 'number') err('slots[' + i + '].order must be a number');
  if (slotIds.has(s.id)) err('duplicate slot id: ' + s.id);
  slotIds.add(s.id);
});

const atoms = core.atoms || [];
if (!atoms.length) err('atoms must not be empty');

const ids = new Set();
const aliasOwner = {}; // lang + ':' + alias -> atomId

function trackAlias(lang, alias, atomId) {
  const key = lang + ':' + alias;
  if (aliasOwner[key] && aliasOwner[key] !== atomId) {
    err('alias collision: "' + alias + '" (' + lang + ') maps to both ' + aliasOwner[key] + ' and ' + atomId);
  } else if (!aliasOwner[key]) {
    aliasOwner[key] = atomId;
  }
}

atoms.forEach(function (a) {
  const where = 'atom ' + a.id;
  if (!/^[a-z0-9-]+$/.test(a.id || '')) err(where + ': id must be kebab-case [a-z0-9-]');
  if (ids.has(a.id)) err('duplicate atom id: ' + a.id);
  ids.add(a.id);
  if (!slotIds.has(a.slot)) err(where + ': slot "' + a.slot + '" does not exist');
  if (['atom', 'macro'].indexOf(a.type) === -1) err(where + ': type must be atom|macro');
  if (!Array.isArray(a.modalities) || !a.modalities.length) err(where + ': modalities must be a non-empty array');
  a.modalities.forEach(function (m) { if (['image', 'video'].indexOf(m) === -1) err(where + ': bad modality ' + m); });
  if (typeof a.zh !== 'string' || !a.zh) err(where + ': zh missing');
  if (typeof a.en !== 'string' || !a.en) err(where + ': en missing');
  trackAlias('zh', a.zh, a.id);
  trackAlias('en', a.en.toLowerCase(), a.id);

  const aliases = a.aliases || { zh: [], en: [] };
  ['zh', 'en'].forEach(function (lang) {
    if (!Array.isArray(aliases[lang])) { err(where + ': aliases.' + lang + ' must be an array'); return; }
    aliases[lang].forEach(function (al) {
      if (typeof al !== 'string' || !al) err(where + ': empty alias in ' + lang);
      else trackAlias(lang, lang === 'en' ? al.toLowerCase() : al, a.id);
    });
  });

  const sc = a.score;
  if (!sc || typeof sc !== 'object') err(where + ': score must be an object');
  else {
    if (typeof sc.value !== 'number' || sc.value < 0 || sc.value > 100) err(where + ': score.value must be 0-100');
    if (['heuristic', 'benchmarked'].indexOf(sc.status) === -1) err(where + ': score.status must be heuristic|benchmarked');
    if (sc.status === 'benchmarked') {
      if (!sc.sampleSize || sc.sampleSize < 12) err(where + ': benchmarked score requires sampleSize >= 12');
      if (!Array.isArray(sc.models) || sc.models.length < 2) err(where + ': benchmarked score requires >= 2 models');
      if (!sc.benchmarkVersion) err(where + ': benchmarked score requires benchmarkVersion');
    }
  }

  const rel = a.relations || {};
  ['hardConflict', 'softTension', 'redundant', 'requires', 'implies', 'expandsTo'].forEach(function (k) {
    if (!Array.isArray(rel[k])) err(where + ': relations.' + k + ' must be an array');
  });

  if (a.type === 'macro') {
    if (!(rel.expandsTo || []).length && !(rel.implies || []).length) {
      err(where + ': macro must have non-empty expandsTo or implies');
    }
  }
});

// reference integrity + hardConflict symmetry
atoms.forEach(function (a) {
  const rel = a.relations || {};
  ['hardConflict', 'softTension', 'redundant', 'requires', 'implies', 'expandsTo'].forEach(function (k) {
    (rel[k] || []).forEach(function (tid) {
      if (!ids.has(tid)) err('atom ' + a.id + ': relations.' + k + ' references missing id ' + tid);
      if (tid === a.id) err('atom ' + a.id + ': relations.' + k + ' must not self-reference');
    });
  });
  (rel.hardConflict || []).forEach(function (tid) {
    const t = atoms.find(function (x) { return x.id === tid; });
    if (t && ((t.relations || {}).hardConflict || []).indexOf(a.id) === -1) {
      err('hardConflict not symmetric: ' + a.id + ' -> ' + tid);
    }
  });
});

if (core.meta && core.meta.totalAtoms !== atoms.length) {
  err('meta.totalAtoms (' + core.meta.totalAtoms + ') != atoms.length (' + atoms.length + ')');
}

if (errors.length) {
  console.error('✗ core.json validation FAILED (' + errors.length + ' issues):');
  errors.forEach(function (e) { console.error('  - ' + e); });
  process.exit(1);
}
console.log('✓ core.json v' + core.version + ' valid: ' + atoms.length + ' atoms, ' + core.slots.length + ' slots, ' + atoms.filter(function (a) { return a.type === 'macro'; }).length + ' macros');
