"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { Sparkles, BookOpen, Target, Zap, Quote } from "lucide-react";
import { getDailySpark, sparkPoolSize, type SparkKind } from "@/lib/dailyKivilcim";

// Sunucuda false, istemcide (hydration sonrası) true. Kıvılcım tarihe bağlı
// olduğundan SSR/istemci uyuşmazlığını böyle önleriz (ArticlesSection deseni).
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

export default function DailySpark() {
  const { dict } = useLocale();
  const t = dict.spark;
  const mounted = useMounted();
  const data = mounted ? getDailySpark() : null;
  const spark = data?.spark ?? null;
  const index = data?.index ?? 0;

  return (
    <section id="spark" className="section" aria-labelledby="spark-title">
      <div className="container">
        <div className="mb-12 reveal">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="spark-title" style={{ maxWidth: 720 }}>{t.title}</h2>
          <p className="section-sub" style={{ maxWidth: 560 }}>{t.subtitle}</p>
        </div>

        {spark && (
          <div className={`spark-card spark-${spark.k}`}>
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
        )}
      </div>
    </section>
  );
}
