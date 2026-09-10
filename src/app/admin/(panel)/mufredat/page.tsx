"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react";
import { CardListSkeleton } from "@/components/admin/Skeleton";
import { CURRICULUM, getGradeById } from "@/lib/curriculum";

type StudentOption = { id: string; name: string; gradeLevel: string | null };
type ProgressRow = { topicId: string; checkedAt: string | null; feedback: string | null; feedbackAt: string | null };
type ProgressMap = Record<string, { checked: boolean; feedback: string | null }>;

export default function AdminMufredatPage() {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentId, setStudentId] = useState("");
  const [gradeId, setGradeId] = useState(CURRICULUM[CURRICULUM.length - 1].id);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/students", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { students?: StudentOption[] }) => setStudents(d.students ?? []))
      .catch(() => {})
      .finally(() => setLoadingStudents(false));
  }, []);

  useEffect(() => {
    if (!studentId) return;
    fetch(`/api/admin/topic-progress?studentId=${encodeURIComponent(studentId)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { progress?: ProgressRow[] }) => {
        const map: ProgressMap = {};
        for (const row of d.progress ?? []) {
          map[row.topicId] = { checked: !!row.checkedAt, feedback: row.feedback };
        }
        setProgress(map);
        // İşaretli konusu olan dersleri otomatik aç
        const withChecked = new Set<string>();
        for (const g of CURRICULUM) {
          for (const s of g.subjects) {
            if (s.topics.some((t) => map[t.id]?.checked)) withChecked.add(s.id);
          }
        }
        setOpenSubjects(withChecked);
      })
      .catch(() => {})
      .finally(() => setLoadingProgress(false));
  }, [studentId]);

  const grade = getGradeById(gradeId) ?? CURRICULUM[0];

  const toggleSubject = (subjectId: string) => {
    setOpenSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) next.delete(subjectId);
      else next.add(subjectId);
      return next;
    });
  };

  const saveFeedback = async (topicId: string, feedback: string) => {
    setProgress((prev) => ({ ...prev, [topicId]: { checked: prev[topicId]?.checked ?? false, feedback: feedback || null } }));
    await fetch("/api/admin/topic-progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, topicId, feedback }),
    }).catch(() => {});
  };

  if (loadingStudents) return <CardListSkeleton rows={4} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Konu Takibi</h2>
        <p className="text-sm text-gray-500 mt-1">
          Öğrencinin işaretlediği konuları gör, konu bazında yorum bırak.
        </p>
      </div>

      <select
        value={studentId}
        onChange={(e) => {
          const id = e.target.value;
          setStudentId(id);
          if (id) {
            setLoadingProgress(true);
          } else {
            setProgress({});
            setOpenSubjects(new Set());
          }
        }}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 w-full max-w-sm"
      >
        <option value="">Öğrenci seç…</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>{s.name}{s.gradeLevel ? ` · ${s.gradeLevel}` : ""}</option>
        ))}
      </select>

      {!studentId ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-16 text-center text-sm text-gray-400">
          Konuları görmek için bir öğrenci seç.
        </div>
      ) : loadingProgress ? (
        <CardListSkeleton rows={3} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {CURRICULUM.map((g) => (
              <button
                key={g.id}
                onClick={() => setGradeId(g.id)}
                className={`text-sm font-medium rounded-full px-3.5 py-1.5 transition-colors ${
                  g.id === gradeId ? "bg-[var(--clr-primary)] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {grade.subjects.map((subject) => {
              const checkedCount = subject.topics.filter((t) => progress[t.id]?.checked).length;
              const open = openSubjects.has(subject.id);
              return (
                <div key={subject.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleSubject(subject.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left"
                  >
                    <span className="text-sm font-semibold text-gray-800">{subject.label}</span>
                    <span className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-400">{checkedCount} / {subject.topics.length}</span>
                      {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </span>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                      {subject.topics.map((topic) => (
                        <TopicRow
                          key={topic.id}
                          label={topic.label}
                          checked={!!progress[topic.id]?.checked}
                          feedback={progress[topic.id]?.feedback ?? null}
                          onSave={(fb) => saveFeedback(topic.id, fb)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function TopicRow({
  label,
  checked,
  feedback,
  onSave,
}: {
  label: string;
  checked: boolean;
  feedback: string | null;
  onSave: (feedback: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(feedback ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await Promise.resolve(onSave(text));
    setSaving(false);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-2">
        {checked ? (
          <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
        ) : (
          <Circle size={16} className="text-gray-300 mt-0.5 shrink-0" />
        )}
        <span className={`text-sm flex-1 ${checked ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
      </div>
      {feedback && !open && (
        <div className="ml-6 flex items-center justify-between gap-2 rounded-lg bg-[var(--clr-accent-tint)] px-3 py-2">
          <p className="text-xs text-gray-700">{feedback}</p>
          <button onClick={() => { setText(feedback); setOpen(true); }} className="text-xs text-[var(--clr-primary)] hover:underline shrink-0">
            Düzenle
          </button>
        </div>
      )}
      {!feedback && !open && (
        <button onClick={() => setOpen(true)} className="ml-6 text-xs font-medium text-[var(--clr-primary)] hover:underline w-fit">
          💬 Yorum ekle
        </button>
      )}
      {open && (
        <div className="ml-6 flex flex-col gap-1.5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            maxLength={2000}
            autoFocus
            placeholder="Bu konuyla ilgili öğrenciye not yaz…"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[var(--clr-primary)]"
          />
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={saving} className="text-xs font-medium rounded-lg px-3 py-1.5 bg-[var(--clr-primary)] text-white hover:opacity-90 disabled:opacity-50">
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button onClick={() => { setOpen(false); setText(feedback ?? ""); }} className="text-xs text-gray-500 hover:underline">
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
