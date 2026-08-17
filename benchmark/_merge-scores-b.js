'use strict';
/* Merge the combined B-confidence summary (runs 001+002) into core.json.
   Updates the 8 benchmarked atoms to confidence B; keeps heuristicValue. */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const summary = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'summary-image-baseline-001+image-baseline-002.json'), 'utf8'));

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
  if (s.confidence !== 'B') { console.error('EXPECTED confidence B for ' + manifestName + ', got ' + s.confidence); process.exit(1); }
  const prevBench = atom.score.status === 'benchmarked' ? atom.score.value : atom.score.heuristicValue;
  atom.score = {
    value: s.atlasScore,
    status: 'benchmarked',
    confidence: s.confidence,
    benchmarkVersion: summary.benchmarkVersion,
    sampleSize: s.sampleSize,
    models: s.modelsList.slice(),
    updatedAt: '2026-08',
    heuristicValue: atom.score.heuristicValue !== undefined ? atom.score.heuristicValue : prevBench
  };
  upgraded++;
  console.log(id.padEnd(16) + ' ' + String(prevBench).padStart(3) + ' -> ' + String(s.atlasScore).padStart(3) +
    '  (conf ' + s.confidence + ', pairs=' + s.pairs + ', n=' + s.sampleSize + ')');
}

core.meta.benchmark = {
  runs: ['image-baseline-001', 'image-baseline-002'],
  benchmarkVersion: '0.1',
  benchmarkedAtoms: upgraded,
  confidence: 'B',
  note: '8 atoms measured across 2 runs: 2 models x 6 scenes x 3 seeds A/B (36 paired observations each, Confidence B). Protocol & raw data: docs/BENCHMARK.md + benchmark/results/.'
};
core.meta.source = '核心词库 v3：8 词条经 benchmark 管道实测（36 对观测/词条，Confidence B），其余 ' + (core.atoms.length - upgraded) + ' 词条为 heuristic 经验估计；冲突表与槽位提示已迁入数据。';

fs.writeFileSync(path.join(root, 'core.json'), JSON.stringify(core, null, 2) + '\n', 'utf8');
console.log('core.json updated: ' + upgraded + ' atoms at Confidence B');
