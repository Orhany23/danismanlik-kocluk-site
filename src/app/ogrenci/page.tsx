import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import StudentPasswordChange from "@/components/StudentPasswordChange";

export const metadata = {
  title: "Öğrenci Paneli | Orhan Yaşlı",
  robots: { index: false, follow: false },
};

type Resource = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string | null;
  body: string | null;
  category: string | null;
  pinned: boolean;
};

const TYPE_ICON: Record<string, string> = { LINK: "🔗", VIDEO: "▶", FILE: "📄", NOTE: "📝" };
const TYPE_OPEN: Record<string, string> = { LINK: "Bağlantıyı aç", VIDEO: "Videoyu izle", FILE: "Dosyayı aç" };

// Not gövdesinin sonundaki "Kaynak: <url>" satırını ayırır; varsa metni ve
// bağlantıyı ayrı döndürür, yoksa bağlantı null olur.
function splitNoteBody(body: string): { text: string; sourceUrl: string | null } {
  const match = body.match(/^Kaynak:\s*(https?:\S+)\s*$/m);
  if (!match) return { text: body, sourceUrl: null };
  const text = body.slice(0, match.index).replace(/\s+$/, "");
  return { text, sourceUrl: match[1] };
}

// Yapılandırılmış not başlıkları — bunlarla başlayan bloklar başlık + metin
// olarak render edilir, diğerleri düz paragraf kalır (eski serbest notlar bozulmaz).
const NOTE_HEADINGS = [
  "Araştırmanın Amacı",
  "Yöntem ve Denekler",
  "Bulgular ve Sonuç",
  "Psikolojik Yorum",
];

// Not gövdesini "\n\n" ile bloklara ayırır; ilk satırı bir başlıkla birebir
// eşleşen blokları <strong> başlık + <p> metin olarak render eder.
function renderNoteBody(text: string) {
  const blocks = text.split("\n\n");
  return blocks.map((block, i) => {
    const nl = block.indexOf("\n");
    const firstLine = nl === -1 ? block : block.slice(0, nl);
    if (NOTE_HEADINGS.includes(firstLine.trim())) {
      const rest = nl === -1 ? "" : block.slice(nl + 1);
      return (
        <div key={i}>
          <strong className="resource-note-heading">{firstLine.trim()}</strong>
          {rest && <p>{rest}</p>}
        </div>
      );
    }
    return <p key={i}>{block}</p>;
  });
}

function ResourceItem({ r }: { r: Resource }) {
  const note = r.type === "NOTE" && r.body ? splitNoteBody(r.body) : null;
  return (
    <div className="resource-item">
      <span className="resource-icon" aria-hidden="true">{TYPE_ICON[r.type] || "🔗"}</span>
      <div className="resource-main">
        {r.category && <span className="resource-cat">{r.category}</span>}
        <h4 className="resource-title">{r.title}</h4>
        {r.description && <p className="resource-desc">{r.description}</p>}
        {note && (
          <details className="resource-note">
            <summary>Notu oku</summary>
            {renderNoteBody(note.text)}
            {note.sourceUrl && (
              <a className="resource-open" href={note.sourceUrl} target="_blank" rel="noopener noreferrer">
                Kaynağı aç →
              </a>
            )}
          </details>
        )}
        {r.type !== "NOTE" && r.url && (
          <a className="resource-open" href={r.url} target="_blank" rel="noopener noreferrer">
            {TYPE_OPEN[r.type] || "Aç"} →
          </a>
        )}
      </div>
    </div>
  );
}

export default async function StudentDashboard() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const studentId = (session?.user as { id?: string } | undefined)?.id;

  if (!session || role !== "STUDENT" || !studentId) {
    redirect("/ogrenci/giris");
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { gradeLevel: true },
  });

  const [personal, library] = await Promise.all([
    prisma.resource.findMany({
      where: { studentId, published: true },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    }),
    prisma.resource.findMany({
      // Seviye (gradeLevel) yalnızca etiket/filtreleme amaçlıdır;
      // görünürlüğü ETKİLEMEZ. Herkese açık kaynak tüm öğrencilere görünür.
      where: { studentId: null, published: true },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="student-shell">
      <header className="student-top">
        <div className="student-top-inner">
          <div className="student-brand">
            <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
              <g fill="none" stroke="var(--clr-primary)" strokeWidth="3.4" strokeLinecap="round">
                <path d="M24 10v28" />
                <path d="M12 12v7c0 7 5 11 12 11s12-4 12-11v-7" />
              </g>
            </svg>
            <span>Öğrenci Paneli</span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="student-logout">Çıkış Yap</button>
          </form>
        </div>
      </header>

      <main className="student-main">
        <h1 className="student-hello">Merhaba, {session.user?.name?.split(" ")[0]} 👋</h1>
        <p className="student-lead">
          Sana özel içerikler ve kaynak kütüphanen burada. Yeni içerik eklendikçe bu sayfada görünür.
        </p>

        {/* Sana Özel İçerikler */}
        <section className="student-section">
          <div className="student-section-head">
            <h2>Sana Özel İçerikler</h2>
            <span className="student-section-count">{personal.length}</span>
          </div>
          {personal.length === 0 ? (
            <div className="student-empty">
              Henüz sana özel bir içerik eklenmedi. Orhan Yaşlı senin için içerik paylaştığında burada görünecek.
            </div>
          ) : (
            <div className="resource-list">
              {personal.map((r) => <ResourceItem key={r.id} r={r as Resource} />)}
            </div>
          )}
        </section>

        {/* Kaynak Kütüphanesi */}
        <section className="student-section">
          <div className="student-section-head">
            <h2>Kaynak Kütüphanesi</h2>
            <span className="student-section-count">{library.length}</span>
          </div>
          {library.length === 0 ? (
            <div className="student-empty">
              Kütüphane çok yakında doluyor. Ders çalışma teknikleri, deneme analizleri ve önerilen kaynaklar burada toplanacak.
            </div>
          ) : (
            <div className="resource-list">
              {library.map((r) => <ResourceItem key={r.id} r={r as Resource} />)}
            </div>
          )}
        </section>

        {/* Hesap Ayarları — şifre değiştirme */}
        <StudentPasswordChange />
      </main>
    </div>
  );
}
