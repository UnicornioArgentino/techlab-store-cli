import { handleGet, handlePost as handlePostOld, handleDelete, handleExport, showUsage } from "./src/commands.js";
import { handlePOST } from "./src/commands.js";

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

    default:
      return callFirst(showUsage);
  }
}

await main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
