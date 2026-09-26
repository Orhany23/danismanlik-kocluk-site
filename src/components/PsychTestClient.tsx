"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, RotateCcw, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import type { PsychTest, LikertTest, CategoryTest } from "@/lib/psychTests";

type LikertApiResult = { kind: "likert"; crisisFlag: boolean };
type CategoryApiResult = { kind: "category" };

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

function ResultActions({ onReset, testTitle }: { onReset: () => void; testTitle?: string }) {
  const waMsg = testTitle
    ? `Merhaba Orhan Bey, sitenizdeki "${testTitle}" testini tamamladım. Sonucumu ve klinik değerlendirmesini birlikte görüşmek istiyorum.`
    : "Merhaba Orhan Bey, bir testin sonucuyla ilgili görüşmek istiyorum.";
  return (
    <div className="test-actions" style={{ marginTop: 24, flexWrap: "wrap" }}>
      <button type="button" className="btn btn-ghost" onClick={onReset}>
        <RotateCcw strokeWidth={1.8} aria-hidden="true" />
        Testi tekrar çöz
      </button>
      <a
        href={`https://wa.me/905432500417?text=${encodeURIComponent(waMsg)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        WhatsApp&apos;tan Orhan Yaşlı&apos;ya Yaz
      </a>
      <Link href="/testler" className="btn btn-ghost">
        Tüm testlere dön
      </Link>
    </div>
  );
}

function TestCompletionView({
  test,
  crisisFlag,
  onReset,
}: {
  test: PsychTest;
  crisisFlag?: boolean;
  onReset: () => void;
}) {
  return (
    <div>
      <TestHead test={test} />
      {crisisFlag && <CrisisBanner />}
      <div className="test-result" style={{ textAlign: "center", padding: "36px 24px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "var(--clr-accent-tint, rgba(122,39,64,0.08))",
            color: "var(--clr-primary)",
            marginBottom: 16,
          }}
        >
          <CheckCircle2 strokeWidth={2.2} size={34} aria-hidden="true" />
        </div>
        <h2 className="test-result-label" style={{ fontSize: "1.45rem", marginBottom: 10 }}>
          Testiniz Başarıyla Tamamlandı
        </h2>
        <p className="test-result-desc" style={{ maxWidth: 540, margin: "0 auto 18px", fontSize: "0.98rem", lineHeight: 1.7 }}>
          Cevaplarınız ve test değerlendirmeniz danışmanınız <strong>Orhan Yaşlı</strong>&apos;nın paneline güvenle iletilmiştir.
        </p>
        <div
          style={{
            background: "var(--clr-bg2, #fbf8f5)",
            border: "1px solid var(--clr-border, #e5ded6)",
            borderRadius: "var(--radius, 12px)",
            padding: "16px 20px",
            maxWidth: 560,
            margin: "0 auto",
            fontSize: "0.92rem",
            lineHeight: 1.65,
            color: "var(--clr-text2)",
          }}
        >
          Klinik ilkemiz gereğince test puanları ve sonuç analizleri ekranda doğrudan gösterilmemektedir.
          Testinizin sonucunu, bilimsel değerlendirmesini ve size özel yol haritasını öğrenmek için
          lütfen <strong>Orhan Yaşlı</strong> ile iletişime geçiniz.
        </div>
      </div>
      <p className="support-disclaimer" style={{ marginTop: 20 }}>{test.disclaimer}</p>
      <ResultActions onReset={onReset} testTitle={test.title} />
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
    return <TestCompletionView test={test} crisisFlag={result.crisisFlag} onReset={handleReset} />;
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
            {submitting ? "Gönderiliyor…" : "Testi Tamamla ve Gönder"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CategoryTestForm({ test }: { test: CategoryTest }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitTest(test.slug, answers);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gönderim sırasında bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <TestCompletionView test={test} onReset={handleReset} />;
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
            {submitting ? "Gönderiliyor…" : "Testi Tamamla ve Gönder"}
          </button>
        </div>
      </form>
    </div>
  );
}
