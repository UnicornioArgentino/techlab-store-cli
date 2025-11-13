import * as cmds from "./src/commands.js";

const handleGet    = cmds.handleGet;
const handleDelete = cmds.handleDelete;
const handleExport = cmds.handleExport;
// Preferimos el nuevo handlePOST; si no existe, caemos a handlePost (legacy)
const handlePOST   = cmds.handlePOST ?? cmds.handlePost;
// Soporte nueva/legacy: preferí handlePOST; si no existe, usa handlePost

// Soporte nueva/legacy: preferí handlePOST; si no existe, usa handlePost

const [, , rawMethod, ...args] = process.argv;
const method = String(rawMethod || "").toUpperCase();

function callFirst(fn, ...params) {
  if (typeof fn === "function") return fn(...params);
  return undefined;
}

async function main() {
  switch (method) {
    case "GET":
      // GET espera UN string (p.ej. "products" o "products/5" o "products?...").
      return callFirst(handleGet, args?.[0] ?? "");

    case "POST":
      // POST espera array: [path, title, price, category]
      if (typeof handlePOST === "function") return handlePOST(args);
      if (typeof handlePostOld === "function") return handlePostOld(args);
      console.error("No existe un handler POST disponible.");
      return;

    case "DELETE":
      // DELETE espera UN string: "products/7"
      return callFirst(handleDelete, args?.[0] ?? "");

    case "EXPORT":
      // EXPORT espera UN string: "products"
      return callFirst(handleExport, args?.[0] ?? "");

    default: {
  const help = [
    '',
    'TechLab Store CLI - Ayuda rápida',
    '',
    'USO BÁSICO',
    '  node index.js <VERBO> <RUTA>',
    '  node index.js GET products',
    '  node index.js GET products/5',
    '  node index.js POST products "Remera DS Análisis" 299 ropa',
    '  node index.js DELETE products/7',
    '',
    'NPM SCRIPTS',
    '  npm run get:all',
    '  npm run get:one',
    '  npm run get:cat:list',
    '  npm run get:cat:elec',
    '  npm run export:all',
    '  npm run post:demo',
    '  npm run del:demo',
    '',
    'FILTROS (QUERYSTRING)',
    "  node index.js GET 'products?minPrice=100&minRating=4'",
    "  node index.js GET 'products?category=electronics&maxPrice=200'",
    "  node index.js GET 'products?category=electronics,men%27s%20clothing&minPrice=20&maxPrice=120'",
    ''
  ].join('\n');
  console.log(help);
  return;
}
  }
}

await main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});






