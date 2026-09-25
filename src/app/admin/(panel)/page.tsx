import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensurePortalMessageTables } from "@/lib/ensurePortalMessageTables";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Inbox, Mail, Star, GraduationCap, Users, CalendarDays, ClipboardList,
  ArrowUpRight, Clock3, Sparkles, CheckCircle2, Zap,
  MessageSquareReply, UserRoundSearch, CalendarCheck2, ChevronRight
} from "lucide-react";

type ActionItem = {
  id: string; priority: 1 | 2 | 3; eyebrow: string; title: string; detail: string;
  href: string; action: string; kind: "work" | "rhythm" | "meeting" | "message" | "review";
};

async function getPendingTestimonials(): Promise<number> {
  try { await ensureTestimonialTable(); return await prisma.testimonial.count({ where: { status: "PENDING" } }); }
  catch { return 0; }
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
  const [clientCount, contactCount, appointmentCount, sessionCount, portalCount] = await Promise.all([
    prisma.client.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.appointment.count({ where: { date: { gte: now }, status: { notIn: ["CANCELLED", "IPTAL"] } } }),
    prisma.session.count({ where: { date: { gte: now }, status: "PLANNED" } }),
    (async () => { try { await ensurePortalMessageTables(); return await prisma.portalConversation.count({ where: { needsReply: true } }); } catch { return 0; } })(),
  ]);
  return { clientCount, messageCount: contactCount + portalCount, appointmentCount, sessionCount };
}

async function getUpcoming(now: Date) {
  const [appointments, sessions] = await Promise.all([
    prisma.appointment.findMany({ take: 6, where: { date: { gte: now }, status: { notIn: ["CANCELLED", "IPTAL"] } }, orderBy: { date: "asc" }, include: { client: { select: { id:true, name:true } } } }),
    prisma.session.findMany({ take: 6, where: { date: { gte: now }, status: "PLANNED" }, orderBy: { date: "asc" }, include: { client: { select: { id:true, name:true } } } }),
  ]);
  return [
    ...appointments.map((x) => ({ id:`a-${x.id}`, date:x.date, title:x.title, name:x.client?.name ?? "—", kind:"Randevu", href:x.client?.id ? `/admin/clients/${x.client.id}` : "/admin/appointments" })),
    ...sessions.map((x) => ({ id:`s-${x.id}`, date:x.date, title:x.title, name:x.client?.name ?? "—", kind:"Seans", href:x.client?.id ? `/admin/clients/${x.client.id}` : "/admin/sessions" })),
  ].sort((a,b)=>a.date.getTime()-b.date.getTime()).slice(0,7);
}

async function getRecentMessages() { return prisma.message.findMany({ take:5, orderBy:{createdAt:"desc"} }); }

async function getActionCenter(now: Date): Promise<ActionItem[]> {
  try {
    await ensureStudentWorkTable();
    const staleBefore = new Date(now.getTime() - 7 * 86400000);
    const meetingLimit = new Date(now.getTime() + 48 * 3600000);

    const [pendingWorks, activeStudents, appointments, sessions, unreadMessages, pendingReviews, portalWaiting] = await Promise.all([
      prisma.studentWork.findMany({
        where:{ seen:false }, take:8, orderBy:{createdAt:"asc"},
        select:{ id:true, createdAt:true, title:true, student:{select:{id:true,name:true}} }
      }),
      prisma.student.findMany({
        where:{ active:true }, take:120, orderBy:{name:"asc"},
        select:{ id:true,name:true,clientId:true,works:{take:1,orderBy:{createdAt:"desc"},select:{createdAt:true}} }
      }),
      prisma.appointment.findMany({
        where:{date:{gte:now,lte:meetingLimit},status:{notIn:["CANCELLED","IPTAL"]}},orderBy:{date:"asc"},take:6,
        select:{id:true,date:true,title:true,client:{select:{id:true,name:true}}}
      }),
      prisma.session.findMany({
        where:{date:{gte:now,lte:meetingLimit},status:"PLANNED"},orderBy:{date:"asc"},take:6,
        select:{id:true,date:true,title:true,client:{select:{id:true,name:true}}}
      }),
      prisma.message.findMany({where:{read:false},orderBy:{createdAt:"asc"},take:5,select:{id:true,name:true,createdAt:true}}),
      (async()=>{ try { await ensureTestimonialTable(); return await prisma.testimonial.findMany({where:{status:"PENDING"},orderBy:{createdAt:"asc"},take:3,select:{id:true,createdAt:true,student:{select:{name:true}}}}); } catch { return []; } })(),
      (async () => { try {
        await ensurePortalMessageTables();
        return await prisma.portalConversation.findMany({
          where: { needsReply: true }, orderBy: { updatedAt: "asc" }, take: 5,
          select: { studentId: true, updatedAt: true, student: { select: { name: true } } },
        });
      } catch { return []; } })(),
    ]);

    const items: ActionItem[] = [];
    for (const w of pendingWorks) items.push({
      id:`work-${w.id}`, priority:1, eyebrow:"GERİ BİLDİRİM",
      title:`${w.student.name} çalışma gönderdi`,
      detail:`${w.title || "Yeni çalışma"} · ${relative(w.createdAt, now)}`,
      href:`/admin/work?student=${w.student.id}`, action:"Değerlendir", kind:"work"
    });

    for (const a of appointments) items.push({
      id:`appt-${a.id}`, priority:1, eyebrow:"GÖRÜŞME HAZIRLIĞI",
      title:`${a.client?.name ?? "Danışan"} ile randevu yaklaşıyor`,
      detail:`${DATE.format(a.date)} · ${a.title}`,
      href:a.client?.id ? `/admin/clients/${a.client.id}` : "/admin/appointments", action:"Brifi aç", kind:"meeting"
    });
    for (const s of sessions) items.push({
      id:`session-${s.id}`, priority:1, eyebrow:"SEANS HAZIRLIĞI",
      title:`${s.client?.name ?? "Danışan"} ile seans yaklaşıyor`,
      detail:`${DATE.format(s.date)} · ${s.title}`,
      href:s.client?.id ? `/admin/clients/${s.client.id}` : "/admin/sessions", action:"Brifi aç", kind:"meeting"
    });

    for (const student of activeStudents) {
      const last = student.works[0]?.createdAt ?? null;
      if (!last || last < staleBefore) {
        items.push({
          id:`rhythm-${student.id}`, priority:2, eyebrow:"ÇALIŞMA RİTMİ",
          title:last ? `${student.name} 7+ gündür çalışma göndermedi` : `${student.name} henüz çalışma göndermedi`,
          detail:last ? `Son çalışma ${relative(last, now)}` : "İlk çalışma kaydı bekleniyor.",
          href:"/admin/students", action:"Öğrenciye git", kind:"rhythm"
        });
      }
    }

    for (const conversation of portalWaiting) items.push({
      id: `portal-${conversation.studentId}`, priority: 1, eyebrow: "MESAJ YANITI",
      title: `${conversation.student.name} yanıt bekliyor`,
      detail: `Panel mesajı · ${relative(conversation.updatedAt, now)}`,
      href: `/admin/messages?student=${conversation.studentId}`, action: "Yanıtla", kind: "message"
    });
    for (const m of unreadMessages) items.push({
      id:`msg-${m.id}`, priority:2, eyebrow:"İLETİŞİM", title:`${m.name} mesaj bıraktı`,
      detail:`Okunmamış mesaj · ${relative(m.createdAt, now)}`, href:"/admin/messages?tab=contact", action:"Mesajı aç", kind:"message"
    });
    for (const t of pendingReviews) items.push({
      id:`review-${t.id}`, priority:3, eyebrow:"ONAY", title:`${t.student.name} yorum gönderdi`,
      detail:`Yayın onayı bekliyor · ${relative(t.createdAt, now)}`, href:"/admin/testimonials", action:"İncele", kind:"review"
    });

    return items.sort((a,b) => a.priority - b.priority || a.title.localeCompare(b.title, "tr")).slice(0,12);
  } catch (err) {
    console.error("Action Center failed:", err);
    return [];
  }
}

function relative(date: Date, now: Date) {
  const hours = Math.max(0, Math.floor((now.getTime()-date.getTime())/3600000));
  if (hours < 1) return "az önce";
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.floor(hours/24)} gün önce`;
}

const DATE = new Intl.DateTimeFormat("tr-TR",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});

export default async function AdminDashboardPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  const now = new Date();
  const [stats, upcoming, messages, pendingTestimonials, studentStats, actions] = await Promise.all([
    getStats(now), getUpcoming(now), getRecentMessages(), getPendingTestimonials(), getStudentStats(), getActionCenter(now)
  ]);
  const urgent = actions.filter(x=>x.priority===1).length;
  const actionCount = actions.length;
  const statCards = [
    {label:"Bekleyen Çalışma",value:studentStats.pendingWork,Icon:Inbox,href:"/admin/work",tone:"teal"},
    {label:"Bekleyen Mesaj",value:stats.messageCount,Icon:Mail,href:"/admin/messages",tone:"amber"},
    {label:"Bekleyen Yorum",value:pendingTestimonials,Icon:Star,href:"/admin/testimonials",tone:"rose"},
    {label:"Aktif Öğrenci",value:studentStats.students,Icon:GraduationCap,href:"/admin/students",tone:"indigo"},
    {label:"Toplam Danışan",value:stats.clientCount,Icon:Users,href:"/admin/clients",tone:"blue"},
    {label:"Gelecek Randevu",value:stats.appointmentCount,Icon:CalendarDays,href:"/admin/appointments",tone:"emerald"},
    {label:"Planlanan Seans",value:stats.sessionCount,Icon:ClipboardList,href:"/admin/sessions",tone:"violet"},
  ];
  return <div className="advisor-os action-center space-y-7">
    <section className="advisor-hero action-hero"><div><span className="advisor-kicker"><Sparkles size={14}/> DANIŞMAN MASASI · V5</span><h2>Bugün ne yapmalısın?</h2><p>Sistem öğrenci ritmini, görüşmeleri ve bekleyen işleri senin için önceliklendiriyor.</p></div><div className={`advisor-focus ${actionCount===0?"is-clear":""}`}>{actionCount===0?<CheckCircle2/>:<Zap/>}<div><strong>{actionCount===0?"Akış temiz":`${actionCount} önerilen aksiyon`}</strong><span>{urgent>0?`${urgent} tanesi yüksek öncelikli.`:"Acil bir işlem görünmüyor."}</span></div></div></section>

    <section className="action-board">
      <div className="action-board-head"><div><span>AKSİYON MERKEZİ</span><h3>Öncelik kuyruğun</h3></div><Link href="/admin/students">Öğrenci Radarı <ArrowUpRight/></Link></div>
      {actions.length===0?<div className="action-clear"><CheckCircle2/><div><b>Bugünün kritik işleri tamam.</b><span>Yeni bir sinyal oluştuğunda burada otomatik görünecek.</span></div></div>:
      <div className="action-list">{actions.map((item,index)=><Link href={item.href} key={item.id} className={`action-row p${item.priority}`}>
        <span className="action-rank">{String(index+1).padStart(2,"0")}</span>
        <span className={`action-kind kind-${item.kind}`}>{item.kind==="work"?<MessageSquareReply/>:item.kind==="meeting"?<CalendarCheck2/>:item.kind==="rhythm"?<UserRoundSearch/>:item.kind==="message"?<Mail/>:<Star/>}</span>
        <span className="action-copy"><small>{item.eyebrow}</small><b>{item.title}</b><em>{item.detail}</em></span>
        <span className="action-cta">{item.action}<ChevronRight/></span>
      </Link>)}</div>}
    </section>

    <div className="advisor-stats">{statCards.map(card=><Link key={card.label} href={card.href} className={`advisor-stat tone-${card.tone}`}><span className="advisor-stat-icon"><card.Icon size={19} strokeWidth={1.8}/></span><span className="advisor-stat-value">{card.value}</span><span className="advisor-stat-label">{card.label}</span><ArrowUpRight className="advisor-stat-arrow" size={16}/></Link>)}</div>

    <div className="advisor-grid">
      <section className="advisor-panel advisor-agenda"><div className="advisor-panel-head"><div><span className="advisor-overline">SIRADAKİLER</span><h3>Görüşme akışı</h3></div><Link href="/admin/appointments">Takvime git <ArrowUpRight size={14}/></Link></div><div className="advisor-agenda-list">{upcoming.map((item,i)=><Link href={item.href} key={item.id} className="advisor-agenda-item"><div className="advisor-time"><Clock3 size={14}/><time>{DATE.format(item.date)}</time></div><div className="advisor-agenda-main"><strong>{item.name}</strong><span>{item.title}</span></div><span className="advisor-kind">{item.kind}</span>{i===0&&<span className="advisor-next">Sıradaki</span>}</Link>)}{upcoming.length===0&&<div className="advisor-empty">Planlanmış gelecek görüşme bulunmuyor.</div>}</div></section>
      <section className="advisor-panel"><div className="advisor-panel-head"><div><span className="advisor-overline">İLETİŞİM</span><h3>İletişim formu mesajları</h3></div><Link href="/admin/messages?tab=contact">Tümü <ArrowUpRight size={14}/></Link></div><div className="advisor-message-list">{messages.map(msg=><Link href="/admin/messages?tab=contact" key={msg.id} className={`advisor-message ${!msg.read?"is-unread":""}`}><span className="advisor-message-dot"/><div><strong>{msg.name}</strong><p>{msg.message}</p></div><time>{new Date(msg.createdAt).toLocaleDateString("tr-TR",{day:"2-digit",month:"short"})}</time></Link>)}{messages.length===0&&<div className="advisor-empty">Henüz mesaj bulunmuyor.</div>}</div></section>
    </div>
    <section className="advisor-shortcuts"><span>Hızlı işlemler</span><Link href="/admin/students">Öğrenci Radarı</Link><Link href="/admin/work">Çalışma değerlendir</Link><Link href="/admin/mufredat">Konu takibi</Link><Link href="/admin/testler">Test sonuçları</Link><Link href="/admin/resources">Kaynak ata</Link></section>
  </div>
}
