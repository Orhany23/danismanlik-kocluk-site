import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Inbox, Mail, Star, GraduationCap, Users, CalendarDays, ClipboardList,
  ArrowUpRight, Clock3, CircleAlert, Sparkles, CheckCircle2
} from "lucide-react";

async function getPendingTestimonials(): Promise<number> {
  try {
    await ensureTestimonialTable();
    return await prisma.testimonial.count({ where: { status: "PENDING" } });
  } catch { return 0; }
}

async function getStudentStats(): Promise<{ students: number; pendingWork: number }> {
  try {
    await ensureStudentWorkTable();
    const [students, pendingWork] = await Promise.all([
      prisma.student.count({ where: { active: true } }),
      prisma.studentWork.count({ where: { seen: false } }),
    ]);
    return { students, pendingWork };
  } catch { return { students: 0, pendingWork: 0 }; }
}

async function getStats(now: Date) {
  const [clientCount, messageCount, appointmentCount, sessionCount] = await Promise.all([
    prisma.client.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.appointment.count({ where: { date: { gte: now }, status: { notIn: ["CANCELLED", "IPTAL"] } } }),
    prisma.session.count({ where: { date: { gte: now }, status: "PLANNED" } }),
  ]);
  return { clientCount, messageCount, appointmentCount, sessionCount };
}

async function getUpcoming(now: Date) {
  const [appointments, sessions] = await Promise.all([
    prisma.appointment.findMany({
      take: 6,
      where: { date: { gte: now }, status: { notIn: ["CANCELLED", "IPTAL"] } },
      orderBy: { date: "asc" },
      include: { client: { select: { name: true } } },
    }),
    prisma.session.findMany({
      take: 6,
      where: { date: { gte: now }, status: "PLANNED" },
      orderBy: { date: "asc" },
      include: { client: { select: { name: true } } },
    }),
  ]);
  return [
    ...appointments.map((x) => ({ id: `a-${x.id}`, date: x.date, title: x.title, name: x.client?.name ?? "—", kind: "Randevu", href: "/admin/appointments" })),
    ...sessions.map((x) => ({ id: `s-${x.id}`, date: x.date, title: x.title, name: x.client?.name ?? "—", kind: "Seans", href: "/admin/sessions" })),
  ].sort((a,b) => a.date.getTime() - b.date.getTime()).slice(0, 7);
}

async function getRecentMessages() {
  return prisma.message.findMany({ take: 5, orderBy: { createdAt: "desc" } });
}

const DATE = new Intl.DateTimeFormat("tr-TR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function AdminDashboardPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  const now = new Date();

  const [stats, upcoming, messages, pendingTestimonials, studentStats] = await Promise.all([
    getStats(now), getUpcoming(now), getRecentMessages(), getPendingTestimonials(), getStudentStats()
  ]);

  const actionCount = studentStats.pendingWork + stats.messageCount + pendingTestimonials;
  const statCards = [
    { label: "Bekleyen Çalışma", value: studentStats.pendingWork, Icon: Inbox, href: "/admin/work", tone: "teal" },
    { label: "Bekleyen Mesaj", value: stats.messageCount, Icon: Mail, href: "/admin/messages", tone: "amber" },
    { label: "Bekleyen Yorum", value: pendingTestimonials, Icon: Star, href: "/admin/testimonials", tone: "rose" },
    { label: "Aktif Öğrenci", value: studentStats.students, Icon: GraduationCap, href: "/admin/students", tone: "indigo" },
    { label: "Toplam Danışan", value: stats.clientCount, Icon: Users, href: "/admin/clients", tone: "blue" },
    { label: "Gelecek Randevu", value: stats.appointmentCount, Icon: CalendarDays, href: "/admin/appointments", tone: "emerald" },
    { label: "Planlanan Seans", value: stats.sessionCount, Icon: ClipboardList, href: "/admin/sessions", tone: "violet" },
  ];

  return (
    <div className="advisor-os space-y-7">
      <section className="advisor-hero">
        <div>
          <span className="advisor-kicker"><Sparkles size={14} /> DANIŞMAN MASASI</span>
          <h2>Bugünün kontrol merkezi</h2>
          <p>Öğrenci, danışan ve görüşme akışını tek ekrandan yönet.</p>
        </div>
        <div className={`advisor-focus ${actionCount === 0 ? "is-clear" : ""}`}>
          {actionCount === 0 ? <CheckCircle2 /> : <CircleAlert />}
          <div>
            <strong>{actionCount === 0 ? "Her şey güncel" : `${actionCount} işlem seni bekliyor`}</strong>
            <span>{actionCount === 0 ? "Bekleyen çalışma, mesaj veya yorum yok." : "Önce geri bildirim ve iletişim işlerini tamamla."}</span>
          </div>
        </div>
      </section>

      <div className="advisor-stats">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className={`advisor-stat tone-${card.tone}`}>
            <span className="advisor-stat-icon"><card.Icon size={19} strokeWidth={1.8} /></span>
            <span className="advisor-stat-value">{card.value}</span>
            <span className="advisor-stat-label">{card.label}</span>
            <ArrowUpRight className="advisor-stat-arrow" size={16} />
          </Link>
        ))}
      </div>

      <div className="advisor-grid">
        <section className="advisor-panel advisor-agenda">
          <div className="advisor-panel-head">
            <div><span className="advisor-overline">SIRADAKİLER</span><h3>Görüşme akışı</h3></div>
            <Link href="/admin/appointments">Takvime git <ArrowUpRight size={14}/></Link>
          </div>
          <div className="advisor-agenda-list">
            {upcoming.map((item, i) => (
              <Link href={item.href} key={item.id} className="advisor-agenda-item">
                <div className="advisor-time"><Clock3 size={14}/><time>{DATE.format(item.date)}</time></div>
                <div className="advisor-agenda-main"><strong>{item.name}</strong><span>{item.title}</span></div>
                <span className="advisor-kind">{item.kind}</span>
                {i === 0 && <span className="advisor-next">Sıradaki</span>}
              </Link>
            ))}
            {upcoming.length === 0 && <div className="advisor-empty">Planlanmış gelecek görüşme bulunmuyor.</div>}
          </div>
        </section>

        <section className="advisor-panel">
          <div className="advisor-panel-head">
            <div><span className="advisor-overline">İLETİŞİM</span><h3>Son mesajlar</h3></div>
            <Link href="/admin/messages">Tümü <ArrowUpRight size={14}/></Link>
          </div>
          <div className="advisor-message-list">
            {messages.map((msg) => (
              <Link href="/admin/messages" key={msg.id} className={`advisor-message ${!msg.read ? "is-unread" : ""}`}>
                <span className="advisor-message-dot" />
                <div><strong>{msg.name}</strong><p>{msg.message}</p></div>
                <time>{new Date(msg.createdAt).toLocaleDateString("tr-TR", {day:"2-digit",month:"short"})}</time>
              </Link>
            ))}
            {messages.length === 0 && <div className="advisor-empty">Henüz mesaj bulunmuyor.</div>}
          </div>
        </section>
      </div>

      <section className="advisor-shortcuts">
        <span>Hızlı işlemler</span>
        <Link href="/admin/students">Öğrenci aç</Link>
        <Link href="/admin/work">Çalışma değerlendir</Link>
        <Link href="/admin/mufredat">Konu takibi</Link>
        <Link href="/admin/testler">Test sonuçları</Link>
        <Link href="/admin/resources">Kaynak ata</Link>
      </section>
    </div>
  );
}
