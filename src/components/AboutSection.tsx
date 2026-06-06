"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function AboutSection() {
  const { dict } = useLocale();
  const t = dict.about;
  const featureIcons = ["🎯", "📚", "💬", "💻", "🎮", "🧠"];
  const gIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs><linearGradient id="accG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#fff"/></linearGradient></defs>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="url(#accG)" opacity="0.9"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5" fill="url(#accG)" opacity="0.7"/>
    </svg>
  );

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <div className="max-w-[820px] mx-auto text-center">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="about-title" dangerouslySetInnerHTML={{ __html: t.title }} />
          <div className="about-accent mx-auto">
            <div className="about-accent-icon">{gIcon}</div>
            <div className="about-accent-text">
              <strong>{t.university}</strong>
              <span>{t.degree}</span>
            </div>
          </div>
          <p className="section-sub about-quote mx-auto">{t.para1}</p>
          <p className="section-sub mx-auto mt-3.5">{t.para2}</p>
          <div className="about-features max-w-[680px] mx-auto">
            {t.features.map((f, i) => (
              <div key={i} className="about-feature">
                <div className="about-feature-icon">{featureIcons[i]}</div>
                {f}
              </div>
            ))}
          </div>
          <div className="about-cta flex gap-3.5 flex-wrap justify-center mt-8">
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-primary">
              {t.cta}
            </button>
            <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-outline">
              {t.cta2}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
