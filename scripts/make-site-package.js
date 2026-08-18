'use strict';
/* Builds a self-hosting package (no GitHub dependency) into site-package/:
   1. full site folder   — upload anywhere (e.g. f8w.com/prompt-atlas/)
   2. storyboard-standalone.html — ONE file, no assets needed (~400KB)
   3. atlas-standalone.html      — ONE file, evidence images inlined as data URIs (~3MB)
   Plus 部署说明.txt. Then zip it all (done separately via Compress-Archive).
   Usage: node scripts/make-site-package.js */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const web = path.join(root, 'web');
const out = path.join(root, 'site-package');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'assets', 'evidence'), { recursive: true });

const files = ['index.html', 'storyboard.html', 'style.css', 'app.js', 'storyboard-app.js', 'core-lib.js', 'core-data.js'];
files.forEach(f => fs.copyFileSync(path.join(web, f), path.join(out, f)));
const evDir = path.join(web, 'assets', 'evidence');
fs.readdirSync(evDir).filter(f => f.endsWith('.jpg')).forEach(f =>
  fs.copyFileSync(path.join(evDir, f), path.join(out, 'assets', 'evidence', f)));

function inline(htmlPath, replacements) {
  let html = fs.readFileSync(path.join(web, htmlPath), 'utf8');
  for (const [from, to] of replacements) html = html.replace(from, function () { return to; }); // function form: no $-substitution
  return html;
}
const css = fs.readFileSync(path.join(web, 'style.css'), 'utf8');
const dataJs = fs.readFileSync(path.join(web, 'core-data.js'), 'utf8');
const libJs = fs.readFileSync(path.join(web, 'core-lib.js'), 'utf8');
const sbJs = fs.readFileSync(path.join(web, 'storyboard-app.js'), 'utf8');

// 1) storyboard single file (no images needed on this page)
const sbSingle = inline('storyboard.html', [
  [/<link rel="stylesheet" href="style.css">/, '<style>\n' + css + '\n</style>'],
  [/<script src="core-data.js"><\/script>/, '<script>\n' + dataJs + '\n</script>'],
  [/<script src="core-lib.js"><\/script>/, '<script>\n' + libJs + '\n</script>'],
  [/<script src="storyboard-app.js"><\/script>/, '<script>\n' + sbJs + '\n</script>']
]);
fs.writeFileSync(path.join(out, 'storyboard-standalone.html'), sbSingle, 'utf8');

// 2) full atlas single file — evidence images become data URIs
const ATLAS = require(path.join(web, 'core-data.js'));
const cache = {};
function toDataUri(p) {
  if (!cache[p]) {
    const buf = fs.readFileSync(path.join(web, p));
    cache[p] = 'data:image/jpeg;base64,' + buf.toString('base64');
  }
  return cache[p];
}
ATLAS.atoms.forEach(a => {
  if (a.evidence) {
    if (a.evidence.control) a.evidence.control = toDataUri(a.evidence.control);
    if (a.evidence.treatment) a.evidence.treatment = toDataUri(a.evidence.treatment);
  }
});
const dataJsInlined = 'var PROMPT_ATLAS_DATA = ' + JSON.stringify(ATLAS) + ';\n' +
  'if (typeof module === \'object\' && module.exports) { module.exports = PROMPT_ATLAS_DATA; }\n' +
  'if (typeof window !== \'undefined\') { window.PROMPT_ATLAS = PROMPT_ATLAS_DATA; }\n';
const appJs = fs.readFileSync(path.join(web, 'app.js'), 'utf8');
const atlasSingle = inline('index.html', [
  [/<link rel="stylesheet" href="style.css">/, '<style>\n' + css + '\n</style>'],
  [/<script src="core-data.js"><\/script>/, '<script>\n' + dataJsInlined + '\n</script>'],
  [/<script src="core-lib.js"><\/script>/, '<script>\n' + libJs + '\n</script>'],
  [/<script src="storyboard-app.js"><\/script>/, '<script>\n' + sbJs + '\n</script>'],
  [/<script src="app.js"><\/script>/, '<script>\n' + appJs + '\n</script>']
]);
fs.writeFileSync(path.join(out, 'atlas-standalone.html'), atlasSingle, 'utf8');

// deploy notes
const notes = `Prompt Atlas 自托管部署包（不依赖 GitHub，国内直连）
================================================

方式 A · 整站文件夹（功能完整，含证据图片）
  把本文件夹里除两个 standalone 和本说明外的所有文件+assets 目录，
  上传到你网站的任意目录（例如 /prompt-atlas/），
  访问 https://你的域名/prompt-atlas/ 即可。storyboard 页在 /prompt-atlas/storyboard.html

方式 B · 单文件版（最简）
  storyboard-standalone.html —— 剧本→分镜单页，无任何外部依赖（~400KB），
  上传这一个文件到任何静态空间即可用。
  atlas-standalone.html —— 完整四合一工具单文件（含证据图，~3MB）。

方式 C · iframe 嵌入现有页面
  <iframe src="https://你的域名/prompt-atlas/storyboard.html"
          style="width:100%;height:900px;border:0"></iframe>

更新词库后重新打包：node scripts/build.js && node scripts/make-site-package.js
（zip 由 PowerShell Compress-Archive 另行生成）
`;
fs.writeFileSync(path.join(out, '部署说明.txt'), notes, 'utf8');

const kb = f => Math.round(fs.statSync(path.join(out, f)).size / 1024);
console.log('site-package/ built:');
console.log('  full site        :', files.length, 'files + ' + fs.readdirSync(evDir).length + ' evidence jpgs');
console.log('  storyboard-single:', kb('storyboard-standalone.html') + ' KB');
console.log('  atlas-single     :', kb('atlas-standalone.html') + ' KB');
