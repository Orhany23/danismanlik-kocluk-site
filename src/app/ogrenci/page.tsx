import { redirect } from "next/navigation";
import { CalendarClock, FileText, Link2, MapPin, MessageSquareQuote, NotebookPen, PlayCircle, Video } from "lucide-react";
import { requireStudent, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import StudentPasswordChange from "@/components/StudentPasswordChange";
import StudentTestimonial from "@/components/StudentTestimonial";
import StudentWorkForm from "@/components/StudentWorkForm";

export const metadata = {
  title: "Öğrenci Paneli | Orhan Yaşlı",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

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

const TYPE_ICON: Record<string, React.ReactNode> = {
  LINK: <Link2 strokeWidth={1.8} aria-hidden="true" />,
  VIDEO: <PlayCircle strokeWidth={1.8} aria-hidden="true" />,
  FILE: <FileText strokeWidth={1.8} aria-hidden="true" />,
  NOTE: <NotebookPen strokeWidth={1.8} aria-hidden="true" />,
};
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
      <span className="resource-icon" aria-hidden="true">
        {TYPE_ICON[r.type] ?? TYPE_ICON.LINK}
      </span>
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

type NextMeeting = { title: string; date: Date; type: string; kind: "appointment" | "session" };

// Bağlı danışan kaydı üzerinden en yakın gelecek randevu/seansı bulur.
// Öğrencinin portal hesabı bir Client'a bağlı değilse (clientId yok) null döner.
async function getNextMeeting(clientId: string | null): Promise<NextMeeting | null> {
  if (!clientId) return null;
  const now = new Date();
  try {
    const [appointment, session] = await Promise.all([
      prisma.appointment.findFirst({
        where: { clientId, date: { gte: now }, status: { notIn: ["CANCELLED", "IPTAL"] } },
        orderBy: { date: "asc" },
        select: { title: true, date: true, type: true },
      }),
      prisma.session.findFirst({
        where: { clientId, date: { gte: now }, status: "PLANNED" },
        orderBy: { date: "asc" },
        select: { title: true, date: true, type: true },
      }),
    ]);
    const candidates: NextMeeting[] = [];
    if (appointment) candidates.push({ ...appointment, kind: "appointment" });
    if (session) candidates.push({ ...session, kind: "session" });
    if (candidates.length === 0) return null;
    return candidates.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  } catch {
    return null;
  }
}

// Koçun yazdığı en son dönüt (StudentWork.feedback).
async function getLatestFeedback(studentId: string) {
  try {
    return await prisma.studentWork.findFirst({
      where: { studentId, feedback: { not: null } },
      orderBy: [{ feedbackAt: "desc" }, { createdAt: "desc" }],
      select: { title: true, feedback: true, feedbackAt: true, createdAt: true },
    });
  } catch {
    return null;
  }
}

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function StudentDashboard() {
  const student = await requireStudent();
  if (!student) {
    redirect("/ogrenci/giris");
  }

  const [nextMeeting, latestFeedback] = await Promise.all([
    getNextMeeting(student.clientId),
    getLatestFeedback(student.id),
  ]);

  const [personal, library] = await Promise.all([
    prisma.resource.findMany({
      where: { studentId: student.id, published: true },
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
        <h1 className="student-hello">Merhaba, {student.name.split(" ")[0]}</h1>
        <p className="student-lead">
          Sana özel içerikler ve kaynak kütüphanen burada. Yeni içerik eklendikçe bu sayfada görünür.
        </p>

        {/* Panelin ilk ekranında iki soru yanıtlanır: sıradaki görüşmem ne zaman,
            koç son çalışmama ne dedi? */}
        <div className="student-summary">
          <section className="student-summary-card" aria-labelledby="next-meeting-title">
            <span className="student-summary-icon" aria-hidden="true">
              <CalendarClock strokeWidth={1.8} />
            </span>
            <h2 className="student-summary-title" id="next-meeting-title">Sonraki seans</h2>
            {nextMeeting ? (
              <>
                <p className="student-summary-value">
                  <time dateTime={nextMeeting.date.toISOString()}>{DATE_FMT.format(nextMeeting.date)}</time>
                </p>
                <p className="student-summary-meta">
                  {nextMeeting.type === "ONLINE" ? (
                    <Video strokeWidth={1.7} aria-hidden="true" />
                  ) : (
                    <MapPin strokeWidth={1.7} aria-hidden="true" />
                  )}
                  <span>
                    {nextMeeting.title}
                    {nextMeeting.type === "ONLINE" ? " · Online" : " · Yüz yüze"}
                  </span>
                </p>
              </>
            ) : (
              <p className="student-summary-empty">
                Henüz seans yok. Planlandığında tarih ve saat burada görünür.
              </p>
            )}
          </section>

          <section className="student-summary-card" aria-labelledby="last-feedback-title">
            <span className="student-summary-icon" aria-hidden="true">
              <MessageSquareQuote strokeWidth={1.8} />
            </span>
            <h2 className="student-summary-title" id="last-feedback-title">Koçun son notu</h2>
            {latestFeedback?.feedback ? (
              <>
                <blockquote className="student-summary-quote">{latestFeedback.feedback}</blockquote>
                <p className="student-summary-meta">
                  <span>
                    {latestFeedback.title ? `${latestFeedback.title} · ` : ""}
                    {DATE_FMT.format(latestFeedback.feedbackAt ?? latestFeedback.createdAt)}
                  </span>
                </p>
              </>
            ) : (
              <p className="student-summary-empty">
                Henüz dönüt yok. Çalışmanı gönderdiğinde Orhan buradan yanıt yazacak.
              </p>
            )}
          </section>
        </div>

        {/* Bugün Ne Çalıştın? — öğrenci günlük çalışma gönderir */}
        <StudentWorkForm />

        {/* Sana Özel İçerikler */}
        <section className="student-section">
          <div className="student-section-head">
            <h2>Sana Özel İçerikler</h2>
            <span className="student-section-count">{personal.length}</span>
          </div>
          {personal.length === 0 ? (
            <div className="student-empty">
              Henüz sana özel bir içerik yok. Orhan senin için içerik paylaştığında burada görünür.
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
              Orhan senin için kaynak eklediğinde burada görünür.
            </div>
          ) : (
            <div className="resource-list">
              {library.map((r) => <ResourceItem key={r.id} r={r as Resource} />)}
            </div>
          )}
        </section>

        {/* Deneyimini Paylaş — öğrenci yorumu (onaya düşer) */}
        <StudentTestimonial />

        {/* Hesap Ayarları — şifre değiştirme */}
        <StudentPasswordChange />
      </main>
    </div>
  );
}
