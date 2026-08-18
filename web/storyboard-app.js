'use strict';
/* Storyboard page logic: script -> segments -> beats -> 9-slot picks -> prompts.
   Pure helpers are exported for node smoke tests; DOM wiring runs in browser only. */
(function (root) {
  var ATLAS = typeof window !== 'undefined' ? window.PROMPT_ATLAS : null;
  var LIB = typeof window !== 'undefined' ? window.PromptAtlasLib : null;

  var BEATS_15 = [[0, 2], [2, 4], [4, 7], [7, 9], [9, 11], [11, 13], [13, 15]];
  var BEAT_ROLES = ['建立', '发展', '关键动作', '反应', '递进', '高潮', '收尾'];

  function splitSentences(text) {
    return String(text || '')
      .replace(/\r/g, '')
      .split(/(?<=[。！？!?；;])/)
      .map(function (s) { return s.replace(/^[\s、，,]+|[\s]+$/g, ''); })
      .filter(function (s) { return s.length > 0; });
  }

  function beatsFor(segLen) {
    if (segLen === 15) return BEATS_15.map(function (b) { return [b[0], b[1]]; }); // fresh copies: beats carry .text
    var n = Math.max(3, Math.min(8, Math.round(segLen / 2.2)));
    var step = segLen / n, out = [];
    for (var i = 0; i < n; i++) out.push([Math.round(i * step), Math.round((i + 1) * step)]);
    return out;
  }

  /* Distribute sentences to segments proportionally to duration, then to beats. */
  function allocate(script, total, segLen) {
    var sentences = splitSentences(script);
    if (!sentences.length) sentences = [String(script || '').trim()];
    var segCount = Math.max(1, Math.ceil(total / segLen));
    var segLens = [];
    for (var s = 0; s < segCount; s++) segLens.push(Math.min(segLen, total - s * segLen));
    var totalLen = sentences.reduce(function (t, x) { return t + x.length; }, 0) || 1;

    var idx = 0;
    var segments = [];
    for (s = 0; s < segCount; s++) {
      var quota = Math.ceil(totalLen * (segLens[s] / total));
      var buf = [], used = 0;
      while (idx < sentences.length && (used < quota || s === segCount - 1)) {
        buf.push(sentences[idx]); used += sentences[idx].length; idx++;
        if (used >= quota && s < segCount - 1) break;
      }
      var beats = beatsFor(segLens[s]);
      var bTotal = buf.reduce(function (t, x) { return t + x.length; }, 0) || 1;
      var frag = [], acc = 0, bi = 0;
      for (var j = 0; j < buf.length; j++) {
        frag.push(buf[j]);
        acc += buf[j].length;
        var bound = Math.ceil(bTotal * ((bi + 1) / beats.length));
        if (acc >= bound && bi < beats.length - 1) { beats[bi].text = frag.join(''); frag = []; bi++; acc = 0; }
      }
      beats[bi].text = frag.join('');
      segments.push({ start: s * segLen, len: segLens[s], beats: beats, picks: {} });
    }
    return segments;
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
    var lines = [];
    lines.push('【统一风格】' + (style || ''));
    lines.push('【第 ' + (segIndex + 1) + ' 段 / ' + seg.len + 's】');
    seg.beats.forEach(function (b) {
      lines.push('[' + (seg.start + b[0]) + '-' + (seg.start + b[1]) + 's] ' + (b.text || '________'));
    });
    if (atoms.length) lines.push('视觉控制：' + atoms.map(function (a) { return a.zh + '（' + a.en + '）'; }).join('，'));
    return lines.join('\n');
  }

  function segEn(seg, style, segIndex) {
    var atoms = pickedAtoms(seg);
    var beats = seg.beats.filter(function (b) { return b.text; }).map(function (b) {
      return '[' + (seg.start + b[0]) + '-' + (seg.start + b[1]) + 's] ' + b.text;
    });
    var s = (style ? style + '. ' : '') + 'Segment ' + (segIndex + 1) + ': ' + beats.join(' ');
    if (atoms.length) s += ', ' + atoms.map(function (a) { return a.en; }).join(', ');
    return s;
  }

  var api = { splitSentences: splitSentences, beatsFor: beatsFor, allocate: allocate, segZh: segZh, segEn: segEn, pickedAtoms: pickedAtoms, BEAT_ROLES: BEAT_ROLES };
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.StoryboardApp = api;

  /* ---------------- browser wiring ---------------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var state = { segments: [], style: '' };

  function slotSelect(segIndex, slot) {
    var opts = '<option value="">—</option>';
    ((ATLAS.bySlot || {})[slot.id] || []).forEach(function (a) {
      opts += '<option value="' + a.id + '">' + esc(a.zh + ' ' + a.en) + ' ·' + (a.score && a.score.value) + '</option>';
    });
    return '<select data-seg="' + segIndex + '" data-slot="' + slot.id + '">' + opts + '</select>';
  }

  function render() {
    var box = $('sb-segments');
    var html = '';
    state.segments.forEach(function (seg, i) {
      html += '<div class="panel sb-seg">';
      html += '<div class="sb-seg-head">第 ' + (i + 1) + ' 段 / ' + seg.len + 's <span class="sb-seg-range">' + seg.start + 's–' + (seg.start + seg.len) + 's</span></div>';
      seg.beats.forEach(function (b, bi) {
        var role = BEAT_ROLES[Math.min(bi, BEAT_ROLES.length - 1)];
        html += '<div class="sb-beat"><span class="sb-beat-t">[' + (seg.start + b[0]) + '-' + (seg.start + b[1]) + 's]</span>' +
          '<span class="sb-beat-role">' + role + '</span>' +
          '<input data-seg="' + i + '" data-beat="' + bi + '" value="' + esc(b.text || '') + '" placeholder="这一拍的画面…"></div>';
      });
      html += '<div class="sb-slots">';
      ATLAS.slots.forEach(function (slot) { html += '<label class="sb-slot"><em>' + esc(slot.zh) + '</em>' + slotSelect(i, slot) + '</label>'; });
      html += '</div><div class="sb-conflict" id="sb-conflict-' + i + '"></div></div>';
    });
    box.innerHTML = html;

    box.querySelectorAll('select[data-slot]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var seg = state.segments[+sel.getAttribute('data-seg')];
        var sid = sel.getAttribute('data-slot');
        if (sel.value) seg.picks[sid] = sel.value; else delete seg.picks[sid];
        renderOutput();
        renderConflict(+sel.getAttribute('data-seg'));
      });
    });
    box.querySelectorAll('input[data-beat]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var seg = state.segments[+inp.getAttribute('data-seg')];
        seg.beats[+inp.getAttribute('data-beat')].text = inp.value;
        renderOutput();
      });
    });
    renderOutput();
    state.segments.forEach(function (_, i) { renderConflict(i); });
  }

  function renderConflict(i) {
    var seg = state.segments[i];
    var el = $('sb-conflict-' + i);
    if (!el) return;
    var atoms = pickedAtoms(seg);
    var msgs = [];
    for (var x = 0; x < atoms.length; x++) {
      for (var y = x + 1; y < atoms.length; y++) {
        if (LIB.pairConflict(atoms[x], atoms[y]) || LIB.pairConflict(atoms[y], atoms[x])) {
          msgs.push('⛔ 冲突：' + atoms[x].zh + ' ↔ ' + atoms[y].zh);
        }
      }
    }
    el.innerHTML = msgs.length ? msgs.join('　') : (atoms.length ? '<span class="sb-ok">✓ 无冲突</span>' : '');
  }

  function fullZh() {
    return state.segments.map(function (seg, i) { return segZh(seg, $('sb-style').value.trim(), i); }).join('\n\n');
  }
  function fullEn() {
    return state.segments.map(function (seg, i) { return segEn(seg, $('sb-style').value.trim(), i); }).join('\n\n');
  }

  function renderOutput() {
    var out = $('sb-output');
    if (!state.segments.length) { out.style.display = 'none'; return; }
    out.style.display = '';
    $('sb-zh').textContent = fullZh();
    $('sb-en').textContent = fullEn();
    var prof = '';
    state.segments.forEach(function (seg, i) {
      var r = LIB.analyze(ATLAS, segEn(seg, '', i), 'video');
      prof += '<div class="sb-prof">第 ' + (i + 1) + ' 段 · Reliability ' + (r.reliability === null ? '—' : r.reliability) +
        ' · Coverage ' + r.covered.length + '/' + r.applicable.length +
        ' · Conflicts ' + r.hardConflicts.length + ' · ControlLevel ' + r.controlLevel + '</div>';
    });
    $('sb-profile').innerHTML = prof;
  }

  function buildShareUrl() {
    var payload = { v: 1, sc: $('sb-script').value, t: +$('sb-total').value, sg: +$('sb-seg').value, st: $('sb-style').value, segs: state.segments };
    var b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return location.origin + location.pathname + '#sb=' + b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function loadFromHash() {
    if (location.hash.indexOf('#sb=') !== 0) return false;
    try {
      var b64 = location.hash.slice(4).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var p = JSON.parse(decodeURIComponent(escape(atob(b64))));
      $('sb-script').value = String(p.sc || '').slice(0, 5000);
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

  function copy(text) {
    function fb() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () {}, fb);
    else fb();
  }

  document.addEventListener('DOMContentLoaded', function () {
    $('sb-generate').addEventListener('click', function () {
      var script = $('sb-script').value.trim();
      var total = Math.max(5, Math.min(600, +$('sb-total').value || 30));
      var seg = Math.max(5, Math.min(60, +$('sb-seg').value || 15));
      if (!script) { alert('请先贴入剧本'); return; }
      state.segments = allocate(script, total, seg);
      render();
    });
    $('sb-style').addEventListener('input', renderOutput);
    $('sb-copy-zh').addEventListener('click', function () { copy(fullZh()); });
    $('sb-copy-en').addEventListener('click', function () { copy(fullEn()); });
    $('sb-share').addEventListener('click', function () {
      var url = buildShareUrl();
      history.replaceState(null, '', url);
      copy(url);
    });
    if (loadFromHash()) { render(); }
  });
}(typeof self !== 'undefined' ? self : this));
