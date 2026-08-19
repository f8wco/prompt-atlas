'use strict';
/* Build per-atom SEO pages (P0 D5-7): core.json + rec-data.js + evidence.json -> web/atoms/{id}/index.html
   - 20 benchmarked atoms: full Evidence page (image slider, byModel bars, byScene heat, provenance, feedback)
   - 40 heuristic atoms: degraded template — explicit "未实测" framing, no evidence visuals (no fake confidence)
   - Also emits web/sitemap.xml (root pages + 60 atom URLs) and web/atoms/manifest.json (sha256 per page, CI sync).
   Usage: node scripts/build-atom-pages.js */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const core = JSON.parse(fs.readFileSync(path.join(root, 'core.json'), 'utf8'));
const rec = require(path.join(root, 'web', 'rec-data.js'));
const evidenceIndex = JSON.parse(fs.readFileSync(path.join(root, 'benchmark', 'results', 'evidence.json'), 'utf8'));

const SITE = 'https://atlas.f8w.com';
const OUT = path.join(root, 'web', 'atoms');
fs.rmSync(OUT, { recursive: true, force: true });

const SHORT = { 'doubao-seedream-4-0-250828': 'Seedream 4.0', 'doubao-seedream-4-5-251128': 'Seedream 4.5', 'zhipu-cogview-4': 'CogView-4' };
const atomById = {}; core.atoms.forEach(a => { atomById[a.id] = a; });
const slotZh = {}; core.slots.forEach(s => { slotZh[s.id] = s.zh; });

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function levelBadge(a) {
  if (a.score.status === 'benchmarked') {
    return '<span class="lv lv-bench">● Benchmarked · 置信 ' + a.score.confidence + '</span>';
  }
  return '<span class="lv lv-heur">○ Heuristic · 未实测</span>';
}
function liftColor(l) { return l >= 50 ? '#16a34a' : (l >= 30 ? '#65a30d' : (l > 10 ? '#9ca3af' : '#ef4444')); }

function evidenceByEn(en) {
  const key = Object.keys(evidenceIndex).find(k => k.toLowerCase() === String(en).toLowerCase());
  return key ? evidenceIndex[key] : null;
}

function head(a) {
  const desc = (a.desc || '').slice(0, 90);
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(a.zh)} ${esc(a.en)} 提示词 · 实测分数与用法 | Atlas</title>
<meta name="description" content="${esc(desc)}。${a.score.status === 'benchmarked' ? '跨 3 个模型家族 × 6 场景实测，分数 ' + a.score.value + '。' : '词库收录，尚未实测（明确标注）。'}来自 Visual Prompt Atlas 实测词库。">
<link rel="canonical" href="${SITE}/atoms/${a.id}/">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.zh)} ${esc(a.en)} — ${a.score.status === 'benchmarked' ? '实测 ' + a.score.value + ' 分' : '未实测词条'}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}/atoms/${a.id}/">
<meta name="robots" content="index,follow">
<link rel="stylesheet" href="../../style.css">
<style>
.atom-page{max-width:820px;margin:0 auto;padding:20px 18px 60px}
.atom-h1{font-size:1.7rem;margin:14px 0 4px}
.atom-sub{color:var(--txt3);font-size:.95rem;margin-bottom:14px}
.lv{display:inline-block;font-size:.78rem;font-weight:700;border-radius:6px;padding:2px 8px;margin-left:8px;vertical-align:middle}
.lv-bench{background:rgba(22,163,74,.12);color:#16a34a}
.lv-heur{background:rgba(154,161,182,.15);color:#6b7280}
.score-big{font-size:2.6rem;font-weight:800;background:linear-gradient(120deg,#6366f1,#a855f7);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.atom-sec{margin-top:26px}
.atom-sec h2{font-size:1.05rem;margin:0 0 8px}
.atom-example{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px 14px;font-family:ui-monospace,Consolas,monospace;font-size:.9rem}
.slider-wrap{position:relative;width:100%;border-radius:12px;overflow:hidden;border:1px solid var(--line2);user-select:none}
.slider-wrap img{width:100%;display:block}
.slider-top{position:absolute;inset:0;clip-path:inset(0 50% 0 0)}
.slider-bar{position:absolute;top:0;bottom:0;left:50%;width:3px;background:var(--pri);pointer-events:none}
.slider-bar::after{content:'◂ ▸';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--pri);color:#fff;font-size:11px;padding:6px 8px;border-radius:999px;white-space:nowrap}
.slider-input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.prov{font-size:.75rem;color:var(--txt3);margin-top:6px;font-family:ui-monospace,Consolas,monospace}
.bm-row{margin:8px 0}
.bm-row .bm-name{font-size:.8rem;color:var(--txt2);width:90px;display:inline-block}
.bm-row .bm-bar{height:14px;border-radius:7px;background:linear-gradient(90deg,#6366f1,#a855f7);display:inline-block;vertical-align:middle}
.bm-row .bm-val{font-size:.8rem;font-weight:700;margin-left:8px}
.heat{border-collapse:collapse;font-size:.8rem;width:100%}
.heat td,.heat th{border:1px solid var(--line);padding:5px 8px;text-align:center}
.heat td.hs{font-weight:700;color:#fff}
.rel-list{display:flex;flex-wrap:wrap;gap:8px}
.rel-chip{border:1px solid var(--line2);border-radius:8px;padding:4px 10px;font-size:.82rem;background:var(--card)}
.rel-chip.hard{border-color:rgba(239,68,68,.5);color:#b91c1c}
.rel-chip.soft{border-color:rgba(245,158,11,.55);color:#92400e}
.fb-row{display:flex;gap:12px;align-items:center;margin-top:10px}
.fb-btn{border:1px solid var(--line2);background:var(--card);border-radius:10px;padding:8px 18px;cursor:pointer;font-size:.9rem}
.fb-btn:hover{border-color:var(--pri)}
.check-cta{display:inline-block;margin-top:8px;background:linear-gradient(120deg,#6366f1,#a855f7);color:#fff;border-radius:12px;padding:12px 22px;text-decoration:none;font-weight:700}
.heur-note{border:1px dashed var(--line2);background:var(--bg);border-radius:12px;padding:14px 16px;color:var(--txt2);font-size:.92rem}
.cite{font-size:.75rem;color:var(--txt3);background:var(--bg);border-radius:8px;padding:8px 12px;margin-top:8px;overflow-wrap:anywhere}
</style>
</head>
<body>
<header>
<div class="brand"><span class="logo-badge">🎬</span><span>视觉提示词图库</span> <span class="tag">Visual Prompt Atlas</span></div>
<div class="header-right"><a class="lang-btn" href="../../index.html">← 返回工具</a></div>
</header>
<main class="atom-page">
`;
}

function foot(a) {
  return `
<div class="atom-sec">
<h2>引用与署名</h2>
<div class="cite">数据来源：Visual Prompt Atlas (github.com/f8wco/prompt-atlas) · ${a.score.status === 'benchmarked' ? '3 模型家族 × 6 场景 × 3 seeds A/B 实测（Confidence ' + a.score.confidence + '，' + a.score.sampleSize + ' 图/词）' : '经验估计，未实测'} · CC BY 4.0</div>
</div>
</main>
<script src="../../analytics.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
  var sl = document.querySelector('.slider-input');
  if (sl) sl.addEventListener('input', function () {
    var v = sl.value + '%';
    var top = document.querySelector('.slider-top');
    var bar = document.querySelector('.slider-bar');
    if (top) top.style.clipPath = 'inset(0 ' + (100 - sl.value) + '% 0 0)';
    if (bar) bar.style.left = v;
  });
  document.querySelectorAll('.fb-btn[data-vote]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (window.AtlasAnalytics && AtlasAnalytics.enabled()) {
        try { Analytics.track('feedback_vote', { atomId: '${a.id}', vote: b.getAttribute('data-vote') }); } catch (e) {}
      }
      var row = document.getElementById('fb-done');
      if (row) row.textContent = '✓ 已记录（可在隐私说明中关闭统计）';
    });
  });
});
</script>
</body>
</html>
`;
}

function sectionDefinition(a) {
  return `
<h1 class="atom-h1">${esc(a.zh)} <span style="font-size:1.05rem;color:var(--txt3)">${esc(a.en)}</span>${levelBadge(a)}</h1>
<div class="atom-sub">槽位：${slotZh[a.slot] || a.slot} · ${a.modalities && a.modalities.length ? a.modalities.join(' / ') : 'image / video'}</div>
<div class="atom-sec">
<h2>是什么</h2>
<p style="color:var(--txt2);line-height:1.8">${esc(a.desc)}</p>
<p style="color:var(--txt3);font-size:.85rem">${esc(a.descEn)}</p>
<div class="atom-example">${esc(a.example)} <button class="btn mini" data-copy-ex>复制</button></div>
</div>`;
}

function sectionScore(a, entry) {
  let html = `
<div class="atom-sec">
<h2>控制力分数</h2>
<div><span class="score-big">${a.score.value}</span> <span style="color:var(--txt3)">/ 100</span></div>`;
  if (a.score.status === 'benchmarked' && a.score.measured) {
    html += `<p style="font-size:.85rem;color:var(--txt2)">依从率 ${a.score.measured.adherence}% · 基线 ${a.score.measured.baseline}% · 增益 +${a.score.measured.lift}pp · 样本 ${a.score.sampleSize} 图（54 对）</p>`;
  } else {
    html += `<p style="font-size:.85rem;color:var(--txt3)">该词条为经验估计（heuristic），尚未进入实测管道——分数只是先验参考，明确标注，不冒充实测。</p>`;
  }
  html += `</div>`;
  return html;
}

function sectionEvidence(a) {
  const ev = evidenceByEn(a.en);
  if (!ev) return '';
  const modelShort = SHORT[ev.model] || ev.model;
  return `
<div class="atom-sec">
<h2>实测证据对照（拖动对比）</h2>
<div class="slider-wrap">
<img src="../../${esc(ev.control)}" alt="无词基线图（control）">
<div class="slider-top"><img src="../../${esc(ev.treatment)}" alt="加词效果图（treatment）"></div>
<div class="slider-bar"></div>
<input class="slider-input" type="range" min="0" max="100" value="50" aria-label="对比滑块">
</div>
<div class="prov">AI Generated · Model: ${esc(modelShort)} · Seed: ${ev.seed} · Scene: ${esc(ev.scene)} · Judged: control ${ev.judged ? ev.judged.control : '-'} → treatment ${ev.judged ? ev.judged.treatment : '-'} · Atlas Benchmark ${esc(rec.benchmarkVersion)}</div>
<p style="font-size:.8rem;color:var(--txt3)">左：不写该词模型自己会怎么画；右：加上该词后的变化。判定由 VLM 裁判 + 人工复核。</p>
</div>`;
}

function sectionByModel(a, entry) {
  if (!entry || !entry.byModel) return '';
  let rows = '';
  rec.models.forEach(m => {
    const v = entry.byModel[m.id];
    if (v === undefined) return;
    rows += `<div class="bm-row"><span class="bm-name">${esc(m.short)}</span><span class="bm-bar" style="width:${Math.round(v * 2.4)}px"></span><span class="bm-val">${v}${v < 40 ? ' ⚠' : ''}</span></div>`;
  });
  const flag = entry.flags && entry.flags.familySplit ? `<p style="font-size:.8rem;color:#92400e">⚠ 家族分裂：同词在不同模型上相差 ${entry.flags.familySplit} 分——选词前先确认目标模型。</p>` : '';
  return `
<div class="atom-sec">
<h2>分模型表现</h2>${rows}${flag}</div>`;
}

function sectionByScene(a, entry) {
  if (!entry || !entry.byScene) return '';
  let cells = '';
  rec.scenes.forEach(sc => {
    const v = entry.byScene[sc.id];
    if (!v) return;
    cells += `<td class="hs" style="background:${liftColor(v.lift)}">${v.lift >= 0 ? '+' : ''}${v.lift}</td>`;
  });
  let heads = rec.scenes.map(sc => `<th>${esc(sc.zh)}</th>`).join('');
  const dead = rec.scenes.filter(sc => entry.byScene[sc.id] && entry.byScene[sc.id].lift <= 10).map(sc => sc.zh);
  const deadNote = dead.length ? `<p style="font-size:.8rem;color:#b91c1c">⚠ 在 ${dead.join('、')} 场景实测增益 ≤10pp：这些画面类型里接近白写。</p>` : '';
  return `
<div class="atom-sec">
<h2>分画面类型增益（lift, pp）</h2>
<table class="heat"><tr>${heads}</tr><tr>${cells}</tr></table>
${deadNote}<p style="font-size:.8rem;color:var(--txt3)">数值为跨 3 模型聚合的处理组-对照组判定差（每格 18 张）。正数越大越值得写，≤10 接近无效。</p>
</div>`;
}

function sectionRelations(a) {
  const rel = a.relations || {};
  const chips = [];
  (rel.hardConflict || []).forEach(id => { if (atomById[id]) chips.push('<span class="rel-chip hard">🚫 ' + esc(atomById[id].zh) + '（硬冲突）</span>'); });
  (rel.softTension || []).forEach(id => { if (atomById[id]) chips.push('<span class="rel-chip soft">⚠ ' + esc(atomById[id].zh) + '（软张力）</span>'); });
  (rel.redundant || []).forEach(id => { if (atomById[id]) chips.push('<span class="rel-chip">↺ ' + esc(atomById[id].zh) + '（冗余）</span>'); });
  (rel.implies || []).forEach(id => { if (atomById[id]) chips.push('<span class="rel-chip">⇒ ' + esc(atomById[id].zh) + '（蕴含）</span>'); });
  if (!chips.length) return '';
  return `
<div class="atom-sec">
<h2>与其他词的关系</h2>
<div class="rel-list">${chips.join('')}</div></div>`;
}

function sectionFeedbackCta(a) {
  const bench = a.score.status === 'benchmarked';
  return `
<div class="atom-sec">
<h2>这个结果和你的体验一致吗？</h2>
${bench ? '' : '<p style="font-size:.85rem;color:var(--txt3)">该词条未实测，暂无可对照结果——欢迎在社区众测开放后提交你的 A/B 图。</p>'}
<div class="fb-row">
<button class="fb-btn" data-vote="up">👍 一致</button>
<button class="fb-btn" data-vote="down">👎 不一致</button>
<span id="fb-done" style="font-size:.82rem;color:var(--txt3)"></span>
</div>
</div>
<div class="atom-sec">
<h2>去验证你的 Prompt</h2>
<p style="font-size:.9rem;color:var(--txt2)">把这个词放进你的提示词，看看体检仪怎么评价它在你的模型/画面类型下的表现：</p>
<a class="check-cta" href="../../index.html#c=${encodeURIComponent(a.en)}">🔍 去 CHECK 验证</a>
</div>`;
}

function buildPage(a) {
  const entry = rec.atoms[a.id] || null;
  const bench = a.score.status === 'benchmarked';
  let body = head(a) + sectionDefinition(a) + sectionScore(a, entry);
  if (bench) {
    body += sectionEvidence(a) + sectionByModel(a, entry) + sectionByScene(a, entry);
  } else {
    body += `
<div class="atom-sec">
<div class="heur-note">📌 该词条尚未实测。以下不展示证据图与模型数据，避免制造「已验证」的错觉。实测管道按「使用频率 × 不确定性 × 模型方差」排序推进，本词进入实测后会在此页更新完整 Evidence。</div>
</div>`;
  }
  body += sectionRelations(a) + sectionFeedbackCta(a) + foot(a);
  return body;
}

/* ---- generate all ---- */
const manifest = { generatedAt: new Date().toISOString(), files: {} };
core.atoms.forEach(a => {
  const dir = path.join(OUT, a.id);
  fs.mkdirSync(dir, { recursive: true });
  const html = buildPage(a);
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  manifest.files[a.id] = crypto.createHash('sha256').update(html, 'utf8').digest('hex').slice(0, 16);
});
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

/* ---- sitemap ---- */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: SITE + '/', priority: '1.0' },
  { loc: SITE + '/storyboard.html', priority: '0.8' },
  { loc: SITE + '/privacy.html', priority: '0.3' }
].concat(core.atoms.map(a => ({ loc: SITE + '/atoms/' + a.id + '/', priority: a.score.status === 'benchmarked' ? '0.9' : '0.6' })));
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(u => '  <url><loc>' + u.loc + '</loc><lastmod>' + today + '</lastmod><priority>' + u.priority + '</priority></url>').join('\n')
  + '\n</urlset>\n';
fs.writeFileSync(path.join(root, 'web', 'sitemap.xml'), sitemap, 'utf8');

const benchCount = core.atoms.filter(a => a.score.status === 'benchmarked').length;
console.log('OK: ' + core.atoms.length + ' atom pages -> web/atoms/ (' + benchCount + ' full-evidence, ' + (core.atoms.length - benchCount) + ' heuristic-degraded) + sitemap.xml + manifest.json');
