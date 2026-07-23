import sparks from "@/data/gunun-kivilcimi.json";

export type SparkKind = "motivasyon" | "hikaye" | "teknik" | "taktik";
export type DailySpark = { k: SparkKind; t: string; c?: string; a?: string };

const pool = sparks as DailySpark[];

/** Havuz boyutu — bileşenlerle paylaşılır. */
export const sparkPoolSize = pool.length;

/**
 * UTC gün-of-year modülo havuz boyutu ile günün kıvılcımını seçer.
 * getDailyStudy ile aynı deterministik mantığı kullanır.
 */
export function getDailySpark(date: Date = new Date()): { spark: DailySpark; index: number } {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  const index = dayOfYear % sparkPoolSize;
  return { spark: pool[index], index };
}
