"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Global hata sınırı (error boundary).
 *
 * Öncesinde projede error.tsx yoktu; bir hata atıldığında Next.js'in
 * varsayılan ekranı çıkıyordu. Mesaj dili skill'in kuralına uygun:
 * ünlem yok, "Oops!" yok, edilgen çatı yok, ne yapılacağı net.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Sorunun izini sürebilmek için konsola yaz; kullanıcıya ham hata gösterme.
  useEffect(() => {
    console.error("[sayfa hatası]", error);
  }, [error]);

  return (
    <section
      className="flex min-h-[calc(100dvh-var(--navbar-h))] items-center justify-center px-5 py-20"
      role="alert"
      aria-labelledby="error-title"
    >
      <div className="w-full max-w-[540px]">
        <p
          className="mb-6 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--clr-gold)]"
          style={{ fontFamily: "var(--font-mono-label)" }}
        >
          Bir şeyler ters gitti
        </p>

        <h1
          id="error-title"
          className="mb-5 text-[clamp(2rem,5.4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.026em] text-[var(--clr-ink)]"
          style={{ fontFamily: "var(--font-display)", fontVariationSettings: '"opsz" 110' }}
        >
          Sayfayı yükleyemedik.
        </h1>

        <p className="mb-9 max-w-[46ch] text-[1.02rem] leading-[1.72] text-[var(--clr-text2)]">
          Beklenmedik bir sorun oluştu. Sayfayı yeniden yüklemek çoğu zaman
          yeterli olur; sorun sürerse bize WhatsApp üzerinden ulaşabilirsiniz.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Yeniden dene
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <Link href="/" className="btn btn-ghost">
            Ana sayfaya dön
          </Link>
        </div>

        {error.digest ? (
          <p
            className="mt-8 text-[0.78rem] text-[var(--clr-text3)]"
            style={{ fontFamily: "var(--font-mono-label)" }}
          >
            Hata kodu: {error.digest}
          </p>
        ) : null}
      </div>
    </section>
  );
}
