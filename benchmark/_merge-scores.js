'use strict';
/* Merge benchmark summary (image-baseline-001, Confidence C) into core.json.
   - upgrades 8 atoms to score.status=benchmarked
   - keeps the previous heuristic value as score.heuristicValue for transparency
   - stamps meta.benchmark and refreshes meta.source wording */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const summary = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'summary-image-baseline-001.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', 'image-baseline-001.json'), 'utf8'));

// manifest atom display-name -> core.json id
const ID_MAP = {
  'close-up': 'close-up',
  'monochrome': 'monochrome',
  'golden hour': 'golden-hour',
  'symmetrical composition': 'symmetry',
  'shallow depth of field': 'shallow-dof',
  'anime style': 'anime',
  'volumetric light': 'volumetric',
  'rule of thirds': 'rule-of-thirds'
};

const core = JSON.parse(fs.readFileSync(path.join(root, 'core.json'), 'utf8'));
const byId = {};
core.atoms.forEach(a => { byId[a.id] = a; });

let upgraded = 0;
for (const [manifestName, id] of Object.entries(ID_MAP)) {
  const atom = byId[id];
  const s = summary.atoms[manifestName];
  if (!atom) { console.error('MISSING atom in core.json: ' + id); process.exit(1); }
  if (!s || typeof s.atlasScore !== 'number') { console.error('MISSING summary for: ' + manifestName); process.exit(1); }
  const oldHeuristic = atom.score.value;
  atom.score = {
    value: s.atlasScore,
    status: 'benchmarked',
    confidence: s.confidence,
    benchmarkVersion: summary.benchmarkVersion,
    sampleSize: s.sampleSize,
    models: manifest.models.slice(),
    updatedAt: '2026-08',
    heuristicValue: oldHeuristic
  };
  upgraded++;
  console.log(id.padEnd(16) + ' ' + String(oldHeuristic).padStart(3) + ' -> ' + String(s.atlasScore).padStart(3) + '  (benchmarked, ' + s.confidence + ', n=' + s.sampleSize + ')');
}

core.meta.benchmark = {
  runs: ['image-baseline-001'],
  benchmarkVersion: '0.1',
  benchmarkedAtoms: upgraded,
  confidence: 'C',
  note: '8 atoms measured via 2 models x 6 scenes A/B (12 paired observations each, Confidence C). Full protocol & raw data: docs/BENCHMARK.md + benchmark/results/.'
};
core.meta.source = '核心词库 v3：8 词条经 benchmark 管道实测（image-baseline-001，Confidence C），其余 ' + (core.atoms.length - upgraded) + ' 词条为 heuristic 经验估计；冲突表与槽位提示已迁入数据。';

fs.writeFileSync(path.join(root, 'core.json'), JSON.stringify(core, null, 2) + '\n', 'utf8');
console.log('core.json updated: ' + upgraded + ' atoms benchmarked');
