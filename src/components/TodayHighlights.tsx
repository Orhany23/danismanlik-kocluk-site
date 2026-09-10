"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import {
  FlaskConical, ArrowUpRight, ArrowRight, Plus, Minus,
  Sparkles, BookOpen, Target, Zap, Quote,
} from "lucide-react";
import { getDailyStudy, poolSize, slugify } from "@/lib/dailyResearch";
import { getDailySpark, sparkPoolSize, type SparkKind } from "@/lib/dailyKivilcim";

// Sunucuda false, istemcide (hydration sonrası) true. Her iki günlük içerik
// de tarihe bağlı hesaplandığından SSR/istemci uyuşmazlığını böyle önleriz.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const KIND_ICON: Record<SparkKind, React.ReactNode> = {
  motivasyon: <Sparkles strokeWidth={1.7} aria-hidden="true" />,
  hikaye: <BookOpen strokeWidth={1.7} aria-hidden="true" />,
  teknik: <Target strokeWidth={1.7} aria-hidden="true" />,
  taktik: <Zap strokeWidth={1.7} aria-hidden="true" />,
};

/* Günün Makalesi: psikolojinin klasik araştırmalarından biri, amaç/yöntem/
   bulgu/yorum bölümleriyle. Daha önce ayrı bir "Makaleler" bölümünde ana
   sayfadaydı; o bölüm kaldırılınca bu kart da tamamen görünmez olmuştu —
   şimdi sayfanın en üstünde, günün notuyla yan yana. */
function DailyArticleCard() {
  const { dict } = useLocale();
  const t = dict.articles;
  const tt = dict.today;
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const data = mounted ? getDailyStudy() : null;
  const daily = data?.study ?? null;
  const index = data?.index ?? 0;

  if (!daily) return null;

  return (
    <div className="article-daily today-card">
      <div className="article-daily-head">
        <span className="article-daily-badge">
          <FlaskConical strokeWidth={1.6} aria-hidden="true" />
          {t.daily.badge}
        </span>
        <div className="article-daily-head-right">
          <span className="article-daily-series" aria-label={`${t.daily.badge} ${index + 1} / ${poolSize}`}>
            {index + 1} / {poolSize}
          </span>
          <span className="article-daily-note">{t.daily.rotateNote}</span>
        </div>
      </div>
      <div className="article-daily-progress" aria-hidden="true">
        <i style={{ width: `${((index + 1) / poolSize) * 100}%` }} />
      </div>
      <p className="article-daily-intro">{t.daily.intro}</p>
      <h3 className="article-daily-title">{daily.t}</h3>
      <p className="article-daily-meta">{daily.r} · {daily.y}</p>
      <p className="article-daily-summary">{daily.s}</p>

      <button
        className="article-daily-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="today-daily-detail"
      >
        <span>{open ? t.daily.detailsClose : t.daily.detailsOpen}</span>
        {open ? <Minus strokeWidth={2} aria-hidden="true" /> : <Plus strokeWidth={2} aria-hidden="true" />}
      </button>
      <div id="today-daily-detail" className={`article-daily-detail ${open ? "open" : ""}`}>
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

      <div className="article-daily-actions">
        <Link className="article-daily-page" href={`/makaleler/${slugify(daily.t)}`}>
          <span>{tt.articlePageLink}</span>
          <ArrowRight strokeWidth={2} aria-hidden="true" />
        </Link>
        <a className="article-daily-link" href={daily.u} target="_blank" rel="noopener noreferrer">
          <span>{t.daily.sourceCta}</span>
          <ArrowUpRight strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/* Günün Notu (Kıvılcım): motivasyon sözü / kısa hikaye / soru çözüm tekniği /
   pratik taktik — dördü de aynı havuzdan, güne göre döner. id="spark":
   DiscoverStrip'teki "Günün kıvılcımı" bağlantısı buraya kaydırır. */
function DailySparkCard() {
  const { dict } = useLocale();
  const t = dict.spark;
  const mounted = useMounted();
  const data = mounted ? getDailySpark() : null;
  const spark = data?.spark ?? null;
  const index = data?.index ?? 0;

  if (!spark) return null;

  return (
    <div id="spark" className={`spark-card today-card spark-${spark.k}`}>
      <div className="spark-head">
        <span className="spark-badge">
          {KIND_ICON[spark.k]}
          {t.kinds[spark.k]}
        </span>
        <span className="spark-today">
          {t.todayLabel} · {index + 1} / {sparkPoolSize}
        </span>
      </div>

      {spark.k === "motivasyon" ? (
        <blockquote className="spark-quote">
          <Quote className="spark-quote-mark" strokeWidth={1.4} aria-hidden="true" />
          {spark.t}
        </blockquote>
      ) : (
        <div className="spark-item">
          <h3 className="spark-item-title">{spark.t}</h3>
          {spark.c && <p className="spark-item-body">{spark.c}</p>}
        </div>
      )}

      <div className="spark-foot">
        <span className="spark-dot" aria-hidden="true" />
        {t.rotateNote}
      </div>
    </div>
  );
}

export default function TodayHighlights() {
  const { dict } = useLocale();
  const t = dict.today;

  return (
    <section id="today" className="section today-section" aria-labelledby="today-title">
      <div className="container">
        <div className="mb-12 reveal">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="today-title" style={{ maxWidth: 720 }}>{t.title}</h2>
          <p className="section-sub" style={{ maxWidth: 560 }}>{t.subtitle}</p>
        </div>
        <div className="today-grid">
          <div className="reveal-left">
            <DailyArticleCard />
          </div>
          <div className="reveal-right">
            <DailySparkCard />
          </div>
        </div>
      </div>
    </section>
  );
}
