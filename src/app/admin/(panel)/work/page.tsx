"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminDialog } from "@/components/admin/DialogProvider";
import { FileText, Image as ImageIcon, Link2, NotebookPen } from "lucide-react";

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
  feedback: string | null;
  feedbackAt: string | null;
  createdAt: string;
  student: { id: string; name: string; gradeLevel: string | null };
};

const TYPE_BADGE: Record<WorkType, { label: string; cls: string; Icon: typeof FileText }> = {
  NOTE: { label: "Not", cls: "bg-amber-50 text-amber-700", Icon: NotebookPen },
  LINK: { label: "Bağlantı", cls: "bg-sky-50 text-sky-700", Icon: Link2 },
  FILE: { label: "PDF", cls: "bg-rose-50 text-rose-700", Icon: FileText },
  PHOTO: { label: "Fotoğraf", cls: "bg-emerald-50 text-emerald-700", Icon: ImageIcon },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminWorkPage() {
  const { confirm } = useAdminDialog();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "unseen" | "seen">("all");
  const [studentFilter, setStudentFilter] = useState<string>("");

  const load = () => {
    fetch("/api/admin/work", { cache: "no-store" })
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

  const filtered = works.filter((w) => {
    if (statusFilter === "unseen" && w.seen) return false;
    if (statusFilter === "seen" && !w.seen) return false;
    if (studentFilter && w.student.id !== studentFilter) return false;
    return true;
  });
  const unseenCount = works.filter((w) => !w.seen).length;

  const setSeen = async (w: Work, seen: boolean) => {
    if (w.seen === seen) return;
    setWorks((prev) => prev.map((x) => (x.id === w.id ? { ...x, seen } : x)));
    await fetch(`/api/admin/work/${w.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seen }),
    }).catch(() => load());
  };
  const toggleSeen = (w: Work) => setSeen(w, !w.seen);

  const remove = async (w: Work) => {
    const ok = await confirm({
      title: "Çalışma silinsin mi?",
      description: "Dosya içeriyorsa depodan da silinir. Bu işlem geri alınamaz.",
      confirmLabel: "Sil",
      tone: "danger",
    });
    if (!ok) return;
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
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            {([
              ["all", "Tümü"],
              ["unseen", "Bekleyenler"],
              ["seen", "Görülenler"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`text-sm px-3 py-2 transition-colors ${statusFilter === key ? "bg-[var(--clr-primary)] text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {label}
                {key === "unseen" && unseenCount > 0 && (
                  <span className={`ml-1.5 text-xs ${statusFilter === key ? "opacity-90" : "text-[var(--clr-primary)]"}`}>{unseenCount}</span>
                )}
              </button>
            ))}
          </div>
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
                    <badge.Icon size={13} strokeWidth={1.9} aria-hidden="true" /> {badge.label}
                  </span>
                </div>

                {w.title && <div className="text-sm font-medium text-gray-800">{w.title}</div>}
                {w.note && <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{w.note}</p>}

                {w.type === "PHOTO" && w.hasFile && (
                  <a href={`/api/admin/work/${w.id}/file`} target="_blank" rel="noopener noreferrer" className="block" onClick={() => setSeen(w, true)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/admin/work/${w.id}/file`} alt={w.title ?? "Öğrenci fotoğrafı"} className="rounded-xl border border-gray-100 max-h-64 w-auto object-contain" />
                  </a>
                )}

                {w.type === "FILE" && w.hasFile && (
                  <a
                    href={`/api/admin/work/${w.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSeen(w, true)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--clr-primary)] hover:underline w-fit"
                  >
                    <FileText size={16} strokeWidth={1.8} aria-hidden="true" />
                    PDF&apos;i aç
                  </a>
                )}

                {w.type === "LINK" && w.url && (
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--clr-primary)] hover:underline w-fit break-all"
                  >
                    <Link2 size={16} strokeWidth={1.8} aria-hidden="true" />
                    Bağlantıyı aç
                  </a>
                )}

                <FeedbackBox work={w} onSaved={(fb, at) =>
                  setWorks((prev) => prev.map((x) => (x.id === w.id ? { ...x, feedback: fb, feedbackAt: at, seen: fb ? true : x.seen } : x)))
                } />

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

// Koçun bir çalışmaya yazdığı değerlendirme/dönüt. Kaydedilince öğrencinin
// panelinde görünür ve çalışma otomatik "görüldü" sayılır.
function FeedbackBox({
  work,
  onSaved,
}: {
  work: Work;
  onSaved: (feedback: string | null, feedbackAt: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(work.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/work/${work.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        onSaved(data.feedback ?? null, data.feedbackAt ?? null);
        setSaved(true);
        setOpen(false);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  // Dönüt varsa ve düzenlenmiyorsa: yazılanı göster
  if (work.feedback && !open) {
    return (
      <div className="rounded-xl bg-[var(--clr-accent-tint)] border border-[var(--clr-primary)]/20 px-4 py-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-[var(--clr-primary)]">💬 Dönütün</span>
          <button onClick={() => { setText(work.feedback ?? ""); setOpen(true); }} className="text-xs text-gray-500 hover:underline">
            Düzenle
          </button>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{work.feedback}</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-[var(--clr-primary)] hover:underline w-fit"
      >
        💬 Dönüt yaz
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-3 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={4000}
        autoFocus
        placeholder="Öğrenciye değerlendirmeni yaz — neyi iyi yapmış, neye dikkat etmeli, sıradaki adım ne?"
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[var(--clr-primary)]"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="text-xs font-medium rounded-lg px-3 py-1.5 bg-[var(--clr-primary)] text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Gönderiliyor…" : "Öğrenciye gönder"}
        </button>
        <button
          onClick={() => { setOpen(false); setText(work.feedback ?? ""); }}
          className="text-xs text-gray-500 hover:underline"
        >
          Vazgeç
        </button>
        {work.feedback && (
          <button
            onClick={() => { setText(""); }}
            className="text-xs text-red-500 hover:underline ml-auto"
          >
            Temizle
          </button>
        )}
        {saved && <span className="text-xs text-emerald-600 ml-auto">Gönderildi ✓</span>}
      </div>
    </div>
  );
}
