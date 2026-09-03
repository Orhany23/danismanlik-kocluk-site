"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Şifremi Unuttum</h1>
        <p className="auth-sub">
          Hesabına kayıtlı e-posta adresini gir, sana bir sıfırlama bağlantısı gönderelim.
        </p>

        {done ? (
          <div className="auth-form">
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 border border-gray-100">
              Bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.
              Gelen kutunu (ve spam klasörünü) kontrol et — bağlantı 1 saat geçerlidir.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              E-posta
              <input
                className="auth-input"
                type="email"
                value={email}
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" disabled={busy} className="auth-btn">
              {busy ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        )}

        <p className="auth-foot">
          <Link href="/ogrenci/giris" className="auth-link">Öğrenci girişine dön</Link>
          {" · "}
          <Link href="/admin/login" className="auth-link">Admin girişine dön</Link>
        </p>
      </div>
    </div>
  );
}
