export const isValidProduct = (p) => {
  if (!p || typeof p !== "object") return false;
  if (typeof p.id !== "number") return false;
  if (typeof p.title !== "string") return false;
  if (typeof p.category !== "string") return false;
  if (!("price" in p)) return false;
  return true;
};

export const fixRating = (r = {}) => ({
  rate: Number.isFinite(Number(r.rate)) ? Number(r.rate) : null,
  count: Number.isFinite(Number(r.count)) ? Number(r.count) : 0,
});

export const filterAndFixProducts = (arr) => {
  const out = [];
  for (const raw of arr ?? []) {
    if (!raw || typeof raw !== "object") continue;
    const fixed = { ...raw, rating: fixRating(raw.rating) };
    if (isValidProduct(fixed)) out.push(fixed);
  }
  return out;
};
