param(
  [string]$Needle = '"title": "Remera DS Análisis"',
  [string]$Path   = ".\export\products.json"
)
$ErrorActionPreference = "Stop"

$resolved = Resolve-Path -LiteralPath $Path -ErrorAction SilentlyContinue
if (-not $resolved) { throw "No existe el archivo: $Path (cwd: $(Get-Location))" }

# Importante: -Pattern con nombre y -SimpleMatch (no regex)
$ok = Select-String -Path $resolved -Pattern $Needle -SimpleMatch -Quiet
if ($ok) {
  Write-Host "OK: encontrado literal $Needle en $resolved"
  exit 0
} else {
  Write-Error "NO encontrado literal $Needle en $resolved"
  exit 1
}
