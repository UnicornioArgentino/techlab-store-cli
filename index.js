#!/usr/bin/env node
import fs from "node:fs";
import { short, cleanUnicode, stripEmojiIf } from "./src/utils/text.js";
import { hasFlag } from "./src/utils/flags.js";
import { filterAndFixProducts, fixRating } from "./src/utils/validate.js";

// Config
const API = "https://fakestoreapi.com";
const NO_EMOJI = hasFlag("--no-emoji");

const stripEmoji = (s) => stripEmojiIf(s, NO_EMOJI);

const sanitizeProduct = (p) => {
  const safe = { ...p };
  safe.id ??= null;
  safe.title = stripEmoji(cleanUnicode(String(safe.title ?? "")));
  safe.category = cleanUnicode(String(safe.category ?? ""));
  safe.image = String(safe.image ?? "");
  safe.price = Number.isFinite(Number(safe.price)) ? Number(safe.price) : null;
  safe.description = stripEmoji(short(cleanUnicode(String(safe.description ?? "")), 180));
  safe.rating = fixRating(safe.rating);
  return safe;
};

const api = async (path, init={}) => {
  const res = await fetch(`${API}${path}`, {
    headers: { "content-type":"application/json; charset=utf-8" },
    ...init,
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} -> ${path}`);
  return res.json();
};

// Endpoints helpers
const getProducts = async () => api("/products");
const getProduct = async (id) => api(`/products/${id}`);
const getCategories = async () => api(`/products/categories`);
const getByCategory = async (cat) => api(`/products/category/${encodeURIComponent(cat)}`);
const postProduct = async (payload) => api(`/products`, { method:"POST", body: payload });
const deleteProduct = async (id) => api(`/products/${id}`, { method:"DELETE" });

// CLI parse
const [, , METHOD, ...ARGS] = process.argv;

const logOk = (label) => console.log(`✔ OK: ${label}`);
const print = (obj) => console.log(JSON.stringify(obj, null, 2));

async function main(){
  const m = (METHOD || "").toUpperCase();

  if (m === "GET") {
    // Rutas compatibles con tu flujo:
    // - GET products
    // - GET products/5
    // - GET products/category/list  (alias de /products/categories)
    // - GET products/category/<name>
    const path = (ARGS[0] || "").trim();

    if (path === "products") {
      const raw = await getProducts();
      const clean = filterAndFixProducts(raw).map(sanitizeProduct);
      console.log("📦 Lista de productos:");
      print(clean);
      return logOk("GET: products");
    }

    if (/^products\/\d+$/.test(path)) {
      const id = Number(path.split("/")[1]);
      const raw = await getProduct(id);
      const clean = sanitizeProduct(raw);
      console.log("🧪 Producto #"+id+":");
      print(clean);
      return logOk(`GET: products/${id}`);
    }

    if (path === "products/category/list") {
      const cats = await getCategories();
      console.log("🏷️ Categorías disponibles:");
      print(cats);
      return logOk("GET: categories");
    }

    if (/^products\/category\/[^\/]+$/.test(path)) {
      const cat = path.split("/")[2];
      const raw = await getByCategory(cat);
      const clean = filterAndFixProducts(raw).map(sanitizeProduct);
      console.log(`📚 Productos en categoría "${cat}":`);
      print(clean);
      return logOk(`GET: category ${cat}`);
    }

    throw new Error(`Ruta GET no reconocida: ${path}`);
  }

  if (m === "POST") {
    // POST products "Title con espacios" 299 categoria
    const resource = ARGS[0];
    if (resource !== "products") throw new Error("Solo POST products soportado");
    const title = ARGS[1] ? ARGS[1] : "";
    const price = Number(ARGS[2]);
    const category = ARGS[3] || "misc";
    const payload = {
      title: title.replace(/^"|"$/g,""),
      price,
      description: "Producto creado desde CLI de TechLab.",
      image: "https://i.pravatar.cc/200",
      category
    };
    console.log("🔎  Enviando body:");
    print(payload);
    const resp = await postProduct(payload);
    console.log("✅ Producto creado:");
    print(sanitizeProduct(resp));
    return logOk(`POST: create demo`);
  }

  if (m === "DELETE") {
    // DELETE products/7
    const path = (ARGS[0] || "").trim();
    if (!/^products\/\d+$/.test(path)) throw new Error("Usa: DELETE products/<id>");
    const id = Number(path.split("/")[1]);
    const resp = await deleteProduct(id);
    console.log("🗑️ Producto #"+id+" eliminado (respuesta API):");
    print(sanitizeProduct(resp));
    return logOk(`DELETE: id ${id} (demo)`);
  }

  throw new Error(`Método no soportado: ${METHOD}`);
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});




