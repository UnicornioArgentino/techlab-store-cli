import fs from "node:fs";
import { readCreatedList, CREATED_PATH } from "../src/utils/localStore.js";

console.log("cwd:", process.cwd());
console.log("CREATED_PATH:", CREATED_PATH);

const list = readCreatedList(fs);
console.log("locals length:", list.length);
for (const x of list) console.log("title:", x?.title, "| category:", x?.category);
