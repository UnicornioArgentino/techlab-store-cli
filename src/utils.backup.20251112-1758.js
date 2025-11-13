import fs from "node:fs/promises";
import path from "node:path";

export function toCSV(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return "";

  // Aplana rating.* a columnas planas
  const flat = rows.map((r) => {
    const out = { ...r };
    if (r?.rating && typeof r.rating === "object") {
      out.rating_rate = r.rating.rate;
      out.rating_count = r.rating.count;
      delete out.rating;
    }
    return out;
  });

  // Encabezados
  const headers = Array.from(
    flat.reduce((set, obj) => {
      Object.keys(obj).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );

  // Escapado CSV
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = [
    headers.join(","),
    ...flat.map((obj) => headers.map((h) => esc(obj[h])).join(",")),
  ];

  return lines.join("\n");
}

export async function ensureOutputFolder(dir = "output") {
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

function ts() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

export async function saveCSV(csvText, dir = "output", prefix = "products") {
  await ensureOutputFolder(dir);
  const file = path.join(dir, `${prefix}_${ts()}.csv`);
  await fs.writeFile(file, csvText, "utf8");
  return file;
}
