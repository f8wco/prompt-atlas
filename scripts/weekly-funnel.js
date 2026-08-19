'use strict';
/* Weekly funnel report (P0 D10) — aggregates receiver JSONL into the seven
   P0 metrics with ABSOLUTE counts alongside percentages (small-sample honesty).

   Definitions (locked by Atlas P0 Spec v0.2):
   - uniqueCheckUsers: aids with >=1 check_started in the ISO week
   - checkCompletion:  users(check_completed) / users(check_started)
   - evidenceView:     users(check_completed AND >=1 evidence_viewed) / users(check_completed)
   - recApplied:       users(check_completed AND >=1 recommendation_applied) / users(check_completed)
   - EAE (Evidence-Assisted Export): an export_clicked where the SAME aid has a
     check_completed in the previous 10 minutes AND an evidence_viewed or
     recommendation_applied between that check and the export. Shares never count.
   - retention: aids with check_completed in week N that have any
     check_started|check_completed in week N+1 (a passing page_view does NOT count)

   Usage: node scripts/weekly-funnel.js [--dir server/data] [--out report.md]
   Module: computeFunnel(events) -> { weeks: [...] } for tests. */

const fs = require('fs');
const path = require('path');

const EXPORT_KINDS = ['prompt', 'optimized_prompt', 'recipe', 'storyboard'];
const EAE_WINDOW_MS = 10 * 60 * 1000;

function isoWeek(ts) {
  const d = new Date(ts);
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day));
  const jan4 = new Date(Date.UTC(monday.getUTCFullYear(), 0, 4));
  const week1Monday = new Date(Date.UTC(jan4.getUTCFullYear(), 0, 4 - ((jan4.getUTCDay() + 6) % 7)));
  const week = Math.round((monday - week1Monday) / (7 * 24 * 3600 * 1000)) + 1;
  return monday.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

function isExport(e) {
  return e.name === 'export_clicked' && (!e.payload || EXPORT_KINDS.indexOf(e.payload.kind) !== -1);
}

function loadEvents(files) {
  const events = [];
  files.forEach(f => {
    fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).forEach(line => {
      try {
        const e = JSON.parse(line);
        if (e && e.aid && e.name && typeof e.t === 'number') events.push(e);
      } catch (err) { /* skip malformed */ }
    });
  });
  events.sort((a, b) => a.t - b.t);
  return events;
}

function computeWeekStats(events) {
  const byAid = {};
  events.forEach(e => {
    (byAid[e.aid] = byAid[e.aid] || []).push(e);
  });

  const users = {
    started: new Set(), completed: new Set(), evidence: new Set(), applied: new Set()
  };
  let eaeCount = 0;
  const eaeUsers = new Set();
  let exportTotal = 0;
  const atomStats = {}; // id -> {checks, views, applies, up, down} (Benchmark priority inputs)
  function bump(id, k) {
    if (!id) return;
    (atomStats[id] = atomStats[id] || { checks: 0, views: 0, applies: 0, up: 0, down: 0 })[k]++;
  }

  Object.keys(byAid).forEach(aid => {
    const evs = byAid[aid];
    let hasCompleted = false, hasStarted = false;
    evs.forEach(e => {
      if (e.name === 'check_started') { hasStarted = true; users.started.add(aid); }
      if (e.name === 'check_completed') {
        hasCompleted = true; users.completed.add(aid);
        ((e.payload && e.payload.foundAtoms) || []).forEach(id => bump(id, 'checks'));
      }
      if (e.name === 'evidence_viewed' && hasCompleted) { users.evidence.add(aid); bump(e.payload && e.payload.atomId, 'views'); }
      if (e.name === 'recommendation_applied' && hasCompleted) { users.applied.add(aid); bump(e.payload && e.payload.atomId, 'applies'); }
      if (e.name === 'feedback_vote') bump(e.payload && e.payload.atomId, (e.payload && e.payload.vote) === 'up' ? 'up' : 'down');
      if (isExport(e)) {
        exportTotal++;
        // EAE: a check_completed within the prior 10 min, with evidence/applied in between
        let qualifying = false;
        for (let i = evs.indexOf(e) - 1; i >= 0; i--) {
          const p = evs[i];
          if (e.t - p.t > EAE_WINDOW_MS) break;
          if (p.name === 'check_completed') {
            // is there an evidence/applied between p and e?
            for (let j = i + 1; j < evs.indexOf(e); j++) {
              const mid = evs[j];
              if ((mid.name === 'evidence_viewed' || mid.name === 'recommendation_applied') && mid.t >= p.t && mid.t <= e.t) { qualifying = true; break; }
            }
            if (qualifying) break;
          }
        }
        if (qualifying) { eaeCount++; eaeUsers.add(aid); }
      }
    });
  });

  const pct = (a, b) => (b === 0 ? null : Math.round(100 * a / b));
  return {
    uniqueCheckUsers: users.started.size,
    completedUsers: users.completed.size,
    checkCompletion: { abs: users.completed.size, of: users.started.size, pct: pct(users.completed.size, users.started.size) },
    evidenceView: { abs: users.evidence.size, of: users.completed.size, pct: pct(users.evidence.size, users.completed.size) },
    recApplied: { abs: users.applied.size, of: users.completed.size, pct: pct(users.applied.size, users.completed.size) },
    eae: { abs: eaeCount, users: eaeUsers.size, exportsTotal: exportTotal },
    atomStats: atomStats,
    _completedSet: users.completed,
    _startedSet: users.started
  };
}

function computeFunnel(events) {
  const weeks = {};
  events.forEach(e => {
    const w = isoWeek(e.t);
    (weeks[w] = weeks[w] || []).push(e);
  });
  const weekKeys = Object.keys(weeks).sort();
  const out = weekKeys.map(w => ({ week: w, stats: computeWeekStats(weeks[w]) }));
  // retention: week N completed users who CHECK again in week N+1
  out.forEach((cur, i) => {
    const next = out[i + 1];
    if (!next) { cur.retention = { abs: 0, of: cur.stats._completedSet.size, pct: null, note: 'no next week in data' }; return; }
    let kept = 0;
    cur.stats._completedSet.forEach(aid => {
      if (next.stats._startedSet.has(aid)) kept++;
    });
    const pct = cur.stats._completedSet.size === 0 ? null : Math.round(100 * kept / cur.stats._completedSet.size);
    cur.retention = { abs: kept, of: cur.stats._completedSet.size, pct: pct };
  });
  out.forEach(w => { delete w.stats._completedSet; delete w.stats._startedSet; });
  return { weeks: out };
}

function renderMarkdown(res) {
  let md = '# Atlas P0 漏斗周报\n\n';
  res.weeks.forEach(w => {
    const s = w.stats;
    md += '## ' + w.week + '\n\n';
    md += '| 指标 | 绝对值 | 比例 |\n|---|---|---|\n';
    md += '| 周独立 CHECK 用户 | ' + s.uniqueCheckUsers + ' | — |\n';
    md += '| CHECK 完成用户 | ' + s.checkCompletion.abs + '/' + s.checkCompletion.of + ' | ' + (s.checkCompletion.pct == null ? '—' : s.checkCompletion.pct + '%') + ' |\n';
    md += '| Evidence 查看用户 | ' + s.evidenceView.abs + '/' + s.evidenceView.of + ' | ' + (s.evidenceView.pct == null ? '—' : s.evidenceView.pct + '%') + ' |\n';
    md += '| 建议采纳用户 | ' + s.recApplied.abs + '/' + s.recApplied.of + ' | ' + (s.recApplied.pct == null ? '—' : s.recApplied.pct + '%') + ' |\n';
    md += '| **Evidence-Assisted Export** | **' + s.eae.abs + ' 次 / ' + s.eae.users + ' 人**（总导出 ' + s.eae.exportsTotal + '） | — |\n';
    md += '| 次周 CHECK 留存 | ' + w.retention.abs + '/' + w.retention.of + ' | ' + (w.retention.pct == null ? '—' : w.retention.pct + '%') + (w.retention.note ? '（' + w.retention.note + '）' : '') + ' |\n\n';

    // Top CHECK atoms — the next-Benchmark priority input (frequency x uncertainty x adoption x model spread)
    const atoms = Object.keys(s.atomStats || {}).map(id => ({ id: id, v: s.atomStats[id] }));
    if (atoms.length) {
      atoms.sort((a, b) => b.v.checks - a.v.checks);
      md += '### Top ' + Math.min(20, atoms.length) + ' CHECK Atoms（下一轮 Benchmark 优先级输入）\n\n';
      md += '| Atom | CHECK | 查看 | 采纳 | 👍 | 👎 |\n|---|---|---|---|---|---|\n';
      atoms.slice(0, 20).forEach(a => {
        md += '| ' + a.id + ' | ' + a.v.checks + ' | ' + a.v.views + ' | ' + a.v.applies + ' | ' + a.v.up + ' | ' + a.v.down + ' |\n';
      });
      md += '\n> 优先级公式（评审定）：检查频率 × 证据不确定性 × 用户采纳影响 × 模型差异度——已 Verified 且各模型稳定的词不因高频继续烧钱；高频 + Heuristic/家族分裂的词才优先。\n\n';
      const up = atoms.reduce((t, a) => t + a.v.up, 0);
      const down = atoms.reduce((t, a) => t + a.v.down, 0);
      const disagreed = atoms.filter(a => a.v.down > 0).sort((a, b) => b.v.down - a.v.down);
      md += '### Evidence 反馈汇总\n\n👍 ' + up + ' · 👎 ' + down + (disagreed.length
        ? ' · 不一致集中：' + disagreed.slice(0, 5).map(a => a.id + '（👎' + a.v.down + '）').join('、')
        : '') + '\n\n';
    }
  });
  md += '> 首单为线下手记（小商店后台），不在事件数据内。\n';
  return md;
}

function main() {
  const args = process.argv.slice(2);
  function argVal(n) { const i = args.indexOf(n); return i !== -1 && args[i + 1] ? args[i + 1] : null; }
  const dir = argVal('--dir') || path.join(__dirname, '..', 'server', 'data');
  const outFile = argVal('--out');
  let files = [];
  if (fs.existsSync(dir)) {
    files = fs.readdirSync(dir).filter(f => /^atlas-events-.*\.jsonl$/.test(f)).sort().map(f => path.join(dir, f));
  }
  if (!files.length) {
    console.error('no event files found in ' + dir + ' — receiver not deployed yet or no data.');
    console.error('usage: node scripts/weekly-funnel.js --dir server/data --out report.md');
    process.exit(2);
  }
  const res = computeFunnel(loadEvents(files));
  const md = renderMarkdown(res);
  if (outFile) { fs.writeFileSync(outFile, md, 'utf8'); console.log('written ' + outFile); }
  else console.log(md);
}

module.exports = { computeFunnel, loadEvents, isoWeek, renderMarkdown };
if (require.main === module) main();
