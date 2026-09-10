/**
 * Yükleme durumu — iskelet (skeleton) ekran.
 *
 * Öncesinde projede loading.tsx yoktu. Skill jenerik dönen spinner yerine
 * sayfanın gerçek şekline benzeyen iskelet öneriyor: içerik geldiğinde
 * layout kaymıyor, ziyaretçi ne beklediğini görüyor.
 *
 * Sadece transform/opacity ile çalışır (GPU hızlandırmalı), prefers-reduced-motion
 * ile durur.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="sr-skeleton-root">
      <span className="sr-only">Sayfa yükleniyor</span>

      {/* Hero karşılığı: solda metin bloğu, sağda portre */}
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-7 pt-24 pb-16 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div>
          <div className="sk sk-line mb-7 h-4 w-[280px]" />
          <div className="sk sk-line mb-4 h-14 w-full max-w-[520px]" />
          <div className="sk sk-line mb-10 h-14 w-full max-w-[380px]" />
          <div className="sk sk-line mb-3 h-4 w-full max-w-[440px]" />
          <div className="sk sk-line mb-10 h-4 w-full max-w-[360px]" />
          <div className="flex gap-3">
            <div className="sk sk-block h-12 w-[170px]" />
            <div className="sk sk-block h-12 w-[140px]" />
          </div>
        </div>
        <div className="sk sk-block hidden aspect-[4/5] w-full max-w-[380px] justify-self-end md:block" />
      </div>

      {/* Kart satırı karşılığı */}
      <div className="mx-auto grid w-full max-w-[1200px] gap-6 px-7 pb-24 md:grid-cols-2">
        <div className="sk sk-block h-[320px] w-full" />
        <div className="sk sk-block h-[320px] w-full" />
      </div>

      <style>{`
        .sk {
          position: relative;
          overflow: hidden;
          background: color-mix(in srgb, var(--clr-border) 62%, var(--clr-bg));
        }
        .sk-line { border-radius: var(--r-xs); }
        .sk-block { border-radius: var(--r-lg); }
        .sk::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--clr-card) 85%, transparent),
            transparent
          );
          animation: sk-sweep 1.6s ease-in-out infinite;
        }
        @keyframes sk-sweep {
          100% { transform: translateX(100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sk::after { animation: none; }
        }
        .sr-skeleton-root { min-height: calc(100dvh - var(--navbar-h)); }
      `}</style>
    </div>
  );
}
