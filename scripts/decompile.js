'use strict';
/* Visual Decompiler: video → structured Scene IR → reconstructed prompt.
   NOT "recovering the original prompt" — reconstructing a prompt that could
   reproduce the observed effect. Extracts 9 slots + Content + Temporal from
   frame sequences via VLM.

   Usage:
     node scripts/decompile.js <video.mp4>                    → decompile + prompt
     node scripts/decompile.js <video.mp4> --prompt "..."     → + Prompt Autopsy

   Requires ARK_API_KEY in benchmark/.env.local and ffmpeg on PATH. */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const env = fs.readFileSync(path.join(ROOT, 'benchmark', '.env.local'), 'utf8');
const KEY = env.match(/ARK_API_KEY=(.+)/)[1].trim();
const ATLAS = require(path.join(ROOT, 'web', 'core-data.js'));
const LIB = require(path.join(ROOT, 'web', 'core-lib.js'));

const args = process.argv.slice(2);
const videoPath = args[0];
const userPrompt = (args.indexOf('--prompt') !== -1) ? args[args.indexOf('--prompt') + 1] : null;
const nFrames = (args.indexOf('--frames') !== -1) ? parseInt(args[args.indexOf('--frames') + 1], 10) : 8;
if (!videoPath || !fs.existsSync(videoPath)) {
  console.error('usage: node scripts/decompile.js <video.mp4> [--prompt "original prompt"] [--frames N]');
  process.exit(2);
}

/* --- frame extraction --- */
const tmpDir = path.join(ROOT, 'benchmark', 'results', 'decompile-frames', path.basename(videoPath).replace(/\.[^.]+$/, ''));
fs.mkdirSync(tmpDir, { recursive: true });

function getDuration(file) {
  try {
    const out = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${file}"`).toString().trim();
    return parseFloat(out) || 5;
  } catch (e) { return 5; }
}

function extractFrames(file, n) {
  const dur = getDuration(file);
  const existing = fs.readdirSync(tmpDir).filter(f => f.endsWith('.jpg'));
  if (existing.length >= n) return existing.sort();
  const interval = dur / n;
  const files = [];
  for (let i = 0; i < n; i++) {
    const t = Math.min(dur - 0.1, i * interval + interval / 2).toFixed(2);
    const out = path.join(tmpDir, 'f' + String(i).padStart(2, '0') + '.jpg');
    try {
      execSync(`ffmpeg -y -ss ${t} -i "${file}" -frames:v 1 -q:v 2 "${out}"`, { stdio: 'pipe' });
      files.push(path.basename(out));
    } catch (e) { /* skip */ }
  }
  return files.sort();
}

/* --- VLM call --- */
function vlmAnalyze(b64Frames, question) {
  return new Promise((resolve, reject) => {
    const content = [{ type: 'text', text: question }];
    b64Frames.forEach((b64, i) => {
      content.push({ type: 'text', text: 'Frame ' + (i + 1) + '/' + b64Frames.length + ':' });
      content.push({ type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + b64 } });
    });
    const body = JSON.stringify({ model: 'doubao-seed-2-0-lite-260215', messages: [{ role: 'user', content }] });
    const req = https.request({
      hostname: 'ark.cn-beijing.volces.com', path: '/api/v3/chat/completions', method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY, 'Content-Length': Buffer.byteLength(body) },
      timeout: 180000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d || '{}');
          if (!j.choices || !j.choices[0]) return reject(new Error('VLM status ' + res.statusCode));
          resolve(j.choices[0].message.content || '');
        } catch (e) { reject(new Error('VLM parse error')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.write(body); req.end();
  });
}

/* --- extraction prompts --- */
const DECOMPILE_PROMPT = `You are a professional cinematographer analyzing a video from its frame sequence (${nFrames} evenly-spaced frames in chronological order).

Analyze the video and output ONLY a valid JSON object (no markdown, no explanation) with this exact structure:

{
  "content": {
    "subject": "who/what is the main subject (be specific)",
    "action": "what is happening / what does the subject do",
    "environment": "where is this (location, setting, atmosphere)"
  },
  "visual": {
    "lighting": { "value": "e.g. neon glow / golden hour / overcast / backlit / rim light / volumetric light", "confidence": 0-100 },
    "camera": { "value": "e.g. tracking shot / handheld / dolly zoom / static / aerial / orbit", "confidence": 0-100 },
    "shot": { "value": "e.g. close-up / medium / wide / extreme wide / over-the-shoulder", "confidence": 0-100 },
    "composition": { "value": "e.g. symmetrical / rule of thirds / leading lines / negative space / frame-in-frame", "confidence": 0-100 },
    "color": { "value": "e.g. teal and orange / monochrome / pastel / high saturation / desaturated / cyberpunk palette", "confidence": 0-100 },
    "style": { "value": "e.g. cinematic / photorealistic / anime / ink wash / claymation / documentary", "confidence": 0-100 },
    "mood": { "value": "e.g. serene / epic / melancholic / cozy / suspenseful / mysterious", "confidence": 0-100 },
    "time": { "value": "e.g. golden hour / blue hour / night / dawn / dusk / rainy night", "confidence": 0-100 },
    "lens": { "value": "e.g. shallow depth of field / telephoto compression / fisheye / macro / film grain / VHS", "confidence": 0-100 }
  },
  "temporal": {
    "beats": [
      { "time": "0-2s", "action": "what happens in this segment" },
      { "time": "2-5s", "action": "..." }
    ],
    "motion": "how does the camera and subject move over time",
    "transition": "any cuts, transitions, or changes in shot type"
  },
  "generation_hints": {
    "likely_mode": "text-to-video or image-to-video (guess from quality/consistency)",
    "first_frame_dependency": true/false
  }
}

Rules:
- confidence = how clearly you can observe this attribute from the frames (0 = guessing, 100 = unmistakable)
- If you cannot determine a slot, set value to null and confidence to 0
- For temporal beats, divide the video into 2-4 logical segments based on what you observe
- Output ONLY the JSON, no other text`;

const AUTOPSY_PROMPT = `You are analyzing a video AND the prompt that was used to generate it. Your job is to determine which words in the prompt actually manifested in the output.

Original prompt: "${userPrompt}"

Based on the ${nFrames} frames provided, for EACH significant word/phrase in the original prompt, output ONLY a valid JSON array (no markdown):

[
  {
    "prompt_word": "the word or phrase from the original prompt",
    "category": "lighting|camera|shot|composition|color|style|mood|time|lens|content|temporal|other",
    "observed": true|false|null,
    "evidence": "what you see in the frames that supports or refutes this",
    "confidence": 0-100
  }
]

Rules:
- observed=true: you can clearly see this effect in the frames
- observed=false: the effect is clearly absent
- observed=null: ambiguous, cannot determine
- Include EVERY significant word from the prompt (not just visual terms — also subject, action, environment)
- Output ONLY the JSON array`;

/* --- main --- */
(async () => {
  console.log('=== Visual Decompiler ===');
  console.log('video: ' + path.basename(videoPath));
  console.log('frames: ' + nFrames);

  const frameFiles = extractFrames(videoPath, nFrames);
  console.log('extracted: ' + frameFiles.length + ' frames');
  if (frameFiles.length < 3) { console.error('ERROR: too few frames'); process.exit(1); }
  const b64s = frameFiles.map(f => fs.readFileSync(path.join(tmpDir, f)).toString('base64'));

  /* Pass 1: Decompile */
  console.log('\n--- Pass 1: Scene IR extraction ---');
  let irText = '';
  try {
    irText = await vlmAnalyze(b64s, DECOMPILE_PROMPT);
  } catch (e) { console.error('VLM error: ' + e.message); process.exit(1); }

  let ir = null;
  try {
    const jsonMatch = irText.match(/\{[\s\S]*\}/);
    ir = JSON.parse(jsonMatch ? jsonMatch[0] : irText);
  } catch (e) {
    console.error('Failed to parse VLM output as JSON:\n' + irText.slice(0, 300));
    process.exit(1);
  }

  console.log('\n=== SCENE IR ===');
  console.log(JSON.stringify(ir, null, 2));

  /* Map to Atlas atoms */
  console.log('\n=== ATLAS ATOM MAPPING ===');
  const SLOT_MAP = { lighting: 'lighting', camera: 'camera', shot: 'shot', composition: 'composition', color: 'color', style: 'style', mood: 'mood', time: 'time', lens: 'technique' };
  const matched = [];
  Object.keys(SLOT_MAP).forEach(slotKey => {
    const v = ir.visual && ir.visual[slotKey];
    if (!v || !v.value || v.confidence < 30) return;
    // run the matcher on the value
    const r = LIB.analyze(ATLAS, v.value, 'video');
    r.found.forEach(a => {
      matched.push({ slot: slotKey, atlasId: a.id, zh: a.zh, en: a.en, score: LIB.readScore(a), vlmValue: v.value, confidence: v.confidence });
    });
    if (!r.found.length) {
      matched.push({ slot: slotKey, atlasId: null, zh: null, en: null, score: null, vlmValue: v.value, confidence: v.confidence, note: 'not in dictionary' });
    }
  });
  matched.forEach(m => {
    console.log('  ' + m.slot.padEnd(14) + (m.atlasId ? m.zh + ' (' + m.en + ') ·' + m.score : '(未收录) "' + m.vlmValue + '"') + ' conf:' + m.confidence);
  });

  /* Reconstruct prompt */
  console.log('\n=== RECONSTRUCTED PROMPT ===');
  const content = ir.content || {};
  const atomsEn = matched.filter(m => m.en).map(m => m.en);
  const baseEn = [content.subject, content.action, content.environment].filter(Boolean).join(', ');
  const reconstructed = (baseEn ? baseEn + ', ' : '') + atomsEn.join(', ');
  console.log('EN: ' + reconstructed);
  const atomsZh = matched.filter(m => m.zh).map(m => m.zh);
  const baseZh = [content.subject, content.action, content.environment].filter(Boolean).join('，');
  console.log('ZH: ' + (baseZh ? baseZh + '，' : '') + atomsZh.join('，'));

  /* Pass 2: Autopsy (if user prompt provided) */
  if (userPrompt) {
    console.log('\n' + '='.repeat(50));
    console.log('=== PROMPT AUTOPSY ===');
    console.log('original: "' + userPrompt + '"');
    let autopsyText = '';
    try {
      autopsyText = await vlmAnalyze(b64s, AUTOPSY_PROMPT);
    } catch (e) { console.error('Autopsy VLM error: ' + e.message); }

    try {
      const arrMatch = autopsyText.match(/\[[\s\S]*\]/);
      const autopsy = JSON.parse(arrMatch ? arrMatch[0] : autopsyText);
      console.log('\n| Prompt 成分 | 观察到 | 证据 | 置信度 |');
      console.log('|---|---|---|---:|');
      autopsy.forEach(a => {
        const obs = a.observed === true ? '✅' : a.observed === false ? '❌' : '❓';
        console.log('| ' + a.prompt_word + ' | ' + obs + ' | ' + String(a.evidence || '').slice(0, 60) + ' | ' + a.confidence + '% |');
      });
      const effective = autopsy.filter(a => a.observed === true).length;
      const total = autopsy.length;
      console.log('\n结论: ' + effective + '/' + total + ' 个词有效 (' + Math.round(100 * effective / total) + '%)');
    } catch (e) {
      console.error('Failed to parse autopsy output:\n' + autopsyText.slice(0, 200));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Done. Output: ' + path.basename(videoPath) + ' → IR + ' + matched.length + ' slot mappings' + (userPrompt ? ' + autopsy' : ''));
})().catch(e => { console.error(e); process.exit(1); });
