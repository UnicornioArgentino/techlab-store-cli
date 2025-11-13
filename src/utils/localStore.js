export const CREATED_PATH = "./_local/created.json";

/** Lee lista de creados locales; si no existe, [] */
export function readCreatedList(fs) {
  try {
    if (!fs.existsSync(CREATED_PATH)) return [];
    let raw = fs.readFileSync(CREATED_PATH, "utf8");
    // Quitar BOM si viene del PowerShell (UTF-8 con BOM)
    raw = raw.replace(/^\uFEFF/, "");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Agrega/actualiza un creado por id o por (title,category) si no tiene id */
export function appendCreated(fs, obj) {
  try {
    const list = readCreatedList(fs);
    const key = (x) =>
      x?.id != null ? `id:${x.id}` :
      `tk:${(x?.title ?? "").toLowerCase()}|${(x?.category ?? "").toLowerCase()}`;
    const map = new Map(list.map((x) => [key(x), x]));
    map.set(key(obj), obj);
    const out = JSON.stringify(Array.from(map.values()), null, 2);
    fs.writeFileSync(CREATED_PATH, out, "utf8");
    return true;
  } catch {
    return false;
  }
}
