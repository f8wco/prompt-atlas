'use strict';
/* Smoke test for storyboard-app pure helpers (node). */
const sb = require('../web/storyboard-app.js');
const script = '深夜的东京街头下着雨。一位穿风衣的女子独自走过霓虹灯下的十字路口，脚步溅起水花。她在便利店门口停下，望向橱窗里的自己。镜头缓缓推近她的侧脸，雨滴滑落，她转身消失在人群中。第二天清晨，阳光洒进旅馆的房间，她醒来，窗外是晴朗的富士山。';
const segs = sb.allocate(script, 30, 15);
console.log('segments:', segs.length);
if (segs.length !== 2) { console.error('FAIL: expect 2 segments'); process.exit(1); }
let texts = 0;
segs.forEach((seg, i) => {
  console.log('--- seg', i + 1, seg.start + 's len', seg.len, 'beats', seg.beats.length);
  seg.beats.forEach(b => { if (b.text) texts++; console.log('  [' + b[0] + '-' + b[1] + ']', (b.text || '').slice(0, 30)); });
});
if (texts === 0) { console.error('FAIL: no content allocated to beats'); process.exit(1); }
const totalAssigned = segs.reduce((t, s) => t + s.beats.reduce((x, b) => x + (b.text || '').length, 0), 0);
console.log('assigned chars:', totalAssigned, '/', script.length);
if (totalAssigned < script.length - 5) { console.error('FAIL: content lost during allocation'); process.exit(1); }
// beats template check
const b15 = sb.beatsFor(15);
if (b15.length !== 7 || b15[0][0] !== 0 || b15[6][1] !== 15) { console.error('FAIL: 15s beat template'); process.exit(1); }
console.log('STORYBOARD SMOKE OK');
