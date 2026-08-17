'use strict';
/* Launcher for run image-baseline-002: generates both models sequentially.
   Key is injected from benchmark/.env.local into the child env only. */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const key = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8').match(/ARK_API_KEY=(.+)/)[1].trim();
const env = Object.assign({}, process.env, { ARK_API_KEY: key });
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifests', 'image-baseline-002.json'), 'utf8'));

for (const model of manifest.models) {
  console.log('=== STAGE generate ' + model + ' start ' + new Date().toISOString() + ' ===');
  const r = spawnSync('node', [path.join(__dirname, 'run-image-baseline.js'), '--run', 'image-baseline-002', '--model', model],
    { stdio: 'inherit', env: env });
  console.log('=== STAGE generate ' + model + ' exit=' + r.status + ' ' + new Date().toISOString() + ' ===');
  if (r.status !== 0) { console.log('(non-zero exit, continuing to next model — resume-safe)'); }
}
console.log('ALL GENERATION STAGES DONE');
