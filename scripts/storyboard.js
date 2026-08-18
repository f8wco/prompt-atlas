'use strict';
/* Deterministic storyboard skeleton generator (Workflow D helper).
   Given total duration and segment length, emits the time-beat skeleton that
   storyboard prompts must follow. Content is filled by the agent/user —
   beat boundaries are the hard constraint this tool owns.
   Usage: node scripts/storyboard.js --total 60 --seg 15 */

const args = process.argv.slice(2);
function argVal(name, fallback) { const i = args.indexOf(name); return i !== -1 && args[i + 1] ? args[i + 1] : fallback; }
const total = parseInt(argVal('--total', '0'), 10);
const seg = parseInt(argVal('--seg', '15'), 10);
if (!total || !seg || total <= 0 || seg <= 0) {
  console.error('usage: node scripts/storyboard.js --total <seconds> --seg <seconds-per-segment>');
  process.exit(2);
}

// Default beat template for a 15s segment (opening / development pairs).
const BEATS_15 = [[0, 2], [2, 4], [4, 7], [7, 9], [9, 11], [11, 13], [13, 15]];
const BEAT_ROLES = ['建立 Establish', '发展 Develop', '关键动作 Key action', '反应 Reaction', '递进 Build', '高潮 Peak', '收尾 Land'];

function beatsFor(length) {
  if (length === 15) return BEATS_15;
  const n = Math.max(4, Math.round(length / 2.2));          // ~7 beats at 15s, fewer for shorter
  const step = length / n;
  const out = [];
  for (let i = 0; i < n; i++) out.push([Math.round(i * step), Math.round((i + 1) * step)]);
  return out;
}

const segCount = Math.ceil(total / seg);
console.log('总时长 ' + total + 's = ' + segCount + ' 段 × ' + seg + 's（末段 ' + (total - (segCount - 1) * seg) + 's）');
console.log('');
console.log('【统一风格】（全段共用：风格基调 + style/mood/调色 词条）');
console.log('');
for (let s = 0; s < segCount; s++) {
  const start = s * seg;
  const len = Math.min(seg, total - start);
  console.log('【第 ' + (s + 1) + ' 段 / ' + len + 's】' + start + 's–' + (start + len) + 's');
  const beats = beatsFor(len);
  beats.forEach((b, i) => {
    const role = BEAT_ROLES[Math.min(i, BEAT_ROLES.length - 1)];
    const range = (start + b[0]) + '-' + (start + b[1]);
    console.log('[' + range + 's] （' + role + '）主体+动作+场景：________，光线/景别/运镜：________');
  });
  console.log('');
}
console.log('（填写后对每段跑: node scripts/check.js "<该段提示词>" video）');
