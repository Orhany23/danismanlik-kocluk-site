"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CardListSkeleton } from "@/components/admin/Skeleton";

type Submission = {
  id: string;
  testSlug: string;
  testTitle: string;
  answers: Record<string, string>;
  score: number | null;
  maxScore: number | null;
  resultLabel: string;
  createdAt: string;
  student: { id: string; name: string; gradeLevel: string | null };
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminTestSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [testFilter, setTestFilter] = useState<string>("");
  const [studentFilter, setStudentFilter] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/test-submissions", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSubmissions(d.submissions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tests = useMemo(() => {
    const map = new Map<string, string>();
    submissions.forEach((s) => map.set(s.testSlug, s.testTitle));
    return Array.from(map, ([slug, title]) => ({ slug, title }));
  }, [submissions]);

  const students = useMemo(() => {
    const map = new Map<string, string>();
    submissions.forEach((s) => map.set(s.student.id, s.student.name));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [submissions]);

  const filtered = submissions.filter((s) => {
    if (testFilter && s.testSlug !== testFilter) return false;
    if (studentFilter && s.student.id !== studentFilter) return false;
    return true;
  });

  if (loading) return <CardListSkeleton rows={4} />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Test Sonuçları</h2>
          <p className="text-sm text-gray-500 mt-1">
            Öğrencilerin doldurduğu psikolojik testler ve puanları. Yorumlama sana ait.
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
          <select
            value={testFilter}
            onChange={(e) => setTestFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
          >
            <option value="">Tüm testler</option>
            {tests.map((t) => (
              <option key={t.slug} value={t.slug}>{t.title}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-16 text-center text-sm text-gray-400">
          {submissions.length === 0 ? "Henüz test sonucu gönderilmedi." : "Bu filtreye uygun sonuç yok."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((s) => {
            const open = openId === s.id;
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenId(open ? null : s.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {s.student.name}
                      {s.student.gradeLevel && <span className="text-gray-400 font-normal"> · {s.student.gradeLevel}</span>}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.testTitle} · {fmtDate(s.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1 bg-[var(--clr-accent-tint)] text-[var(--clr-primary)]">
                      {s.score !== null ? `${s.score} / ${s.maxScore}` : s.resultLabel}
                    </span>
                    {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </button>
                {open && (
                  <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Sonuç: {s.resultLabel}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Madde bazında cevaplar</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      {Object.entries(s.answers).map(([qId, val]) => (
                        <div key={qId} className="flex items-center gap-2">
                          <span className="text-gray-400 font-mono text-xs">{qId}</span>
                          <span>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
