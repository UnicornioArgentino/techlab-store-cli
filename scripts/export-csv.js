import { saveProductsCsv } from "../src/export/csv.js";

const API = "https://fakestoreapi.com";
const res = await fetch(`${API}/products`);
if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
const rows = await res.json();

// Nota: CSV espera campos comunes; si tu index ya sanea, igual funciona.
import { filterAndFixProducts } from "../src/utils/validate.js";
import { short, cleanUnicode } from "../src/utils/text.js";
const sanitize = (p) => {
  const q = { ...p };
  q.title = cleanUnicode(String(q.title ?? ""));
  q.description = short(cleanUnicode(String(q.description ?? "")), 180);
  return q;
};
const clean = filterAndFixProducts(rows).map(sanitize);

saveProductsCsv(clean, "./export/products.csv");
console.log("✅ Exportado CSV: .\\export\\products.csv");

