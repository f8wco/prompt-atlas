'use strict';
/* Storyboard page logic v2: script -> segments -> beats -> 9-slot picks -> prompts.
   v2 changes (from real-user feedback):
   - clause-level splitting (commas too), per-beat duration-proportional quota, all beats filled
   - auto-detect dictionary terms in the script and pre-select them per segment
   - per-segment "smart recommend" fills empty slots (measured scores + conflict-checked)
   - two outputs: storyboard draft (zh) & per-segment video prompts; profile hidden until words picked
   Pure helpers exported for node smoke tests. */
(function (root) {
  var ATLAS = typeof window !== 'undefined' ? window.PROMPT_ATLAS : null;
  var LIB = typeof window !== 'undefined' ? window.PromptAtlasLib : null;
  var REC = typeof window !== 'undefined' ? (window.PROMPT_ATLAS_REC || null) : null;
  var AN = typeof window !== 'undefined' ? (window.AtlasAnalytics || null) : null;
  function trk(n, p) { if (AN && AN.enabled()) { try { AN.track(n, p); } catch (e) { /* ignore */ } } }

  var BEATS_15 = [[0, 2], [2, 4], [4, 7], [7, 9], [9, 11], [11, 13], [13, 15]];
  var BEAT_ROLES = ['建立', '发展', '关键动作', '反应', '递进', '高潮', '收尾'];
  var BEAT_CAP = 90; // max chars per beat text

  function splitSentences(text) {
    var rough = String(text || '').replace(/\r/g, '').split(/(?<=[。！？!?；;\n])/);
    var out = [];
    rough.forEach(function (s) {
      s = s.replace(/\n+/g, '').trim();
      if (!s) return;
      if (s.length <= BEAT_CAP) { out.push(s); return; }
      // long sentence: split at commas into clauses, keep >= 8 chars
      var parts = s.split(/(?<=[，,、：:])/);
      var buf = '';
      parts.forEach(function (p) {
        buf += p;
        if (buf.length >= 12) { out.push(buf); buf = ''; }
      });
      if (buf) { if (out.length && buf.length < 8) out[out.length - 1] += buf; else out.push(buf); }
    });
    return out.filter(function (s) { return s.length > 0; }).reduce(function (acc, s) {
      // a unit that starts with a closing quote/bracket belongs to the previous sentence
      if (acc.length && /^[”』」）)】]/.test(s)) acc[acc.length - 1] += s;
      else acc.push(s);
      return acc;
    }, []);
  }

  function beatsFor(segLen) {
    if (segLen === 15) return BEATS_15.map(function (b) { return [b[0], b[1]]; });
    var n = Math.max(3, Math.min(8, Math.round(segLen / 2.2)));
    var step = segLen / n, out = [];
    for (var i = 0; i < n; i++) out.push([Math.round(i * step), Math.round((i + 1) * step)]);
    return out;
  }

  function allocate(script, total, segLen) {
    var clauses = splitSentences(script);
    if (!clauses.length) clauses = [String(script || '').trim()].filter(Boolean);
    var segCount = Math.max(1, Math.ceil(total / segLen));
    var segLens = [];
    for (var s = 0; s < segCount; s++) segLens.push(Math.min(segLen, total - s * segLen));
    var totalLen = clauses.reduce(function (t, x) { return t + x.length; }, 0) || 1;

    var idx = 0;
    var segments = [];
    for (s = 0; s < segCount; s++) {
      var quota = Math.ceil(totalLen * (segLens[s] / total));
      var buf = [], used = 0;
      while (idx < clauses.length) {
        buf.push(clauses[idx]); used += clauses[idx].length; idx++;
        if (used >= quota && s < segCount - 1) break;
      }
      var beats = beatsFor(segLens[s]);
      // if fewer clauses than beats, sub-split the longest ones at commas until enough units
      function splitOnce(arr) {
        var best = -1, bestLen = 0;
        for (var k = 0; k < arr.length; k++) if (arr[k].length > bestLen) { bestLen = arr[k].length; best = k; }
        if (bestLen < 16) return false;
        var m = arr[best].match(/^(.{6,}?[，,、])(.+)$/);
        if (!m) return false;
        arr.splice(best, 1, m[1], m[2]);
        return true;
      }
      while (buf.length < beats.length && splitOnce(buf)) { /* split until enough units */ }
      var bi = 0;
      if (buf.length <= beats.length) {
        // scarce content: one unit per beat, no merging
        beats.forEach(function (b, i) { b.text = buf[i] || ''; });
      } else {
        // per-beat quota proportional to beat duration, hard cap, greedy fill
        var bTotal = buf.reduce(function (t, x) { return t + x.length; }, 0) || 1;
        var cur = '';
        var push = function () { if (bi < beats.length) { beats[bi].text = cur; bi++; } cur = ''; };
        for (var j = 0; j < buf.length; j++) {
          cur += buf[j];
          var beatQuota = Math.min(BEAT_CAP, Math.max(10, Math.ceil(bTotal * ((beats[bi] ? (beats[bi][1] - beats[bi][0]) : 2) / segLens[s]))));
          if (cur.length >= beatQuota) push();
          else if (cur.length >= BEAT_CAP) push();
        }
        if (cur) push();
        while (bi < beats.length) { beats[bi].text = ''; bi++; }
        // backfill: if content was sufficient but rounding left beats empty, split the longest filled beat
        for (var e = 0; e < beats.length; e++) {
          if (beats[e].text) continue;
          var longest = -1, len = 0;
          for (var f = 0; f < beats.length; f++) if ((beats[f].text || '').length > len) { len = beats[f].text.length; longest = f; }
          if (longest === -1 || len < 24) break;
          var txt = beats[longest].text;
          var mid = txt.length >> 1;
          var cut = txt.indexOf('，', Math.max(6, mid - 20));
          if (cut === -1 || cut < 6) cut = mid;
          beats[longest].text = txt.slice(0, cut + 1);
          beats[e].text = txt.slice(cut + 1);
        }
      }
      segments.push({ start: s * segLen, len: segLens[s], beats: beats, picks: {} });
    }
    return segments;
  }

  /* Auto-detect dictionary terms in segment text and pre-select one per slot. */
  function autoDetect(seg) {
    if (!LIB || !ATLAS) return 0;
    var text = seg.beats.map(function (b) { return b.text || ''; }).join(' ');
    var r = LIB.analyze(ATLAS, text, 'video');
    var n = 0;
    r.found.forEach(function (a) {
      if (!seg.picks[a.slot]) { seg.picks[a.slot] = a.id; n++; }
    });
    return n;
  }

  /* Fill empty slots: evidence-aware ranking (rec-data.js) when available,
     legacy top-score fill otherwise. Slots likely described in free text stay free. */
  function smartRecommend(seg, model) {
    if (!LIB || !ATLAS) return 0;
    var text = seg.beats.map(function (b) { return b.text || ''; }).join(' ');
    if (REC && LIB.recommendAtoms) {
      var r = LIB.analyze(ATLAS, text, 'video');
      var maybeSlots = {};
      r.missingDetail.forEach(function (d) { if (d.maybe) maybeSlots[d.slot.id] = true; });
      var recs = LIB.recommendAtoms(ATLAS, REC, { mode: 'video', model: model || null, scene: null, picks: seg.picks });
      var added = 0;
      recs.slots.forEach(function (s) {
        if (seg.picks[s.slot.id] || maybeSlots[s.slot.id]) return;
        var picked = Object.keys(seg.picks).map(function (k) { return LIB.atomById(ATLAS, seg.picks[k]); }).filter(Boolean);
        var cands = s.candidates;
        for (var i = 0; i < cands.length; i++) {
          var c = cands[i];
          if (c.tier < 1) continue; // measured dead on this context
          var bad = c.conflict || picked.some(function (p) { return LIB.pairConflict(c.atom, p) || LIB.pairConflict(p, c.atom); });
          if (bad) continue;
          seg.picks[s.slot.id] = c.atom.id;
          added++;
          break;
        }
      });
      return added;
    }
    var r = LIB.analyze(ATLAS, text, 'video');
    var opt = LIB.buildOptimized(ATLAS, r);
    var added = 0;
    opt.added.forEach(function (a) {
      if (!seg.picks[a.slot]) { seg.picks[a.slot] = a.id; added++; }
    });
    // slots the optimizer skipped (maybe/free-text): fill with top-score non-conflicting
    ATLAS.slots.forEach(function (slot) {
      if (seg.picks[slot.id]) return;
      var list = (ATLAS.bySlot[slot.id] || []).slice().sort(function (x, y) { return y.score.value - x.score.value; });
      for (var i = 0; i < list.length; i++) {
        var cand = list[i];
        var picked = Object.keys(seg.picks).map(function (k) { return LIB.atomById(ATLAS, seg.picks[k]); });
        var bad = picked.some(function (p) { return LIB.pairConflict(cand, p) || LIB.pairConflict(p, cand); });
        if (!bad) { seg.picks[slot.id] = cand.id; added++; break; }
      }
    });
    return added;
  }

  function pickedAtoms(seg) {
    var out = [];
    Object.keys(seg.picks || {}).forEach(function (sid) {
      var a = LIB ? LIB.atomById(ATLAS, seg.picks[sid]) : null;
      if (a) out.push(a);
    });
    return out;
  }

  function segZh(seg, style, segIndex) {
    var atoms = pickedAtoms(seg);
    var lines = ['【统一风格】' + (style || '（待填）'), '【第 ' + (segIndex + 1) + ' 段 / ' + seg.len + 's】'];
    seg.beats.forEach(function (b) {
      lines.push('[' + (seg.start + b[0]) + '-' + (seg.start + b[1]) + 's] ' + (b.text || '……'));
    });
    if (atoms.length) lines.push('视觉控制：' + atoms.map(function (a) { return a.zh + '（' + a.en + '）'; }).join('，'));
    return lines.join('\n');
  }

  /* one block per segment, ready to paste into a video model */
  function segVideoPrompt(seg, style) {
    var atoms = pickedAtoms(seg);
    var body = seg.beats.map(function (b) {
      return '[' + (seg.start + b[0]) + '-' + (seg.start + b[1]) + 's]' + (b.text ? ' ' + b.text : '');
    }).join(' ');
    var s = (style ? style + '。' : '') + body;
    if (atoms.length) s += '。' + atoms.map(function (a) { return a.zh + ' ' + a.en; }).join('，');
    return s;
  }

  var api = { splitSentences: splitSentences, beatsFor: beatsFor, allocate: allocate,
    autoDetect: autoDetect, smartRecommend: smartRecommend, segZh: segZh, segVideoPrompt: segVideoPrompt,
    pickedAtoms: pickedAtoms, BEAT_ROLES: BEAT_ROLES };
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.StoryboardApp = api;

  /* ---------------- browser wiring ---------------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var EXAMPLE = '雨夜的东京街头，霓虹灯牌在湿漉漉的柏油路上投下彩色的光。一位穿黑色风衣的女子撑伞走过十字路口，脚步溅起细小的水花。她在一家便利店门前停下，收伞，回头看了一眼来路。镜头缓慢推近她的侧脸，雨滴顺着伞沿滑落。她转身走进便利店，暖黄的灯光吞没了她的身影。第二天清晨，雨停了，阳光斜照进旅馆的房间，她已经离开，桌上只留下一张字条。';

  var state = { segments: [], style: '' };

  function slotSelect(segIndex, slot) {
    var opts = '<option value="">—</option>';
    ((ATLAS.bySlot || {})[slot.id] || []).forEach(function (a) {
      var mark = a.score.status === 'benchmarked' ? ' ✓' : '';
      opts += '<option value="' + a.id + '">' + esc(a.zh + ' ' + a.en) + ' ·' + a.score.value + mark + '</option>';
    });
    return '<select data-seg="' + segIndex + '" data-slot="' + slot.id + '">' + opts + '</select>';
  }

  function render() {
    var box = $('sb-segments');
    var html = '';
    state.segments.forEach(function (seg, i) {
      var picked = Object.keys(seg.picks).length;
      html += '<div class="panel sb-seg">';
      html += '<div class="sb-seg-head">第 ' + (i + 1) + ' 段 / ' + seg.len + 's <span class="sb-seg-range">' + seg.start + 's–' + (seg.start + seg.len) + 's</span>';
      html += '<span class="sb-seg-btns"><button class="btn mini" data-rec="' + i + '">🎲 智能推荐</button>' +
        '<button class="btn mini ghost" data-auto="' + i + '">🔍 识别剧本词汇</button></span></div>';
      seg.beats.forEach(function (b, bi) {
        html += '<div class="sb-beat"><span class="sb-beat-t">[' + (seg.start + b[0]) + '-' + (seg.start + b[1]) + 's]</span>' +
          '<span class="sb-beat-role">' + BEAT_ROLES[Math.min(bi, BEAT_ROLES.length - 1)] + '</span>' +
          '<input data-seg="' + i + '" data-beat="' + bi + '" value="' + esc(b.text || '') + '" placeholder="这一拍的画面…"></div>';
      });
      html += '<div class="sb-slots">';
      ATLAS.slots.forEach(function (slot) { html += '<label class="sb-slot"><em>' + esc(slot.zh) + '</em>' + slotSelect(i, slot) + '</label>'; });
      html += '</div><div class="sb-conflict" id="sb-conflict-' + i + '"></div></div>';
    });
    box.innerHTML = html;

    box.querySelectorAll('select[data-slot]').forEach(function (sel) {
      var seg = state.segments[+sel.getAttribute('data-seg')];
      var sid = sel.getAttribute('data-slot');
      if (seg.picks[sid]) sel.value = seg.picks[sid];
      sel.addEventListener('change', function () {
        if (sel.value) seg.picks[sid] = sel.value; else delete seg.picks[sid];
        renderOutput(); renderConflict(+sel.getAttribute('data-seg'));
      });
    });
    box.querySelectorAll('input[data-beat]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        state.segments[+inp.getAttribute('data-seg')].beats[+inp.getAttribute('data-beat')].text = inp.value;
        renderOutput();
      });
    });
    box.querySelectorAll('button[data-rec]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mSel = $('sb-model');
        smartRecommend(state.segments[+btn.getAttribute('data-rec')], mSel ? mSel.value : '');
        render(); renderOutput();
      });
    });
    box.querySelectorAll('button[data-auto]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var n = autoDetect(state.segments[+btn.getAttribute('data-auto')]);
        render(); renderOutput();
        toast(n ? '从剧本识别出 ' + n + ' 个词库词条 ✓' : '这段没识别到词库词条（可点智能推荐）');
      });
    });
    renderOutput();
    state.segments.forEach(function (_, i) { renderConflict(i); });
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast show'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.className = 'toast'; }, 2200);
  }

  function renderConflict(i) {
    var el = $('sb-conflict-' + i);
    if (!el) return;
    var atoms = pickedAtoms(state.segments[i]);
    var msgs = [];
    for (var x = 0; x < atoms.length; x++) {
      for (var y = x + 1; y < atoms.length; y++) {
        if (LIB.pairConflict(atoms[x], atoms[y]) || LIB.pairConflict(atoms[y], atoms[x])) {
          msgs.push('⛔ 冲突：' + atoms[x].zh + ' ↔ ' + atoms[y].zh);
        }
      }
    }
    el.innerHTML = msgs.length ? msgs.join('　') : (atoms.length ? '<span class="sb-ok">✓ 已选 ' + atoms.length + ' 词，无冲突</span>' : '<span class="sb-hint">点「🎲 智能推荐」一键补齐视觉控制词</span>');
  }

  function fullZh() { return state.segments.map(function (s, i) { return segZh(s, $('sb-style').value.trim(), i); }).join('\n\n'); }
  function fullVideo() { return state.segments.map(function (s) { return segVideoPrompt(s, $('sb-style').value.trim()); }).join('\n\n'); }
  function fullTimeline() {
    return state.segments.map(function (seg, i) {
      var beats = seg.beats.filter(function (b) { return b.text; }).map(function (b) {
        return '[' + (seg.start + b[0]) + '-' + (seg.start + b[1]) + 's] ' + b.text;
      });
      return 'Segment ' + (i + 1) + ': ' + beats.join(' ');
    }).join('\n\n');
  }

  function renderOutput() {
    var out = $('sb-output');
    if (!state.segments.length) { out.style.display = 'none'; return; }
    out.style.display = '';
    $('sb-zh').textContent = fullZh();
    $('sb-video').textContent = fullVideo();
    var prof = '';
    state.segments.forEach(function (seg, i) {
      if (!Object.keys(seg.picks).length) {
        prof += '<div class="sb-prof">第 ' + (i + 1) + ' 段 · <span class="sb-hint">未选词——先点「🎲 智能推荐」</span></div>';
        return;
      }
      var r = LIB.analyze(ATLAS, segVideoPrompt(seg, ''), 'video');
      var ev = (r.evidence && r.evidence.total > 0) ? ' · 实测 ' + r.evidence.benchmarked + '/' + r.evidence.total : '';
      prof += '<div class="sb-prof">第 ' + (i + 1) + ' 段 · 可靠性 ' + (r.reliability === null ? '—' : r.reliability) +
        ' · 覆盖 ' + r.covered.length + '/' + r.applicable.length +
        ' · 冲突 ' + r.hardConflicts.length + ' · ' + (r.controlLevel === 'high' ? '🟢 控制强' : r.controlLevel === 'medium' ? '🟡 适中' : r.controlLevel === 'conflict' ? '🔴 有冲突' : '🔵 留白多') + ev + '</div>';
    });
    $('sb-profile').innerHTML = prof;
  }

  function buildShareUrl() {
    var payload = { v: 2, sc: $('sb-script').value, t: +$('sb-total').value, sg: +$('sb-seg').value, st: $('sb-style').value, segs: state.segments };
    var b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return location.origin + location.pathname + '#sb=' + b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function loadFromHash() {
    if (location.hash.indexOf('#sb=') !== 0) return false;
    try {
      var b64 = location.hash.slice(4).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var p = JSON.parse(decodeURIComponent(escape(atob(b64))));
      $('sb-script').value = String(p.sc || '').slice(0, 8000);
      $('sb-total').value = +p.t || 30;
      $('sb-seg').value = +p.sg || 15;
      $('sb-style').value = String(p.st || '').slice(0, 200);
      state.segments = (p.segs || []).slice(0, 40).map(function (seg) {
        var beats = (seg.beats || []).slice(0, 10).map(function (b) {
          return { 0: +b[0] || 0, 1: +b[1] || 0, text: String(b.text || '').slice(0, 500) };
        });
        var picks = {};
        Object.keys(seg.picks || {}).forEach(function (sid) {
          if (LIB.atomById(ATLAS, seg.picks[sid])) picks[sid] = seg.picks[sid];
        });
        return { start: Math.max(0, +seg.start || 0), len: Math.max(1, +seg.len || 15), beats: beats, picks: picks };
      });
      return state.segments.length > 0;
    } catch (e) { return false; }
  }

  function copy(text, msg) {
    function fb() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast(msg || '已复制 ✓'); }, fb);
    else { fb(); toast(msg || '已复制 ✓'); }
  }

  var REWRITE_PROMPT = '你是一名 AI 视频分镜师。请把下面的剧本/小说改写成「画面化分镜文案」，要求：\n' +
    '1. 只保留能被镜头拍出来的内容（人物动作、表情、场景、光线、运镜），删掉心理描写、旁白注释和无法视觉化的信息；台词压缩成「某人说：…」一句\n' +
    '2. 按 15 秒一段拆分，每段内用时间拍点 [0-2s] [2-4s] [4-7s] [7-9s] [9-11s] [11-13s] [13-15s] 标注，每一拍 1 个画面动作，不超过 60 字\n' +
    '3. 直接输出改写结果，不要解释\n\n剧本：\n';

  document.addEventListener('DOMContentLoaded', function () {
    // evidence-aware model selector (hidden when rec data is absent)
    var mSel = $('sb-model');
    if (mSel) {
      if (REC && REC.models && REC.models.length) {
        var opts = '<option value="">不指定（通用）</option>';
        REC.models.forEach(function (m) { opts += '<option value="' + esc(m.id) + '">' + esc(m.short) + '</option>'; });
        mSel.innerHTML = opts;
      } else {
        var field = $('sb-model-field');
        if (field) field.style.display = 'none';
      }
    }
    $('sb-generate').addEventListener('click', function () {
      var script = $('sb-script').value.trim();
      var total = Math.max(5, Math.min(600, +$('sb-total').value || 30));
      var seg = Math.max(5, Math.min(60, +$('sb-seg').value || 15));
      if (!script) { toast('请先贴入剧本'); return; }
      state.segments = allocate(script, total, seg);
      state.segments.forEach(function (s) { autoDetect(s); });
      render();
      toast('已生成 ' + state.segments.length + ' 段，并自动识别了剧本中的视觉词汇');
    });
    $('sb-example').addEventListener('click', function () {
      $('sb-script').value = EXAMPLE;
      $('sb-total').value = 30; $('sb-seg').value = 15;
      $('sb-style').value = '电影质感，teal and orange 青橙调色';
      state.segments = allocate(EXAMPLE, 30, 15);
      state.segments.forEach(function (s) { autoDetect(s); });
      render();
    });
    $('sb-rewrite').addEventListener('click', function () {
      var s = $('sb-script').value.trim();
      if (!s) { toast('请先贴入剧本'); return; }
      copy(REWRITE_PROMPT + s, '改写指令已复制——粘贴给任意 AI 聊天助手，改写后再贴回来');
    });
    $('sb-style').addEventListener('input', renderOutput);
    $('sb-copy-video').addEventListener('click', function () { copy(fullVideo(), '视频提示词已复制 ✓'); trk('export_clicked', { kind: 'storyboard' }); });
    $('sb-copy-zh').addEventListener('click', function () { copy(fullZh(), '分镜稿已复制 ✓'); trk('export_clicked', { kind: 'storyboard' }); });
    $('sb-copy-timeline').addEventListener('click', function () { copy(fullTimeline(), '时间轴大纲已复制 ✓'); trk('export_clicked', { kind: 'storyboard' }); });
    $('sb-share').addEventListener('click', function () {
      var url = buildShareUrl();
      history.replaceState(null, '', url);
      copy(url, '分享链接已复制 ✓');
      trk('share_created', { kind: 'storyboard_card' });
    });
    if (AN && AN.enabled()) { try { AN.pageView('/storyboard.html', document.referrer, 'zh'); } catch (e) { /* ignore */ } }
    if (loadFromHash()) render();
  });
}(typeof self !== 'undefined' ? self : this));
