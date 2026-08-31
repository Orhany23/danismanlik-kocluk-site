"use client";

import { useState, useEffect, useRef } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  // Sunucudaki son bilinen değerler — "kaydedilmemiş değişiklik var mı?"
  // sorusunu yanıtlamak için tutulur.
  const savedRef = useRef<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"ok" | "err">("ok");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        savedRef.current = { ...data };
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Yalnızca değişen alanlar gönderilir; kayıt tek ve açık bir eylemdir
  // (alan terk edilince sessizce kaydetmek kullanıcıyı kontrolsüz bırakıyordu).
  const handleSaveAll = async () => {
    const changed = Object.entries(settings).filter(([key, value]) => savedRef.current[key] !== value);
    if (changed.length === 0) {
      setMessageType("ok");
      setMessage("Değişiklik yok.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setSaving(true);
    let failed = 0;
    for (const [key, value] of changed) {
      try {
        const res = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
        if (res.ok) savedRef.current[key] = value;
        else failed++;
      } catch {
        failed++;
      }
    }
    setSaving(false);
    setDirty(failed > 0);
    if (failed === 0) {
      setMessageType("ok");
      setMessage(`Kaydedildi (${changed.length} alan).`);
    } else {
      setMessageType("err");
      setMessage(`${failed} alan kaydedilemedi, tekrar deneyin.`);
    }
    setTimeout(() => setMessage(""), 5000);
  };

  const handleReset = () => {
    setSettings({ ...savedRef.current });
    setDirty(false);
    setMessage("");
  };

  const updateField = (key: string, value: string) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      setDirty(Object.entries(next).some(([k, v]) => savedRef.current[k] !== v));
      return next;
    });
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Ayarlar</h2>
        <p className="text-sm text-gray-500 mt-1">Site ayarlarını yönetin.</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
          messageType === "err"
            ? "bg-red-50 text-red-700 border-red-100"
            : "bg-emerald-50 text-emerald-700 border-emerald-100"
        }`}>
          <span className="text-lg">{messageType === "err" ? "✕" : "✓"}</span> {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">İletişim Bilgileri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input value={settings.phone || ""} onChange={(e) => updateField("phone", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input value={settings.email || ""} onChange={(e) => updateField("email", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <input value={settings.address || ""} onChange={(e) => updateField("address", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Saatleri</label>
              <input value={settings.hours || ""} onChange={(e) => updateField("hours", e.target.value)} className="form-control" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">Sosyal Medya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input value={settings.instagram || ""} onChange={(e) => updateField("instagram", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input value={settings.linkedin || ""} onChange={(e) => updateField("linkedin", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
              <input value={settings.youtube || ""} onChange={(e) => updateField("youtube", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
              <input value={settings.twitter || ""} onChange={(e) => updateField("twitter", e.target.value)} className="form-control" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Başlığı</label>
              <input value={settings.siteTitle || ""} onChange={(e) => updateField("siteTitle", e.target.value)} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Açıklaması</label>
              <textarea value={settings.siteDescription || ""} onChange={(e) => updateField("siteDescription", e.target.value)} className="form-control" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler</label>
              <input value={settings.siteKeywords || ""} onChange={(e) => updateField("siteKeywords", e.target.value)} className="form-control" />
            </div>
          </div>
        </div>
      </div>

      {/* Tek ve açık kayıt eylemi; sayfa altına yapışır ki uzun formda kaybolmasın. */}
      <div className="sticky bottom-[68px] lg:bottom-0 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 bg-[#f5f7fa]/95 backdrop-blur border-t border-gray-200 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSaveAll}
          disabled={saving || !dirty}
          style={{ backgroundColor: "#1e3a8a", color: "#ffffff" }}
          className="px-6 py-3 min-h-[44px] rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
        </button>
        {dirty && !saving && (
          <button
            onClick={handleReset}
            className="px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-white transition-colors"
          >
            Değişiklikleri geri al
          </button>
        )}
        <span className="text-xs text-gray-500" role="status" aria-live="polite">
          {saving ? "Kaydediliyor…" : dirty ? "Kaydedilmemiş değişiklikleriniz var." : "Tüm değişiklikler kayıtlı."}
        </span>
      </div>

      <PasswordChangeCard />
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
      <button
        onClick={handleChangePassword}
        disabled={busy || !currentPassword || !newPassword}
        style={{ backgroundColor: "#1e3a8a", color: "#ffffff" }}
        className="mt-4 px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {busy ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
      </button>
    </div>
  );
}
