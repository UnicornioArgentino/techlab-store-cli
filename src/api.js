const BASE = "https://fakestoreapi.com";

async function handle(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${res.statusText} ${txt ? "- " + txt : ""}`);
  }
  // DELETE de fakestoreapi también devuelve JSON
  return res.json();
}

export async function apiGet(path) {
  const url = `${BASE}/${path}`;
  const res = await fetch(url, { method: "GET" });
  return handle(res);
}

export async function apiPost(path, body) {
  const url = `${BASE}/${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {})
  });
  return handle(res);
}

export async function apiDelete(path) {
  const url = `${BASE}/${path}`;
  const res = await fetch(url, { method: "DELETE" });
  return handle(res);
}
