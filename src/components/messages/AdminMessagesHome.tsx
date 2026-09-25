"use client";
import { useState } from "react";
import AdminInbox from "./AdminInbox";
import ContactInbox from "./ContactInbox";
import type { PortalEmailStatus } from "@/lib/portalMessageNotifications";

export default function AdminMessagesHome({ initialTab, initialPerson, emailStatus }: {
  initialTab: "portal" | "contact";
  initialPerson: { id: string; name: string; gradeLevel: string | null; active: boolean } | null;
  emailStatus: PortalEmailStatus;
}) {
  const [tab, setTab] = useState(initialTab);
  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-800">Mesajlar</h1><p className="text-sm text-gray-500 mt-2">Öğrenci ve danışanlarınla panel üzerinden konuş, yanıt bekleyenleri takip et.</p></div>
    {tab === "portal" && <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600" role="status">
      <p className="font-semibold text-gray-800">E-posta bildirimleri{emailStatus.studentReady && emailStatus.adminReady ? " · Ayarlar mevcut" : " · Kurulum gerekli"}</p>
      <p className="mt-1">{emailStatus.detail}</p>
      {emailStatus.adminEmail && <p className="mt-1 break-all">Bildirim adresiniz: <strong>{emailStatus.adminEmail}</strong></p>}
      <p className="mt-1 text-xs">Bildirimlerde mesaj içeriği paylaşılmaz. Ayarların bulunması, e-postanın teslim edildiğini doğrulamaz.</p>
    </div>}
    <div className="portal-tabs" aria-label="Mesaj türü"><button type="button" aria-pressed={tab === "portal"} onClick={() => setTab("portal")}>Öğrenci / Danışan</button><button type="button" aria-pressed={tab === "contact"} onClick={() => setTab("contact")}>İletişim formu</button></div>
    {tab === "portal" ? <AdminInbox initialPerson={initialPerson} /> : <ContactInbox />}
  </div>;
}
