import fs from "node:fs";

const PATH  = process.argv[2] || "./export/products.json";
const TITLE = process.argv[3] || "";

const clean = (s) => (s ?? "")
  .normalize("NFC")
  .replace(/[\u200B-\u200D\uFEFF]/g, "")
  .trim();

const strip = (s) => clean(s)
  .normalize("NFD")
  .replace(/\p{Mn}+/gu, "")
  .toLowerCase();

const raw = fs.readFileSync(PATH, "utf8").replace(/^\uFEFF/, "");
const arr = JSON.parse(raw);

const needle = strip(TITLE);
const hits = arr.filter(x => strip(x?.title) === needle);

if (hits.length) {
  console.log(`OK: encontrado '${TITLE}' (${hits.length}) en ${PATH}`);
  console.table(hits.map(x => ({ id: x.id, title: x.title, price: x.price, category: x.category })));
  process.exit(0);
} else {
  console.error(`NO encontrado '${TITLE}' en ${PATH}`);
  const near = arr
    .filter(x => strip(x?.title).includes(strip("Remera")) && strip(x?.title).includes(strip("Análisis")))
    .map(x => ({ id: x.id, title: x.title, category: x.category }));
  if (near.length) {
    console.log("\nSugerencias cercanas:");
    console.table(near);
  }
  process.exit(1);
}
