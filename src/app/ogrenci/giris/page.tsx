"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = await signIn("student", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("E-posta veya şifre hatalı.");
      setBusy(false);
    } else {
      router.push("/ogrenci");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="36" height="36">
            <g fill="none" stroke="#E8590C" strokeWidth="3.4" strokeLinecap="round">
              <path d="M24 10v28" />
              <path d="M12 12v7c0 7 5 11 12 11s12-4 12-11v-7" />
            </g>
          </svg>
        </div>
        <h1 className="auth-title">Öğrenci Girişi</h1>
        <p className="auth-sub">Hesabına giriş yaparak kaynaklarına ulaş.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            E-posta
            <input className="auth-input" type="email" value={email} required
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="auth-label">
            Şifre
            <input className="auth-input" type="password" value={password} required
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={busy} className="auth-btn">
            {busy ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="auth-foot">
          Hesabın yok mu?{" "}
          <Link href="/ogrenci/kayit" className="auth-link">Kayıt ol</Link>
        </p>
      </div>
    </div>
  );
}
