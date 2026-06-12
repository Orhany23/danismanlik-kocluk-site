"use client";

import { useLocale } from "@/components/LocaleProvider";

const profileIcons = [
  <svg key="0" viewBox="0 0 32 32" fill="none" stroke="#E8590C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="10" r="6" /><path d="M8 28c0-5 3.6-9 8-9s8 4 8 9" /><path d="M17 8l-2 3 2 2" strokeWidth="1.4" />
  </svg>,
  <svg key="1" viewBox="0 0 32 32" fill="none" stroke="#E8590C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6L4 10v12l8 4 8-4V10l-8-4z" /><path d="M20 10l8 4v12l-8 4" /><path d="M12 14l8-4" /><path d="M12 18l8-4" /><path d="M12 22l8-4" />
  </svg>,
  <svg key="2" viewBox="0 0 32 32" fill="none" stroke="#E8590C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="16" r="13" /><path d="M16 10v6l4 3" />
  </svg>,
  <svg key="3" viewBox="0 0 32 32" fill="none" stroke="#E8590C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4v4M16 24v4M4 16h4M24 16h4" /><path d="M8.5 8.5l2.8 2.8M20.7 20.7l2.8 2.8" /><path d="M8.5 23.5l2.8-2.8M20.7 11.3l2.8-2.8" />
  </svg>,
  <svg key="4" viewBox="0 0 32 32" fill="none" stroke="#E8590C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="9" r="4" /><circle cx="23" cy="9" r="4" /><path d="M9 24c0-4 3-8 7-8s7 4 7 8" /><path d="M5 20h22" strokeWidth="1.4" />
  </svg>,
];

export default function WhoForSection() {
  const { dict } = useLocale();
  const t = dict.whoFor;

  return (
    <section id="who-for" className="section" aria-labelledby="whofor-title" style={{ background: "var(--clr-bg2)" }}>
      <div className="container">
        <div className="text-center mb-14">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="whofor-title" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="section-sub mx-auto">{t.subtitle}</p>
        </div>
        <div className="services-grid">
          {t.profiles.map((profile, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{profileIcons[i]}</div>
              <h3 className="service-title">{profile.title}</h3>
              <p className="service-desc">{profile.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
