"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

// Kayıt formundaki doğum yılı seçenekleri (bugünden 100 yıl geriye).
const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - 6 - i);

export default function StudentRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gradeLevel: "",
    birthYear: "",
    guardianName: "",
    guardianPhone: "",
    guardianConsent: false,
    website: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isMinor = form.birthYear !== "" && CURRENT_YEAR - Number(form.birthYear) < 18;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kayıt başarısız.");
        setBusy(false);
        return;
      }
      // Otomatik giriş
      const result = await signIn("student", {
        email: form.email.toLowerCase().trim(),
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        router.push("/ogrenci/giris");
      } else {
        router.push("/ogrenci");
      }
    } catch {
      setError("Bir hata oluştu, tekrar deneyin.");
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="36" height="36">
            <g fill="none" stroke="var(--clr-primary)" strokeWidth="3.4" strokeLinecap="round">
              <path d="M24 10v28" />
              <path d="M12 12v7c0 7 5 11 12 11s12-4 12-11v-7" />
            </g>
          </svg>
        </div>
        <h1 className="auth-title">Öğrenci Kaydı</h1>
        <p className="auth-sub">Kaynaklara ve sana özel içeriklere erişmek için hesap oluştur.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text" name="website" tabIndex={-1} autoComplete="off"
            value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
            style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true"
          />
          <label className="auth-label">
            Ad Soyad
            <input className="auth-input" type="text" value={form.name} required
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="auth-label">
            E-posta
            <input className="auth-input" type="email" value={form.email} required
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="auth-label">
            Şifre <span className="auth-hint">(en az 8 karakter)</span>
            <input className="auth-input" type="password" value={form.password} required minLength={8}
              autoComplete="new-password"
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <label className="auth-label">
            Sınıf / Hedef <span className="auth-hint">(opsiyonel)</span>
            <select className="auth-input" value={form.gradeLevel}
              onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}>
              <option value="">Seçiniz</option>
              <option value="LGS">LGS</option>
              <option value="YKS-Sayısal">YKS — Sayısal</option>
              <option value="YKS-EA">YKS — Eşit Ağırlık</option>
              <option value="YKS-Sözel">YKS — Sözel</option>
              <option value="YKS-Dil">YKS — Dil</option>
              <option value="Mezun">Mezun</option>
              <option value="Diğer">Diğer</option>
            </select>
          </label>

          <label className="auth-label">
            Doğum yılı
            <select className="auth-input" value={form.birthYear} required
              onChange={(e) => setForm({ ...form, birthYear: e.target.value })}>
              <option value="">Seçiniz</option>
              {BIRTH_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>

          {/* 18 yaş altındaysa veli bilgisi zorunlu: onay kaydı "kim onayladı,
              nasıl ulaşılır" bilgisini de içersin. */}
          {isMinor && (
            <>
              <label className="auth-label">
                Veli adı soyadı
                <input className="auth-input" type="text" required value={form.guardianName}
                  onChange={(e) => setForm({ ...form, guardianName: e.target.value })} />
              </label>
              <label className="auth-label">
                Veli telefonu
                <input className="auth-input" type="tel" required value={form.guardianPhone}
                  placeholder="05XX XXX XX XX"
                  onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} />
              </label>
            </>
          )}

          <label className="auth-consent">
            <input type="checkbox" checked={form.guardianConsent} required
              onChange={(e) => setForm({ ...form, guardianConsent: e.target.checked })} />
            <span>
              {isMinor
                ? "Velim bu kaydı biliyor ve onay veriyor. "
                : "18 yaşından büyüğüm. "}
              <Link href="/gizlilik" target="_blank" className="auth-link">Gizlilik Politikası</Link>{" "}
              ve{" "}
              <Link href="/kullanim-kosullari" target="_blank" className="auth-link">Kullanım Koşulları</Link>{"'nı"} okudum, kabul ediyorum.
            </span>
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={busy} className="auth-btn">
            {busy ? "Kaydediliyor..." : "Hesap Oluştur"}
          </button>
        </form>

        <p className="auth-foot">
          Zaten hesabın var mı?{" "}
          <Link href="/ogrenci/giris" className="auth-link">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}
