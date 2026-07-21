"use client";

import { useEffect, useState, useCallback } from "react";

type Status = "PENDING" | "APPROVED" | "REJECTED";
type Existing = { rating: number; text: string; displayPref: string; status: Status } | null;

const STATUS_INFO: Record<Status, { label: string; cls: string }> = {
  PENDING: { label: "Onay bekliyor", cls: "is-pending" },
  APPROVED: { label: "Sitede yayında", cls: "is-approved" },
  REJECTED: { label: "Yayınlanmadı — düzenleyip tekrar gönderebilirsin", cls: "is-rejected" },
};

const MIN_LEN = 20;
const MAX_LEN = 600;

export default function StudentTestimonial() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [displayPref, setDisplayPref] = useState<"NAME" | "INITIALS">("NAME");
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const data: { testimonial?: Existing } = await fetch("/api/student/testimonial")
      .then((r) => r.json())
      .catch(() => ({ testimonial: null }));
    const t = data.testimonial;
    if (t) {
      setRating(t.rating);
      setText(t.text);
      setDisplayPref(t.displayPref === "INITIALS" ? "INITIALS" : "NAME");
      setStatus(t.status);
    }
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load async; state güncellemesi fetch sonrası
  useEffect(() => { void load(); }, [load]);

  const submit = async () => {
    setMsg(null);
    if (rating < 1 || rating > 5) {
      setMsg({ ok: false, text: "Lütfen 1 ile 5 arasında bir puan seç." });
      return;
    }
    const trimmed = text.trim();
    if (trimmed.length < MIN_LEN || trimmed.length > MAX_LEN) {
      setMsg({ ok: false, text: `Yorum en az ${MIN_LEN}, en fazla ${MAX_LEN} karakter olmalı.` });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/student/testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text: trimmed, displayPref }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ ok: false, text: data.error || "Yorum kaydedilemedi." });
      } else {
        setStatus("PENDING");
        setMsg({ ok: true, text: "Yorumun alındı, onay sonrası yayınlanacak." });
      }
    } catch {
      setMsg({ ok: false, text: "Bir hata oluştu, tekrar dene." });
    } finally {
      setSaving(false);
    }
  };

  const count = text.trim().length;

  return (
    <section className="student-section">
      <div className="student-section-head">
        <h2>Deneyimini Paylaş</h2>
        {status && (
          <span className={`testimonial-status-badge ${STATUS_INFO[status].cls}`}>
            {STATUS_INFO[status].label}
          </span>
        )}
      </div>

      <div className="testimonial-form">
        <p className="testimonial-form-desc">
          Yorumun Orhan Yaşlı&apos;nın onayından geçtikten sonra sitede yayınlanır.
        </p>

        {loading ? (
          <p className="testimonial-form-desc">Yükleniyor…</p>
        ) : (
          <>
            {/* Yıldız seçici */}
            <div className="testimonial-field">
              <span className="testimonial-label">Puanın</span>
              <div className="testimonial-stars-input" role="group" aria-label="Puan seç (1-5 yıldız)">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`testimonial-star-btn ${n <= rating ? "is-on" : ""}`}
                    aria-label={`${n} yıldız`}
                    aria-pressed={n === rating}
                    onClick={() => setRating(n)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Yorum metni */}
            <div className="testimonial-field">
              <label className="testimonial-label" htmlFor="testimonial-text">
                Yorumun
              </label>
              <textarea
                id="testimonial-text"
                className="testimonial-textarea"
                value={text}
                maxLength={MAX_LEN}
                placeholder="Birlikte çalışmak sana neler kattı? Deneyimini kısaca anlat…"
                onChange={(e) => setText(e.target.value)}
              />
              <span className={`testimonial-count ${count < MIN_LEN ? "is-low" : ""}`}>
                {count} / {MAX_LEN} karakter (en az {MIN_LEN})
              </span>
            </div>

            {/* Ad görünümü */}
            <div className="testimonial-field">
              <span className="testimonial-label">Adın nasıl görünsün?</span>
              <div className="testimonial-prefs">
                <label className="testimonial-pref">
                  <input
                    type="radio"
                    name="displayPref"
                    checked={displayPref === "NAME"}
                    onChange={() => setDisplayPref("NAME")}
                  />
                  <span>Adımla (Elif Kaya)</span>
                </label>
                <label className="testimonial-pref">
                  <input
                    type="radio"
                    name="displayPref"
                    checked={displayPref === "INITIALS"}
                    onChange={() => setDisplayPref("INITIALS")}
                  />
                  <span>Baş harflerimle (E. K.)</span>
                </label>
              </div>
            </div>

            {msg && (
              <p className={`testimonial-msg ${msg.ok ? "is-ok" : "is-err"}`}>{msg.text}</p>
            )}

            <button type="button" className="auth-btn testimonial-submit" onClick={submit} disabled={saving}>
              {saving ? "Kaydediliyor…" : status ? "Yorumu Güncelle" : "Yorumu Gönder"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
