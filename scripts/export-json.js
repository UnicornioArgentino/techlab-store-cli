import fs from "node:fs";
import { readCreatedList } from "../src/utils/localStore.js";

const API = "https://fakestoreapi.com";

async function main(){
  const res = await fetch(`${API}/products`);
  if(!res.ok) throw new Error(`GET /products -> ${res.status}`);
  const apiProducts = await res.json();

  // Lee locales y loguea
  const locals = readCreatedList(fs);
  console.log("[merge] api:", apiProducts.length, " | locals:", locals.length);

  const byId = new Map(apiProducts.map(p => [String(p.id ?? ""), p]));
  const merged = [...apiProducts];

  for (const p of locals){
    const pid = p?.id != null ? String(p.id) : null;
    if (pid && !byId.has(pid)){
      merged.push(p);
      byId.set(pid, p);
    } else if (!pid) {
      const dup = merged.find(x =>
        (x?.title ?? "").toLowerCase() === (p?.title ?? "").toLowerCase() &&
        (x?.category ?? "").toLowerCase() === (p?.category ?? "").toLowerCase()
      );
      if(!dup) merged.push(p);
    }
  }

  if (!fs.existsSync("./export")) fs.mkdirSync("./export", { recursive: true });
  fs.writeFileSync("./export/products.json", JSON.stringify(merged, null, 2), "utf8");
  console.log("✅ Exportado (merge): ./export/products.json  ->", merged.length, "items");
}

main().catch(e => { console.error(e); process.exit(1); });
