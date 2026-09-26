import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft, ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { getAllStudies, getStudyBySlug } from "@/lib/dailyResearch";
import ShareButtons from "@/components/ShareButtons";

const SITE = "https://psdorhanyasli.com.tr";

export function generateStaticParams() {
  return getAllStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudyBySlug(slug);
  if (!study) return { title: "Araştırma bulunamadı" };

  const description = study.s.length > 155 ? `${study.s.slice(0, 152)}...` : study.s;
  const title = `${study.t} — ${study.r} (${study.y})`;

  return {
    title: `${title} | Orhan Yaşlı`,
    description,
    alternates: { canonical: `/makaleler/${study.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/makaleler/${study.slug}`,
    },
  };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getStudyBySlug(slug);
  if (!study) notFound();

  const all = getAllStudies();
  const prev = all[(study.index - 1 + all.length) % all.length];
  const next = all[(study.index + 1) % all.length];

  const sections = [
    { heading: "Araştırmanın Amacı", body: study.a },
    { heading: "Yöntem", body: study.m },
    { heading: "Bulgular", body: study.f },
    { heading: "Yorum ve Bugüne Etkisi", body: study.p },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: study.t,
    abstract: study.s,
    inLanguage: "tr",
    about: { "@type": "Thing", name: study.t },
    author: { "@type": "Person", name: study.r },
    datePublished: String(study.y),
    citation: study.u,
    url: `${SITE}/makaleler/${study.slug}`,
    isPartOf: {
      "@type": "Collection",
      name: "Psikoloji Araştırmaları",
      url: `${SITE}/makaleler`,
    },
    publisher: { "@type": "Person", name: "Orhan Yaşlı", url: SITE },
  };

  return (
    <main className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <article className="mak-article">
          <nav className="mak-crumb" aria-label="Konum">
            <Link href="/makaleler">Makaleler</Link>
            <span aria-hidden="true">/</span>
            <span>{study.t}</span>
          </nav>

          <span className="mak-card-badge">
            <FlaskConical strokeWidth={1.6} aria-hidden="true" />
            Araştırma {study.index + 1} / {all.length}
          </span>

          <h1 className="mak-article-title">{study.t}</h1>
          <p className="mak-article-meta">
            {study.r} · {study.y}
          </p>

          <p className="mak-article-lead">{study.s}</p>

          {sections.map((sec, idx) => {
            const isTakeaway = idx === 3;
            if (isTakeaway) {
              return (
                <section
                  key={sec.heading}
                  className="mak-article-block"
                  style={{
                    padding: "24px 28px",
                    borderRadius: 16,
                    background: "var(--clr-surface)",
                    border: "1px solid var(--clr-border)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    marginTop: 32,
                    marginBottom: 32,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, color: "var(--clr-primary)" }}>
                    <Sparkles size={20} strokeWidth={2} aria-hidden="true" />
                    <h2
                      className="mak-article-h2"
                      style={{
                        margin: 0,
                        fontSize: "1.15rem",
                        color: "var(--clr-text)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      Öğrencinin ve Sınavın Hayatına Yansıması
                    </h2>
                  </div>
                  <p className="mak-article-body" style={{ margin: 0, color: "var(--clr-text2)", lineHeight: 1.75 }}>
                    {sec.body}
                  </p>
                </section>
              );
            }

            return (
              <section key={sec.heading} className="mak-article-block">
                <h2 className="mak-article-h2">{sec.heading}</h2>
                <p className="mak-article-body">{sec.body}</p>
              </section>
            );
          })}

          <a
            className="mak-source"
            href={study.u}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <span>Kaynağı görüntüle</span>
            <ArrowUpRight strokeWidth={2} aria-hidden="true" />
          </a>

          <ShareButtons url={`${SITE}/makaleler/${study.slug}`} title={study.t} />

          <nav className="mak-pager" aria-label="Diğer araştırmalar">
            <Link href={`/makaleler/${prev.slug}`} className="mak-pager-link">
              <ArrowLeft strokeWidth={2} aria-hidden="true" />
              <span>
                <small>Önceki</small>
                {prev.t}
              </span>
            </Link>
            <Link href={`/makaleler/${next.slug}`} className="mak-pager-link mak-pager-next">
              <span>
                <small>Sonraki</small>
                {next.t}
              </span>
              <ArrowRight strokeWidth={2} aria-hidden="true" />
            </Link>
          </nav>

          <Link href="/makaleler" className="btn btn-outline mak-back">
            Tüm araştırmalara dön
          </Link>
        </article>
      </div>
    </main>
  );
}
