"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { GraduationCap, MapPin, MessageCircleHeart, FlaskConical } from "lucide-react";
import PsiMark from "@/components/PsiMark";
import { getDailyStudy } from "@/lib/dailyResearch";

// Sunucuda false, istemcide (hydration sonrası) true döner. Günün araştırması
// tarihe bağlı olduğundan SSR/istemci uyuşmazlığını böyle önleriz (ArticlesSection deseni).
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function HeroSection() {
  const { dict, locale } = useLocale();
  const t = dict.hero;
  // Günün araştırması istemcide tarihe göre hesaplanır; mount olana kadar
  // şerit render edilmez (hydration uyuşmazlığını önlemek için).
  const mounted = useMounted();
  const daily = mounted ? getDailyStudy().study : null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const trust =
    locale === "tr"
      ? ["RPD altyapılı koçluk", "Çanakkale + Online", "İlk görüşme ücretsiz"]
      : ["PGR-based coaching", "Çanakkale + Online", "Free first session"];

  return (
    <section id="hero" aria-label="Ana başlık">
      <PsiMark className="psi-mark psi-hero" />
      <div className="container">
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true" />
                {t.badge}
              </div>

              {/* Kompakt Günün Araştırması — ilk ekranda okunabilsin diye başlığın üstünde */}
              {mounted && daily && (
                <a href="#articles" className="hero-daily">
                  <FlaskConical strokeWidth={1.8} aria-hidden="true" />
                  <span className="hero-daily-label">{dict.articles.daily.badge}</span>
                  <span className="hero-daily-title">{daily.t}</span>
                  <span className="hero-daily-cta">{t.dailyCta} →</span>
                </a>
              )}

              <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t.title }} />

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

              <div className="hero-trust">
                {trust.map((item, i) => (
                  <span key={i} className="hero-trust-item">
                    {i === 0 ? <GraduationCap /> : i === 1 ? <MapPin /> : <MessageCircleHeart />}
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-portrait">
              <div className="hero-portrait-frame">
                <img
                  src="/orhan.jpg"
                  alt="Orhan Yaşlı"
                  loading="eager"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="hero-portrait-tag">
                <span className="hero-portrait-tag-mark">
                  <GraduationCap strokeWidth={1.8} />
                </span>
                <span>
                  <strong>Orhan Yaşlı</strong>
                  <span>{locale === "tr" ? "RPD Mezunu • Rehber Öğretmen" : "PGR Graduate • Counselor"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
