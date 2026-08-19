/* ============================================================
   Atlas Share Card (P0 D8-9) — canvas 1080x1440 (3:4) PNG.
   Report card + recipe card. Keeps the existing indigo-purple
   gradient (P0 decision: no brand redesign).
   share_created is fired by the CALLER — a share is never an
   export (North Star hygiene, Spec §1.3).
   UMD-lite: browser -> window.AtlasShareCard
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.AtlasShareCard = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 1080, H = 1440;
  var SITE_URL = 'https://atlas.f8w.com';
  var FONT = '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif';

  function fitText(ctx, text, maxW, basePx, weight) {
    var px = basePx;
    ctx.font = (weight || '') + ' ' + px + 'px ' + FONT;
    while (px > 20 && ctx.measureText(text).width > maxW) {
      px -= 2;
      ctx.font = (weight || '') + ' ' + px + 'px ' + FONT;
    }
    if (ctx.measureText(text).width <= maxW) return { text: text, px: px };
    // hard truncate with ellipsis
    var t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return { text: t + '…', px: px };
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawBase(ctx, title) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    var grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(1, '#a855f7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 150);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 44px ' + FONT;
    ctx.fillText('Atlas Studio', 60, 92);
    ctx.font = '400 26px ' + FONT;
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.fillText('视觉提示词图库 · Visual Prompt Atlas', 60, 130);
    var tt = fitText(ctx, title, W - 120, 56, '800');
    ctx.fillStyle = '#171a26';
    ctx.font = '800 ' + tt.px + 'px ' + FONT;
    ctx.fillText(tt.text, 60, 250);
  }

  function drawFooter(ctx) {
    ctx.fillStyle = '#9aa1b6';
    ctx.font = '400 26px ' + FONT;
    ctx.fillText('少堆词，多控制 · Don\'t add words. Control the image.', 60, H - 200);
    // QR
    var qr = null;
    if (typeof root !== 'undefined' && root.AtlasQR) {
      qr = root.AtlasQR.encode(SITE_URL);
    }
    if (qr) {
      var n = qr.size, quiet = 4, scale = Math.floor(240 / (n + quiet * 2)) || 1;
      var dim = (n + quiet * 2) * scale;
      var qx = W - 60 - dim, qy = H - 60 - dim - 20;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qx - 8, qy - 8, dim + 16, dim + 16);
      ctx.fillStyle = '#171a26';
      for (var y = 0; y < n; y++) {
        for (var x = 0; x < n; x++) {
          if (qr.modules[y][x]) ctx.fillRect(qx + (x + quiet) * scale, qy + (y + quiet) * scale, scale, scale);
        }
      }
      ctx.fillStyle = '#6d5df6';
      ctx.font = '700 28px ' + FONT;
      ctx.fillText('atlas.f8w.com', qx, qy + dim + 44);
    } else {
      ctx.fillStyle = '#6d5df6';
      ctx.font = '700 40px ' + FONT;
      ctx.fillText('atlas.f8w.com', W - 380, H - 160);
    }
  }

  function drawBadges(ctx, badges, startY) {
    var x = 60, y = startY;
    ctx.font = '400 30px ' + FONT;
    badges.forEach(function (b) {
      var label = b.name + ' ' + b.score;
      var wLabel = ctx.measureText(label).width + 44;
      if (x + wLabel > W - 60) { x = 60; y += 78; }
      ctx.fillStyle = b.kind === 'bad' ? 'rgba(239,68,68,.10)' : 'rgba(99,102,241,.10)';
      roundRect(ctx, x, y, wLabel, 58, 12);
      ctx.fill();
      ctx.fillStyle = b.kind === 'bad' ? '#ef4444' : '#4f46e5';
      ctx.fillText(label, x + 22, y + 40);
      x += wLabel + 18;
    });
    return y + 78;
  }

  function reportCard(data) {
    data = data || {};
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    drawBase(ctx, '提示词体检报告');
    var stats = [
      { k: '可靠性', v: data.reliability == null ? '—' : String(data.reliability) },
      { k: '覆盖', v: (data.covered || 0) + '/' + (data.total || 9) },
      { k: '一致性', v: String(data.consistency == null ? '—' : data.consistency) },
      { k: '留白', v: String(data.freedom == null ? '—' : data.freedom) }
    ];
    var sx = 60;
    stats.forEach(function (s) {
      var fit = fitText(ctx, s.v, 190, 84, '800');
      ctx.fillStyle = '#171a26';
      ctx.font = '800 ' + fit.px + 'px ' + FONT;
      ctx.fillText(fit.text, sx, 400);
      ctx.fillStyle = '#5c6377';
      ctx.font = '400 28px ' + FONT;
      ctx.fillText(s.k, sx, 445);
      sx += 250;
    });
    var y = 520;
    if (data.badges && data.badges.length) {
      ctx.fillStyle = '#171a26';
      ctx.font = '700 34px ' + FONT;
      ctx.fillText(data.badges.some(function (b) { return b.kind === 'bad'; }) ? '✅ 强开关 / ⚠ 实测无效' : '✅ 实测强开关', 60, y);
      y = drawBadges(ctx, data.badges.slice(0, 10), y + 20);
    }
    if (data.invalidCount > 0) {
      ctx.fillStyle = 'rgba(239,68,68,.08)';
      roundRect(ctx, 60, y + 10, W - 120, 86, 14);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.font = '700 36px ' + FONT;
      ctx.fillText('⚠ 实测无效词 ' + data.invalidCount + ' 个', 92, y + 66);
      y += 120;
    }
    ctx.fillStyle = '#9aa1b6';
    ctx.font = '400 26px ' + FONT;
    ctx.fillText('来自 2160 张 A/B 实测 · 每个分数都有证据', 60, y + 40);
    drawFooter(ctx);
    return canvas;
  }

  function recipeCard(data) {
    data = data || {};
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    drawBase(ctx, data.title || '视觉配方卡');
    var y = 330;
    ctx.font = '700 32px ' + FONT;
    (data.slots || []).slice(0, 9).forEach(function (s) {
      var zh = fitText(ctx, s.zh, 260, 34, '700');
      ctx.fillStyle = '#5c6377';
      ctx.font = '700 ' + zh.px + 'px ' + FONT;
      ctx.fillText(zh.text, 60, y);
      ctx.fillStyle = s.score >= 80 ? '#16a34a' : (s.score >= 60 ? '#ca8a04' : '#9ca3af');
      ctx.font = '800 38px ' + FONT;
      ctx.fillText(String(s.score), 350, y);
      y += 66;
    });
    if (data.reliability != null) {
      ctx.fillStyle = '#171a26';
      ctx.font = '800 60px ' + FONT;
      ctx.fillText('可靠性 ' + data.reliability, 60, y + 50);
    }
    drawFooter(ctx);
    return canvas;
  }

  function download(canvas, filename) {
    return new Promise(function (resolve) {
      if (canvas.toBlob) {
        canvas.toBlob(function (blob) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
          resolve(true);
        }, 'image/png');
      } else resolve(false);
    });
  }

  return {
    reportCard: reportCard,
    recipeCard: recipeCard,
    download: download,
    SITE_URL: SITE_URL
  };
}));
