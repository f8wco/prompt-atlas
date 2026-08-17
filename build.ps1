# 把 core.json 同步为浏览器可读的 core-data.js（双击 index.html 即可用，无需服务器）
# 用法: pwsh -File build.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsonPath = Join-Path $root "core.json"
$outPath = Join-Path $root "web\core-data.js"

$json = Get-Content -Path $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($null -eq $json.atoms) { throw "core.json 缺少 atoms 数组" }

$count = @($json.atoms).Count
if ($count -ne $json.meta.totalAtoms) {
    Write-Warning "atoms 实际数量 ($count) 与 meta.totalAtoms ($($json.meta.totalAtoms)) 不一致，已自动修正"
    $json.meta.totalAtoms = $count
}

# 按槽位 id 建立索引，方便体检仪快速查询
$bySlot = @{}
foreach ($slot in $json.slots) { $bySlot[$slot.id] = @() }
foreach ($atom in $json.atoms) {
    if (-not $bySlot.ContainsKey($atom.slot)) { throw "词条 $($atom.id) 引用了不存在的槽位 $($atom.slot)" }
    $bySlot[$atom.slot] += $atom
}

$compact = @{
    version = $json.version
    name = $json.name
    slots = @($json.slots)
    atoms = @($json.atoms)
    bySlot = $bySlot
    totalAtoms = $count
} | ConvertTo-Json -Depth 6

$header = @"
/* 由 build.ps1 从 core.json 自动生成，请勿手改本文件。
   修改词库请编辑 core.json 后重新运行: pwsh -File build.ps1 */
window.PROMPT_ATLAS = 
"@

$outDir = Split-Path -Parent $outPath
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
[System.IO.File]::WriteAllText($outPath, $header + $compact + ";`n", [System.Text.Encoding]::UTF8)
Write-Host "OK: core.json ($count 词条) -> web\core-data.js"
