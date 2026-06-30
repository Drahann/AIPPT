# Render representative slides of each deck in a sample CSV to PNG (PowerPoint COM).
# Usage: render_decks.ps1 -SampleCsv <csv> -OutRoot <dir> [-PerDeck 10] [-Width 1600]
param(
  [Parameter(Mandatory=$true)][string]$SampleCsv,
  [Parameter(Mandatory=$true)][string]$OutRoot,
  [int]$PerDeck = 10,
  [int]$Width = 1600
)
$ErrorActionPreference = 'Continue'
New-Item -ItemType Directory -Force -Path $OutRoot | Out-Null
$rows = Import-Csv -Path $SampleCsv
$logPath = Join-Path $OutRoot "_render_log.csv"
$log = New-Object System.Collections.Generic.List[object]

$ppt = New-Object -ComObject PowerPoint.Application
foreach ($r in $rows) {
  $did = $r.deck_id; $path = $r.fullpath
  $deckDir = Join-Path $OutRoot $did
  New-Item -ItemType Directory -Force -Path $deckDir | Out-Null
  if (-not (Test-Path -LiteralPath $path)) { Write-Output "MISSING: $did"; continue }
  $pres = $null
  try {
    $pres = $ppt.Presentations.Open($path, $true, $false, $false)  # ReadOnly, Untitled, no window
    $n = $pres.Slides.Count
    $sw = $pres.PageSetup.SlideWidth; $sh = $pres.PageSetup.SlideHeight
    $th = [int][math]::Round($Width * $sh / $sw)
    # representative slide indices
    if ($n -le $PerDeck) { $sel = 1..$n }
    else {
      $sel = @(1,2)
      $rem = $PerDeck - 3
      for ($k=1; $k -le $rem; $k++) { $sel += [int][math]::Round(2 + $k*(($n-1)-2)/($rem+1)) }
      $sel += $n
      $sel = $sel | Sort-Object -Unique
    }
    foreach ($i in $sel) {
      if ($i -lt 1 -or $i -gt $n) { continue }
      $fn = Join-Path $deckDir ("s{0:D2}.png" -f $i)
      try { $pres.Slides.Item($i).Export($fn, "PNG", $Width, $th) } catch {}
    }
    $log.Add([PSCustomObject]@{ deck_id=$did; slides=$n; exported=($sel -join ' '); aspect=("{0:N3}" -f ($sw/$sh)) })
    Write-Output ("OK  {0,-26} slides={1,3}  exported={2}" -f $did,$n,($sel.Count))
    $pres.Close()
  } catch {
    Write-Output ("ERR {0}: {1}" -f $did, $_.Exception.Message)
    if ($pres) { try { $pres.Close() } catch {} }
  }
}
try { $ppt.Quit() } catch {}
$log | Export-Csv -Path $logPath -NoTypeInformation -Encoding UTF8
Write-Output "RENDER DONE -> $OutRoot  (log: $logPath)"