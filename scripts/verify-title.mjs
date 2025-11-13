import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const p = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  return p.status === 0;
}

const path  = process.argv[2] || "./export/products.json";
const title = process.argv[3] || "";
if (!title) {
  console.error("Uso: node scripts/verify-title.mjs <path-json> \"<titulo>\"");
  process.exit(2);
}

const okRaw  = run("powershell", ["-NoLogo","-ExecutionPolicy","Bypass","-File","./scripts/assert-title-raw.ps1","-Path", path]);
const okJson = run("node", ["./scripts/assert-title-json.mjs", path, title]);

if (okRaw && okJson) {
  console.log("✅ verify:title -> OK");
  process.exit(0);
} else {
  console.error("❌ verify:title -> FALLÓ");
  process.exit(1);
}
