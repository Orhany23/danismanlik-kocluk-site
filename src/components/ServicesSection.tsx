"use client";

import { useLocale } from "@/components/LocaleProvider";
import {
  Target, CalendarCheck, School, Compass, BookOpen,
  UserRound, Wind, Brain, Puzzle, Home, HeartHandshake, Video,
} from "lucide-react";
import PsiMark from "@/components/PsiMark";

const groupIcons: Record<string, React.ReactNode[]> = {
  academic: [
    <Target key="a0" strokeWidth={1.6} />,
    <CalendarCheck key="a1" strokeWidth={1.6} />,
    <School key="a2" strokeWidth={1.6} />,
    <Compass key="a3" strokeWidth={1.6} />,
    <BookOpen key="a4" strokeWidth={1.6} />,
  ],
  counseling: [
    <UserRound key="c0" strokeWidth={1.6} />,
    <Wind key="c1" strokeWidth={1.6} />,
    <Brain key="c2" strokeWidth={1.6} />,
    <Puzzle key="c3" strokeWidth={1.6} />,
    <Home key="c4" strokeWidth={1.6} />,
    <HeartHandshake key="c5" strokeWidth={1.6} />,
    <Video key="c6" strokeWidth={1.6} />,
  ],
};

export default function ServicesSection() {
  const { dict } = useLocale();
  const t = dict.services;

  return (
    <section id="services" aria-labelledby="services-title">
      {/* Section intro */}
      <div className="section" style={{ paddingBottom: 48 }}>
        <div className="container reveal">
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
            {inverted && <PsiMark className="psi-mark psi-ink" />}
            <div className="container">
              <div className="domain-head reveal">
                <span className="domain-eyebrow">{group.eyebrow}</span>
                <h3 className="domain-heading">{group.heading}</h3>
                <p className="domain-blurb">{group.blurb}</p>
              </div>

              <div className="domain-grid">
                {group.items.map((item, i) => (
                  <article key={i} className={`domain-card reveal delay-${(i % 3) + 1}`}>
                    <div className="domain-card-top">
                      <span className="domain-card-icon">{groupIcons[group.key]?.[i]}</span>
                      {item.tag && <span className="domain-tag">{item.tag}</span>}
                    </div>
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
