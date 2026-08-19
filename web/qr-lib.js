/* ============================================================
   Atlas QR (P0 D8) — minimal dependency-free QR encoder.
   Byte mode, single block, versions 1-3, ECC level M.
   Enough for short URLs (<= 42 bytes). Structure after the
   public-domain Project Nayuki reference (qrcodegen).
   UMD-lite: browser -> window.AtlasQR, node -> module.exports
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.AtlasQR = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---- GF(256), primitive 0x11D ---- */
  var EXP = new Array(512), LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();
  function gmul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  /* version tables (ECC M, single block) */
  var ECC_PER_BLOCK = { 1: 10, 2: 16, 3: 26 };
  var DATA_CW = { 1: 16, 2: 28, 3: 44 };
  var ALIGN = { 1: [], 2: [6, 18], 3: [6, 22] };

  function rsGenPolyLow(deg) { // coefficients low-first; result[deg] === 1
    var p = [1];
    for (var i = 0; i < deg; i++) {
      var q = new Array(p.length + 1).fill(0);
      for (var k = 0; k < p.length; k++) {
        q[k + 1] ^= p[k];                    // * x
        q[k] ^= gmul(p[k], EXP[i]);          // * alpha^i
      }
      p = q;
    }
    return p;
  }
  function rsRemainder(dataHighFirst, deg) { // explicit long division
    var g = rsGenPolyLow(deg);
    var n = dataHighFirst.length;
    var work = new Array(n + deg).fill(0);   // low-first dividend
    for (var k = 0; k < n; k++) work[deg + k] = dataHighFirst[n - 1 - k];
    for (var d = n + deg - 1; d >= deg; d--) {
      var coef = work[d];
      if (coef === 0) continue;
      for (var j = 0; j <= deg; j++) work[d - deg + j] ^= gmul(g[j], coef);
    }
    return work.slice(0, deg).reverse();     // high-first remainder
  }

  function toUtf8(text) {
    if (typeof TextEncoder === 'function') return Array.prototype.slice.call(new TextEncoder().encode(text));
    var out = [];
    for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) { out.push(0xC0 | (c >> 6), 0x80 | (c & 63)); }
      else { out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
    }
    return out;
  }

  var MASKS = [
    function (x, y) { return ((x + y) % 2) === 0; },
    function (x, y) { return (y % 2) === 0; },
    function (x, y) { return (x % 3) === 0; },
    function (x, y) { return ((x + y) % 3) === 0; },
    function (x, y) { return ((Math.floor(x / 3) + Math.floor(y / 2)) % 2) === 0; },
    function (x, y) { return ((x * y) % 2) + ((x * y) % 3) === 0; },
    function (x, y) { return ((((x * y) % 2) + ((x * y) % 3)) % 2) === 0; },
    function (x, y) { return ((((x + y) % 2) + ((x * y) % 3)) % 2) === 0; }
  ];

  function getBit(x, i) { return ((x >>> i) & 1) !== 0; }

  function bch15(d) {
    var v = d << 10;
    for (var i = 4; i >= 0; i--) if ((v >>> (i + 10)) & 1) v ^= 0x537 << i;
    return ((d << 10) | v) ^ 0x5412;
  }

  function buildMatrix(text) {
    var bytes = toUtf8(String(text));
    if (bytes.length > 42) throw new Error('AtlasQR: payload too long (max 42 bytes)');
    var ver = 1;
    while (ver <= 3 && DATA_CW[ver] < bytes.length + 2) ver++;
    if (ver > 3) throw new Error('AtlasQR: payload too long for v1-3');

    /* bitstream: mode(4) + count(8) + data + terminator + pad */
    var bits = [];
    function push(v, n) { for (var i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); }
    push(4, 4); push(bytes.length, 8);
    bytes.forEach(function (b) { push(b, 8); });
    var cap = DATA_CW[ver] * 8;
    for (var t = 0; t < 4 && bits.length < cap; t++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var dataCW = [];
    for (var b2 = 0; b2 < bits.length; b2 += 8) {
      var v2 = 0; for (var q = 0; q < 8; q++) v2 = (v2 << 1) | bits[b2 + q];
      dataCW.push(v2);
    }
    var pads = [0xEC, 0x11], pi = 0;
    while (dataCW.length < DATA_CW[ver]) dataCW.push(pads[(pi++) % 2]);
    var all = dataCW.concat(rsRemainder(dataCW, ECC_PER_BLOCK[ver]));

    var size = 17 + 4 * ver;

    function fresh() {
      var m = [], f = [];
      for (var r = 0; r < size; r++) { m.push(new Array(size).fill(false)); f.push(new Array(size).fill(false)); }
      return { m: m, f: f };
    }
    function drawFunctions(st) {
      function set(x, y, dark) { st.m[y][x] = dark; st.f[y][x] = true; }
      function finder(cx, cy) { // top-left of 7x7
        for (var dy = -1; dy <= 7; dy++) {
          for (var dx = -1; dx <= 7; dx++) {
            var x = cx + dx, y = cy + dy;
            if (x < 0 || x >= size || y < 0 || y >= size) continue;
            var dark = (dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6) &&
              (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
            set(x, y, dark);
          }
        }
      }
      finder(0, 0); finder(size - 7, 0); finder(0, size - 7);
      for (var i = 0; i < size; i++) { // timing
        if (!st.f[6][i]) set(i, 6, i % 2 === 0);
        if (!st.f[i][6]) set(6, i, i % 2 === 0);
      }
      var ap = ALIGN[ver]; // alignment (skip the three finder corners)
      for (var a = 0; a < ap.length; a++) {
        for (var b = 0; b < ap.length; b++) {
          var r2 = ap[a], c2 = ap[b];
          if ((r2 === 6 && c2 === 6) || (r2 === 6 && c2 === size - 7) || (r2 === size - 7 && c2 === 6)) continue;
          for (var dy2 = -2; dy2 <= 2; dy2++) {
            for (var dx2 = -2; dx2 <= 2; dx2++) {
              set(c2 + dx2, r2 + dy2, Math.max(Math.abs(dx2), Math.abs(dy2)) !== 1);
            }
          }
        }
      }
      for (var fi = 0; fi < 15; fi++) { // reserve format areas
        var dummy = getBit(0, fi);
        if (dummy) { /* never */ }
        if (fi < 6) { st.f[fi][8] = true; }
        else if (fi === 6) { st.f[7][8] = true; }
        else if (fi === 7) { st.f[8][8] = true; st.f[size - 8][8] = true; } // dark module neighbor col
        else if (fi === 8) { st.f[8][7] = true; }
        else { st.f[8][14 - fi] = true; }
        if (fi <= 7) st.f[8][size - 1 - fi] = true;
        if (fi >= 8) st.f[8][size - 15 + fi] = true;
      }
      set(8, size - 8, true); // dark module
    }

    function drawFormat(st, mask) {
      var bitsF = bch15((0 /* ECC M */ << 3) | mask);
      function set(x, y, dark) { st.m[y][x] = dark; st.f[y][x] = true; }
      for (var i = 0; i <= 5; i++) set(8, i, getBit(bitsF, i));
      set(8, 7, getBit(bitsF, 6));
      set(8, 8, getBit(bitsF, 7));
      set(7, 8, getBit(bitsF, 8));
      for (var j = 9; j < 15; j++) set(14 - j, 8, getBit(bitsF, j));
      for (var k = 0; k <= 7; k++) set(size - 1 - k, 8, getBit(bitsF, k));
      for (var l = 8; l < 15; l++) set(8, size - 15 + l, getBit(bitsF, l));
      set(8, size - 8, true);
    }

    function place(st, mask) {
      var fn = MASKS[mask];
      var bi = 0, total = all.length * 8;
      for (var right = size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;
        for (var vert = 0; vert < size; vert++) {
          for (var c = 0; c < 2; c++) {
            var x = right - c;
            var upward = ((right + 1) & 2) === 0;
            var y = upward ? size - 1 - vert : vert;
            if (!st.f[y][x]) {
              var bit = false;
              if (bi < total) bit = ((all[bi >> 3] >>> (7 - (bi & 7))) & 1) !== 0;
              st.m[y][x] = bit !== fn(x, y);
              bi++;
            }
          }
        }
      }
    }

    function penalty(st) { // rules 1 & 4 (any mask is decodable; this only tunes choice)
      var pen = 0, dark = 0, n = size;
      for (var y = 0; y < n; y++) {
        var runC = 1;
        for (var x = 1; x < n; x++) {
          if (st.m[y][x] === st.m[y][x - 1]) { runC++; if (runC === 5) pen += 3; else if (runC > 5) pen += 1; }
          else runC = 1;
        }
      }
      for (var x2 = 0; x2 < n; x2++) {
        var runR = 1;
        for (var y2 = 1; y2 < n; y2++) {
          if (st.m[y2][x2] === st.m[y2 - 1][x2]) { runR++; if (runR === 5) pen += 3; else if (runR > 5) pen += 1; }
          else runR = 1;
        }
      }
      for (var y3 = 0; y3 < n; y3++) for (var x3 = 0; x3 < n; x3++) if (st.m[y3][x3]) dark++;
      pen += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
      return pen;
    }

    var best = null, bestMask = 0, bestPen = Infinity;
    for (var mk = 0; mk < 8; mk++) {
      var st = fresh();
      drawFunctions(st);
      drawFormat(st, mk);
      place(st, mk);
      var p = penalty(st);
      if (p < bestPen) { bestPen = p; best = st; bestMask = mk; }
    }
    return { size: size, modules: best.m, version: ver, mask: bestMask };
  }

  return { encode: buildMatrix };
}));
