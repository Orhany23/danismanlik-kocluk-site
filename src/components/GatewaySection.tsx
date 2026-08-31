"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { ArrowRight, Check, GraduationCap, HeartHandshake, Lock } from "lucide-react";

const DOOR_ICON: Record<string, React.ReactNode> = {
  kocluk: <GraduationCap strokeWidth={1.7} aria-hidden="true" />,
  danismanlik: <HeartHandshake strokeWidth={1.7} aria-hidden="true" />,
};

/**
 * "İki kapı" — ziyaretçi hero'dan sonra tek bir soruya cevap verir:
 * koçluk mu, danışmanlık mı? (GOV.UK: bir sayfada tek belirgin sonraki adım.)
 */
export default function GatewaySection() {
  const { dict } = useLocale();
  const t = dict.gateway;

  return (
    <section id="gateway" className="section" aria-labelledby="gateway-title">
      <div className="container">
        <div className="mb-10 reveal">
          <span className="section-label">{t.label}</span>
          <h2
            className="section-title"
            id="gateway-title"
            style={{ maxWidth: 720 }}
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="section-sub" style={{ maxWidth: 620 }}>{t.subtitle}</p>
        </div>

        <div className="gateway-grid">
          {t.doors.map((door, i) => (
            <article key={door.key} className={`gateway-card reveal delay-${i + 1}`}>
              <span className="gateway-icon">{DOOR_ICON[door.key]}</span>
              <span className="gateway-eyebrow">{door.eyebrow}</span>
              <h3 className="gateway-title">{door.title}</h3>
              <p className="gateway-desc">{door.desc}</p>
              <ul className="gateway-points">
                {door.points.map((point, j) => (
                  <li key={j}>
                    <Check strokeWidth={2.4} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {door.note && (
                <p className="gateway-note">
                  <Lock strokeWidth={1.8} aria-hidden="true" />
                  <span>{door.note}</span>
                </p>
              )}
              <Link href={door.href} className="gateway-cta">
                {door.cta}
                <ArrowRight strokeWidth={2} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
