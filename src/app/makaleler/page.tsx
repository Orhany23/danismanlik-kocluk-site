import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, ArrowUpRight, BookOpen } from "lucide-react";
import { getAllStudies } from "@/lib/dailyResearch";
import { dictionaries } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Psikoloji Araştırmaları ve Çalışma Rehberleri | Orhan Yaşlı",
  description:
    "Psikolojinin dönüm noktası olmuş klasik araştırmalar — amacı, yöntemi, bulguları ve kaynağıyla sade Türkçe özetler. Ayrıca bilimsel temelli çalışma rehberleri.",
  alternates: { canonical: "/makaleler" },
  openGraph: {
    title: "Psikoloji Araştırmaları ve Çalışma Rehberleri",
    description:
      "Psikolojinin klasik araştırmaları, amacı ve bulgularıyla sade Türkçe özetler.",
    type: "website",
    url: "/makaleler",
  },
};

export default function MakalelerPage() {
  const studies = getAllStudies();
  const guides = dictionaries.tr.articles.items;

  return (
    <main className="section">
      <div className="container">
        <header className="mak-head">
          <span className="section-label">Makaleler</span>
          <h1 className="section-title" style={{ maxWidth: 780 }}>
            Psikoloji Araştırmaları ve{" "}
            <em>Çalışma Rehberleri</em>
          </h1>
          <p className="section-sub">
            Psikolojinin dönüm noktası olmuş {studies.length} klasik araştırmayı; amacı,
            yöntemi, bulguları ve yorumuyla birlikte sade bir dille özetledim. Her birinin
            sonunda özgün kaynağa bağlantı var.
          </p>
        </header>

        <ol className="mak-grid" aria-label="Araştırma listesi">
          {studies.map((s) => (
            <li key={s.slug}>
              <Link href={`/makaleler/${s.slug}`} className="mak-card">
                <span className="mak-card-badge">
                  <FlaskConical strokeWidth={1.6} aria-hidden="true" />
                  Araştırma
                </span>
                <h2 className="mak-card-title">{s.t}</h2>
                <p className="mak-card-meta">
                  {s.r} · {s.y}
                </p>
                <p className="mak-card-excerpt">{s.s}</p>
                <span className="mak-card-more">
                  İncele
                  <ArrowUpRight strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <section className="mak-guides" aria-labelledby="mak-guides-title">
          <span className="section-label">Çalışma Rehberleri</span>
          <h2 className="section-title" id="mak-guides-title" style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)" }}>
            Uygulamaya Dönük Rehberler
          </h2>
          {guides.map((g, i) => (
            <article key={i} className="mak-guide">
              <div className="mak-guide-head">
                <span className="mak-card-badge">
                  <BookOpen strokeWidth={1.6} aria-hidden="true" />
                  {g.category}
                </span>
                <span className="mak-guide-time">
                  {g.readTime} dk okuma
                </span>
              </div>
              <h3 className="mak-guide-title">{g.title}</h3>
              <div className="article-content" dangerouslySetInnerHTML={{ __html: g.content }} />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
