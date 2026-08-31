import studies from "@/data/gunun-arastirmasi.json";

export type DailyStudy = { t: string; r: string; y: string; s: string; a: string; m: string; f: string; p: string; u: string };

const pool = studies as DailyStudy[];

/** Havuz boyutu — cron ve public bileşen aynı listeyi paylaşır. */
export const poolSize = pool.length;

/** Belirli bir indeksteki araştırmayı döndürür (negatif/aşan değerler normalize edilir). */
export function getStudyByIndex(i: number): { study: DailyStudy; index: number } {
  const index = ((i % poolSize) + poolSize) % poolSize;
  return { study: pool[index], index };
}

/**
 * UTC gün-of-year modülo havuz boyutu ile günün araştırmasını seçer.
 * NOT: Cron'un mevcut mantığıyla birebir aynı olmalı.
 */
export function getDailyStudy(date: Date = new Date()): { study: DailyStudy; index: number } {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  const index = dayOfYear % poolSize;
  return { study: pool[index], index };
}

/* ------------------------------------------------------------------ */
/* Kalıcı makale sayfaları (/makaleler) için yardımcılar                */
/* ------------------------------------------------------------------ */

const TR_MAP: Record<string, string> = {
  ı: "i", İ: "i", ş: "s", Ş: "s", ğ: "g", Ğ: "g",
  ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c",
};

/** Türkçe başlığı URL'de kullanılabilir slug'a çevirir. */
export function slugify(text: string): string {
  return text
    .split("")
    .map((c) => TR_MAP[c] ?? c)
    .join("")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export type StudyWithSlug = DailyStudy & { slug: string; index: number };

/** Havuzdaki tüm araştırmalar, slug'ları hesaplanmış hâlde. */
export function getAllStudies(): StudyWithSlug[] {
  return pool.map((study, index) => ({ ...study, slug: slugify(study.t), index }));
}

/** Slug'a karşılık gelen araştırmayı döndürür; yoksa null. */
export function getStudyBySlug(slug: string): StudyWithSlug | null {
  return getAllStudies().find((s) => s.slug === slug) ?? null;
}
