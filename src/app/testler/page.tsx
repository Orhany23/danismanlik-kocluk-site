import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, Activity, HeartHandshake, GraduationCap } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { getTestBySlug } from "@/lib/psychTests";

export const metadata: Metadata = {
  title: "Psikolojik Değerlendirme ve Testler | Orhan Yaşlı",
  description:
    "Panik atak, agorafobi, duygudurum, anksiyete ve sınav koçluğuna yönelik yapılandırılmış öz-değerlendirme testleri. Sonuçlar danışmanınız Orhan Yaşlı'nın paneline güvenle aktarılır.",
  alternates: { canonical: "/testler" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type TestSection = {
  id: string;
  title: string;
  badge: string;
  icon: typeof Activity;
  desc: string;
  slugs: string[];
};

const SECTIONS: TestSection[] = [
  {
    id: "panik-atak",
    title: "Panik Atak ve Agorafobi Değerlendirmeleri",
    badge: "Panik Atak",
    icon: Activity,
    desc: "Panik atak sıklığını, atak anındaki bedensel duyumları (çarpıntı, nefes darlığı vb.), felaketleştirici düşünceleri ve agorafobik kaçınmaları değerlendiren yapılandırılmış klinik ölçekler.",
    slugs: [
      "panik-bozuklugu-siddet-olcegi",
      "beden-duyumlari-olcegi",
      "dsm5-panik-bozukluk-olcegi",
      "agorafobik-bilisler-olcegi",
    ],
  },
  {
    id: "duygudurum-ve-kaygi",
    title: "Duygudurum ve Psikolojik Değerlendirme",
    badge: "Psikolojik Destek",
    icon: HeartHandshake,
    desc: "Depresyon, yaygın anksiyete, umutsuzluk ve genel ruhsal iyi oluş düzeyini değerlendiren geçerliliği kanıtlanmış ölçekler.",
    slugs: [
      "beck-depresyon-envanteri",
      "beck-anksiyete-olcegi",
      "beck-umutsuzluk-olcegi",
      "genel-kaygi-taramasi",
      "iyi-olus-endeksi",
    ],
  },
  {
    id: "sinav-ve-ogrenci-koclugu",
    title: "Öğrenci ve Sınav Koçluğu",
    badge: "Sınav Koçluğu",
    icon: GraduationCap,
    desc: "Sınav kaygısı ve bireysel çalışma/öğrenme stillerini keşfetmeye yönelik değerlendirmeler.",
    slugs: [
      "sinav-kaygisi",
      "ogrenme-stili",
    ],
  },
];

export default async function TestlerPage() {
  const student = await requireStudent();
  if (!student) redirect("/ogrenci/giris");

  return (
    <main className="section">
      <div className="container">
        <header className="mak-head">
          <span className="section-label">Öz-Değerlendirme Testleri</span>
          <h1 className="section-title" style={{ maxWidth: 780 }}>
            Kendini Tanımak ve Durumunu Anlamak İçin <em>Yapılandırılmış Testler</em>
          </h1>
          <p className="section-sub">
            Bu testler tanı aracı değildir; farkındalık sağlamak ve danışmanlık sürecindeki yol haritanızı netleştirmek amacıyla uygulanır.
            Testleri tamamladığınızda sonuçlar ve değerlendirmeler doğrudan danışmanınız <strong>Orhan Yaşlı</strong>&apos;nın paneline iletilir.
          </p>
        </header>

        <div className="test-sections" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {SECTIONS.map((sec) => {
            const tests = sec.slugs
              .map((slug) => getTestBySlug(slug))
              .filter((t): t is NonNullable<typeof t> => Boolean(t));
            if (tests.length === 0) return null;
            const Icon = sec.icon;

            return (
              <section key={sec.id} aria-labelledby={`sec-${sec.id}`} className="test-section-group">
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span className="mak-card-badge" style={{ margin: 0 }}>
                      <Icon strokeWidth={1.8} size={15} aria-hidden="true" />
                      {sec.badge}
                    </span>
                  </div>
                  <h2
                    id={`sec-${sec.id}`}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.25rem, 2.5vw, 1.55rem)",
                      fontWeight: 700,
                      color: "var(--clr-text)",
                      margin: "0 0 6px 0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {sec.title}
                  </h2>
                  <p style={{ margin: 0, fontSize: "0.93rem", color: "var(--clr-text3)", maxWidth: 720, lineHeight: 1.6 }}>
                    {sec.desc}
                  </p>
                </div>

                <ol className="test-grid" aria-label={sec.title}>
                  {tests.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/testler/${t.slug}`} className="mak-card">
                        <span className="mak-card-badge">
                          <ClipboardList strokeWidth={1.6} aria-hidden="true" />
                          {t.category}
                        </span>
                        <h3 className="mak-card-title">{t.title}</h3>
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
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
