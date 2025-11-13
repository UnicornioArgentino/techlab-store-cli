import fs from 'node:fs';
import path from 'node:path';

export function parseResource(resource) {
  // Admite: 'products', 'products/15', 'products/category/electronics'
  const segments = String(resource || '')
    .split('/')
    .filter(Boolean);
  const [collection, s2, s3] = segments;
  return { collection, s2, s3, segments };
}

export function prettyPrint(data, label = '') {
  const json = JSON.stringify(data, null, 2);
  if (label) console.log(`\n${label}`);
  console.log(json);
}

export function showUsage(prefix = '') {
  if (prefix) console.log(`\n${prefix}\n`);
  console.log(`
Uso:
  npm run start -- GET products
  npm run start -- GET products/<id>
  npm run start -- GET products/category/<name>
  npm run start -- POST products "<title>" <price> <category>
  npm run start -- DELETE products/<id>

Extra (portfolio):
  npm run start -- EXPORT products   # exporta CSV en ./output/products_YYYYMMDD-HHmm.csv

Ejemplos:
  npm run start -- GET products
  npm run start -- GET products/5
  npm run start -- GET products/category/electronics
  npm run start -- POST products "Remera DS Análisis" 299 ropa
  npm run start -- DELETE products/7
  npm run start -- EXPORT products

Notas:
  - En Windows suele requerir: npm run start -- <COMANDO ...>
  - En POST, usá comillas para títulos con espacios.
`);
}

export function toCSV(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return '';
  // Aplanado simple de 1er nivel
  const flatten = (obj) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          // aplanar un nivel (e.g. rating.rate/rating.count)
          return [k, JSON.stringify(v)];
        }
        return [k, v];
      })
    );
  const flatRows = rows.map(flatten);
  const headers = Array.from(
    flatRows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  const esc = (val) => {
    if (val === null || val === undefined) return '';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [
    headers.map(esc).join(','),
    ...flatRows.map((r) => headers.map((h) => esc(r[h])).join(',')),
  ];
  return lines.join('\n');
}

export function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

export function saveFile({ dir = './output', name, content }) {
  ensureDir(dir);
  const fp = path.join(dir, name);
  fs.writeFileSync(fp, content);
  return fp;
}

export function tsStamp() {
  const pad = (n) => String(n).padStart(2, '0');
  const d = new Date();
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${y}${m}${dd}-${hh}${mm}`;
}
