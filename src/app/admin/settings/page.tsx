"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(false);
    if (res.ok) {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setMessage("Kaydedildi!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Ayarlar</h2>
        <p className="text-sm text-gray-500 mt-1">Site ayarlarını yönetin.</p>
      </div>

      {message && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm border border-emerald-100">
          <span>✓</span> {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">İletişim Bilgileri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input value={settings.phone || ""} onChange={(e) => updateField("phone", e.target.value)}
                onBlur={(e) => handleSave("phone", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input value={settings.email || ""} onChange={(e) => updateField("email", e.target.value)}
                onBlur={(e) => handleSave("email", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <input value={settings.address || ""} onChange={(e) => updateField("address", e.target.value)}
                onBlur={(e) => handleSave("address", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Saatleri</label>
              <input value={settings.hours || ""} onChange={(e) => updateField("hours", e.target.value)}
                onBlur={(e) => handleSave("hours", e.target.value)} className="form-control" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">Sosyal Medya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input value={settings.instagram || ""} onChange={(e) => updateField("instagram", e.target.value)}
                onBlur={(e) => handleSave("instagram", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input value={settings.linkedin || ""} onChange={(e) => updateField("linkedin", e.target.value)}
                onBlur={(e) => handleSave("linkedin", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
              <input value={settings.youtube || ""} onChange={(e) => updateField("youtube", e.target.value)}
                onBlur={(e) => handleSave("youtube", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
              <input value={settings.twitter || ""} onChange={(e) => updateField("twitter", e.target.value)}
                onBlur={(e) => handleSave("twitter", e.target.value)} className="form-control" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Başlığı</label>
              <input value={settings.siteTitle || ""} onChange={(e) => updateField("siteTitle", e.target.value)}
                onBlur={(e) => handleSave("siteTitle", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Açıklaması</label>
              <textarea value={settings.siteDescription || ""} onChange={(e) => updateField("siteDescription", e.target.value)}
                onBlur={(e) => handleSave("siteDescription", e.target.value)} className="form-control" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler</label>
              <input value={settings.siteKeywords || ""} onChange={(e) => updateField("siteKeywords", e.target.value)}
                onBlur={(e) => handleSave("siteKeywords", e.target.value)} className="form-control" />
            </div>
          </div>
        </div>
      </div>

      <PasswordChangeCard />

      {saving && <div className="text-center text-sm text-gray-400">Kaydediliyor...</div>}
    </div>
  );
}

function PasswordChangeCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const handleChangePassword = async () => {
    setStatus(null);
    if (newPassword.length < 8) {
      setStatus({ type: "err", text: "Yeni şifre en az 8 karakter olmalı." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "err", text: "Yeni şifreler eşleşmiyor." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "ok", text: "Şifre başarıyla değiştirildi." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setStatus({ type: "err", text: data.error || "Şifre değiştirilemedi." });
      }
    } catch {
      setStatus({ type: "err", text: "Bir hata oluştu, tekrar deneyin." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-700 mb-4">Şifre Değiştir</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
          <input type="password" value={currentPassword} autoComplete="current-password"
            onChange={(e) => setCurrentPassword(e.target.value)} className="form-control" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
          <input type="password" value={newPassword} autoComplete="new-password"
            onChange={(e) => setNewPassword(e.target.value)} className="form-control" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
          <input type="password" value={confirmPassword} autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" />
        </div>
      </div>
      {status && (
        <div className={`mt-4 px-4 py-3 rounded-xl text-sm border ${
          status.type === "ok"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {status.text}
        </div>
      )}
      <button onClick={handleChangePassword} disabled={busy || !currentPassword || !newPassword}
        className="mt-4 px-5 py-2.5 rounded-xl bg-[var(--clr-navy,#1e3a8a)] text-white text-sm font-medium disabled:opacity-50">
        {busy ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
      </button>
    </div>
  );
}
