export const short = (s, n = 180) => {
  const v = (s ?? "");
  return typeof v === "string" && v.length > n ? v.slice(0, n) + "…" : String(v);
};

// Limpieza "suave": deja unicode (tildes/ñ), aplana espacios y recorta
export const cleanUnicode = (s) => {
  if (s == null) return "";
  if (typeof s !== "string") return String(s);
  return s.replace(/\s+/g, " ").trim();
};

// Si enabled=true, elimina emojis (Extended Pictographic + VARIATION SELECTOR-16)
export const stripEmojiIf = (s, enabled = false) => {
  if (!enabled) return s ?? "";
  const v = String(s ?? "");
  return v.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "");
};
