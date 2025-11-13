# QA RESULTS – techlab-store-cli
Fecha: 2025-11-13 11:59:46
Versión package.json: 1.0.1

## Export
[merge] api: 20  | locals: 1 ✅ Exportado (merge): ./export/products.json  -> 21 items

## Smoke
✅ smoke: export/products.json OK -> 21 items

## Verify Title
OK: encontrado literal "title": "Remera DS Análisis" en D:\techlab-store-cli\export\products.json OK: encontrado 'Remera DS Análisis' (1) en ./export/products.json ┌─────────┬──────┬──────────────────────┬───────┬──────────┐ │ (index) │ id   │ title                │ price │ category │ ├─────────┼──────┼──────────────────────┼───────┼──────────┤ │ 0       │ null │ 'Remera DS Análisis' │ 299   │ 'ropa'   │ └─────────┴──────┴──────────────────────┴───────┴──────────┘ ✅ verify:title -> OK

## Git status (vacío = limpio)


## Tags
v0.1.0
v0.1.1
v0.1.2

## Hook pre-commit
OK: pre-commit permitió commit (verify:title pasó)
