type Bucket = { count: number; ts: number };

const stores = new Map<string, Map<string, Bucket>>();
const MAX_KEYS_PER_SCOPE = 5_000;

function pruneExpired(hits: Map<string, Bucket>, now: number, windowMs: number) {
  if (hits.size < MAX_KEYS_PER_SCOPE) return;

  for (const [key, bucket] of hits) {
    if (now - bucket.ts > windowMs) hits.delete(key);
  }

  if (hits.size >= MAX_KEYS_PER_SCOPE) {
    const oldest = [...hits.entries()].sort((a, b) => a[1].ts - b[1].ts);
    const removeCount = Math.ceil(MAX_KEYS_PER_SCOPE * 0.1);
    for (const [key] of oldest.slice(0, removeCount)) hits.delete(key);
  }
}

/**
 * In-memory sabit pencereli limit. Vercel'de instance başına çalışır.
 * Kalıcı/paylaşımlı limit gerektiğinde Redis/Upstash benzeri ortak store kullanılmalı.
 */
export function rateLimited(scope: string, key: string, max: number, windowMs: number): boolean {
  let hits = stores.get(scope);
  if (!hits) {
    hits = new Map();
    stores.set(scope, hits);
  }

  const now = Date.now();
  pruneExpired(hits, now, windowMs);

  const rec = hits.get(key);
  if (!rec || now - rec.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    return false;
  }

  rec.count++;
  return rec.count > max;
}

/** Vercel'in eklediği istemci IP'sini tercih et; aksi halde güvenilir fallback'leri kullan. */
export function clientIp(req: Request): string {
  const vercel = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;

  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;

  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
