import fs from "node:fs";
const raw = fs.readFileSync("./export/products.json","utf8").replace(/^\uFEFF/,"");
const arr = JSON.parse(raw);
if(!Array.isArray(arr) || arr.length < 21){
  console.error("❌ smoke: export/products.json no tiene al menos 21 items");
  process.exit(1);
}
console.log("✅ smoke: export/products.json OK ->", arr.length, "items");
