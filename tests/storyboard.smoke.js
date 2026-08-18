'use strict';
/* Smoke test for storyboard-app v2 pure helpers (node). */
const sb = require('../web/storyboard-app.js');

// long prose (mirrors real novel input): every beat should get content
const script = Array.from({ length: 6 }).map((_, i) =>
  '第' + (i + 1) + '章的深夜，东京街头下着雨。霓虹灯牌在湿漉漉的柏油路上投下彩色的光，一位穿黑色风衣的女子撑伞走过十字路口，脚步溅起细小的水花。她在便利店门前停下，收伞，回头看了一眼来路。镜头缓慢推近她的侧脸，雨滴顺着伞沿滑落。她转身走进便利店，暖黄的灯光吞没了她的身影。第二天清晨，雨停了，阳光斜照进旅馆的房间，她已经离开，桌上只留下一张字条，字条上画着一朵小小的花。').join('');
const segs = sb.allocate(script, 30, 15);
console.log('segments:', segs.length);
if (segs.length !== 2) { console.error('FAIL: expect 2 segments'); process.exit(1); }
let filled = 0, empty = 0, over = 0;
segs.forEach((seg) => {
  seg.beats.forEach(b => {
    if (b.text && b.text.trim()) filled++; else empty++;
    if ((b.text || '').length > 130) over++;
  });
});
console.log('beats filled:', filled, '| empty:', empty, '| over-cap:', over);
if (empty > 0) { console.error('FAIL: long script left empty beats (' + empty + ')'); process.exit(1); }
if (over > 0) { console.error('FAIL: beat far exceeds cap'); process.exit(1); }
const totalAssigned = segs.reduce((t, s) => t + s.beats.reduce((x, b) => x + (b.text || '').length, 0), 0);
const totalChars = script.length;
console.log('assigned chars:', totalAssigned, '/', totalChars);
if (totalAssigned < totalChars * 0.98) { console.error('FAIL: content lost'); process.exit(1); }
const b15 = sb.beatsFor(15);
if (b15.length !== 7 || b15[6][1] !== 15) { console.error('FAIL: beat template'); process.exit(1); }
// share-template sanity: no mutation across segments (old aliasing bug)
segs[0].beats[0].text = 'AAA';
if (segs[1].beats[0].text === 'AAA') { console.error('FAIL: beat aliasing regressed'); process.exit(1); }
// short script: empties are allowed (honest scarcity), just report
const short = sb.allocate('雨夜。她走过街口，进了店。', 30, 15);
const shortEmpty = short.reduce((t, s) => t + s.beats.filter(b => !b.text).length, 0);
console.log('short-script empty beats (informational, scarcity is honest):', shortEmpty);
console.log('STORYBOARD V2 SMOKE OK');
