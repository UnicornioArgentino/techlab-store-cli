// src/commands.js
import { apiGet, apiPost, apiDelete } from "./api.js";
import { toCSV, saveCSV } from "./utils.js";

// Filtro local con querystring: minPrice, maxPrice, minRating, category
function filterProducts(products, qs = "") {
  if (!qs) return products;
  const params = new URLSearchParams(qs);

  const minPrice  = params.get("minPrice");
  const maxPrice  = params.get("maxPrice");
  const minRating = params.get("minRating");
  const category  = params.get("category"); // acepta lista separada por coma

  let out = [...products];

  if (minPrice !== null) {
    const v = Number(minPrice);
    if (!Number.isNaN(v)) out = out.filter((p) => Number(p.price) >= v);
  }
  if (maxPrice !== null) {
    const v = Number(maxPrice);
    if (!Number.isNaN(v)) out = out.filter((p) => Number(p.price) <= v);
  }
  if (minRating !== null) {
    const v = Number(minRating);
    if (!Number.isNaN(v)) out = out.filter((p) => Number(p?.rating?.rate) >= v);
  }
  if (category) {
    const wanted = category
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (wanted.length) {
      out = out.filter((p) => wanted.includes(String(p.category).toLowerCase()));
    }
  }
  return out;
}

export async function handleGet(resource) {
  // GET products[?...qs]
  if (resource === "products" || resource.startsWith("products?")) {
    const qs = resource.includes("?") ? resource.split("?")[1] : "";
    const products = await apiGet("/products");
    const filtered = filterProducts(products, qs);

    if (qs) {
      console.log(`ðŸ”Ž Filtro aplicado: ?${qs}`);
      console.log(`ðŸ§® Resultados: ${filtered.length}/${products.length}`);
    }
    console.log("\nðŸ“¦ Lista de productos:");
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }

  // GET products/<id>
  if (resource.startsWith("products/") && !resource.startsWith("products/category")) {
    const id = resource.split("/")[1];
    const product = await apiGet(`/products/${id}`);
    console.log("\nðŸ§¾ Producto #" + id + ":");
    console.log(JSON.stringify(product, null, 2));
    return;
  }

  // GET products/category/list
  if (resource === "products/category/list") {
    const categories = await apiGet("/products/categories");
    console.log("\nðŸ·ï¸ CategorÃ­as disponibles:");
    console.log(JSON.stringify(categories, null, 2));
    return;
  }

  // GET products/category/<cat>
  if (resource.startsWith("products/category/")) {
    const cat = resource.split("/")[2];
    const list = await apiGet(`/products/category/${cat}`);
    console.log(`\nðŸ“š Productos en categorÃ­a "${cat}":`);
    console.log(JSON.stringify(list, null, 2));
    return;
  }

  console.error("âŒ Recurso GET no soportado:", resource);
}

export async function handlePost({ title, price, category }) {
  const body = {
    title,
    price: Number(price),
    description: "Producto creado desde CLI de TechLab.",
    image: "https://i.pravatar.cc/200",
    category,
  };
  const created = await apiPost("/products", body);
  console.log("\nâœ… Producto creado:");
  console.log(JSON.stringify(created, null, 2));
}

export async function handleDelete(resource) {
  if (!resource.startsWith("products/")) {
    console.error("âŒ Formato esperado: DELETE products/<id>");
    return;
  }
  const id = resource.split("/")[1];
  const deleted = await apiDelete(`/products/${id}`);
  console.log(`\nðŸ—‘ï¸ Producto #${id} eliminado (respuesta API):`);
  console.log(JSON.stringify(deleted, null, 2));
}

export async function handleExport(resource) {
  if (resource !== "products") {
    console.error("âŒ Formato esperado: EXPORT products");
    return;
  }
  const products = await apiGet("/products");
  const csv = toCSV(products);
  await ensureOutputFolder();
  const filePath = await saveCSV(csv);
  console.log(`\nâœ… CSV exportado: ${filePath}`);
}




