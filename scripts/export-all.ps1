param(
  [string]$OutFile = ".\export\products.json"
)

$ErrorActionPreference = "Stop"

Write-Host "▶ Descargando products..."
$node = "node"
$args = @("index.js", "GET", "products")
$p = Start-Process -FilePath $node -ArgumentList $args -NoNewWindow -PassThru -Wait -RedirectStandardOutput ".\export\.tmp.out"
if ($p.ExitCode -ne 0) { throw "falló GET products (exit $($p.ExitCode))" }

# La CLI ya imprime bonito; extraemos el bloque JSON más largo del output
$content = Get-Content .\export\.tmp.out -Raw
Remove-Item .\export\.tmp.out -Force

# Heurística: toma el primer '[' ... ']' grande
if ($content -match '(\[\s*[\s\S]*\])') {
  $json = $Matches[1]
  $json | Set-Content $OutFile -Encoding UTF8
  Write-Host "✅ Exportado: $OutFile"
} else {
  throw "No se detectó JSON de lista en la salida."
}
