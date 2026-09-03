"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalı.");
      return;
    }
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Şifre sıfırlanamadı.");
      } else {
        setDone(data.loginUrl || "/ogrenci/giris");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-card">
        <h1 className="auth-title">Geçersiz Bağlantı</h1>
        <p className="auth-sub">Bu bağlantı eksik ya da hatalı. Lütfen sıfırlama talebini yeniden oluştur.</p>
        <p className="auth-foot">
          <Link href="/sifremi-unuttum" className="auth-link">Şifremi unuttum sayfasına git</Link>
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="auth-card">
        <h1 className="auth-title">Şifre Güncellendi</h1>
        <p className="auth-sub">Yeni şifrenle giriş yapabilirsin.</p>
        <button className="auth-btn" onClick={() => router.push(done)}>
          Giriş Sayfasına Git
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Yeni Şifre Belirle</h1>
      <p className="auth-sub">Hesabın için yeni bir şifre gir.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-label">
          Yeni Şifre
          <input
            className="auth-input"
            type="password"
            value={password}
            required
            minLength={8}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="auth-label">
          Yeni Şifre (Tekrar)
          <input
            className="auth-input"
            type="password"
            value={confirm}
            required
            minLength={8}
            autoComplete="new-password"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={busy} className="auth-btn">
          {busy ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-wrap">
      <Suspense fallback={<div className="auth-card">Yükleniyor...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
