#!/usr/bin/env node
import { showUsage } from "./src/utils.js";
import {
  handleGet,
  handleDelete,
  handleExport,
  handlePOST,
  handlePost as handlePostOld
} from "./src/commands.js";

const [, , rawMethod, ...args] = process.argv;
const method = String(rawMethod || "").toUpperCase();

// Adapta args: si el handler declara <= 1 parámetro => pasa args[0]; si no, pasa el array completo
const callHandler = (fn) => {
  if (typeof fn !== "function") return;
  return fn.length <= 1 ? fn(args[0]) : fn(args);
};

async function main() {
  switch (method) {
    case "GET":
      return callHandler(handleGet);
    case "POST":
      // Prioriza handler nuevo
      if (typeof handlePOST === "function") {
        return callHandler(handlePOST);
      }
      // Fallback por compatibilidad
      if (typeof handlePostOld === "function") {
        return callHandler(handlePostOld);
      }
      console.error("No existe un handler POST disponible.");
      return;
    case "DELETE":
      return callHandler(handleDelete);
    case "EXPORT":
      return callHandler(handleExport);
    default:
      return showUsage?.();
  }
}

await main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
