"use client";

import { useEffect, useMemo, useState } from "react";

type WorkType = "NOTE" | "LINK" | "FILE" | "PHOTO";
type Work = {
  id: string;
  type: WorkType;
  title: string | null;
  note: string | null;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
  hasFile?: boolean;
  seen: boolean;
  createdAt: string;
  student: { id: string; name: string; gradeLevel: string | null };
};

const TYPE_BADGE: Record<WorkType, { label: string; cls: string; emoji: string }> = {
  NOTE: { label: "Not", cls: "bg-amber-50 text-amber-700", emoji: "📝" },
  LINK: { label: "Bağlantı", cls: "bg-sky-50 text-sky-700", emoji: "🔗" },
  FILE: { label: "PDF", cls: "bg-rose-50 text-rose-700", emoji: "📄" },
  PHOTO: { label: "Fotoğraf", cls: "bg-emerald-50 text-emerald-700", emoji: "📷" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminWorkPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnseen, setOnlyUnseen] = useState(false);
  const [studentFilter, setStudentFilter] = useState<string>("");

  const load = () => {
    fetch("/api/admin/work")
      .then((r) => r.json())
      .then((d) => setWorks(d.works ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const students = useMemo(() => {
    const map = new Map<string, string>();
    works.forEach((w) => map.set(w.student.id, w.student.name));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [works]);

  const filtered = works.filter(
    (w) => (!onlyUnseen || !w.seen) && (!studentFilter || w.student.id === studentFilter),
  );
  const unseenCount = works.filter((w) => !w.seen).length;

  const toggleSeen = async (w: Work) => {
    const seen = !w.seen;
    setWorks((prev) => prev.map((x) => (x.id === w.id ? { ...x, seen } : x)));
    await fetch(`/api/admin/work/${w.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seen }),
    }).catch(() => load());
  };

  const remove = async (w: Work) => {
    if (!confirm("Bu çalışmayı silmek istediğinize emin misiniz? (Dosyaysa depodan da silinir)")) return;
    setWorks((prev) => prev.filter((x) => x.id !== w.id));
    await fetch(`/api/admin/work/${w.id}`, { method: "DELETE" }).catch(() => load());
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Öğrenci Çalışmaları</h2>
          <p className="text-sm text-gray-500 mt-1">
            Öğrencilerin gönderdiği günlük çalışmalar
            {unseenCount > 0 && <span className="ml-2 inline-flex items-center rounded-full bg-[var(--clr-primary)] text-white text-xs px-2 py-0.5">{unseenCount} yeni</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
          >
            <option value="">Tüm öğrenciler</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button
            onClick={() => setOnlyUnseen((v) => !v)}
            className={`text-sm rounded-lg px-3 py-2 border transition-colors ${onlyUnseen ? "bg-[var(--clr-primary)] text-white border-transparent" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            Sadece bekleyenler
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-16 text-center text-sm text-gray-400">
          {works.length === 0 ? "Henüz öğrenci çalışması gönderilmedi." : "Bu filtreye uygun çalışma yok."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((w) => {
            const badge = TYPE_BADGE[w.type];
            return (
              <div
                key={w.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 ${w.seen ? "border-gray-100" : "border-[var(--clr-primary)]/40 ring-1 ring-[var(--clr-primary)]/10"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{w.student.name}</div>
                    <div className="text-xs text-gray-400">
                      {w.student.gradeLevel ? `${w.student.gradeLevel} · ` : ""}{fmtDate(w.createdAt)}
                    </div>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 ${badge.cls}`}>
                    <span aria-hidden="true">{badge.emoji}</span> {badge.label}
                  </span>
                </div>

                {w.title && <div className="text-sm font-medium text-gray-800">{w.title}</div>}
                {w.note && <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{w.note}</p>}

                {w.type === "PHOTO" && w.hasFile && (
                  <a href={`/api/admin/work/${w.id}/file`} target="_blank" rel="noopener noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/admin/work/${w.id}/file`} alt={w.title ?? "Öğrenci fotoğrafı"} className="rounded-xl border border-gray-100 max-h-64 w-auto object-contain" />
                  </a>
                )}

                {w.type === "FILE" && w.hasFile && (
                  <a
                    href={`/api/admin/work/${w.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--clr-primary)] hover:underline w-fit"
                  >
                    📄 PDF&apos;i aç
                  </a>
                )}

                {w.type === "LINK" && w.url && (
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--clr-primary)] hover:underline w-fit break-all"
                  >
                    🔗 Bağlantıyı aç
                  </a>
                )}

                <div className="flex items-center justify-between gap-3 pt-2 mt-auto border-t border-gray-50">
                  <button
                    onClick={() => toggleSeen(w)}
                    className={`text-xs font-medium rounded-lg px-3 py-1.5 transition-colors ${w.seen ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-[var(--clr-primary)] text-white hover:opacity-90"}`}
                  >
                    {w.seen ? "✓ Görüldü" : "Görüldü işaretle"}
                  </button>
                  <button onClick={() => remove(w)} className="text-xs text-red-500 hover:underline">Sil</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
