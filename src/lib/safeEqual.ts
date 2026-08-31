import { timingSafeEqual } from "crypto";

/** Uzunluk sızıntısını azaltmak için aynı boyuta doldurulmuş timing-safe karşılaştırma. */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  const len = Math.max(left.length, right.length, 1);
  const la = Buffer.alloc(len);
  const lb = Buffer.alloc(len);
  left.copy(la);
  right.copy(lb);
  const sameLen = left.length === right.length && left.length > 0;
  return timingSafeEqual(la, lb) && sameLen;
}
