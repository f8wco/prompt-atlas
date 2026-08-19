'use strict';
/* Build the evidence-aware recommendation data layer:
   benchmark evaluations (raw JSONL) + anomalies -> web/rec-data.js (browser global + CommonJS).

   Everything here is derived, never hand-written. Sources (all committed to the repo):
     - benchmark/manifests/image-baseline-00{1,2,3,4}.json   (atom/model/scene/seed protocol)
     - benchmark/results/evaluations-image-baseline-00{1,2,3,4}.jsonl (VLM judgments, video smoke excluded: different protocol)
     - benchmark/results/anomalies-...+004.json               (whiteout / familySplit / strongSwitch flags)
     - core.json                                              (atom id mapping via `en` field + byModel drift invariant)

   Invariants enforced (process exits non-zero on violation):
     1. Every benchmarked core.json atom has a matching manifest atom name (via case-insensitive `en`).
     2. byModel rebuilt from raw judgments equals core.json score.byModel exactly (drift guard).
     3. Exactly 3 models x 6 scenes; every rec atom has byScene lift for all 6 scenes.

   Usage: node scripts/build-rec.js   (or: npm run build:rec) */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const RUNS = ['image-baseline-001', 'image-baseline-002', 'image-baseline-003', 'image-baseline-004'];

const core = JSON.parse(fs.readFileSync(path.join(root, 'core.json'), 'utf8'));
const coreById = {};
core.atoms.forEach(a => { coreById[a.id] = a; });

/* ---------- read raw judgments ---------- */
function readJsonl(file) {
  return fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
}

const byKey = {}; // `${atomName}__${model}__${scene}__${condition}__${seed}` -> judgment (last wins, mirrors aggregate.js)
let totalEval = 0;
RUNS.forEach(runId => {
  const f = path.join(root, 'benchmark', 'results', 'evaluations-' + runId + '.jsonl');
  if (!fs.existsSync(f)) throw new Error('missing ' + f);
  readJsonl(f).forEach(e => {
    if (typeof e.judgment !== 'number') throw new Error('non-numeric judgment in ' + runId + ': ' + e.observationKey);
    // run-001 lines carry no `seed` field: seed lives only in the observationKey suffix (`__sN`, none = seed 1)
    const m = /__s(\d+)$/.exec(e.observationKey);
    const seed = (typeof e.seed === 'number') ? e.seed : (m ? Number(m[1]) : 1);
    byKey[[e.atomId, e.model, e.sceneTemplate, e.condition, seed].join('__')] = e.judgment;
    totalEval++;
  });
});

/* ---------- manifest atom names -> core ids (via `en` field, verified identical) ---------- */
const manifestAtomNames = [...new Set(RUNS.flatMap(r => {
  const m = JSON.parse(fs.readFileSync(path.join(root, 'benchmark', 'manifests', r + '.json'), 'utf8'));
  return m.atoms;
}))];

const nameToId = {};
const idByName = {};
core.atoms.forEach(a => { idByName[a.en.toLowerCase()] = a.id; });
manifestAtomNames.forEach(name => {
  const id = idByName[name.toLowerCase()];
  if (!id) throw new Error('manifest atom "' + name + '" has no core.json atom with matching `en` field');
  nameToId[name] = id;
});

const benchIds = core.atoms.filter(a => a.score && a.score.status === 'benchmarked').map(a => a.id);
const missing = benchIds.filter(id => !Object.values(nameToId).includes(id));
if (missing.length) throw new Error('benchmarked core atoms without benchmark data: ' + missing.join(', '));
if (Object.keys(nameToId).length !== benchIds.length) {
  throw new Error('manifest/core atom count mismatch: ' + Object.keys(nameToId).length + ' vs ' + benchIds.length);
}

/* ---------- aggregate: atom x model x scene ---------- */
const MODELS = ['doubao-seedream-4-0-250828', 'doubao-seedream-4-5-251128', 'zhipu-cogview-4'];
const SCENES = ['portrait', 'street', 'product', 'environment', 'animal', 'architecture'];
const SEEDS = [1, 2, 3];

const mean = arr => arr.reduce((s, v) => s + v, 0) / arr.length;
const pct = v => Math.round(v * 100);

function cell(name, model, scene) {
  const t = [], c = [];
  SEEDS.forEach(seed => {
    const tv = byKey[[name, model, scene, 'treatment', seed].join('__')];
    const cv = byKey[[name, model, scene, 'control', seed].join('__')];
    if (tv !== undefined) t.push(tv);
    if (cv !== undefined) c.push(cv);
  });
  return { t, c };
}

const recAtoms = {};
manifestAtomNames.forEach(name => {
  const id = nameToId[name];
  const entry = { byModel: {}, byScene: {}, byModelScene: {} };
  let modelScoreMismatch = null;

  MODELS.forEach(model => {
    // pooled across scenes -> byModel (must match core.json)
    const allT = [], allC = [];
    const perScene = {};
    SCENES.forEach(scene => {
      const { t, c } = cell(name, model, scene);
      if (!t.length) return;
      allT.push(...t); allC.push(...c);
      const A = mean(t), B = c.length ? mean(c) : 0;
      perScene[scene] = { a: pct(A), b: pct(B), lift: pct(A - B), n: t.length + c.length };
    });
    if (!allT.length) return;
    const A = mean(allT), B = allC.length ? mean(allC) : 0, L = Math.max(0, A - B);
    const modelScore = Math.round(100 * (0.7 * A + 0.3 * L));
    const coreVal = coreById[id].score.byModel && coreById[id].score.byModel[model];
    if (coreVal !== undefined && coreVal !== modelScore) {
      modelScoreMismatch = id + '/' + model + ': rebuilt ' + modelScore + ' vs core.json ' + coreVal;
    }
    entry.byModel[model] = modelScore;
    entry.byModelScene[model] = perScene;
  });

  if (modelScoreMismatch) throw new Error('byModel drift: ' + modelScoreMismatch + ' — re-run benchmark/aggregate.js and sync core.json');

  // pooled across models -> byScene (same numbers anomalies.js reports as sceneDependent)
  SCENES.forEach(scene => {
    const t = [], c = [];
    MODELS.forEach(model => {
      const cc = cell(name, model, scene);
      t.push(...cc.t); c.push(...cc.c);
    });
    if (!t.length) return;
    const A = mean(t), B = c.length ? mean(c) : 0;
    entry.byScene[scene] = { lift: pct(A - B), n: t.length + c.length };
  });

  const sceneCount = Object.keys(entry.byScene).length;
  if (sceneCount !== SCENES.length) throw new Error(id + ': byScene covers ' + sceneCount + '/' + SCENES.length + ' scenes');
  recAtoms[id] = entry;
});

/* ---------- anomalies flags ---------- */
const anomaliesPath = path.join(root, 'benchmark', 'results', 'anomalies-' + RUNS.join('+') + '.json');
const anomalies = JSON.parse(fs.readFileSync(anomaliesPath, 'utf8'));
function anomalyIds(list) {
  return (list || []).map(x => nameToId[x.atom]).filter(Boolean);
}
anomalyIds(anomalies.categories.redundant).forEach(id => { recAtoms[id].flags = Object.assign({ whiteout: true }, recAtoms[id].flags); });
anomalyIds(anomalies.categories.strongSwitch).forEach(id => { recAtoms[id].flags = Object.assign({ strongSwitch: true }, recAtoms[id].flags); });
(anomalies.categories.familySplit || []).forEach(x => {
  const id = nameToId[x.atom];
  if (id) recAtoms[id].flags = Object.assign({ familySplit: x.spread }, recAtoms[id].flags);
});

/* ---------- payload ---------- */
const payload = {
  version: 1,
  benchmarkVersion: core.meta.benchmark.benchmarkVersion,
  runs: RUNS,
  evaluationLines: totalEval,
  models: [
    { id: MODELS[0], short: 'Seedream 4.0', family: 'doubao' },
    { id: MODELS[1], short: 'Seedream 4.5', family: 'doubao' },
    { id: MODELS[2], short: 'CogView-4', family: 'zhipu' }
  ],
  scenes: [
    { id: 'portrait', zh: '人像', en: 'Portrait' },
    { id: 'street', zh: '街头', en: 'Street' },
    { id: 'product', zh: '产品', en: 'Product' },
    { id: 'environment', zh: '自然环境', en: 'Environment' },
    { id: 'animal', zh: '动物', en: 'Animal' },
    { id: 'architecture', zh: '建筑', en: 'Architecture' }
  ],
  /* byModelScene cells pool 3 seeds per condition (n=6) — low-sample detail, footnote only.
     byScene pools all 3 models (n<=18). Never present these as precise probabilities. */
  sampleNote: 'low',
  atoms: recAtoms
};

const header =
  '/* 由 scripts/build-rec.js 从 benchmark 原始评测数据自动生成，请勿手改本文件。\n' +
  '   修改数据请重跑 benchmark 或运行: node scripts/build-rec.js (或 npm run build:rec)\n' +
  '   byModel 与 core.json 强一致（构建时校验）；byScene 为跨模型聚合 lift；byModelScene 单元格样本量低（n=6），仅供注脚。 */\n';

const out = header +
  'var PROMPT_ATLAS_REC = ' + JSON.stringify(payload, null, 2) + ';\n' +
  'if (typeof module === \'object\' && module.exports) { module.exports = PROMPT_ATLAS_REC; }\n' +
  'if (typeof window !== \'undefined\') { window.PROMPT_ATLAS_REC = PROMPT_ATLAS_REC; }\n';

const outPath = path.join(root, 'web', 'rec-data.js');
fs.writeFileSync(outPath, out, 'utf8');

const flagged = Object.keys(recAtoms).filter(id => recAtoms[id].flags).length;
console.log('OK: ' + totalEval + ' judgments -> web/rec-data.js (' + Object.keys(recAtoms).length + ' rec atoms, ' + flagged + ' flagged)');
