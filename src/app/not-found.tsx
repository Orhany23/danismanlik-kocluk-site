import Link from "next/link";

/**
 * Markalı 404 sayfası.
 *
 * Öncesinde projede not-found.tsx yoktu; Next.js'in varsayılan beyaz
 * "404 | This page could not be found." ekranı çıkıyordu. Artık site
 * paletiyle ve tipografisiyle uyumlu, ziyaretçiyi çıkmazdan kurtaran
 * bir sayfa var (skill: "No custom 404 page", "No 'back' navigation").
 */
export default function NotFound() {
  return (
    <section
      className="flex min-h-[calc(100dvh-var(--navbar-h))] items-center justify-center px-5 py-20"
      aria-labelledby="notfound-title"
    >
      <div className="w-full max-w-[560px] text-center">
        <p
          className="mb-6 font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--clr-gold)]"
          style={{ fontFamily: "var(--font-mono-label)" }}
        >
          Hata 404
        </p>

        <h1
          id="notfound-title"
          className="mb-5 text-[clamp(2.4rem,7vw,4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-[var(--clr-ink)]"
          style={{ fontFamily: "var(--font-display)", fontVariationSettings: '"opsz" 130' }}
        >
          Bu sayfa <em className="not-italic text-[var(--clr-sage)] italic">taşınmış</em> olabilir.
        </h1>

        <p className="mx-auto mb-10 max-w-[46ch] text-[1.02rem] leading-[1.72] text-[var(--clr-text2)]">
          Aradığınız adres artık burada değil. Aşağıdaki yollardan biri sizi
          aradığınız yere götürebilir.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Ana sayfaya dön
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
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link href="/paketler" className="btn btn-ghost">
            Paketler
          </Link>
          <Link href="/makaleler" className="btn-text">
            Makalelere göz at
          </Link>
        </div>
      </div>
    </section>
  );
}
