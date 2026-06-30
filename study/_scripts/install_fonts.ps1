# Per-user font install (no admin). Dedupe -> copy to per-user Fonts -> register HKCU.
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'SilentlyContinue'

$ROOT = "W:\ppt\挑战杯 互联网+三创赛 创青春 国赛金奖级PPT 模板"
$userFonts = Join-Path $env:LOCALAPPDATA "Microsoft\Windows\Fonts"
New-Item -ItemType Directory -Force -Path $userFonts | Out-Null
$regKey = "HKCU:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts"
$logPath = "W:\ppt\study\_scripts\font_install_log.csv"

$files = Get-ChildItem -LiteralPath $ROOT -Recurse -File -ErrorAction SilentlyContinue | Where-Object { @('.ttf','.otf','.ttc') -contains $_.Extension.ToLower() }
# dedupe by lowercase filename
$seen = @{}
$uniq = foreach ($f in $files) { $k = $f.Name.ToLower(); if (-not $seen.ContainsKey($k)) { $seen[$k]=$true; $f } }

$log = New-Object System.Collections.Generic.List[object]
$ok = 0; $fail = 0; $i = 0
foreach ($f in $uniq) {
  $i++
  $ext = $f.Extension.ToLower()
  $suffix = if ($ext -eq '.otf') { '(OpenType)' } else { '(TrueType)' }
  # family names
  $names = @()
  try {
    $pfc = New-Object System.Drawing.Text.PrivateFontCollection
    $pfc.AddFontFile($f.FullName)
    $names = @($pfc.Families | ForEach-Object { $_.Name } | Select-Object -Unique)
    $pfc.Dispose()
  } catch {}
  if ($names.Count -eq 0) { $names = @([System.IO.Path]::GetFileNameWithoutExtension($f.Name)) }
  # copy
  $dest = Join-Path $userFonts $f.Name
  try { Copy-Item -LiteralPath $f.FullName -Destination $dest -Force } catch { $fail++; continue }
  # register each family name
  foreach ($n in $names) {
    $valName = "$n $suffix"
    try { New-ItemProperty -Path $regKey -Name $valName -Value $dest -PropertyType String -Force | Out-Null } catch {}
  }
  $ok++
  $log.Add([PSCustomObject]@{ file=$f.Name; families=($names -join ' | '); dest=$dest })
  if ($i % 50 -eq 0) { Write-Output "  ...$i / $($uniq.Count) processed" }
}

# broadcast font change so freshly-launched apps see them
$sig = @'
using System;
using System.Runtime.InteropServices;
public class FontBroadcast {
  [DllImport("user32.dll")] public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam, uint flags, uint timeout, out IntPtr result);
}
'@
try { Add-Type -TypeDefinition $sig; $r=[IntPtr]::Zero; [FontBroadcast]::SendMessageTimeout([IntPtr]0xffff, 0x1D, [IntPtr]::Zero, [IntPtr]::Zero, 2, 1000, [ref]$r) | Out-Null } catch {}

$log | Export-Csv -Path $logPath -NoTypeInformation -Encoding UTF8
Write-Output "FONT INSTALL DONE: ok=$ok fail=$fail unique=$($uniq.Count) total_found=$($files.Count)"
Write-Output "log -> $logPath"