"use client";

import { useLocale } from "@/components/LocaleProvider";
import { GraduationCap, MapPin, MessageCircleHeart } from "lucide-react";

export default function HeroSection() {
  const { dict, locale } = useLocale();
  const t = dict.hero;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const trust =
    locale === "tr"
      ? ["RPD altyapılı koçluk", "Çanakkale + Online", "İlk görüşme ücretsiz"]
      : ["PGR-based coaching", "Çanakkale + Online", "Free first session"];

  return (
    <section id="hero" aria-label="Ana başlık">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true" />
                {t.badge}
              </div>

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
