import studies from "@/data/gunun-arastirmasi.json";

export type DailyStudy = { t: string; r: string; y: string; s: string; u: string };

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
