"use client";

import { useState, useEffect } from "react";
import { useAdminDialog } from "@/components/admin/DialogProvider";
import { CalendarDays, CheckCircle2, Mail, Phone, Send } from "lucide-react";
import { CardListSkeleton } from "@/components/admin/Skeleton";

type Message = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  read: boolean;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
};

async function fetchMessages(): Promise<Message[]> {
  const res = await fetch("/api/messages", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function AdminMessagesPage() {
  const { confirm } = useAdminDialog();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchMessages().then(setMessages).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
    setSelected((prev) => prev?.id === id ? { ...prev, read: true } : prev);
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    setReply(msg.reply ?? "");
    setNotice(null);
    if (!msg.read) void markAsRead(msg.id);
  };

  const sendReply = async () => {
    if (!selected || sending) return;
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yanıt gönderilemedi.");
      const updated = data.message as Message;
      setMessages((prev) => prev.map((m) => m.id === updated.id ? updated : m));
      setSelected(updated);
      setReply(updated.reply ?? "");
      setNotice({ ok: true, text: "Yanıt e-posta ile gönderildi ve cevaplandı olarak kaydedildi." });
    } catch (error) {
      setNotice({ ok: false, text: error instanceof Error ? error.message : "Yanıt gönderilemedi." });
    } finally {
      setSending(false);
    }
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

  if (loading) return <CardListSkeleton rows={4} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mesajlar</h2>
        <p className="text-sm text-gray-500 mt-1">İletişim formundan gelen mesajları gör ve doğrudan e-posta ile yanıtla.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <button key={msg.id} onClick={() => openMessage(msg)}
                className={`w-full text-left px-5 py-4 transition-colors ${!msg.read ? "bg-indigo-50/50 font-medium" : "hover:bg-gray-50"} ${selected?.id === msg.id ? "bg-indigo-50 border-l-2 border-[var(--clr-primary)]" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-800 truncate">{msg.name}</span>
                  <span className="flex items-center gap-2 text-xs text-gray-400 shrink-0 ml-2">
                    {msg.repliedAt && <CheckCircle2 size={14} className="text-emerald-600" aria-label="Cevaplandı" />}
                    {new Date(msg.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.message}</p>
              </button>
            ))}
            {messages.length === 0 && <div className="px-5 py-12 text-center text-sm text-gray-400">Henüz mesaj bulunmuyor.</div>}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {selected ? (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selected.name}</h3>
                  <span className={`text-xs ${selected.repliedAt ? "text-emerald-600" : "text-amber-600"}`}>
                    {selected.repliedAt ? "Cevaplandı" : "Yanıt bekliyor"}
                  </span>
                </div>
                <button onClick={() => deleteMessage(selected.id)} className="text-xs text-red-500 hover:underline">Sil</button>
              </div>

              <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                {selected.email && <span className="inline-flex items-center gap-1.5"><Mail size={14} />{selected.email}</span>}
                {selected.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} />{selected.phone}</span>}
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{new Date(selected.createdAt).toLocaleString("tr-TR")}</span>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-gray-800">Dönüt / Yanıt</h4>
                  {selected.repliedAt && <span className="text-xs text-emerald-600">Cevaplandı</span>}
                </div>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={7}
                  maxLength={5000}
                  disabled={!selected.email || sending}
                  placeholder={selected.email ? "Mesaja vereceğin yanıtı yaz…" : "Bu mesajda e-posta adresi yok."}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--clr-primary)]/20 disabled:bg-gray-100"
                />
                {notice && <p className={`text-xs ${notice.ok ? "text-emerald-700" : "text-red-600"}`}>{notice.text}</p>}
                <button
                  onClick={sendReply}
                  disabled={!selected.email || sending || reply.trim().length < 2}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--clr-primary)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Send size={15} />
                  {sending ? "Gönderiliyor…" : selected.repliedAt ? "Yanıtı Güncelle ve Tekrar Gönder" : "Yanıtı Gönder"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-400 py-20">Okumak ve yanıtlamak için soldan bir mesaj seç.</div>
          )}
        </div>
      </div>
    </div>
  );
}
