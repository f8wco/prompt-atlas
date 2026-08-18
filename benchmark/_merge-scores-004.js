'use strict';
/* Merge the combined 4-run summary (runs 001-004) into core.json:
   12 new atoms (from manifest 004) upgraded to benchmarked Confidence B.
   Total benchmarked after this: 8 + 12 = 20. Keeps heuristicValue. */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const summary = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'summary-image-baseline-001+image-baseline-002+image-baseline-003+image-baseline-004.json'), 'utf8'));
const core = JSON.parse(fs.readFileSync(path.join(root, 'core.json'), 'utf8'));

// manifest display name -> core id via `en` match (single source of truth)
const byEn = {};
core.atoms.forEach(a => { byEn[a.en] = a; });

const manifest004 = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', 'image-baseline-004.json'), 'utf8'));
let upgraded = 0;
for (const name of manifest004.atoms) {
  const atom = byEn[name];
  const s = summary.atoms[name];
  if (!atom) { console.error('MISSING core atom for manifest name: ' + name); process.exit(1); }
  if (!s || typeof s.atlasScore !== 'number') { console.error('MISSING summary for: ' + name); process.exit(1); }
  if (s.confidence !== 'B') { console.error('EXPECTED B for ' + name + ', got ' + s.confidence); process.exit(1); }
  const prev = atom.score.value;
  atom.score = {
    value: s.atlasScore,
    status: 'benchmarked',
    confidence: s.confidence,
    benchmarkVersion: summary.benchmarkVersion,
    sampleSize: s.sampleSize,
    models: s.modelsList.slice(),
    updatedAt: '2026-08',
    heuristicValue: atom.score.heuristicValue !== undefined ? atom.score.heuristicValue : prev
  };
  upgraded++;
  console.log(name.padEnd(24) + String(prev).padStart(3) + ' -> ' + String(s.atlasScore).padStart(3) +
    '  (conf ' + s.confidence + ', pairs=' + s.pairs + ', n=' + s.sampleSize + ', models=' + s.modelsList.length + ')');
}

const totalBench = core.atoms.filter(a => a.score.status === 'benchmarked').length;
core.meta.benchmark = {
  runs: ['image-baseline-001', 'image-baseline-002', 'image-baseline-003', 'image-baseline-004'],
  benchmarkVersion: '0.1',
  benchmarkedAtoms: totalBench,
  confidence: 'B',
  note: totalBench + ' atoms measured across 3 model families (Seedream 4.0/4.5 + Zhipu CogView-4), 54 paired observations each (Confidence B). Protocol & raw data: docs/BENCHMARK.md + benchmark/results/.'
};
core.meta.source = '核心词库 v3：' + totalBench + ' 词条经 benchmark 管道实测（3 个模型家族，54 对观测/词条，Confidence B），其余 ' + (core.atoms.length - totalBench) + ' 词条为 heuristic 经验估计；冲突表与槽位提示已迁入数据。';

fs.writeFileSync(path.join(root, 'core.json'), JSON.stringify(core, null, 2) + '\n', 'utf8');
console.log('core.json updated: +' + upgraded + ' new benchmarked atoms (total ' + totalBench + ')');
