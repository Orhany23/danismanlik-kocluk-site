"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, MessageSquareQuote } from "lucide-react";
import { CURRICULUM, getGradeById } from "@/lib/curriculum";

type ProgressRow = { topicId: string; checkedAt: string | null; feedback: string | null; feedbackAt: string | null };
type ProgressMap = Record<string, { checked: boolean; feedback: string | null }>;

export default function MufredatClient({ defaultGradeId }: { defaultGradeId: string }) {
  const [gradeId, setGradeId] = useState(defaultGradeId);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/student/topic-progress", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { progress?: ProgressRow[] }) => {
        const map: ProgressMap = {};
        for (const row of d.progress ?? []) {
          map[row.topicId] = { checked: !!row.checkedAt, feedback: row.feedback };
        }
        setProgress(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grade = getGradeById(gradeId) ?? CURRICULUM[0];

  const toggleTopic = async (topicId: string) => {
    const wasChecked = progress[topicId]?.checked ?? false;
    setProgress((prev) => ({ ...prev, [topicId]: { checked: !wasChecked, feedback: prev[topicId]?.feedback ?? null } }));
    try {
      const res = await fetch("/api/student/topic-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, checked: !wasChecked }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Sunucuya yazılamadıysa görsel durumu geri al.
      setProgress((prev) => ({ ...prev, [topicId]: { checked: wasChecked, feedback: prev[topicId]?.feedback ?? null } }));
    }
  };

  const toggleSubject = (subjectId: string) => {
    setOpenSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) next.delete(subjectId);
      else next.add(subjectId);
      return next;
    });
  };

  const gradeProgress = useMemo(() => {
    let checked = 0;
    let total = 0;
    for (const s of grade.subjects) {
      for (const t of s.topics) {
        total++;
        if (progress[t.id]?.checked) checked++;
      }
    }
    return { checked, total };
  }, [grade, progress]);

  return (
    <div>
      <header className="mak-head">
        <span className="section-label">Konu Takibi</span>
        <h1 className="section-title" style={{ maxWidth: 780 }}>
          Çalıştığın Konuları <em>İşaretle</em>
        </h1>
        <p className="section-sub">
          Sınıfını seç, çalıştığın konuları işaretle. İşaretlerin ve Orhan&apos;ın konuya özel
          yorumları burada görünür.
        </p>
      </header>

      <div className="mufredat-grade-tabs" role="tablist" aria-label="Sınıf seç">
        {CURRICULUM.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={g.id === gradeId}
            onClick={() => setGradeId(g.id)}
            className={`mufredat-grade-tab${g.id === gradeId ? " mufredat-grade-tab--active" : ""}`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mufredat-summary">
        <div className="support-progress" style={{ margin: 0, flex: 1 }}>
          <i style={{ width: `${gradeProgress.total ? (gradeProgress.checked / gradeProgress.total) * 100 : 0}%` }} />
        </div>
        <span className="test-progress-label" style={{ whiteSpace: "nowrap" }}>
          {gradeProgress.checked} / {gradeProgress.total} konu
        </span>
      </div>

      {loading ? (
        <p className="student-summary-empty" style={{ marginTop: 24 }}>Yükleniyor…</p>
      ) : (
        <div className="mufredat-subject-list">
          {grade.subjects.map((subject) => {
            const checkedCount = subject.topics.filter((t) => progress[t.id]?.checked).length;
            const open = openSubjects.has(subject.id);
            return (
              <div key={subject.id} className="mufredat-subject">
                <button className="mufredat-subject-head" onClick={() => toggleSubject(subject.id)}>
                  <span className="mufredat-subject-title">{subject.label}</span>
                  <span className="mufredat-subject-count">
                    {checkedCount} / {subject.topics.length}
                  </span>
                  {open ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                </button>
                {open && (
                  <ul className="mufredat-topic-list">
                    {subject.topics.map((topic) => {
                      const state = progress[topic.id];
                      return (
                        <li key={topic.id} className="mufredat-topic">
                          <label className="mufredat-topic-label">
                            <input
                              type="checkbox"
                              checked={!!state?.checked}
                              onChange={() => toggleTopic(topic.id)}
                            />
                            <span>{topic.label}</span>
                          </label>
                          {state?.feedback && (
                            <p className="mufredat-topic-feedback">
                              <MessageSquareQuote size={14} aria-hidden="true" />
                              {state.feedback}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
