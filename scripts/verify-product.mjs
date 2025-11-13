import { spawnSync } from "node:child_process";

function run(cmd, args, opts={}) {
  const p = spawnSync(cmd, args, { stdio: "inherit", shell: false, ...opts });
  return p.status === 0;
}

const okRaw  = run("powershell", ["-NoLogo","-ExecutionPolicy","Bypass","-File","./scripts/assert-title-raw.ps1","-Path","./export/products.json"]);
const okJson = run("node", ["./scripts/assert-title-json.mjs","./export/products.json","Remera DS Análisis"]);

if (okRaw && okJson) {
  console.log("✅ verify:producto -> OK (literal y JSON-aware)");
  process.exit(0);
} else {
  console.error("❌ verify:producto -> FALLÓ (revisar logs arriba)");
  process.exit(1);
}
