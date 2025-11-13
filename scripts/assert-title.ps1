param([string]$Title = "Remera DS Análisis")
$ErrorActionPreference = "Stop"

function Clean([string]$s){
  if ($null -eq $s) { return "" }
  $s = $s.Normalize([Text.NormalizationForm]::FormC).Trim()
  $s = $s -replace '\u200B|\u200C|\u200D|\uFEFF',''
  return $s
}

function EqInvariantNoAccents($a,$b){
  $ci   = [Globalization.CultureInfo]::InvariantCulture
  $opts = [Globalization.CompareOptions]::IgnoreCase -bor [Globalization.CompareOptions]::IgnoreNonSpace
  # Usar CompareInfo.Compare (NO CultureInfo.Compare)
  return ($ci.CompareInfo.Compare((Clean $a), (Clean $b), $opts) -eq 0)
}

$data = Get-Content .\export\products.json -Raw -Encoding utf8 | ConvertFrom-Json
$hits = $data | Where-Object { EqInvariantNoAccents $_.title $Title }

if($hits.Count -gt 0){
  Write-Host "OK: encontrado '$Title' ($($hits.Count))"
  $hits | Format-Table id, title, price, category -Auto
  exit 0
}else{
  Write-Error "NO encontrado '$Title' en export/products.json"
  Write-Host "`nSugerencias cercanas:"
  $data | Where-Object { $_.title -like '*Remera*' } | Select-Object id,title,category | Format-Table -Auto
  exit 1
}
