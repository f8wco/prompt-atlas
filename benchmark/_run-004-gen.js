'use strict';
/* Launcher for image-baseline-004: Seedream 4.0 -> 4.5 -> CogView-4, sequential, resume-safe. */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const envRaw = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const ark = envRaw.match(/ARK_API_KEY=(.+)/)[1].trim();
const zhipu = envRaw.match(/ZHIPU_API_KEY=(.+)/)[1].trim();

const stages = [
  ['seedream-4-0', 'node', [path.join(__dirname, 'run-image-baseline.js'), '--run', 'image-baseline-004', '--model', 'doubao-seedream-4-0-250828'], { ARK_API_KEY: ark }],
  ['seedream-4-5', 'node', [path.join(__dirname, 'run-image-baseline.js'), '--run', 'image-baseline-004', '--model', 'doubao-seedream-4-5-251128'], { ARK_API_KEY: ark }],
  ['cogview-4', 'node', [path.join(__dirname, 'run-image-zhipu.js'), '--run', 'image-baseline-004'], { ZHIPU_API_KEY: zhipu }]
];
for (const [name, cmd, argsArr, extraEnv] of stages) {
  console.log('=== STAGE gen-004 ' + name + ' start ' + new Date().toISOString() + ' ===');
  const r = spawnSync(cmd, argsArr, { stdio: 'inherit', env: Object.assign({}, process.env, extraEnv) });
  console.log('=== STAGE gen-004 ' + name + ' exit=' + r.status + ' ' + new Date().toISOString() + ' ===');
  if (r.status !== 0) console.log('(non-zero exit, continuing — resume-safe)');
}
console.log('ALL GEN-004 STAGES DONE');
