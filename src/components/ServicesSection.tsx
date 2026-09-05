"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  Target, CalendarCheck, School, Compass, BookOpen,
  UserRound, Wind, Brain, Puzzle, Home, HeartHandshake, Video,
  ChevronDown,
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

// Her grupta önce 3 kart görünür; gerisi istek üzerine açılır
// (NN/g progressive disclosure — 12 kartlık duvar tarama yükünü artırıyordu).
const PREVIEW_COUNT = 3;

// Lüks/sinematik his: kart üzerinde imlecin konumuna göre hafif 3D tilt
// ve ışık parıltısı (glint). Dokunmatik cihazlarda CSS ile devre dışı kalır.
function handleCardTilt(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const cx = r.width / 2;
  const cy = r.height / 2;
  const rx = ((y - cy) / cy) * -4;
  const ry = ((x - cx) / cx) * 4;
  el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
}
function resetCardTilt(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.transform = "rotateX(0) rotateY(0) translateY(0)";
}

export default function ServicesSection() {
  const { dict } = useLocale();
  const t = dict.services;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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
        const isOpen = !!expanded[group.key];
        const visible = isOpen ? group.items : group.items.slice(0, PREVIEW_COUNT);
        const hidden = group.items.length - PREVIEW_COUNT;
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

              <div className="domain-grid" id={`domain-grid-${group.key}`}>
                {visible.map((item, i) => (
                  <article
                    key={i}
                    className={`domain-card reveal delay-${(i % 3) + 1}`}
                    onMouseMove={handleCardTilt}
                    onMouseLeave={resetCardTilt}
                  >
                    <div className="domain-card-top">
                      <span className="domain-card-icon">{groupIcons[group.key]?.[i]}</span>
                      {item.tag && <span className="domain-tag">{item.tag}</span>}
                    </div>
                    <h4 className="domain-card-title">{item.title}</h4>
                    <p className="domain-card-desc">{item.desc}</p>
                  </article>
                ))}
              </div>

              {hidden > 0 && (
                <button
                  type="button"
                  className="domain-more"
                  aria-expanded={isOpen}
                  aria-controls={`domain-grid-${group.key}`}
                  onClick={() => setExpanded((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
                >
                  <span>{isOpen ? t.showLess : `${t.showAll} (${group.items.length})`}</span>
                  <ChevronDown
                    strokeWidth={2}
                    aria-hidden="true"
                    className={isOpen ? "domain-more-icon is-open" : "domain-more-icon"}
                  />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
