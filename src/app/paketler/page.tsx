import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import { dictionaries } from "@/lib/i18n";

const SITE = "https://psdorhanyasli.com.tr";
const WA_NUMBER = "905432500417";

export const metadata: Metadata = {
  title: "Koçluk ve Danışmanlık Paketleri | Orhan Yaşlı",
  description:
    "Sınav ve öğrenci koçluğu paketi ile psikolojik danışmanlık paketinin kapsamı, çalışma biçimi ve ücreti. Çanakkale'de yüz yüze, Türkiye genelinde online. İlk görüşme ücretsizdir.",
  alternates: { canonical: "/paketler" },
  openGraph: {
    title: "Koçluk ve Danışmanlık Paketleri",
    description:
      "İki paketin kapsamı ve çalışma biçimi. Çanakkale yüz yüze, Türkiye geneli online. İlk görüşme ücretsizdir.",
    type: "website",
    url: "/paketler",
  },
};

export default function PaketlerPage() {
  const t = dictionaries.tr.packages;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Koçluk ve Danışmanlık Paketleri",
    itemListElement: t.items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: p.title,
        description: p.desc,
        serviceType: p.badge,
        url: `${SITE}/paketler#${p.key}`,
        areaServed: { "@type": "Country", name: "Türkiye" },
        provider: { "@type": "Person", name: "Orhan Yaşlı", url: SITE },
        ...(p.price
          ? {
              offers: {
                "@type": "Offer",
                price: "7000",
                priceCurrency: "TRY",
                url: `${SITE}/paketler#${p.key}`,
              },
            }
          : {}),
      },
    })),
  };

  return (
    <main className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <header className="pkg-page-head">
          <span className="section-label">{t.label}</span>
          <h1
            className="section-title"
            style={{ maxWidth: 760 }}
            dangerouslySetInnerHTML={{ __html: t.title }}
          />
          <p className="section-sub">{t.subtitle}</p>
        </header>

        {t.items.map((p) => (
          <section key={p.key} id={p.key} className="pkg-detail-block" aria-labelledby={`${p.key}-title`}>
            <div className="pkg-detail-main">
              <span className="pkg-badge">{p.badge}</span>
              <h2 className="pkg-detail-title" id={`${p.key}-title`}>
                {p.title}
              </h2>
              <p className="pkg-detail-desc">{p.desc}</p>

              <ul className="pkg-meta">
                {p.meta.map((m, j) => (
                  <li key={j}>{m}</li>
                ))}
              </ul>

              <p className="pkg-includes-label">{t.includesLabel}</p>
              <ul className="pkg-includes">
                {p.includes.map((inc, j) => (
                  <li key={j}>
                    <Check strokeWidth={2.4} aria-hidden="true" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="pkg-detail-side">
              {p.price ? (
                <span className="pkg-price pkg-price--lg">
                  <strong>{p.price}</strong>
                  <small>{p.priceUnit}</small>
                </span>
              ) : (
                <span className="pkg-price pkg-price--quote">{p.priceNote}</span>
              )}

              <a
                className="btn btn-primary pkg-btn"
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(p.waText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle strokeWidth={2} aria-hidden="true" />
                {t.infoCta}
              </a>
              <Link className="btn btn-outline pkg-btn" href="/#contact">
                Form ile ulaş
              </Link>
              <p className="pkg-side-note">İlk görüşme ücretsizdir.</p>
            </aside>
          </section>
        ))}

        <p className="pkg-note pkg-note--page">{t.note}</p>

        <Link href="/#services" className="pkg-compare">
          Tüm hizmetleri incele
          <ArrowRight strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
