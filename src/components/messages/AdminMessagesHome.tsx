"use client";
import { useState } from "react";
import AdminInbox from "./AdminInbox";
import ContactInbox from "./ContactInbox";

export default function AdminMessagesHome({ initialTab, initialPerson }: {
  initialTab: "portal" | "contact";
  initialPerson: { id: string; name: string; gradeLevel: string | null; active: boolean } | null;
}) {
  const [tab, setTab] = useState(initialTab);
  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-800">Mesajlar</h1><p className="text-sm text-gray-500 mt-2">Öğrenci ve danışanlarınla panel üzerinden konuş, yanıt bekleyenleri takip et.</p></div>
    <div className="portal-tabs" aria-label="Mesaj türü"><button type="button" aria-pressed={tab === "portal"} onClick={() => setTab("portal")}>Öğrenci / Danışan</button><button type="button" aria-pressed={tab === "contact"} onClick={() => setTab("contact")}>İletişim formu</button></div>
    {tab === "portal" ? <AdminInbox initialPerson={initialPerson} /> : <ContactInbox />}
  </div>;
}
