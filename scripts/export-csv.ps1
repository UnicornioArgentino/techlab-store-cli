param(
  [string]$Json = ".\export\products.json",
  [string]$Csv  = ".\export\products.csv"
)
$ErrorActionPreference = "Stop"

if (!(Test-Path $Json)) { throw "No existe $Json. Corré primero: npm run export" }

$data = Get-Content $Json -Raw | ConvertFrom-Json
$flat = foreach($p in $data){
  [PSCustomObject]@{
    id      = $p.id
    title   = $p.title
    price   = $p.price
    category= $p.category
    image   = $p.image
    rate    = $p.rating.rate
    count   = $p.rating.count
  }
}
$flat | Export-Csv -NoTypeInformation -Encoding UTF8 $Csv
Write-Host "✅ Exportado CSV: $Csv"
