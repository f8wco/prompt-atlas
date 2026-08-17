/* ============================================================
   Visual Prompt Atlas — core-lib.js (engine v3)
   Pure, deterministic prompt logic shared by browser and tests.
   UMD-lite: browser -> window.PromptAtlasLib, node -> module.exports
   v3: modalities consumed · Control Profile (no single fake score)
       · relations drive the analyzer (hardConflict/softTension/redundant/implies)
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.PromptAtlasLib = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SUGGESTION_MIN_SCORE = 60;
  var HARD_PENALTY = 30;
  var TENSION_PENALTY = 10;

  /* free-text conflict hints (v1 heuristic; moved into core.json in batch B) */
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
    'fisheye': ['写实'],
    'vhs': ['8k', '超清', 'ultra hd', '高清', '4k']
  };

  var SLOT_HINTS = {
    lighting: ['光影', '灯光', '打光', '柔光', '逆光', '侧光', '光照', 'light', 'lighting', 'shadow', '光线'],
    camera: ['运镜', '镜头运动', '推近', '拉远', '环绕', '旋转镜头', '漩涡镜头', '视角', '机位', 'camera', 'zoom', 'pan', 'rotate'],
    shot: ['特写', '全景', '中景', '远景', '全身', '面部', '半身', 'framing', 'close-up', 'wide shot', 'medium shot'],
    composition: ['构图', '居中', '中央', '对称', '三分', '留白', '前景', 'background', 'composition', 'centered'],
    color: ['配色', '色调', '色彩', '黑金', '冷暖', '饱和度', '影调', '滤镜', 'color', 'palette', 'tone', 'grading'],
    style: ['风格', '质感', '画风', '电影感', '国漫', '日系', '写实', '二次元', '水墨', '院线', 'style', 'look', 'realistic', 'render'],
    mood: ['氛围', '情绪', '史诗', '温馨', '紧张', '神秘', '压抑', '张力', 'mood', 'atmosphere', 'epic', 'tense'],
    time: ['夜晚', '白天', '清晨', '黄昏', '时代', '古代', '未来', 'night', 'day', 'morning', 'evening'],
    technique: ['特效', '粒子', '景深', '慢镜头', '延时', '一镜到底', '渲染', 'depth of field', 'effect', 'particle', 'render', 'vfx']
  };

  /* contexts where a time-of-day dimension is meaningless (abstract spaces) */
  var TIME_IRRELEVANT_HINTS = ['隧道', '虚空', '抽象空间', '星云', '太空', '宇宙', '黑洞', 'space', 'nebula', 'void', 'tunnel', 'outer space'];

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function readScore(a) {
    return (a.score && typeof a.score === 'object') ? a.score.value : a.score;
  }
  function atomById(data, id) {
    var list = data.atoms || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* ---------------- modality ---------------- */
  function atomAppliesToMode(atom, mode) {
    if (!atom.modalities || !atom.modalities.length) return true;
    return atom.modalities.indexOf(mode) !== -1;
  }

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

    hits.sort(function (a, b) { return a.start - b.start || b.length - a.length; });
    var accepted = [];
    var seenIds = {};
    var lastEnd = -1;
    hits.forEach(function (h) {
      if (h.start < lastEnd) return;
      if (seenIds[h.id]) return;
      accepted.push(h.atom);
      seenIds[h.id] = true;
      lastEnd = h.end;
    });
    return accepted;
  }

  /* ---------------- applicability ---------------- */
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

  /* ---------------- relations ---------------- */
  function relationPair(a, b, key) {
    var ra = (a.relations && a.relations[key]) || [];
    var rb = (b.relations && b.relations[key]) || [];
    return ra.indexOf(b.id) !== -1 || rb.indexOf(a.id) !== -1;
  }
  function relationHardConflict(a, b) { return relationPair(a, b, 'hardConflict'); }

  function hasFreeTextConflict(atom, lowerText) {
    var words = CONFLICTS[atom.id] || [];
    for (var i = 0; i < words.length; i++) {
      if (lowerText.indexOf(words[i].toLowerCase()) !== -1) return true;
    }
    return false;
  }
  function pairConflict(a, b) {
    if (relationHardConflict(a, b)) return true;
    var words = CONFLICTS[a.id] || [];
    var text = (b.en + ' ' + b.zh).toLowerCase();
    for (var i = 0; i < words.length; i++) {
      if (text.indexOf(words[i].toLowerCase()) !== -1) return true;
    }
    return false;
  }

  function findPairs(found, key) {
    var pairs = [];
    for (var i = 0; i < found.length; i++) {
      for (var j = i + 1; j < found.length; j++) {
        var a = found[i], b = found[j];
        if (relationPair(a, b, key)) pairs.push({ a: a, b: b });
        else if (key === 'redundant' && ((a.relations && (a.relations.implies || []).indexOf(b.id) !== -1) || (b.relations && (b.relations.implies || []).indexOf(a.id) !== -1))) {
          pairs.push({ a: a, b: b, implied: true });
        }
      }
    }
    return pairs;
  }

  /* ---------------- Analyzer (Control Profile) ---------------- */
  function analyze(data, text, mode) {
    var slots = data.slots || [];
    var bySlot = data.bySlot || {};
    var lower = text.toLowerCase();
    var allFound = matchAtoms(data, text);

    // split by modality: video-only atoms matched in an image prompt are mismatches
    var found = [];
    var modalityMismatches = [];
    allFound.forEach(function (a) {
      if (atomAppliesToMode(a, mode)) found.push(a);
      else modalityMismatches.push(a);
    });

    var foundIds = {};
    found.forEach(function (a) { foundIds[a.id] = true; });

    // implied coverage
    var impliedBySlot = {};
    slots.forEach(function (s) { impliedBySlot[s.id] = []; });
    found.forEach(function (a) {
      var rels = a.relations || {};
      (rels.implies || []).forEach(function (tid) {
        var t = atomById(data, tid);
        if (t && !foundIds[t.id]) {
          impliedBySlot[t.slot] = impliedBySlot[t.slot] || [];
          if (impliedBySlot[t.slot].indexOf(t) === -1) impliedBySlot[t.slot].push(t);
        }
      });
    });

    var applicable = applicableSlots(data, mode);
    var notApplicable = notApplicableSlots(data, mode);

    // time slot becomes irrelevant in abstract-space contexts
    var timeIrrelevant = false;
    for (var ti = 0; ti < TIME_IRRELEVANT_HINTS.length; ti++) {
      if (lower.indexOf(TIME_IRRELEVANT_HINTS[ti].toLowerCase()) !== -1) { timeIrrelevant = true; break; }
    }
    var extraNotApplicable = [];
    if (timeIrrelevant) {
      for (var s = 0; s < slots.length; s++) if (slots[s].id === 'time') extraNotApplicable.push(slots[s]);
    }
    var applicable = applicable.filter(function (s) {
      return extraNotApplicable.map(function (x) { return x.id; }).indexOf(s.id) === -1;
    });
    notApplicable = notApplicable.concat(extraNotApplicable);

    var perSlot = {};
    slots.forEach(function (s) { perSlot[s.id] = found.filter(function (a) { return a.slot === s.id; }); });

    var covered = applicable.filter(function (s) { return perSlot[s.id].length > 0 || impliedBySlot[s.id].length > 0; });
    var missing = applicable.filter(function (s) { return perSlot[s.id].length === 0 && impliedBySlot[s.id].length === 0; });
    var coverage = applicable.length ? covered.length / applicable.length : 0;

    // Reliability over canonical ATOMS only (macros excluded, modality-applicable)
    var canonAtoms = found.filter(function (a) { return a.type !== 'macro'; });
    var reliability = null;
    if (canonAtoms.length) {
      var sum = 0;
      canonAtoms.forEach(function (a) { sum += readScore(a); });
      reliability = Math.round(sum / canonAtoms.length);
    }

    // relations among found atoms
    var hardConflicts = findPairs(found, 'hardConflict');
    var tensions = findPairs(found, 'softTension');
    var redundants = findPairs(found, 'redundant');

    var consistency = 100 - hardConflicts.length * HARD_PENALTY - tensions.length * TENSION_PENALTY;
    if (consistency < 0) consistency = 0;

    var freedom = missing.length;
    var macroCount = found.filter(function (a) { return a.type === 'macro'; }).length;

    var controlLevel;
    if (hardConflicts.length > 0) controlLevel = 'conflict';
    else if (reliability !== null && reliability >= 80 && coverage >= 0.75) controlLevel = 'high';
    else if (reliability !== null && reliability >= 60 && coverage >= 0.5) controlLevel = 'medium';
    else controlLevel = 'low';

    var uncertain = found.filter(function (a) { return a.type !== 'macro' && readScore(a) < 60; });

    var maybeCount = 0;
    var missingDetail = missing.map(function (s) {
      var hints = SLOT_HINTS[s.id] || [];
      var maybe = false;
      for (var h = 0; h < hints.length; h++) {
        if (lower.indexOf(hints[h].toLowerCase()) !== -1) { maybe = true; break; }
      }
      if (maybe) maybeCount++;
      var suggs = (bySlot[s.id] || [])
        .filter(function (x) { return x.type !== 'macro' && atomAppliesToMode(x, mode); })
        .slice().sort(function (x, y) { return readScore(y) - readScore(x); }).slice(0, 3)
        .map(function (x) {
          var conflict = hasFreeTextConflict(x, lower);
          if (!conflict) {
            for (var f = 0; f < found.length; f++) {
              if (relationHardConflict(x, found[f])) { conflict = true; break; }
            }
          }
          return { atom: x, conflict: conflict };
        });
      return { slot: s, maybe: maybe, suggs: suggs };
    });

    return {
      text: text, mode: mode,
      found: found, allFound: allFound,
      modalityMismatches: modalityMismatches,
      perSlot: perSlot, impliedBySlot: impliedBySlot,
      applicable: applicable, notApplicable: notApplicable,
      timeIrrelevant: timeIrrelevant,
      covered: covered, missing: missing, missingDetail: missingDetail,
      maybeCount: maybeCount,
      macroCount: macroCount,
      hardConflicts: hardConflicts, tensions: tensions, redundants: redundants,
      reliability: reliability, coverage: coverage, consistency: consistency,
      freedom: freedom, controlLevel: controlLevel,
      uncertain: uncertain
    };
  }

  /* ---------------- Optimizer 2.0 ---------------- */
  function buildOptimized(data, r) {
    var selected = [];
    var added = [];
    var skipped = [];
    var noSuggestion = [];
    var maybeSlots = [];
    var expansions = [];
    r.found.forEach(function (a) {
      var rels = a.relations || {};
      if (a.type === 'macro' && rels.expandsTo && rels.expandsTo.length) {
        expansions.push({ macro: a, targets: rels.expandsTo.map(function (id) { return atomById(data, id); }).filter(Boolean) });
      }
    });
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
        if (readScore(x.atom) >= SUGGESTION_MIN_SCORE) { chosen = x.atom; }
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
      expansions: expansions,
      maybeCount: r.maybeCount,
      longPrefix: !!(added.length && isLong)
    };
  }

  return {
    SUGGESTION_MIN_SCORE: SUGGESTION_MIN_SCORE,
    HARD_PENALTY: HARD_PENALTY,
    TENSION_PENALTY: TENSION_PENALTY,
    CONFLICTS: CONFLICTS,
    SLOT_HINTS: SLOT_HINTS,
    TIME_IRRELEVANT_HINTS: TIME_IRRELEVANT_HINTS,
    matchAtoms: matchAtoms,
    applicableSlots: applicableSlots,
    notApplicableSlots: notApplicableSlots,
    atomAppliesToMode: atomAppliesToMode,
    analyze: analyze,
    buildOptimized: buildOptimized,
    hasFreeTextConflict: hasFreeTextConflict,
    pairConflict: pairConflict,
    readScore: readScore,
    atomById: atomById
  };
}));
