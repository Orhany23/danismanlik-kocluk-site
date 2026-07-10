"use client";

import { useState, useSyncExternalStore } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { BrainCircuit, ListChecks, Clock, Plus, Minus, FlaskConical, ArrowUpRight } from "lucide-react";
import { getDailyStudy } from "@/lib/dailyResearch";

// Sunucuda false, istemcide (hydration sonrası) true döner. Günün araştırması
// tarihe bağlı olduğundan SSR/istemci uyuşmazlığını böyle önleriz.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const articleIcons = [
  <BrainCircuit key="0" strokeWidth={1.6} />,
  <ListChecks key="1" strokeWidth={1.6} />,
];

export default function ArticlesSection() {
  const { dict } = useLocale();
  const t = dict.articles;
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  // Günün araştırması banner'ındaki "detaylı incele" bölümünün aç/kapa durumu.
  const [dailyOpen, setDailyOpen] = useState(false);
  // Günün araştırması istemcide tarihe göre hesaplanır; mount olana kadar
  // banner render edilmez (hydration uyuşmazlığını önlemek için).
  const mounted = useMounted();
  const daily = mounted ? getDailyStudy().study : null;

  const toggle = (i: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section id="articles" className="section" aria-labelledby="articles-title">
      <div className="container">
        <div className="mb-12">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="articles-title" style={{ maxWidth: 720 }} dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="section-sub" style={{ maxWidth: 560 }}>{t.subtitle}</p>
        </div>
        {daily && (
          <div className="article-daily">
            <div className="article-daily-head">
              <span className="article-daily-badge">
                <FlaskConical strokeWidth={1.6} aria-hidden="true" />
                {t.daily.badge}
              </span>
              <span className="article-daily-note">{t.daily.rotateNote}</span>
            </div>
            <p className="article-daily-intro">{t.daily.intro}</p>
            <h3 className="article-daily-title">{daily.t}</h3>
            <p className="article-daily-meta">{daily.r} · {daily.y}</p>
            <p className="article-daily-summary">{daily.s}</p>
            <button
              className="article-daily-toggle"
              onClick={() => setDailyOpen((v) => !v)}
              aria-expanded={dailyOpen}
              aria-controls="daily-detail"
            >
              <span>{dailyOpen ? t.daily.detailsClose : t.daily.detailsOpen}</span>
              {dailyOpen ? <Minus strokeWidth={2} aria-hidden="true" /> : <Plus strokeWidth={2} aria-hidden="true" />}
            </button>
            <div
              id="daily-detail"
              className={`article-daily-detail ${dailyOpen ? "open" : ""}`}
            >
              <div className="article-daily-detail-inner">
                <h4 className="article-daily-section-title">{t.daily.sections.purpose}</h4>
                <p className="article-daily-section-text">{daily.a}</p>
                <h4 className="article-daily-section-title">{t.daily.sections.method}</h4>
                <p className="article-daily-section-text">{daily.m}</p>
                <h4 className="article-daily-section-title">{t.daily.sections.findings}</h4>
                <p className="article-daily-section-text">{daily.f}</p>
                <h4 className="article-daily-section-title">{t.daily.sections.interpretation}</h4>
                <p className="article-daily-section-text">{daily.p}</p>
              </div>
            </div>
            <a
              className="article-daily-link"
              href={daily.u}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{t.daily.sourceCta}</span>
              <ArrowUpRight strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        )}
        <div className="article-grid">
          {t.items.map((item, i) => {
            const open = openSet.has(i);
            return (
              <article key={i} className={`article-card ${open ? "open" : ""}`}>
                <div className="article-card-head">
                  <span className="article-card-icon" aria-hidden="true">{articleIcons[i % articleIcons.length]}</span>
                  <span className="article-tag">{item.category}</span>
                </div>
                <h3 className="article-title">{item.title}</h3>
                <p className="article-meta">
                  <Clock strokeWidth={1.6} aria-hidden="true" />
                  <span>{item.readTime} {t.readTimeLabel}</span>
                </p>
                <p className="article-excerpt">{item.excerpt}</p>
                <div
                  id={`article-panel-${i}`}
                  className={`article-panel ${open ? "open" : ""}`}
                >
                  <div className="article-panel-inner">
                    <div className="article-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </div>
                <button
                  className="article-toggle"
                  onClick={() => toggle(i)}
                  aria-expanded={open}
                  aria-controls={`article-panel-${i}`}
                >
                  <span>{open ? t.readLess : t.readMore}</span>
                  {open ? <Minus strokeWidth={2} aria-hidden="true" /> : <Plus strokeWidth={2} aria-hidden="true" />}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
