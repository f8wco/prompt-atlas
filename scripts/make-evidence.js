'use strict';
/* Evidence pair picker (v0.4 "Show, Don't Tell"): for each benchmarked atom,
   deterministically select the (model, scene, seed) cell with the strongest
   visual contrast — control judged 0 AND treatment judged 1 — and copy the two
   images to web/assets/evidence/<id>-{control,treatment}.jpg (original size;
   downscale separately). Records provenance into benchmark/results/evidence.json
   for the core.json merge step.
   Usage: node scripts/make-evidence.js */

const fs = require('fs');
const path = require('path');

const RUNS = ['image-baseline-001', 'image-baseline-002', 'image-baseline-003', 'image-baseline-004'];
const ATOMS = ['close-up', 'monochrome', 'golden hour', 'symmetrical composition',
  'shallow depth of field', 'anime style', 'volumetric light', 'rule of thirds',
  // run 004 targeted atoms
  'macro', 'telephoto compression', 'fisheye lens', 'rim light', 'backlit silhouette',
  'neon glow', 'teal and orange', 'film grain', 'pastel colors', 'ink wash painting',
  'blue hour', 'negative space'];

const base = path.join(__dirname, '..', 'benchmark');
const outDir = path.join(__dirname, '..', 'web', 'assets', 'evidence');
fs.mkdirSync(outDir, { recursive: true });

// index observations + judgments per run
const cells = []; // {atom, model, scene, cond, seed, run, imageFile, judgment}
for (const run of RUNS) {
  const obs = fs.readFileSync(path.join(base, 'results', 'observations-' + run + '.jsonl'), 'utf8')
    .trim().split('\n').map(JSON.parse);
  const ev = fs.readFileSync(path.join(base, 'results', 'evaluations-' + run + '.jsonl'), 'utf8')
    .trim().split('\n').map(JSON.parse);
  const last = {};
  ev.forEach(e => { last[e.observationKey] = e.judgment; }); // deduped files: single per key
  for (const o of obs) {
    const key = o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition +
      (o.seed && o.seed > 1 ? '__s' + o.seed : '');
    cells.push({
      atom: o.atomId, model: o.model, scene: o.sceneTemplate, cond: o.condition,
      seed: o.seed, run: run, imageFile: o.imageFile, judgment: last[key]
    });
  }
}

function findImage(c) {
  return path.join(base, 'results', 'images', c.run, c.imageFile);
}

const manifest = {};
for (const atom of ATOMS) {
  const atomCells = cells.filter(c => c.atom === atom && c.judgment !== undefined);
  const groups = {};
  atomCells.forEach(c => {
    const k = c.model + '|' + c.scene + '|' + c.seed;
    (groups[k] = groups[k] || {})[c.cond] = c;
  });
  const keys = Object.keys(groups);
  // preference 1: control=0 & treatment=1 (max contrast); 2: any differing pair; 3: treatment=1 pair
  let pick = null, mode = '';
  for (const pref of [
    k => groups[k].control && groups[k].treatment && groups[k].control.judgment === 0 && groups[k].treatment.judgment === 1,
    k => groups[k].control && groups[k].treatment && groups[k].control.judgment !== groups[k].treatment.judgment,
    k => groups[k].treatment && groups[k].treatment.judgment === 1 && groups[k].control
  ]) {
    const k = keys.find(pref);
    if (k) { pick = groups[k]; mode = pref === 0 ? 'contrast' : 'diff'; break; }
    // note: find(pred) does not carry index; redo with loop for mode labels
  }
  // deterministic redo with explicit loop (keeps mode labels honest)
  pick = null; mode = '';
  const prefs = [
    ['contrast', k => groups[k].control && groups[k].treatment && groups[k].control.judgment === 0 && groups[k].treatment.judgment === 1],
    ['diff', k => groups[k].control && groups[k].treatment && groups[k].control.judgment !== groups[k].treatment.judgment],
    ['any', k => groups[k].control && groups[k].treatment]
  ];
  for (const [label, pred] of prefs) {
    const k = keys.find(pred);
    if (k) { pick = groups[k]; mode = label; break; }
  }
  if (!pick) { console.error('NO PAIR for ' + atom); process.exit(1); }
  const slug = atom.replace(/[^a-z0-9]+/g, '-');
  const destC = path.join(outDir, slug + '-control.jpg');
  const destT = path.join(outDir, slug + '-treatment.jpg');
  fs.copyFileSync(findImage(pick.control), destC);
  fs.copyFileSync(findImage(pick.treatment), destT);
  manifest[atom] = {
    control: 'assets/evidence/' + slug + '-control.jpg',
    treatment: 'assets/evidence/' + slug + '-treatment.jpg',
    model: pick.treatment.model, scene: pick.treatment.scene, seed: pick.treatment.seed,
    source: pick.treatment.run, selection: mode,
    judged: { control: pick.control.judgment, treatment: pick.treatment.judgment }
  };
  console.log(atom.padEnd(24), mode.padEnd(9), pick.treatment.model.split('-').slice(-1)[0], pick.treatment.scene, 's' + pick.treatment.seed,
    'judged ' + pick.control.judgment + '->' + pick.treatment.judgment);
}
fs.writeFileSync(path.join(base, 'results', 'evidence.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log('manifest: benchmark/results/evidence.json | images: web/assets/evidence/ (originals)');
console.log('NEXT: stamp + downscale via  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-evidence.ps1');
