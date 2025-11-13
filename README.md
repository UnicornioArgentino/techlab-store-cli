[![CI](https://github.com/UnicornioArgentino/techlab-store-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/UnicornioArgentino/techlab-store-cli/actions/workflows/ci.yml)

# techlab-store-cli

CLI mínima para generar un catálogo **export/products.json** desde una fuente API + locales,
y verificar que exista un producto clave.

## Requisitos
- Node.js 18+ (probado con 22.x)
- Windows PowerShell

## Comandos
\\\ash
npm run export                 # genera export/products.json
node ./scripts/smoke.mjs       # smoke: valida que haya >= 21 items
npm run verify:title -- "Remera DS Análisis"   # verifica existencia por título
npm run export:check -- "Remera DS Análisis"   # export + verificación en un paso
\\\

## Verificación automática (pre-commit)
Hay un hook *.git/hooks/pre-commit.bat* que bloquea el commit si falla la verificación.

## Licencia
MIT

## Uso rápido
npm run export
node ./scripts/smoke.mjs
npm run verify:title -- \"Remera DS Análisis\"
