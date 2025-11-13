#!/usr/bin/env node
import { showUsage } from "./src/utils.js";
import { handleGet, handleDelete, handleExport, handlePOST, handlePost as handlePostOld } from "./src/commands.js";

const [, , rawMethod, ...args] = process.argv;
const method = String(rawMethod || "").toUpperCase();

async function main() {
  switch (method) {
    case "GET":
      return handleGet?.(args);
    case "POST":
      if (typeof handlePOST === "function") {
        return handlePOST(args);
      }
      // fallback por compatibilidad
      if (typeof handlePostOld === "function") {
        return handlePostOld(args);
      }
      console.error("No existe un handler POST disponible.");
      return;
    case "DELETE":
      return handleDelete?.(args);
    case "EXPORT":
      return handleExport?.(args);
    default:
      return showUsage?.();
  }
}

await main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
