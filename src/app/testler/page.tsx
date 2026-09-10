import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { PSYCH_TESTS } from "@/lib/psychTests";

export const metadata: Metadata = {
  title: "Psikolojik Testler | Orhan Yaşlı",
  description:
    "Sınav kaygısı, genel kaygı ve öğrenme stili için ücretsiz öz-değerlendirme testleri. Sonuçlar danışmanlık sürecinde birlikte değerlendirilmek üzere hesabına kaydedilir.",
  alternates: { canonical: "/testler" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TestlerPage() {
  const student = await requireStudent();
  if (!student) redirect("/ogrenci/giris");

  return (
    <main className="section">
      <div className="container">
        <header className="mak-head">
          <span className="section-label">Testler</span>
          <h1 className="section-title" style={{ maxWidth: 780 }}>
            Kendini Tanımak İçin <em>Kısa Testler</em>
          </h1>
          <p className="section-sub">
            Bu testler tanı aracı değildir; sadece farkındalık kazanmanı sağlar. Sonuçların,
            danışmanlık sürecinde Orhan Yaşlı ile birlikte değerlendirilmek üzere hesabına
            kaydedildiğini unutma.
          </p>
        </header>

        <ol className="test-grid" aria-label="Test listesi">
          {PSYCH_TESTS.map((t) => (
            <li key={t.slug}>
              <Link href={`/testler/${t.slug}`} className="mak-card">
                <span className="mak-card-badge">
                  <ClipboardList strokeWidth={1.6} aria-hidden="true" />
                  {t.category}
                </span>
                <h2 className="mak-card-title">{t.title}</h2>
                <p className="mak-card-meta">Yaklaşık {t.estimatedMinutes} dakika</p>
                <p className="mak-card-excerpt">{t.shortDesc}</p>
                <span className="mak-card-more">
                  Teste başla
                  <ArrowUpRight strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
