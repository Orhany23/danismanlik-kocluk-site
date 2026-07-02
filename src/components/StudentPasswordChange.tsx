"use client";

import { useState } from "react";

export default function StudentPasswordChange() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPassword !== newPassword2) {
      setMsg({ ok: false, text: "Yeni şifreler birbiriyle uyuşmuyor." });
      return;
    }
    if (newPassword.length < 8) {
      setMsg({ ok: false, text: "Yeni şifre en az 8 karakter olmalı." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/student/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ ok: false, text: data.error || "Şifre değiştirilemedi." });
      } else {
        setMsg({ ok: true, text: "Şifren güncellendi. Bir sonraki girişte yeni şifreni kullan." });
        setCurrentPassword("");
        setNewPassword("");
        setNewPassword2("");
      }
    } catch {
      setMsg({ ok: false, text: "Bir hata oluştu, tekrar dene." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="student-section">
      <div className="student-section-head">
        <h2>Hesap Ayarları</h2>
      </div>
      {!open ? (
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(true)}>
          Şifremi Değiştir
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: 420 }}>
          <label className="auth-label">
            Mevcut Şifre
            <input
              className="auth-input" type="password" value={currentPassword} required
              autoComplete="current-password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <label className="auth-label">
            Yeni Şifre
            <input
              className="auth-input" type="password" value={newPassword} required
              minLength={8} autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label className="auth-label">
            Yeni Şifre (Tekrar)
            <input
              className="auth-input" type="password" value={newPassword2} required
              minLength={8} autoComplete="new-password"
              onChange={(e) => setNewPassword2(e.target.value)}
            />
          </label>
          {msg && (
            <p style={{ color: msg.ok ? "var(--clr-sage-dark)" : "#C0392B", fontSize: "0.92rem", margin: 0 }}>
              {msg.text}
            </p>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="auth-btn" disabled={busy} style={{ flex: 1 }}>
              {busy ? "Kaydediliyor…" : "Şifreyi Güncelle"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setOpen(false); setMsg(null); }}>
              Vazgeç
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
