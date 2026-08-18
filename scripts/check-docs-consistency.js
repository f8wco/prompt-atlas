'use strict';
/* Keeps README/SKILL numbers in sync with core.json (single source of truth).
   CI-enforced. Run: node scripts/check-docs-consistency.js
   Checks: Atoms badge count, Benchmark badge (count + confidence letter),
   SKILL.md heuristic/benchmarked counts. */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const core = JSON.parse(fs.readFileSync(path.join(root, 'core.json'), 'utf8'));
const bench = core.atoms.filter(a => a.score && a.score.status === 'benchmarked');
const tier = { C: 1, B: 2, A: 3 };
const conf = bench.reduce((m, a) => (tier[a.score.confidence] || 0) > (tier[m] || 0) ? a.score.confidence : m, 'C');
const total = core.atoms.length;
const heuristic = total - bench.length;

function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
const errors = [];
function need(p, needle, desc) {
  if (read(p).indexOf(needle) === -1) errors.push(p + ': ' + desc + ' not found [' + needle + ']');
}

['README.md', 'README.en.md'].forEach(p => {
  need(p, 'Atoms-' + total + '-', 'Atoms badge count');
  if (bench.length) need(p, 'Benchmark-' + bench.length + '%20benchmarked%20(' + conf + ')', 'Benchmark badge');
  if (bench.length) {
    const t = read(p);
    if (t.indexOf('全部为 `heuristic`') !== -1 || t.indexOf('all current scores are `heuristic`') !== -1) {
      errors.push(p + ': stale claim "all heuristic" but ' + bench.length + ' atoms are benchmarked');
    }
  }
});
need('SKILL.md', '当前 ' + heuristic + ' 个词条', 'heuristic count');
if (bench.length) need('SKILL.md', '当前 ' + bench.length + ' 个词条，Confidence ' + conf, 'benchmarked count + confidence');
if (read('SKILL.md').indexOf('40 + 0.6') !== -1) {
  errors.push('SKILL.md: stale v0.2 single-score formula (40 + 0.6) — engine is v3 Control Profile');
}

if (errors.length) {
  console.error('✗ docs out of sync with core.json:');
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('✓ docs consistent with core.json: ' + total + ' atoms, ' + bench.length + ' benchmarked (' + conf + '), ' + heuristic + ' heuristic');
