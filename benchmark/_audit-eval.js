'use strict';
/* Audit helper: cross-checks observations vs evaluations, finds gaps/dups/anomalies. */
const fs = require('fs');
const path = require('path');

const base = __dirname;
const args2 = process.argv.slice(2);
function argVal2(name, fallback) { const i = args2.indexOf(name); return i !== -1 && args2[i + 1] ? args2[i + 1] : fallback; }
const runId = argVal2('--run', 'image-baseline-001');
const manifest = JSON.parse(fs.readFileSync(path.join(base, 'manifests', runId + '.json'), 'utf8'));

const obs = fs.readFileSync(path.join(base, 'results', 'observations-' + runId + '.jsonl'), 'utf8')
  .trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
const evalFile = path.join(base, 'results', 'evaluations-' + runId + '.jsonl');
const evals = fs.readFileSync(evalFile, 'utf8')
  .trim().split('\n').filter(Boolean).map(l => JSON.parse(l));

const obsKeys = obs.map(o => o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition);
const evalKeys = evals.map(e => e.observationKey);

const evalSet = new Set();
const dupKeys = new Set();
for (const k of evalKeys) { if (evalSet.has(k)) dupKeys.add(k); evalSet.add(k); }

const missing = obs.filter(o => !evalSet.has(o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition));
const orphan = evals.filter(e => !obsKeys.includes(e.observationKey));
const badJudgments = evals.filter(e => typeof e.judgment !== 'number' || (e.judgment !== 0 && e.judgment !== 1));
const weirdAnswers = evals.filter(e => !e.rawAnswer || e.rawAnswer.length > 200);

console.log('observations       :', obs.length);
console.log('eval lines         :', evals.length);
console.log('unique eval keys   :', evalSet.size);
console.log('duplicate keys     :', dupKeys.size, dupKeys.size ? [...dupKeys].slice(0, 10).join(', ') : '');
console.log('missing evaluations:', missing.length);
if (missing.length) console.log(missing.map(o => o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition).join('\n  '));
console.log('orphan eval lines  :', orphan.length, orphan.length ? orphan.slice(0, 5).map(e => e.observationKey).join(', ') : '');
console.log('bad judgments      :', badJudgments.length);
console.log('weird rawAnswers   :', weirdAnswers.length, weirdAnswers.length ? weirdAnswers.slice(0, 5).map(e => e.observationKey + ' => ' + String(e.rawAnswer).slice(0, 80)) : '');
const modelsInEvals = {};
for (const e of evals) modelsInEvals[e.evaluator && e.evaluator.model] = (modelsInEvals[e.evaluator && e.evaluator.model] || 0) + 1;
console.log('evaluator models   :', JSON.stringify(modelsInEvals));

// per-atom pair coverage & judgment means
const byAtom = {};
for (const o of obs) {
  const a = o.atomId;
  byAtom[a] = byAtom[a] || { pairs: 0, control: 0, controlN: 0, treatment: 0, treatmentN: 0, judged: 0 };
  const key = o.atomId + '__' + o.model + '__' + o.sceneTemplate + '__' + o.condition;
  byAtom[a].pairs++;
  if (evalSet.has(key)) {
    byAtom[a].judged++;
    const e = evals.find(x => x.observationKey === key);
    if (e) {
      if (o.condition === 'control') { byAtom[a].control += e.judgment; byAtom[a].controlN++; }
      else { byAtom[a].treatment += e.judgment; byAtom[a].treatmentN++; }
    }
  }
}
console.log('\nper-atom: pairs judged controlMean treatmentMean lift');
for (const a of Object.keys(byAtom).sort()) {
  const s = byAtom[a];
  const cm = s.controlN ? (s.control / s.controlN).toFixed(2) : '-';
  const tm = s.treatmentN ? (s.treatment / s.treatmentN).toFixed(2) : '-';
  const lift = (s.controlN && s.treatmentN) ? (s.treatment / s.treatmentN - s.control / s.controlN).toFixed(2) : '-';
  console.log(a.padEnd(24), s.pairs + '   ' + s.judged + '      ' + cm.padStart(5) + '         ' + tm.padStart(5) + '           ' + lift.padStart(5));
}
