"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function HeroSection() {
  const { dict } = useLocale();
  const t = dict.hero;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" aria-label="Ana başlık">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            {t.badge}
          </div>

          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t.title }} />

          <div className="hero-row">
            <p className="hero-sub">{t.subtitle}</p>

            <div className="hero-cta">
              <button onClick={() => scrollTo("contact")} className="btn btn-primary">
                {t.cta.free}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <a
                href="https://wa.me/905432500417?text=Merhaba,%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                {t.cta.whatsapp}
              </a>
            </div>
          </div>

          <div className="hero-stats" role="list">
            {(["experience", "clients", "specialties", "satisfaction"] as const).map((key) => (
              <div key={key} className="hero-stat" role="listitem">
                <span className="hero-stat-num">{t.stats[key].num}</span>
                <span className="hero-stat-label">{t.stats[key].label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
