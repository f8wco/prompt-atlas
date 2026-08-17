'use strict';
/* One-time migration: core.json v1 -> v2
   - adds type (atom|macro), modalities, aliases, score object (status=heuristic), relations
   - first macro batch: cinematic / cyberpunk-style / rainy-night
   Run: node scripts/migrate-v2.js   (idempotent: v2 input passes through) */

const fs = require('fs');
const path = require('path');
const corePath = path.join(__dirname, '..', 'core.json');
const core = JSON.parse(fs.readFileSync(corePath, 'utf8'));

if (core.version >= 2) { console.log('already v2, nothing to do'); process.exit(0); }

const macroDefs = {
  'cinematic': { expandsTo: ['shallow-dof', 'film-grain', 'teal-orange'], aliases: { zh: ['电影质感'], en: ['cinematic look'] } },
  'cyberpunk-style': { expandsTo: ['cyberpunk-palette', 'neon', 'rainy-night'], aliases: { zh: ['赛博朋克风'], en: ['cyberpunk style'] } },
  'rainy-night': { implies: ['night'], aliases: { zh: ['雨夜街景'], en: ['rainy night street'] } }
};

const videoOnly = ['dolly-in', 'dolly-out', 'orbit', 'dolly-zoom', 'tracking', 'handheld', 'aerial', 'crane', 'time-lapse', 'slow-motion', 'long-take'];

const extraAliases = {
  'close-up': { en: ['close up', 'closeup'] },
  'time-lapse': { en: ['time lapse', 'timelapse'] },
  'slow-motion': { en: ['slow motion'] },
  'shallow-dof': { en: ['shallow dof', 'depth of field'] }
};

const relations = {
  'aerial': { hardConflict: ['handheld'], softTension: ['long-take', 'over-shoulder', 'close-up'] },
  'handheld': { hardConflict: ['aerial', 'crane'], softTension: ['long-take'] },
  'crane': { hardConflict: ['handheld'] },
  'monochrome': { hardConflict: ['teal-orange', 'cyberpunk-palette', 'high-sat', 'pastel'] },
  'teal-orange': { hardConflict: ['monochrome'], softTension: ['cyberpunk-palette', 'pastel'] },
  'cyberpunk-palette': { hardConflict: ['monochrome'], softTension: ['teal-orange'] },
  'high-sat': { hardConflict: ['monochrome'], softTension: ['desaturated'] },
  'pastel': { hardConflict: ['monochrome'], softTension: ['teal-orange'] },
  'desaturated': { softTension: ['high-sat'] },
  'time-lapse': { hardConflict: ['slow-motion'] },
  'slow-motion': { hardConflict: ['time-lapse'] },
  'rule-of-thirds': { softTension: ['symmetry'] },
  'symmetry': { softTension: ['rule-of-thirds'] },
  'photoreal': { softTension: ['anime', 'ink-wash', 'claymation', 'pixel-art'] },
  'anime': { softTension: ['photoreal'] },
  'ink-wash': { softTension: ['photoreal'] },
  'claymation': { softTension: ['photoreal'] },
  'pixel-art': { softTension: ['photoreal'] },
  'serene': { softTension: ['suspense', 'epic'] },
  'cozy': { softTension: ['suspense', 'wasteland'] },
  'dawn': { softTension: ['night'] },
  'dusk': { softTension: ['night'] },
  'long-take': { softTension: ['aerial', 'handheld'] },
  'over-shoulder': { softTension: ['aerial'] },
  'close-up': { softTension: ['aerial'] }
};

function emptyRelations() {
  return { hardConflict: [], softTension: [], redundant: [], requires: [], implies: [], expandsTo: [] };
}

core.atoms = core.atoms.map(function (a) {
  const isMacro = Object.prototype.hasOwnProperty.call(macroDefs, a.id);
  const rel = emptyRelations();
  if (relations[a.id]) {
    if (relations[a.id].hardConflict) rel.hardConflict = relations[a.id].hardConflict.slice();
    if (relations[a.id].softTension) rel.softTension = relations[a.id].softTension.slice();
  }
  const aliases = { zh: [], en: [] };
  if (extraAliases[a.id]) {
    if (extraAliases[a.id].zh) aliases.zh = extraAliases[a.id].zh.slice();
    if (extraAliases[a.id].en) aliases.en = extraAliases[a.id].en.slice();
  }
  if (isMacro) {
    if (macroDefs[a.id].aliases.zh) aliases.zh = aliases.zh.concat(macroDefs[a.id].aliases.zh);
    if (macroDefs[a.id].aliases.en) aliases.en = aliases.en.concat(macroDefs[a.id].aliases.en);
    if (macroDefs[a.id].expandsTo) rel.expandsTo = macroDefs[a.id].expandsTo.slice();
    if (macroDefs[a.id].implies) rel.implies = macroDefs[a.id].implies.slice();
  }
  return {
    id: a.id,
    type: isMacro ? 'macro' : 'atom',
    slot: a.slot,
    modalities: videoOnly.indexOf(a.id) !== -1 ? ['video'] : ['image', 'video'],
    zh: a.zh,
    en: a.en,
    aliases: aliases,
    score: {
      value: a.score,
      status: 'heuristic',
      confidence: null,
      benchmarkVersion: null,
      sampleSize: 0,
      models: [],
      updatedAt: '2026-08'
    },
    relations: rel,
    desc: a.desc,
    descEn: a.descEn,
    example: a.example
  };
});

core.version = 2;
core.meta.totalAtoms = core.atoms.length;
core.meta.source = '核心词库 v2：60 词条（含 3 个 macro）。所有分数为 heuristic 经验估计，实测分数通过 benchmark 管道发布（见 docs/BENCHMARK.md）';
core.meta.scoringStatus = { heuristic: '经验估计，未经实测', benchmarked: '经 benchmark 管道实测，附样本/模型/置信度' };

fs.writeFileSync(corePath, JSON.stringify(core, null, 2) + '\n', 'utf8');
console.log('migrated core.json to v2: ' + core.atoms.length + ' atoms, macros: ' + core.atoms.filter(function (a) { return a.type === 'macro'; }).map(function (a) { return a.id; }).join(', '));
