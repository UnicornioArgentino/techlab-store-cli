param()

$ErrorActionPreference = "Stop"

function Time-Node {
  param([string]$ArgsLine)
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $p = Start-Process -FilePath "node" -ArgumentList $ArgsLine -NoNewWindow -PassThru -Wait
  $sw.Stop()
  if ($p.ExitCode -ne 0) { throw "Falló: $ArgsLine (exit $($p.ExitCode))" }
  [PSCustomObject]@{ Command = $ArgsLine; Ms = $sw.Elapsed.TotalMilliseconds }
}

$rows = @()
$rows += Time-Node 'index.js GET products'
$rows += Time-Node 'index.js GET products/5'
$rows += Time-Node 'index.js GET products/category/list'
$rows += Time-Node 'index.js GET products/category/electronics'
$rows += Time-Node 'index.js POST products "Remera DS Análisis" 299 ropa'
$rows += Time-Node 'index.js DELETE products/7'

$rows | Sort-Object Ms | Format-Table -AutoSize
