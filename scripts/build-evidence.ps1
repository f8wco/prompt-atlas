# Evidence image builder: downscale (if needed) + attribution watermark.
# ASCII-only on purpose (PS 5.1 reads BOM-less .ps1 as ANSI).
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\build-evidence.ps1
# Run AFTER scripts/make-evidence.js has copied fresh originals into web/assets/evidence/.
Add-Type -AssemblyName System.Drawing
Get-ChildItem "$PSScriptRoot\..\web\assets\evidence\*.jpg" | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $bmp = $img
  if ($img.Width -gt 760) {
    $w = 720; $h = [int]($img.Height * $w / $img.Width)
    $nb = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($nb)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $img.Dispose()
    $bmp = $nb
  }
  $text = 'Visual Prompt Atlas - measured A/B - atlas.f8w.com'
  $font = New-Object System.Drawing.Font('Arial', 9, [System.Drawing.FontStyle]::Regular)
  $g2 = [System.Drawing.Graphics]::FromImage($bmp)
  $sz = $g2.MeasureString($text, $font)
  $x = $bmp.Width - $sz.Width - 8
  $y = $bmp.Height - $sz.Height - 6
  $bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 0, 0, 0))
  $g2.FillRectangle($bg, ($x - 4), ($y - 2), ($sz.Width + 8), ($sz.Height + 4))
  $g2.DrawString($text, $font, [System.Drawing.Brushes]::White, $x, $y)
  $g2.Dispose()
  $tmp = $_.FullName + '.tmp'
  $bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
  Move-Item $tmp $_.FullName -Force
  Write-Host ('stamped ' + $_.Name)
}
Write-Host 'evidence images watermarked'
