import fs from "node:fs";
const p = "./_local/created.json";
if (fs.existsSync(p)) {
  let raw = fs.readFileSync(p, "utf8");
  raw = raw.replace(/^\uFEFF/, "");         // limpia BOM si lo hay
  // validar JSON y re-escribir sin BOM
  const json = JSON.stringify(JSON.parse(raw), null, 2);
  fs.writeFileSync(p, json, "utf8");         // Node escribe sin BOM
  console.log("✓ _local/created.json reescrito sin BOM");
} else {
  console.log("ℹ️ _local/created.json no existe; nada que hacer");
}
