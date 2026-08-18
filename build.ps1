# 兼容入口：实际构建已迁移到跨平台的 node scripts/build.js
# 用法: pwsh -File build.ps1   （等价于: node scripts/build.js）
node "$PSScriptRoot\scripts\build.js"
exit $LASTEXITCODE
