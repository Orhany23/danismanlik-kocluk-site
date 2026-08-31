"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminDialog } from "@/components/admin/DialogProvider";

type Student = { id: string; name: string; email: string; gradeLevel: string | null };
type Testimonial = {
  id: string;
  rating: number;
  text: string;
  displayPref: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  student: Student | null;
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Onay bekliyor", cls: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Yayında", cls: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Reddedildi", cls: "bg-red-100 text-red-700" },
};

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-500 text-sm" aria-label={`${n} yıldız`}>
      {"★".repeat(n)}
      <span className="text-gray-300">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function AdminTestimonialsPage() {
  const { confirm } = useAdminDialog();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetch("/api/admin/testimonials")
      .then((x) => x.json())
      .catch(() => ({ testimonials: [] }));
    setTestimonials(data.testimonials || []);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load async; state güncellemesi fetch sonrası
  useEffect(() => { void load(); }, [load]);

  const setStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const remove = async (id: string) => {
    const ok = await confirm({
      title: "Yorum silinsin mi?",
      description: "Bu işlem geri alınamaz.",
      confirmLabel: "Sil",
      tone: "danger",
    });
    if (!ok) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  };

  const pendingCount = testimonials.filter((t) => t.status === "PENDING").length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Öğrenci Yorumları</h2>
        <p className="text-sm text-gray-500 mt-1">
          Öğrencilerin gönderdiği yorumlar burada onaylanır. Yalnızca onayladıkların ana sayfada yayınlanır.
          {pendingCount > 0 && (
            <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              {pendingCount} onay bekliyor
            </span>
          )}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Yükleniyor...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-sm text-gray-400">Henüz yorum gönderilmedi.</p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-xl border p-5 ${
                t.status === "PENDING" ? "border-amber-200 ring-1 ring-amber-100" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800">{t.student?.name || "Öğrenci"}</span>
                    {t.student?.email && <span className="text-xs text-gray-400">{t.student.email}</span>}
                    {t.student?.gradeLevel && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{t.student.gradeLevel}</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[t.status].cls}`}>
                      {STATUS_BADGE[t.status].label}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <Stars n={t.rating} />
                    <span className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString("tr-TR")}</span>
                    <span className="text-xs text-gray-400">
                      {t.displayPref === "INITIALS" ? "Baş harfleriyle görünür" : "Adıyla görünür"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {t.status !== "APPROVED" && (
                    <button
                      onClick={() => setStatus(t.id, "APPROVED")}
                      className="text-xs px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      Onayla
                    </button>
                  )}
                  {t.status !== "REJECTED" && (
                    <button
                      onClick={() => setStatus(t.id, "REJECTED")}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Reddet
                    </button>
                  )}
                  <button
                    onClick={() => remove(t.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Sil
                  </button>
                </div>
              </div>
              <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {t.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
