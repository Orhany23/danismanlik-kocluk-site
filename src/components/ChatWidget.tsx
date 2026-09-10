"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { Bot, Send, X } from "lucide-react";

type Message = { role: "user" | "model"; text: string };

const MESSAGE_MAX = 800;

// Ziyaretçiyle sohbet eden bilgilendirme asistanı (Google Gemini, ücretsiz
// katman). Sohbet SADECE bileşen belleğinde tutulur — sayfa yenilenince
// kaybolur; sunucuya "geçmiş" olarak kaydedilmez (bkz. /gizlilik madde 7).
export default function ChatWidget() {
  const { dict } = useLocale();
  const t = dict.chat;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const panelId = "chat-widget-panel";

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const send = async () => {
    const text = input.trim().slice(0, MESSAGE_MAX);
    if (!text || sending) return;
    setError(null);
    const nextMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          // Sadece son birkaç turu gönder — sunucu da ayrıca kırpıyor.
          history: nextMessages.slice(0, -1).slice(-16),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setError(data.error || t.genericError);
      }
    } catch {
      setError(t.genericError);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        type="button"
        id="chat-widget-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t.closeLabel : t.openLabel}
      >
        {open ? <X strokeWidth={2} aria-hidden="true" /> : <Bot strokeWidth={1.8} aria-hidden="true" />}
      </button>

      {open && (
        <div id={panelId} className="chat-panel" role="dialog" aria-label={t.panelTitle}>
          <div className="chat-panel-head">
            <div>
              <p className="chat-panel-title">{t.panelTitle}</p>
              <p className="chat-panel-subtitle">{t.panelSubtitle}</p>
            </div>
            <button type="button" className="chat-panel-close" onClick={() => setOpen(false)} aria-label={t.closeLabel}>
              <X strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="chat-panel-list" ref={listRef} aria-live="polite">
            <div className="chat-bubble chat-bubble--model">{t.greeting}</div>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble chat-bubble--${m.role}`}>
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="chat-bubble chat-bubble--model chat-bubble--typing" aria-label="…">
                <span />
                <span />
                <span />
              </div>
            )}
            {error && <div className="chat-bubble chat-bubble--error">{error}</div>}
          </div>

          <div className="chat-panel-input-row">
            <textarea
              className="chat-panel-input"
              placeholder={t.placeholder}
              value={input}
              maxLength={MESSAGE_MAX}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="chat-panel-send"
              onClick={send}
              disabled={sending || !input.trim()}
              aria-label={t.send}
            >
              <Send strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <p className="chat-panel-disclaimer">{t.disclaimer}</p>
        </div>
      )}
    </>
  );
}
