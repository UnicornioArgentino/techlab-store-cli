// src/api.js
const BASE_URL = "https://fakestoreapi.com";

async function http(method, path, body) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const init = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body != null) init.body = JSON.stringify(body);

  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} -> ${url}\n${text}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return {};
  return res.json();
}

export async function apiGet(path) {
  return http("GET", path);
}

export async function apiPost(path, body) {
  return http("POST", path, body);
}

export async function apiDelete(path) {
  return http("DELETE", path);
}
