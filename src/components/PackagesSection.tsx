"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { Check, ArrowRight, MessageCircle, Users, Monitor, Gift } from "lucide-react";

const WA_NUMBER = "905432500417";

const metaIcons = [
  <Users key="0" strokeWidth={1.7} aria-hidden="true" />,
  <Monitor key="1" strokeWidth={1.7} aria-hidden="true" />,
  <Gift key="2" strokeWidth={1.7} aria-hidden="true" />,
];

export default function PackagesSection() {
  const { dict } = useLocale();
  const t = dict.packages;

  return (
    <section id="packages" className="section" aria-labelledby="packages-title">
      <div className="container">
        <div className="pkg-head reveal">
          <span className="section-label">{t.label}</span>
          <h2
            className="section-title"
            id="packages-title"
            style={{ maxWidth: 720 }}
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="section-sub">{t.subtitle}</p>
        </div>

        <div className="pkg-grid">
          {t.items.map((p, i) => (
            <article key={p.key} className={`pkg-card reveal delay-${i + 1}`}>
              <span className="pkg-badge">{p.badge}</span>
              <h3 className="pkg-title">{p.title}</h3>
              <p className="pkg-desc">{p.desc}</p>

              <ul className="pkg-meta">
                {p.meta.map((m, j) => (
                  <li key={j}>
                    {metaIcons[j % metaIcons.length]}
                    {m}
                  </li>
                ))}
              </ul>

              <p className="pkg-includes-label">{t.includesLabel}</p>
              <ul className="pkg-includes">
                {p.includes.map((inc, j) => (
                  <li key={j}>
                    <Check strokeWidth={2.4} aria-hidden="true" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>

              <div className="pkg-foot">
                {p.price ? (
                  <span className="pkg-price">
                    <strong>{p.price}</strong>
                    <small>{p.priceUnit}</small>
                  </span>
                ) : (
                  <span className="pkg-price pkg-price--quote">{p.priceNote}</span>
                )}

                <div className="pkg-actions">
                  <a
                    className="btn btn-primary pkg-btn"
                    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(p.waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle strokeWidth={2} aria-hidden="true" />
                    {t.infoCta}
                  </a>
                  <Link className="pkg-detail" href={`/paketler#${p.key}`}>
                    {t.detailCta}
                    <ArrowRight strokeWidth={2} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pkg-foot-row">
          <p className="pkg-note">{t.note}</p>
          <Link href="/paketler" className="pkg-compare">
            {t.compareCta}
            <ArrowRight strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
