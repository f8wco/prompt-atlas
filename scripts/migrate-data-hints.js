'use strict';
/* One-time migration: move free-text conflict tables & slot hints from code into core.json (data source of truth).
   Run: node scripts/migrate-data-hints.js   (idempotent) */

const fs = require('fs');
const path = require('path');
const corePath = path.join(__dirname, '..', 'core.json');
const core = JSON.parse(fs.readFileSync(corePath, 'utf8'));

const CONFLICTS = {
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

const SLOT_HINTS = {
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

const TIME_IRRELEVANT = ['隧道', '虚空', '抽象空间', '星云', '太空', '宇宙', '黑洞', 'space', 'nebula', 'void', 'tunnel', 'outer space'];

core.atoms = core.atoms.map(function (a) {
  a.freeTextConflicts = CONFLICTS[a.id] || [];
  return a;
});

core.slots = core.slots.map(function (s) {
  s.freeTextHints = SLOT_HINTS[s.id] || [];
  if (s.id === 'time') s.timeIrrelevantHints = TIME_IRRELEVANT;
  return s;
});

core.version = 3;
core.meta.totalAtoms = core.atoms.length;
core.meta.source = '核心词库 v3：冲突表与槽位提示迁入数据（atoms.freeTextConflicts / slots.freeTextHints / slots.timeIrrelevantHints），代码零硬编码规则。';

fs.writeFileSync(corePath, JSON.stringify(core, null, 2) + '\n', 'utf8');
const withConflicts = core.atoms.filter(function (a) { return (a.freeTextConflicts || []).length; }).length;
const withHints = core.slots.filter(function (s) { return (s.freeTextHints || []).length; }).length;
console.log('migrated hints to data: ' + withConflicts + ' atoms with freeTextConflicts, ' + withHints + ' slots with freeTextHints, time-irrelevant hints on time slot');
