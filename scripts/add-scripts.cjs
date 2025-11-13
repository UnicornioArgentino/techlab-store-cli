const fs = require("fs");
const p = "package.json";
const pkg = JSON.parse(fs.readFileSync(p, "utf8"));
pkg.scripts = pkg.scripts || {};
pkg.scripts["test:title:raw"]  = "powershell -NoLogo -ExecutionPolicy Bypass -File ./scripts/assert-title-raw.ps1 -Path ./export/products.json";
pkg.scripts["test:title:json"] = "node ./scripts/assert-title-json.mjs ./export/products.json \"Remera DS Análisis\"";
fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
console.log("OK: scripts agregados");
