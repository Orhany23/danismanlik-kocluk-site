"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { ArrowRight, BookOpen, CalendarDays, Sparkles } from "lucide-react";

const ITEM_ICON: Record<string, React.ReactNode> = {
  articles: <BookOpen strokeWidth={1.7} aria-hidden="true" />,
  exams: <CalendarDays strokeWidth={1.7} aria-hidden="true" />,
  spark: <Sparkles strokeWidth={1.7} aria-hidden="true" />,
};

// Makale bölümünün tamamı ana sayfadan çıktı; yerine üç kısa giriş noktası.
// Sayfa yükünü artırmadan içeriğe yol gösterir (progressive disclosure).
export default function DiscoverStrip() {
  const { dict } = useLocale();
  const t = dict.discover;

  const hrefFor = (key: string) =>
    key === "articles" ? "/makaleler" : key === "exams" ? "#exams" : "#spark";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    if (key === "articles") return;
    e.preventDefault();
    const id = key === "exams" ? "exams" : "spark";
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="discover" className="section discover-section" aria-labelledby="discover-title">
      <div className="container">
        <div className="discover-head reveal">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title discover-title" id="discover-title">{t.title}</h2>
        </div>
        <div className="discover-grid">
          {t.items.map((item, i) => (
            <Link
              key={item.key}
              href={hrefFor(item.key)}
              onClick={(e) => handleClick(e, item.key)}
              className={`discover-card reveal delay-${(i % 3) + 1}`}
            >
              <span className="discover-icon">{ITEM_ICON[item.key]}</span>
              <span className="discover-card-title">{item.title}</span>
              <span className="discover-card-desc">{item.desc}</span>
              <span className="discover-card-cta">
                {item.cta}
                <ArrowRight strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
