type Bucket = { count: number; ts: number };

const stores = new Map<string, Map<string, Bucket>>();

/**
 * In-memory sabit pencereli limit. Vercel'de instance başına çalışır;
 * sıfır maliyetli ilk savunma (OWASP ASVS: brute-force'a karşı hız sınırı).
 * Kalıcı paylaşım için Upstash/Redis gerekir.
 */
export function rateLimited(scope: string, key: string, max: number, windowMs: number): boolean {
  let hits = stores.get(scope);
  if (!hits) {
    hits = new Map();
    stores.set(scope, hits);
  }
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now - rec.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    return false;
  }
  rec.count++;
  return rec.count > max;
}

/** Vercel'in eklediği istemci IP'sini tercih et; aksi halde x-forwarded-for'un ilk hop'u. */
export function clientIp(req: Request): string {
  const vercel = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
