'use strict';
/* Cross-platform build: core.json -> web/core-data.js (browser global + CommonJS).
   Replaces the old PowerShell-only builder. Usage: node scripts/build.js  (or: npm run build) */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'core.json');
const outPath = path.join(root, 'web', 'core-data.js');

const core = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
if (!Array.isArray(core.atoms) || !core.atoms.length) throw new Error('core.json 缺少 atoms 数组');

const count = core.atoms.length;
if (count !== core.meta.totalAtoms) {
  console.warn('atoms 实际数量 (' + count + ') 与 meta.totalAtoms (' + core.meta.totalAtoms + ') 不一致，已自动修正');
  core.meta.totalAtoms = count;
}

const bySlot = {};
core.slots.forEach(s => { bySlot[s.id] = []; });
core.atoms.forEach(a => {
  if (!bySlot[a.slot]) throw new Error('词条 ' + a.id + ' 引用了不存在的槽位 ' + a.slot);
  bySlot[a.slot].push(a);
});

const payload = {
  version: core.version,
  name: core.name,
  slots: core.slots,
  atoms: core.atoms,
  bySlot: bySlot,
  totalAtoms: count
};

const header =
  '/* 由 scripts/build.js 从 core.json 自动生成，请勿手改本文件。\n' +
  '   修改词库请编辑 core.json 后重新运行: node scripts/build.js (或 npm run build) */\n';

const out =
  header +
  'var PROMPT_ATLAS_DATA = ' + JSON.stringify(payload, null, 2) + ';\n' +
  'if (typeof module === \'object\' && module.exports) { module.exports = PROMPT_ATLAS_DATA; }\n' +
  'if (typeof window !== \'undefined\') { window.PROMPT_ATLAS = PROMPT_ATLAS_DATA; }\n';

fs.writeFileSync(outPath, out, 'utf8');
console.log('OK: core.json (' + count + ' 词条) -> web/core-data.js');
