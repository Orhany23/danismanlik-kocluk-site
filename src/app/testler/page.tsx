import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, Activity, HeartHandshake, GraduationCap, Lock, LogIn } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { getTestBySlug } from "@/lib/psychTests";

export const metadata: Metadata = {
  title: "Psikolojik Değerlendirme ve Testler | Orhan Yaşlı",
  description:
    "Panik atak, agorafobi, duygudurum, anksiyete ve sınav koçluğuna yönelik yapılandırılmış öz-değerlendirme testleri. Sonuçlar danışmanınız Orhan Yaşlı'nın paneline güvenle aktarılır.",
  alternates: { canonical: "/testler" },
  robots: { index: true, follow: true },
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
            Testleri tamamladığınızda sonuçlar doğrudan danışmanınız <strong>Orhan Yaşlı</strong>&apos;nın paneline iletilir.
          </p>
        </header>

        {!student && (
          <div
            style={{
              marginBottom: 36,
              padding: "20px 24px",
              borderRadius: 16,
              background: "var(--clr-surface)",
              border: "1px solid var(--clr-border)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--clr-primary)" }}>
              <Lock size={18} strokeWidth={2} aria-hidden="true" />
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Öğrenci & Danışan Girişi Gerekir</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--clr-text2)", lineHeight: 1.6 }}>
              Aşağıdaki testler; seans öncesi durum tespiti ve danışan takip süreçlerimizi yapılandırmak için kullanılır.
              Etik standartlar gereği test puanları öğrencilere gösterilmez; doğrudan danışmanınız <strong>Orhan Yaşlı</strong>&apos;nın paneline aktarılır ve görüşmelerinizde birlikte değerlendirilir.
              Testleri uygulamak için öğrenci hesabınızla giriş yapabilirsiniz.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
              <Link
                href="/ogrenci/giris?callbackUrl=/testler"
                className="btn btn-primary"
                style={{ fontSize: "0.88rem", padding: "8px 18px" }}
              >
                <LogIn size={15} strokeWidth={2} aria-hidden="true" style={{ marginRight: 6 }} />
                Öğrenci Girişi Yap
              </Link>
              <Link
                href="/#contact"
                className="btn btn-secondary"
                style={{ fontSize: "0.88rem", padding: "8px 18px" }}
              >
                Danışmanlık Almak İçin İletişime Geç
              </Link>
            </div>
          </div>
        )}

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
                  {tests.map((t) => {
                    const cardHref = student ? `/testler/${t.slug}` : `/ogrenci/giris?callbackUrl=/testler/${t.slug}`;
                    return (
                      <li key={t.slug}>
                        <Link href={cardHref} className="mak-card">
                          <span className="mak-card-badge">
                            <ClipboardList strokeWidth={1.6} aria-hidden="true" />
                            {t.category}
                          </span>
                          <h3 className="mak-card-title">{t.title}</h3>
                          <p className="mak-card-meta">Yaklaşık {t.estimatedMinutes} dakika</p>
                          <p className="mak-card-excerpt">{t.shortDesc}</p>
                          <span className="mak-card-more">
                            {student ? "Teste başla" : "Giriş yap ve başla"}
                            <ArrowUpRight strokeWidth={2} aria-hidden="true" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
