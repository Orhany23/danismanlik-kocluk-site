"use client";

import { useLocale } from "@/components/LocaleProvider";

const serviceIcons = [
  // Exam Coaching - graduation cap
  <svg key="0" viewBox="0 0 32 32" fill="none">
    <defs><linearGradient id="sv1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#1a56db"/></linearGradient></defs>
    <path d="M16 2L2 10l14 8 14-8L16 2z" fill="url(#sv1)"/>
    <path d="M2 18l14 8 14-8" fill="url(#sv1)" opacity="0.85"/>
    <path d="M2 12l14 8 14-8" fill="url(#sv1)" opacity="0.7"/>
  </svg>,
  // Student Coaching - clock
  <svg key="1" viewBox="0 0 32 32" fill="none">
    <defs><linearGradient id="sv2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#1a56db"/></linearGradient></defs>
    <circle cx="16" cy="16" r="14" fill="url(#sv2)"/>
    <path d="M16 7v9l6 4" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
  </svg>,
  // Anxiety - shield
  <svg key="2" viewBox="0 0 32 32" fill="none">
    <defs><linearGradient id="sv3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
    <path d="M16 2L2 10v6c0 8 6 14 14 16 8-2 14-8 14-16V10L16 2z" fill="url(#sv3)"/>
    <path d="M16 8v6" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
    <circle cx="16" cy="20" r="2" fill="#fff" opacity="0.9"/>
  </svg>,
  // Individual - person
  <svg key="3" viewBox="0 0 32 32" fill="none">
    <defs><linearGradient id="sv4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#1a56db"/></linearGradient></defs>
    <circle cx="16" cy="11" r="7" fill="url(#sv4)"/>
    <path d="M3 28c0-8 5.8-14 13-14s13 6 13 14" fill="url(#sv4)" opacity="0.85"/>
  </svg>,
  // Online - monitor
  <svg key="4" viewBox="0 0 32 32" fill="none">
    <defs><linearGradient id="sv5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
    <rect x="2" y="4" width="28" height="20" rx="3" fill="url(#sv5)"/>
    <rect x="10" y="24" width="12" height="4" rx="1" fill="#1a56db" opacity="0.3"/>
    <circle cx="22" cy="13" r="4" fill="#fff" opacity="0.2"/>
    <circle cx="22" cy="13" r="2" fill="#60a5fa" opacity="0.8"/>
  </svg>,
  // Play therapy - blocks
  <svg key="5" viewBox="0 0 32 32" fill="none">
    <defs><linearGradient id="sv6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#1a56db"/></linearGradient></defs>
    <rect x="4" y="14" width="8" height="14" rx="2" fill="url(#sv6)"/>
    <rect x="12" y="8" width="8" height="20" rx="2" fill="url(#sv6)" opacity="0.85"/>
    <rect x="20" y="4" width="8" height="24" rx="2" fill="url(#sv6)" opacity="0.7"/>
  </svg>,
];

export default function ServicesSection() {
  const { dict } = useLocale();
  const t = dict.services;

  return (
    <section id="services" className="section" aria-labelledby="services-title" style={{ background: "var(--clr-bg2)" }}>
      <div className="container">
        <div className="text-center mb-14">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="services-title" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="section-sub mx-auto">{t.subtitle}</p>
        </div>
        <div className="services-grid">
          {t.cards.map((card, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{serviceIcons[i]}</div>
              <h3 className="service-title">{card.title}</h3>
              <p className="service-desc">{card.desc}</p>
              <span className="service-tag">{card.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
