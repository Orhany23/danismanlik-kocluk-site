"use client";
import { useState, type FormEvent } from "react";
import type { PortalEmailStatus } from "@/lib/portalMessageNotifications";

export default function AdminNotificationSettings({ initialStatus }: { initialStatus: PortalEmailStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [email, setEmail] = useState(initialStatus.adminEmail || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setSaved(false);
    try {
      const response = await fetch("/api/admin/notification-email", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Bildirim adresi kaydedilemedi.");
      setEmail(data.email); setStatus(data.status); setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bildirim adresi kaydedilemedi. Tekrar deneyin.");
    } finally { setBusy(false); }
  }

  return <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600" aria-labelledby="notification-title">
    <h2 id="notification-title" className="font-semibold text-gray-800">E-posta bildirimleri</h2>
    <p className="mt-1">{status.detail}</p>
    <form onSubmit={save} className="mt-3">
      <label htmlFor="notification-email" className="block font-medium text-gray-800">Bildirim alacağım e-posta</label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input id="notification-email" type="email" required maxLength={254} autoComplete="email" disabled={busy}
          value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false); setError(""); }}
          aria-describedby="notification-help" aria-invalid={Boolean(error)} placeholder="adiniz@gmail.com"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-2 focus:outline-emerald-700" />
        <button type="submit" disabled={busy} className="portal-send">{busy ? "Kaydediliyor…" : "Adresi kaydet"}</button>
      </div>
      <p id="notification-help" className="mt-2 text-xs">Öğrenci ve danışanlar size mesaj yazdığında bu adrese bildirim gelir. Adres yalnızca yönetici panelinde görünür.</p>
      {error && <p role="alert" className="mt-2 text-red-700">{error}</p>}
      {saved && <p role="status" className="mt-2 text-emerald-800">Bildirim adresi kaydedildi. Sonraki yeni mesajlarda kullanılacak.</p>}
    </form>
    <p className="mt-2 text-xs">Bildirimlerde sohbet içeriği paylaşılmaz. E-posta teslimini yeni bir mesaj göndererek kontrol edebilirsiniz.</p>
  </section>;
}
