"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { BrainCircuit, ListChecks, Clock, Plus, Minus } from "lucide-react";

const articleIcons = [
  <BrainCircuit key="0" strokeWidth={1.6} />,
  <ListChecks key="1" strokeWidth={1.6} />,
];

export default function ArticlesSection() {
  const { dict } = useLocale();
  const t = dict.articles;
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

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
                  className="article-panel"
                  style={{ maxHeight: open ? "900px" : "0px" }}
                >
                  <div className="article-content" dangerouslySetInnerHTML={{ __html: item.content }} />
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
