import fs from "node:fs";
import { appendCreated, readCreatedList, CREATED_PATH } from "../src/utils/localStore.js";

const fixLatin1Utf8 = (s) => {
  // Repara "Remera DS AnÃ¡lisis" -> "Remera DS Análisis"
  if (s && /[ÃÂ]/.test(s)) return Buffer.from(s, "latin1").toString("utf8");
  return s;
};
const norm = (s) => (s ?? "").normalize("NFC").trim();

const [,, titleArg, priceArg, categoryArg] = process.argv;
let title = titleArg ?? "Remera DS Análisis";
title = norm(fixLatin1Utf8(title));

const price = Number(priceArg ?? 299);
const category = norm(categoryArg ?? "ropa");

const obj = {
  id: null,
  title,
  price,
  description: "Producto creado desde CLI de TechLab.",
  image: "https://i.pravatar.cc/200",
  category,
  rating: { rate: null, count: 0 }
};

// Repara registros viejos mojibake en _local/created.json (si los hubiera)
try {
  const list = readCreatedList(fs).map(x => {
    if (!x || typeof x !== "object") return x;
    return {
      ...x,
      title: norm(fixLatin1Utf8(x.title)),
      category: norm(fixLatin1Utf8(x.category))
    };
  });
  fs.writeFileSync(CREATED_PATH, JSON.stringify(list, null, 2), "utf8");
} catch {}

const ok = appendCreated(fs, obj);
if (!ok) {
  console.error("✗ No se pudo guardar en _local/created.json");
  process.exit(1);
}
console.log("✓ Guardado local:", obj.title, "-> _local/created.json");
