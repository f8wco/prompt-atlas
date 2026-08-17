'use strict';
/* Launcher for run image-baseline-003 evaluation: two full VLM passes (Ark doubao vision). */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const key = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8').match(/ARK_API_KEY=(.+)/)[1].trim();
const env = Object.assign({}, process.env, { ARK_API_KEY: key });

const stages = [['pass1', []], ['pass2', ['--force']]];
for (const [name, extra] of stages) {
  console.log('=== STAGE eval-003 ' + name + ' start ' + new Date().toISOString() + ' ===');
  const r = spawnSync('node', [path.join(__dirname, 'eval-vlm.js'), '--run', 'image-baseline-003'].concat(extra),
    { stdio: 'inherit', env: env });
  console.log('=== STAGE eval-003 ' + name + ' exit=' + r.status + ' ' + new Date().toISOString() + ' ===');
  if (r.status !== 0) { console.log('(non-zero exit — continuing)'); }
}
console.log('ALL EVAL-003 STAGES DONE');
