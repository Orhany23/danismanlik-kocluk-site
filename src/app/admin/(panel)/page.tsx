import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureTestimonialTable } from "@/lib/ensureTestimonialTable";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Inbox, Mail, Star, GraduationCap, Users, CalendarDays, ClipboardList } from "lucide-react";

// Bekleyen yorum sayısı — tablo üretimde henüz oluşmamışsa dashboard çökmesin
// diye güvenli şekilde alınır (hata halinde 0 döner).
async function getPendingTestimonials(): Promise<number> {
  try {
    await ensureTestimonialTable();
    return await prisma.testimonial.count({ where: { status: "PENDING" } });
  } catch {
    return 0;
  }
}

// Öğrenci tarafı sayıları — tablolar üretimde runtime DDL ile oluştuğu için
// dashboard'un çökmemesi adına ayrı ve güvenli şekilde alınır.
async function getStudentStats(): Promise<{ students: number; pendingWork: number }> {
  try {
    await ensureStudentWorkTable();
    const [students, pendingWork] = await Promise.all([
      prisma.student.count({ where: { active: true } }),
      prisma.studentWork.count({ where: { seen: false } }),
    ]);
    return { students, pendingWork };
  } catch {
    return { students: 0, pendingWork: 0 };
  }
}

async function getStats() {
  const [clientCount, messageCount, appointmentCount, sessionCount] = await Promise.all([
    prisma.client.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.appointment.count({ where: { date: { gte: new Date() } } }),
    prisma.session.count({ where: { status: "PLANNED" } }),
  ]);
  return { clientCount, messageCount, appointmentCount, sessionCount };
}

async function getRecentAppointments() {
  return prisma.appointment.findMany({
    take: 5,
    orderBy: { date: "desc" },
    include: { client: { select: { name: true } } },
  });
}

async function getRecentMessages() {
  return prisma.message.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminDashboardPage() {
  if (!(await requireAdmin())) redirect("/admin/login");

  const stats = await getStats();
  const appointments = await getRecentAppointments();
  const messages = await getRecentMessages();
  const pendingTestimonials = await getPendingTestimonials();
  const studentStats = await getStudentStats();

  // Önce günlük bakılan işler (bekleyen çalışma/mesaj), sonra genel sayılar.
  const statCards = [
    { label: "Bekleyen Çalışma", value: studentStats.pendingWork, color: "bg-teal-500", Icon: Inbox, href: "/admin/work" },
    { label: "Bekleyen Mesaj", value: stats.messageCount, color: "bg-amber-500", Icon: Mail, href: "/admin/messages" },
    { label: "Bekleyen Yorum", value: pendingTestimonials, color: "bg-rose-500", Icon: Star, href: "/admin/testimonials" },
    { label: "Aktif Öğrenci", value: studentStats.students, color: "bg-indigo-500", Icon: GraduationCap, href: "/admin/students" },
    { label: "Toplam Danışan", value: stats.clientCount, color: "bg-blue-500", Icon: Users, href: "/admin/clients" },
    { label: "Gelecek Randevu", value: stats.appointmentCount, color: "bg-emerald-500", Icon: CalendarDays, href: "/admin/appointments" },
    { label: "Planlanan Seans", value: stats.sessionCount, color: "bg-purple-500", Icon: ClipboardList, href: "/admin/sessions" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center" aria-hidden="true">
                <card.Icon size={20} strokeWidth={1.8} />
              </span>
              <span className={`w-2 h-2 rounded-full ${card.color}`} aria-hidden="true" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Son Randevular</h3>
          <Link href="/admin/appointments" className="text-sm text-[var(--clr-primary)] hover:underline">
            Tümünü Gör
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-50">
                <th className="px-6 py-3 font-medium">Danışan</th>
                <th className="px-6 py-3 font-medium">Tarih</th>
                <th className="px-6 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-3 text-sm text-gray-700">{apt.client?.name || "—"}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{new Date(apt.date).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      apt.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                      apt.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                      apt.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {apt.status === "CONFIRMED" ? "Onaylandı" : apt.status === "PENDING" ? "Bekliyor" : apt.status === "COMPLETED" ? "Tamamlandı" : "İptal"}
                    </span>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400">Henüz randevu bulunmuyor.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Son Mesajlar</h3>
          <Link href="/admin/messages" className="text-sm text-[var(--clr-primary)] hover:underline">
            Tümünü Gör
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`px-6 py-3.5 flex items-center gap-4 ${!msg.read ? "bg-blue-50/50" : ""}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!msg.read ? "bg-blue-500" : "bg-transparent"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{msg.name}</span>
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{msg.message}</p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-gray-400">Henüz mesaj bulunmuyor.</div>
          )}
        </div>
      </div>
    </div>
  );
}
