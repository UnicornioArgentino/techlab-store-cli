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

// Helpers
const callArray = (fn) => (typeof fn === "function" ? fn(args) : undefined);
const callFirst = (fn) => (typeof fn === "function" ? fn(args[0]) : undefined);

async function main() {
  switch (method) {
    case "GET":
      return callArray(handleGet);       // pasa array
    case "POST":
      if (typeof handlePOST === "function") {
        return callArray(handlePOST);    // pasa array
      }
      if (typeof handlePostOld === "function") {
        return callArray(handlePostOld); // pasa array (compat)
      }
      console.error("No existe un handler POST disponible.");
      return;
    case "DELETE":
      return callFirst(handleDelete);    // pasa "products/7" como string
    case "EXPORT":
      return callArray(handleExport);    // pasa array
    default:
      return showUsage?.();
  }
}

await main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});

