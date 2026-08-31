/** Yalnızca http(s) kabul et; javascript:/data:/credential URL'lerini reddet. */
export function parseHttpUrl(raw: unknown, max = 2000): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > max) return null;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (u.username || u.password) return null;
    return u.toString().slice(0, max);
  } catch {
    return null;
  }
}
