
const API = "https://fakestoreapi.com";
const tests = [
  ["index.js GET products/5", `${API}/products/5`],
  ["index.js POST products \"Remera DS Análisis\" 299 ropa", `${API}/products`],
  ["index.js GET products/category/electronics", `${API}/products/category/electronics`],
  ["index.js GET products/category/list", `${API}/products/categories`],
  ["index.js GET products", `${API}/products`],
  ["index.js DELETE products/7", `${API}/products/7`],
];

const results = [];
for (const [label, url] of tests) {
  const t0 = performance.now();
  let method = "GET", body;
  if (label.startsWith("index.js POST")) {
    method = "POST";
    body = JSON.stringify({ title:"Remera DS Análisis", price:299, description:"Producto creado desde CLI de TechLab.", image:"https://i.pravatar.cc/200", category:"ropa" });
  }
  if (label.startsWith("index.js DELETE")) method = "DELETE";
  const res = await fetch(url, { method, headers: { "content-type":"application/json" }, body });
  await res.json().catch(()=>{});
  const t1 = performance.now();
  results.push([label, (t1 - t0)]);
}

console.log("\nCommand".padEnd(55), "Ms");
console.log("-------".padEnd(55), "--");
for (const [label, ms] of results) {
  const s = ms.toLocaleString("es-AR", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  console.log(label.padEnd(55), s);
}
