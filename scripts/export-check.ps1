param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Args)

$Title = ($Args -join ' ').Trim()
if (-not $Title) { Write-Error 'Uso: npm run export:check -- "Título"'; exit 2 }

cmd /c "npm run export --silent"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node .\scripts\verify-title.mjs .\export\products.json "$Title"
exit $LASTEXITCODE
