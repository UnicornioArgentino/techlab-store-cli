
import fs from "node:fs";

const toCsvValue = (v) => {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/\r?\n/g, " ").trim().replace(/"/g, '""');
  return /[",]/.test(s) ? `"${s}"` : s;
};

export const saveProductsCsv = (rows, outPath) => {
  const headers = ["id","title","price","category","image","rating_count","rating_rate"];
  const lines = [headers.join(",")];
  for (const p of rows) {
    lines.push([
      toCsvValue(p.id),
      toCsvValue(p.title),
      toCsvValue(p.price),
      toCsvValue(p.category),
      toCsvValue(p.image),
      toCsvValue(p.rating?.count ?? 0),
      toCsvValue(p.rating?.rate ?? "")
    ].join(","));
  }
  fs.writeFileSync(outPath, lines.join("\n"), { encoding: "utf-8" });
};
