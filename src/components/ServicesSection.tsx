"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function ServicesSection() {
  const { dict } = useLocale();
  const t = dict.services;

  return (
    <section id="services" aria-labelledby="services-title">
      {/* Section intro */}
      <div className="section" style={{ paddingBottom: 48 }}>
        <div className="container">
          <span className="section-label">{t.label}</span>
          <h2
            className="section-title"
            id="services-title"
            style={{ maxWidth: 720 }}
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="section-sub" style={{ maxWidth: 560 }}>{t.subtitle}</p>
        </div>
      </div>

      {t.groups.map((group) => {
        const inverted = group.key === "counseling";
        return (
          <div
            key={group.key}
            className={`domain-band ${inverted ? "domain-band--ink" : ""}`}
          >
            <div className="container">
              <div className="domain-head">
                <span className="domain-eyebrow">{group.eyebrow}</span>
                <h3 className="domain-heading">{group.heading}</h3>
                <p className="domain-blurb">{group.blurb}</p>
              </div>

              <div className="domain-grid">
                {group.items.map((item, i) => (
                  <article key={i} className="domain-card">
                    {item.tag && <span className="domain-tag">{item.tag}</span>}
                    <h4 className="domain-card-title">{item.title}</h4>
                    <p className="domain-card-desc">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
