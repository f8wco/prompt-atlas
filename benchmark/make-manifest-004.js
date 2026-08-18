'use strict';
/* Generates manifests/image-baseline-004.json: 12 priority atoms (targeted benchmark,
   per v0.6 strategy: usage x uncertainty x model variance), straight to Confidence B
   (3 families x 6 scenes x 3 seeds = 54 pairs/atom). Atom display names are pulled
   from core.json `en` fields so the pipeline naming stays consistent. */

const fs = require('fs');
const path = require('path');

const IDS = ['macro', 'telephoto', 'fisheye', 'rim', 'backlit', 'neon',
  'teal-orange', 'film-grain', 'pastel', 'ink-wash', 'blue-hour', 'negative-space'];

const QUESTIONS = {
  macro: 'Is this a macro shot where a very small subject fills the frame with extreme close-up detail? Answer YES or NO only.',
  telephoto: 'Does the image show strong telephoto-lens characteristics (flattened/compressed perspective, isolated subject, heavily blurred busy background)? Answer YES or NO only.',
  fisheye: 'Does the image show clear fisheye-lens distortion (strong barrel curvature of straight lines, warped wide frame)? Answer YES or NO only.',
  rim: 'Does the subject have a clear rim light (bright edge/outline light separating it from the background)? Answer YES or NO only.',
  backlit: 'Is the main subject backlit (light source behind the subject creating a silhouette or bright glowing outline)? Answer YES or NO only.',
  neon: 'Are colorful neon lights a dominant visual element in the image? Answer YES or NO only.',
  'teal-orange': 'Does the color grading show the teal-and-orange look (cool teal/blue-green shadows paired with warm orange highlights)? Answer YES or NO only.',
  'film-grain': 'Does the image visibly show analog film-grain texture (fine grain/noise structure rather than digital smoothness)? Answer YES or NO only.',
  pastel: 'Is the color palette dominantly pastel (soft, pale, low-saturation tones)? Answer YES or NO only.',
  'ink-wash': 'Is the image in Chinese ink-wash painting style (black ink brush strokes, paper texture, minimal color)? Answer YES or NO only.',
  'blue-hour': 'Does the image show blue-hour lighting (deep blue twilight sky/ambient tones)? Answer YES or NO only.',
  'negative-space': 'Is the composition dominated by large empty negative space with a small isolated subject? Answer YES or NO only.'
};

const core = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'core.json'), 'utf8'));
const atoms = IDS.map(id => {
  const a = core.atoms.find(x => x.id === id);
  if (!a) throw new Error('atom not found: ' + id);
  return a;
});

const manifest = {
  benchmarkVersion: '0.1',
  runId: 'image-baseline-004',
  extends: 'image-baseline-001',
  modality: 'image',
  targetConfidence: 'B',
  note: 'Targeted benchmark round 2 (v0.6 strategy): 12 priority atoms straight to Confidence B. 3 families x 6 scenes x 3 seeds x 2 conditions = 108 images per atom, 1296 total. Atom names use core.json `en` display values.',
  atoms: atoms.map(a => a.en),
  models: ['doubao-seedream-4-0-250828', 'doubao-seedream-4-5-251128', 'zhipu-cogview-4'],
  scenes: [
    { id: 'portrait', prompt: 'portrait of a woman standing by a window' },
    { id: 'street', prompt: 'a street scene with a cyclist passing by' },
    { id: 'product', prompt: 'a ceramic mug on a wooden table' },
    { id: 'environment', prompt: 'a misty forest clearing' },
    { id: 'animal', prompt: 'a cat sitting on a windowsill' },
    { id: 'architecture', prompt: 'a modern building facade seen from below' }
  ],
  conditions: ['control', 'treatment'],
  size: '2048x2048',
  seeds: [1, 2, 3],
  evaluator: { type: 'vlm+human-audit', vlm: 'doubao vision (Volcano Ark chat completions)', questions: {} }
};
atoms.forEach(a => { manifest.evaluator.questions[a.en] = QUESTIONS[a.id]; });

fs.writeFileSync(path.join(__dirname, 'manifests', 'image-baseline-004.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log('manifest 004 written:', manifest.atoms.join(', '));
manifest.atoms.forEach(name => {
  if (!QUESTIONS[atoms.find(a => a.en === name).id]) throw new Error('missing question for ' + name);
});
console.log('questions: 12/12 OK | CogView size note: run-zhipu overrides to its manifest size');
