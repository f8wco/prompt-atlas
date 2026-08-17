/* ============================================================
   Visual Prompt Atlas — core-lib.js
   Pure, deterministic prompt logic shared by browser and tests.
   UMD-lite: browser -> window.PromptAtlasLib, node -> module.exports
   Matcher 2.0 · Applicability · Optimizer 2.0 · Conflict hints
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.PromptAtlasLib = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SUGGESTION_MIN_SCORE = 60;

  /* ---------------- free-text conflict hints (v1 heuristic; superseded by relations graph in v2) ---------------- */
  var CONFLICTS = {
    'golden-hour': ['夜晚', '深夜', '午夜', 'midnight', '黑金', '漆黑', 'dark room', 'blue hour', '蓝调时刻'],
    'overcast': ['阳光', '烈日', 'sunny', 'bright sunlight', 'golden hour', '黄金时刻'],
    'neon': ['自然光', '日光', 'daylight', '白天', '阳光', 'sunlit'],
    'rembrandt': ['平光', 'flat light'],
    'backlit': ['正面光', 'front light', '顺光'],
    'dolly-in': ['拉远', '拉镜头', 'pull back', 'dolly out', '镜头拉远'],
    'dolly-out': ['推进', '推近', 'push in', 'dolly in', '镜头推近'],
    'orbit': ['静止镜头', 'static camera', '固定机位', 'fixed camera', 'static'],
    'tracking': ['静止', 'static', '固定机位', '固定镜头'],
    'handheld': ['稳定器', 'gimbal', '丝滑', 'smooth', 'steady', 'steadicam', '平稳'],
    'aerial': ['手持', 'handheld', '过肩', 'over-the-shoulder', '静止', 'static'],
    'crane': ['手持', 'handheld'],
    'close-up': ['全景', 'wide shot', '大远景', '全身', 'full body', 'extreme wide'],
    'extreme-close-up': ['全景', 'wide shot', '大远景', '全身', 'full body'],
    'medium': ['大远景', 'extreme wide'],
    'wide': ['特写', 'close-up', '大特写', 'extreme close-up'],
    'extreme-wide': ['特写', 'close-up', '大特写', '面部'],
    'over-shoulder': ['全景', 'wide shot', '航拍', 'aerial'],
    'rule-of-thirds': ['对称', 'symmetrical', '居中', 'centered'],
    'symmetry': ['三分法', 'rule of thirds', '不对称', 'asymmetric'],
    'negative-space': ['复杂背景', 'busy background', '杂乱'],
    'teal-orange': ['黑金', '金黑', 'black and gold', '黑白', 'monochrome', '粉彩', 'pastel', '冷白'],
    'film-grain': ['8k', '超清', 'ultra hd', '干净', 'clean', '4k'],
    'high-sat': ['黑白', 'monochrome', '低饱和', 'desaturated', 'muted', '灰调', '褪色'],
    'desaturated': ['高饱和', 'vivid', '鲜艳', '色彩丰富', 'colorful'],
    'cyberpunk-palette': ['黑金', '金黑', '黑白', 'monochrome', '粉彩', 'pastel'],
    'monochrome': ['彩色', 'colorful', '高饱和', 'vivid', '黑金', '金黑', '青橙', 'teal and orange', '鲜艳'],
    'pastel': ['黑金', '暗黑', 'dark', '重金属', '哥特'],
    'photoreal': ['动漫', 'anime', '卡通', 'cartoon', '国漫', '二次元', '水墨', 'ink', '像素', 'pixel'],
    'documentary': ['特效', 'vfx', 'cgi', '粒子特效', '奇幻'],
    'anime': ['写实', 'photoreal', '真人', 'realistic', '电影质感', 'cinematic realism', '8k超清', '实拍'],
    'cyberpunk-style': ['古装', '仙侠', '古代', '水墨', '田园'],
    'ink-wash': ['3d', '三维', '写实', 'photoreal', '8k'],
    'claymation': ['写实', 'photoreal', '真人'],
    'pixel-art': ['写实', 'photoreal', '8k', '高清'],
    'serene': ['史诗', 'epic', '紧张', 'suspense', '激烈', '战斗'],
    'epic': ['温馨', 'cozy', '宁静', 'serene', '日常'],
    'melancholic': ['温馨', 'cozy', '欢乐', '开心'],
    'cozy': ['史诗', 'epic', '末日', 'wasteland', '恐怖', '暗黑'],
    'suspense': ['温馨', 'cozy', '宁静', '治愈'],
    'wasteland': ['温馨', 'cozy', '都市', '繁华'],
    'dawn': ['夜晚', '深夜', '午夜', 'midnight', '黑金'],
    'blue-hour': ['正午', 'noon', '黑金', '烈日', 'golden hour', '黄金时刻'],
    'dusk': ['深夜', 'midnight'],
    'night': ['白天', 'daytime', '正午', 'noon', '阳光'],
    'rainy-night': ['晴天', 'sunny', '白天', 'daytime'],
    'shallow-dof': ['全景清晰', 'deep focus', '大景深', '全部清晰'],
    'macro': ['全景', 'wide shot', '大远景'],
    'time-lapse': ['慢动作', 'slow motion'],
    'slow-motion': ['延时', 'time-lapse', '快进'],
    'long-take': ['分镜', 'storyboard', '剪辑', 'cuts', '蒙太奇', '多镜头', '转场'],
    'fisheye': ['电影感', 'cinematic', '写实'],
    'vhs': ['8k', '超清', 'ultra hd', '高清', '4k']
  };

  var SLOT_HINTS = {
    lighting: ['光影', '灯光', '打光', '柔光', '逆光', '侧光', '光照', 'light', 'lighting', 'shadow', '光线'],
    camera: ['运镜', '镜头运动', '推近', '拉远', '环绕', '旋转镜头', '视角', '机位', 'camera', 'zoom', 'pan', 'rotate', '漩涡'],
    shot: ['特写', '全景', '中景', '远景', '全身', '面部', '半身', 'framing', 'close-up', 'wide shot', 'medium shot'],
    composition: ['构图', '居中', '中央', '对称', '三分', '留白', '前景', 'background', 'composition', 'centered'],
    color: ['配色', '色调', '色彩', '黑金', '冷暖', '饱和度', '影调', '滤镜', 'color', 'palette', 'tone', 'grading'],
    style: ['风格', '质感', '画风', '电影感', '国漫', '日系', '写实', '二次元', '水墨', '院线', 'style', 'look', 'realistic', 'render'],
    mood: ['氛围', '情绪', '史诗', '温馨', '紧张', '神秘', '压抑', '张力', 'mood', 'atmosphere', 'epic', 'tense'],
    time: ['夜晚', '白天', '清晨', '黄昏', '时代', '古代', '未来', '隧道', '虚空', '抽象', '星云', '太空', '宇宙', '黑洞', 'night', 'day', 'morning', 'evening', 'space', 'nebula', 'void', 'tunnel'],
    technique: ['特效', '粒子', '景深', '慢镜头', '延时', '一镜到底', '渲染', 'depth of field', 'effect', 'particle', 'render', 'vfx']
  };

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  /* ---------------- Matcher 2.0 ---------------- */
  function termLists(atom) {
    return {
      en: [atom.en].concat((atom.aliases && atom.aliases.en) || []),
      zh: [atom.zh].concat((atom.aliases && atom.aliases.zh) || [])
    };
  }

  function matchAtoms(data, text) {
    var ATOMS = data.atoms || [];
    var lower = text.toLowerCase();
    var hits = [];

    // English: boundary-aware regex per term (word-ish boundaries)
    ATOMS.forEach(function (a) {
      termLists(a).en.forEach(function (term) {
        if (!term) return;
        var t = term.toLowerCase();
        var re = new RegExp('(^|[^a-z0-9])(' + escapeRe(t) + ')($|[^a-z0-9])', 'g');
        var m;
        while ((m = re.exec(lower)) !== null) {
          hits.push({ id: a.id, atom: a, start: m.index + m[1].length, end: m.index + m[1].length + m[2].length, length: m[2].length });
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      });
    });

    // Chinese: longest-match-first alternation (no word boundaries)
    var zhEntries = [];
    ATOMS.forEach(function (a) {
      termLists(a).zh.forEach(function (term) {
        if (!term) return;
        zhEntries.push({ atom: a, term: term });
      });
    });
    zhEntries.sort(function (x, y) { return y.term.length - x.term.length; });
    if (zhEntries.length) {
      var pattern = zhEntries.map(function (e) { return escapeRe(e.term); }).join('|');
      var re2 = new RegExp(pattern, 'g');
      var m2;
      while ((m2 = re2.exec(text)) !== null) {
        for (var i = 0; i < zhEntries.length; i++) {
          if (text.substr(m2.index, zhEntries[i].term.length) === zhEntries[i].term) {
            hits.push({ id: zhEntries[i].atom.id, atom: zhEntries[i].atom, start: m2.index, end: m2.index + zhEntries[i].term.length, length: zhEntries[i].term.length });
            break;
          }
        }
        if (m2.index === re2.lastIndex) re2.lastIndex++;
      }
    }

    // Span suppression: sort by start asc, length desc; a shorter term inside an
    // already-accepted span is not counted again.
    hits.sort(function (a, b) { return a.start - b.start || b.length - a.length; });
    var accepted = [];
    var seenIds = {};
    var lastEnd = -1;
    hits.forEach(function (h) {
      if (h.start < lastEnd) return;   // overlaps an accepted span
      if (seenIds[h.id]) return;       // same canonical atom already counted
      accepted.push(h.atom);
      seenIds[h.id] = true;
      lastEnd = h.end;
    });
    return accepted;
  }

  /* ---------------- Applicability ---------------- */
  function applicableSlots(data, mode) {
    var slots = data.slots || [];
    if (mode === 'image') return slots.filter(function (s) { return s.id !== 'camera'; });
    return slots;
  }
  function notApplicableSlots(data, mode) {
    var slots = data.slots || [];
    if (mode === 'image') return slots.filter(function (s) { return s.id === 'camera'; });
    return [];
  }

  /* ---------------- Conflict helpers ---------------- */
  function hasFreeTextConflict(atom, lowerText) {
    var words = CONFLICTS[atom.id] || [];
    for (var i = 0; i < words.length; i++) {
      if (lowerText.indexOf(words[i].toLowerCase()) !== -1) return true;
    }
    return false;
  }
  function pairConflict(a, b) {
    var words = CONFLICTS[a.id] || [];
    var text = (b.en + ' ' + b.zh).toLowerCase();
    for (var i = 0; i < words.length; i++) {
      if (text.indexOf(words[i].toLowerCase()) !== -1) return true;
    }
    return false;
  }

  /* ---------------- Analyzer ---------------- */
  function analyze(data, text, mode) {
    var slots = data.slots || [];
    var ATOMS = data.atoms || [];
    var bySlot = data.bySlot || {};
    var lower = text.toLowerCase();
    var found = matchAtoms(data, text);
    var applicable = applicableSlots(data, mode);
    var notApplicable = notApplicableSlots(data, mode);
    var applicableIds = {};
    applicable.forEach(function (s) { applicableIds[s.id] = true; });

    var perSlot = {};
    slots.forEach(function (s) { perSlot[s.id] = found.filter(function (a) { return a.slot === s.id; }); });

    var covered = applicable.filter(function (s) { return perSlot[s.id].length > 0; });
    var missing = applicable.filter(function (s) { return perSlot[s.id].length === 0; });
    var coverage = applicable.length ? covered.length / applicable.length : 0;

    var avg = 0;
    if (found.length) {
      var sum = 0;
      found.forEach(function (a) { sum += a.score; });
      avg = sum / found.length;
    }
    var score = found.length ? Math.round(coverage * (40 + 0.6 * avg)) : 0;
    var grade = score >= 80 ? 1 : (score >= 60 ? 2 : (score >= 40 ? 3 : 4));
    var uncertain = found.filter(function (a) { return a.score < 60; });

    var maybeCount = 0;
    var missingDetail = missing.map(function (s) {
      var hints = SLOT_HINTS[s.id] || [];
      var maybe = false;
      for (var h = 0; h < hints.length; h++) {
        if (lower.indexOf(hints[h].toLowerCase()) !== -1) { maybe = true; break; }
      }
      if (maybe) maybeCount++;
      var suggs = (bySlot[s.id] || []).slice().sort(function (x, y) { return y.score - x.score; }).slice(0, 3)
        .map(function (x) { return { atom: x, conflict: hasFreeTextConflict(x, lower) }; });
      return { slot: s, maybe: maybe, suggs: suggs };
    });

    return {
      text: text, mode: mode,
      found: found, perSlot: perSlot,
      applicable: applicable, notApplicable: notApplicable,
      covered: covered, missing: missing, missingDetail: missingDetail,
      maybeCount: maybeCount,
      coverage: coverage, avg: avg, score: score, grade: grade, uncertain: uncertain
    };
  }

  /* ---------------- Optimizer 2.0 ---------------- */
  function buildOptimized(data, r) {
    var selected = [];
    var added = [];
    var skipped = [];
    var noSuggestion = [];
    var maybeSlots = [];
    r.missingDetail.forEach(function (d) {
      if (d.maybe) { maybeSlots.push(d.slot.id); return; }
      var chosen = null;
      for (var i = 0; i < d.suggs.length; i++) {
        var x = d.suggs[i];
        if (x.conflict) { skipped.push(x.atom); continue; }
        var bad = false;
        for (var j = 0; j < selected.length; j++) {
          if (pairConflict(x.atom, selected[j]) || pairConflict(selected[j], x.atom)) { bad = true; break; }
        }
        if (bad) { skipped.push(x.atom); continue; }
        if (x.atom.score >= SUGGESTION_MIN_SCORE) { chosen = x.atom; }
        else { skipped.push(x.atom); }
        break; // at most ONE candidate per slot
      }
      if (chosen) { selected.push(chosen); added.push(chosen); }
      else { noSuggestion.push(d.slot.id); }
    });

    var base = r.text.trim();
    var isLong = base.length > 180;
    var en;
    if (added.length) {
      if (isLong) {
        en = 'Global directives: ' + added.map(function (a) { return a.en; }).join(', ') + '\n\n' + base;
      } else {
        en = base + ', ' + added.map(function (a) { return a.en; }).join(', ');
      }
    } else {
      en = base;
    }
    return {
      en: en, added: added, skipped: skipped,
      noSuggestion: noSuggestion, maybeSlots: maybeSlots,
      maybeCount: r.maybeCount,
      longPrefix: !!(added.length && isLong)
    };
  }

  return {
    SUGGESTION_MIN_SCORE: SUGGESTION_MIN_SCORE,
    CONFLICTS: CONFLICTS,
    SLOT_HINTS: SLOT_HINTS,
    matchAtoms: matchAtoms,
    applicableSlots: applicableSlots,
    notApplicableSlots: notApplicableSlots,
    analyze: analyze,
    buildOptimized: buildOptimized,
    hasFreeTextConflict: hasFreeTextConflict,
    pairConflict: pairConflict
  };
}));
