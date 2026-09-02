import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";
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

          {sections.map((sec) => (
            <section key={sec.heading} className="mak-article-block">
              <h2 className="mak-article-h2">{sec.heading}</h2>
              <p className="mak-article-body">{sec.body}</p>
            </section>
          ))}

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
