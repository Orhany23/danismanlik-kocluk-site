"use client";

import { useState, useEffect } from "react";
import { useAdminDialog } from "@/components/admin/DialogProvider";
import { CalendarDays, Mail, Phone } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
};

async function fetchMessages(): Promise<Message[]> {
  const res = await fetch("/api/messages");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function AdminMessagesPage() {
  const { confirm } = useAdminDialog();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = async (id: string) => {
    const ok = await confirm({
      title: "Mesaj silinsin mi?",
      description: "Bu işlem geri alınamaz.",
      confirmLabel: "Sil",
      tone: "danger",
    });
    if (!ok) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) markAsRead(msg.id);
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mesajlar</h2>
        <p className="text-sm text-gray-500 mt-1">İletişim formundan gelen mesajlar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left px-5 py-4 transition-colors ${!msg.read ? "bg-indigo-50/50 font-medium" : "hover:bg-gray-50"} ${selected?.id === msg.id ? "bg-indigo-50 border-l-2 border-[var(--clr-primary)]" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-800 truncate">{msg.name}</span>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{new Date(msg.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.message}</p>
              </button>
            ))}
            {messages.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-gray-400">Henüz mesaj bulunmuyor.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {selected ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{selected.name}</h3>
                <button onClick={() => deleteMessage(selected.id)} className="text-xs text-red-500 hover:underline">Sil</button>
              </div>
              <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={14} strokeWidth={1.8} aria-hidden="true" />
                  {selected.email}
                </span>
                {selected.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={14} strokeWidth={1.8} aria-hidden="true" />
                    {selected.phone}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} strokeWidth={1.8} aria-hidden="true" />
                  {new Date(selected.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-400 py-20">Görüntülemek için bir mesaj seçin.</div>
          )}
        </div>
      </div>
    </div>
  );
}
