"use client";

import { useState } from "react";
import { ClipboardList, RotateCcw, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import type { PsychTest, LikertTest, CategoryTest, CategoryResult } from "@/lib/psychTests";

type LikertApiResult = { kind: "likert"; score: number; maxScore: number; crisisFlag: boolean };
type CategoryApiResult = { kind: "category"; result: CategoryResult };

function CrisisBanner() {
  return (
    <div className="test-crisis-banner">
      <AlertTriangle strokeWidth={1.8} aria-hidden="true" />
      <div>
        <strong>Yalnız değilsin.</strong> Cevaplarından biri, zor bir dönemden geçtiğini
        gösteriyor olabilir. Kendine zarar verme düşüncen varsa şimdi <strong>112</strong>&apos;yi
        ara ya da yanında güvendiğin biriyle konuş. Orhan Yaşlı da bu konuşmayı seninle yapmak
        üzere bilgilendirildi.
      </div>
    </div>
  );
}

async function submitTest(testSlug: string, answers: Record<string, string>) {
  const res = await fetch("/api/student/test-submission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testSlug, answers }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gönderim sırasında bir hata oluştu.");
  return data as LikertApiResult | CategoryApiResult;
}

export default function PsychTestClient({ test }: { test: PsychTest }) {
  return test.kind === "likert" ? <LikertTestForm test={test} /> : <CategoryTestForm test={test} />;
}

function TestHead({ test }: { test: PsychTest }) {
  return (
    <header className="mak-head">
      <span className="mak-card-badge">
        <ClipboardList strokeWidth={1.6} aria-hidden="true" />
        {test.category}
      </span>
      <h1 className="section-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}>
        {test.title}
      </h1>
      <p className="section-sub" style={{ marginBottom: 0 }}>
        {test.intro}
      </p>
      {test.kind === "likert" && test.source && (
        <p className="mak-card-meta" style={{ marginTop: 10, marginBottom: 0 }}>
          {test.source}
        </p>
      )}
    </header>
  );
}

function ProgressBar({ answered, total }: { answered: number; total: number }) {
  const pct = Math.round((answered / total) * 100);
  return (
    <div className="test-progress-wrap" aria-hidden="true">
      <div className="support-progress">
        <i style={{ width: `${pct}%` }} />
      </div>
      <span className="test-progress-label">
        {answered} / {total} soru yanıtlandı
      </span>
    </div>
  );
}

function ResultActions({ onReset }: { onReset: () => void }) {
  return (
    <div className="test-actions">
      <button type="button" className="btn btn-ghost" onClick={onReset}>
        <RotateCcw strokeWidth={1.8} aria-hidden="true" />
        Tekrar çöz
      </button>
      <a
        href="https://wa.me/905432500417?text=Merhaba,%20bir%20testin%20sonucuyla%20ilgili%20konu%C5%9Fmak%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        WhatsApp&apos;tan konuş
      </a>
    </div>
  );
}

function LikertTestForm({ test }: { test: LikertTest }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<LikertApiResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = await submitTest(test.slug, answers);
      if (data.kind === "likert") setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gönderim sırasında bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div>
        <TestHead test={test} />
        {result.crisisFlag && <CrisisBanner />}
        <div className="test-result">
          <span className="test-result-score">
            {result.score} / {result.maxScore}
          </span>
          <h2 className="test-result-label">Puanın kaydedildi</h2>
          <p className="test-result-desc">
            Bu puanın ne anlama geldiğini yorumlamıyoruz; bir sonraki görüşmede Orhan Yaşlı
            ile birlikte değerlendireceksiniz.
          </p>
        </div>
        <p className="support-disclaimer">{test.disclaimer}</p>
        <ResultActions onReset={handleReset} />
      </div>
    );
  }

  return (
    <div>
      <TestHead test={test} />
      <ProgressBar answered={answeredCount} total={total} />
      <form onSubmit={handleSubmit}>
        <ol className="test-question-list">
          {test.questions.map((q, i) => {
            const options = q.options ?? test.options;
            return (
              <li key={q.id} className="test-question">
                <p className="test-question-text">
                  <span className="test-question-index">{i + 1}</span>
                  {q.text}
                </p>
                <div className="test-options" role="radiogroup" aria-label={q.text || `Soru ${i + 1}`}>
                  {options.map((opt, oi) => {
                    const value = String(opt.value);
                    const inputId = `${q.id}-${oi}`;
                    const checked = answers[q.id] === value;
                    return (
                      <label key={inputId} htmlFor={inputId} className={`test-option${checked ? " test-option--checked" : ""}`}>
                        <input
                          type="radio"
                          id={inputId}
                          name={q.id}
                          checked={checked}
                          onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
        {error && <p className="test-error">{error}</p>}
        <div className="test-actions">
          <button type="submit" className="btn btn-primary" disabled={!allAnswered || submitting}>
            {submitting ? (
              <Loader2 className="animate-spin" strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <CheckCircle2 strokeWidth={1.8} aria-hidden="true" />
            )}
            {submitting ? "Gönderiliyor…" : "Sonucu gör"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CategoryTestForm({ test }: { test: CategoryTest }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CategoryResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = await submitTest(test.slug, answers);
      if (data.kind === "category") setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gönderim sırasında bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div>
        <TestHead test={test} />
        <div className="test-result test-result--low">
          <h2 className="test-result-label">{result.label}</h2>
          <p className="test-result-desc">{result.description}</p>
          <ul className="test-result-tips">
            {result.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
        <p className="support-disclaimer">{test.disclaimer}</p>
        <ResultActions onReset={handleReset} />
      </div>
    );
  }

  return (
    <div>
      <TestHead test={test} />
      <ProgressBar answered={answeredCount} total={total} />
      <form onSubmit={handleSubmit}>
        <ol className="test-question-list">
          {test.questions.map((q, i) => (
            <li key={q.id} className="test-question">
              <p className="test-question-text">
                <span className="test-question-index">{i + 1}</span>
                {q.text}
              </p>
              <div className="test-options" role="radiogroup" aria-label={q.text}>
                {q.options.map((opt, oi) => {
                  const inputId = `${q.id}-${oi}`;
                  const checked = answers[q.id] === opt.category;
                  return (
                    <label key={inputId} htmlFor={inputId} className={`test-option${checked ? " test-option--checked" : ""}`}>
                      <input
                        type="radio"
                        id={inputId}
                        name={q.id}
                        checked={checked}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.category }))}
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
        {error && <p className="test-error">{error}</p>}
        <div className="test-actions">
          <button type="submit" className="btn btn-primary" disabled={!allAnswered || submitting}>
            {submitting ? (
              <Loader2 className="animate-spin" strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <CheckCircle2 strokeWidth={1.8} aria-hidden="true" />
            )}
            {submitting ? "Gönderiliyor…" : "Sonucu gör"}
          </button>
        </div>
      </form>
    </div>
  );
}
