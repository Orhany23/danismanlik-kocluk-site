"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Appointment = { id: string; title: string; date: string; duration: number; status: string; notes: string | null };
type SessionRow = { id: string; title: string; date: string; duration: number; status: string; notes: string | null };
type Work = { id: string; type: string; title: string | null; seen: boolean; feedback: string | null; createdAt: string };
type Student = {
  id: string; name: string; email: string; gradeLevel: string | null; active: boolean;
  works: Work[]; _count: { works: number; resources: number };
};
type Client = {
  id: string; name: string; phone: string; email: string | null; notes: string | null; createdAt: string;
  appointments: Appointment[]; sessions: SessionRow[]; student: Student | null;
};

const STATUS_CLS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  PLANNED: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-50 text-red-600",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/clients/${id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Client | null) => {
        setClient(d);
        setNotes(d?.notes ?? "");
      })
      .catch(() => setClient(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  const saveNotes = async () => {
    if (!client) return;
    setSavingNotes(true);
    setNotesSaved(false);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: client.name, email: client.email, phone: client.phone, notes }),
      });
      if (res.ok) {
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2500);
      }
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;
  if (!client) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Danışan bulunamadı.
        </div>
        <Link href="/admin/clients" className="text-sm text-[var(--clr-primary)] hover:underline">← Danışanlar</Link>
      </div>
    );
  }

  const upcoming = client.appointments.filter((a) => new Date(a.date) >= new Date());

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/clients" className="text-sm text-gray-500 hover:underline">← Danışanlar</Link>
        <div className="flex items-start justify-between gap-4 flex-wrap mt-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {client.phone || "telefon yok"}
              {client.email ? ` · ${client.email}` : ""}
              {` · kayıt ${new Date(client.createdAt).toLocaleDateString("tr-TR")}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {client.student ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--clr-accent-tint)] text-[var(--clr-primary)] text-xs font-medium px-3 py-1.5">
                🎓 Portal hesabı bağlı
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1.5">
                Portal hesabı yok
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Yaklaşan Randevu", v: upcoming.length },
          { l: "Toplam Randevu", v: client.appointments.length },
          { l: "Toplam Seans", v: client.sessions.length },
          { l: "Gönderdiği Çalışma", v: client.student?._count.works ?? 0 },
        ].map((s) => (
          <div key={s.l} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-gray-800">{s.v}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sol: notlar + portal */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Notlar</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Bu danışan hakkındaki notların…"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[var(--clr-primary)]"
            />
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="text-xs font-medium rounded-lg px-3 py-1.5 bg-[var(--clr-primary)] text-white hover:opacity-90 disabled:opacity-50"
              >
                {savingNotes ? "Kaydediliyor…" : "Notu kaydet"}
              </button>
              {notesSaved && <span className="text-xs text-emerald-600">Kaydedildi ✓</span>}
            </div>
          </div>

          {client.student && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Portal hesabı</h3>
              <p className="text-sm text-gray-800 font-medium">{client.student.name}</p>
              <p className="text-xs text-gray-500">
                {client.student.email}
                {client.student.gradeLevel ? ` · ${client.student.gradeLevel}` : ""}
                {client.student.active ? "" : " · askıda"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {client.student._count.works} çalışma · {client.student._count.resources} atanmış kaynak
              </p>
              <div className="flex gap-3 mt-3">
                <Link href="/admin/work" className="text-xs font-medium text-[var(--clr-primary)] hover:underline">
                  Çalışmaları gör
                </Link>
                <Link href="/admin/students" className="text-xs font-medium text-[var(--clr-primary)] hover:underline">
                  Öğrenciler
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sağ: geçmiş */}
        <div className="lg:col-span-2 space-y-5">
          <Timeline
            title="Randevular"
            empty="Henüz randevu yok."
            rows={client.appointments.map((a) => ({ id: a.id, title: a.title, date: a.date, meta: `${a.duration} dk`, status: a.status, notes: a.notes }))}
          />
          <Timeline
            title="Seanslar"
            empty="Henüz seans yok."
            rows={client.sessions.map((s) => ({ id: s.id, title: s.title, date: s.date, meta: `${s.duration} dk`, status: s.status, notes: s.notes }))}
          />

          {client.student && client.student.works.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Son gönderdiği çalışmalar</h3>
              <ul className="space-y-2">
                {client.student.works.map((w) => (
                  <li key={w.id} className="flex items-center justify-between gap-3 text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                    <span className="text-gray-800 truncate">{w.title || w.type}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">{new Date(w.createdAt).toLocaleDateString("tr-TR")}</span>
                      <span className={`text-xs font-medium ${w.feedback ? "text-[var(--clr-primary)]" : w.seen ? "text-emerald-600" : "text-gray-400"}`}>
                        {w.feedback ? "dönüt verildi" : w.seen ? "görüldü" : "bekliyor"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={async () => {
          if (!confirm(`${client.name} silinsin mi? Randevu ve seansları varsa silme başarısız olur.`)) return;
          const res = await fetch(`/api/clients/${client.id}`, { method: "DELETE" });
          if (res.ok) router.push("/admin/clients");
          else alert("Silinemedi. Önce randevu/seans kayıtlarını silmelisin.");
        }}
        className="text-xs text-red-500 hover:underline"
      >
        Danışanı sil
      </button>
    </div>
  );
}

function Timeline({
  title, rows, empty,
}: {
  title: string;
  empty: string;
  rows: { id: string; title: string; date: string; meta: string; status: string; notes: string | null }[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-800">{r.title}</span>
                <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${STATUS_CLS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {r.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{fmt(r.date)} · {r.meta}</div>
              {r.notes && <p className="text-sm text-gray-600 mt-1.5 whitespace-pre-wrap">{r.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
