"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, MessageCircle, RefreshCw, Send } from "lucide-react";

type Message = { id: string; sender: "ADMIN" | "STUDENT"; body: string; createdAt: string; readAt: string | null };
type MessagePage = { messages: Message[]; hasMore: boolean };
export type MessageDraft = { body: string; clientMessageId: string };
export const emptyDraft: MessageDraft = { body: "", clientMessageId: "" };
const dateFormat = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: "no-store", ...init });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Bağlantı kurulamadı. Tekrar dene.");
  return data as T;
}

function mergeMessages(current: Message[], incoming: Message[]) {
  const byId = new Map(current.map((message) => [message.id, message]));
  incoming.forEach((message) => byId.set(message.id, message));
  return [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}

export default function MessageThread({ endpoint, viewer, peerName, active = true, draft, onDraftChange, onChange }: {
  endpoint: string; viewer: "ADMIN" | "STUDENT"; peerName: string; active?: boolean;
  draft: MessageDraft; onDraftChange: (draft: MessageDraft) => void; onChange?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [older, setOlder] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [sendError, setSendError] = useState("");
  const [readError, setReadError] = useState("");
  const [notice, setNotice] = useState("");
  const [newBelow, setNewBelow] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const latest = useRef<string | null>(null);
  const reading = useRef(false);
  const sendingRef = useRef(false);
  const refreshing = useRef(false);
  const scrollToEnd = useRef(true);
  const readIds = useRef(new Set<string>());
  const changeRef = useRef(onChange);
  useEffect(() => { changeRef.current = onChange; }, [onChange]);

  const refresh = useCallback(async () => {
    if (refreshing.current || document.hidden) return;
    refreshing.current = true;
    try {
      const after = latest.current;
      const data = await request<MessagePage>(`${endpoint}${after ? `?after=${encodeURIComponent(after)}` : ""}`);
      if (!after) setOlder(data.hasMore);
      if (data.messages.length) {
        latest.current = data.messages[data.messages.length - 1].id;
        setMessages((current) => mergeMessages(current, data.messages));
        if (!scrollToEnd.current) setNewBelow(true);
        changeRef.current?.();
      }
      setLoadError("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Mesajlar yüklenemedi.");
    } finally { refreshing.current = false; setLoading(false); }
  }, [endpoint]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 10000);
    const resume = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", resume); window.removeEventListener("online", resume); };
  }, [refresh]);

  useEffect(() => {
    if (scrollToEnd.current && scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages]);

  // Yalnızca açık sekmede ve görünür alanda okunan mesajlara alındı bildirimi.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const visible = new Set<string>();
    const mark = async () => {
      if (document.hidden || reading.current) return;
      const ids = [...visible].filter((id) => !readIds.current.has(id)).slice(0, 100);
      if (!ids.length) return;
      reading.current = true;
      try {
        await request(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
        ids.forEach((id) => readIds.current.add(id));
        setReadError("");
        changeRef.current?.();
        window.dispatchEvent(new Event("portal-messages-changed"));
      } catch { setReadError("Okundu bilgisi güncellenemedi. Bağlantı gelince yeniden denenecek."); }
      finally { reading.current = false; }
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.messageId;
        if (id) { if (entry.isIntersecting && entry.intersectionRatio > 0) visible.add(id); else visible.delete(id); }
      }
      void mark();
    }, { root, threshold: 0 });
    root.querySelectorAll<HTMLElement>("[data-unread='true']").forEach((element) => observer.observe(element));
    const timer = window.setInterval(() => void mark(), 10000);
    document.addEventListener("visibilitychange", mark);
    return () => { observer.disconnect(); clearInterval(timer); document.removeEventListener("visibilitychange", mark); };
  }, [endpoint, messages]);

  const loadOlder = async () => {
    if (!messages.length || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const data = await request<MessagePage>(`${endpoint}?before=${encodeURIComponent(messages[0].id)}`);
      const root = scroller.current;
      const height = root?.scrollHeight ?? 0;
      const top = root?.scrollTop ?? 0;
      scrollToEnd.current = false;
      setMessages((current) => mergeMessages(current, data.messages));
      setOlder(data.hasMore);
      requestAnimationFrame(() => { if (root) root.scrollTop = top + root.scrollHeight - height; });
      setLoadError("");
    } catch (error) { setLoadError(error instanceof Error ? error.message : "Önceki mesajlar yüklenemedi."); }
    finally { setLoadingOlder(false); }
  };

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sendingRef.current || !draft.body.trim() || !active || loading || loadError) return;
    sendingRef.current = true;
    setSending(true); setSendError(""); setNotice("");
    try {
      // Aynı taslak için tekrar denemelerde aynı kimlik kullanılır.
      const payload = { body: draft.body, clientMessageId: draft.clientMessageId || crypto.randomUUID() };
      onDraftChange(payload);
      const result = await request<{ message: Message }>(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      onDraftChange(emptyDraft);
      setNotice("Mesaj gönderildi.");
      scrollToEnd.current = true;
      setMessages((current) => mergeMessages(current, [result.message]));
      // GET imleci yalnızca GET sonucu ile ilerler; eş zamanlı gelen mesajlar atlanmaz.
      await refresh();
      changeRef.current?.();
      window.dispatchEvent(new Event("portal-messages-changed"));
    } catch (error) { setSendError(error instanceof Error ? error.message : "Mesaj gönderilemedi. Taslağın korundu."); }
    finally { sendingRef.current = false; setSending(false); }
  };

  const updateDraft = (body: string) => {
    onDraftChange({ body, clientMessageId: crypto.randomUUID() }); setSendError(""); setNotice("");
  };

  return <section className="portal-thread" aria-label={`${peerName} ile mesajlaşma`}>
    <header className="portal-thread-header"><span className="portal-avatar"><MessageCircle size={21} /></span><div><h2>{peerName}</h2><p>{active ? "Panel üzerinden kişisel mesajlaşma" : "Pasif hesap · Geçmiş mesajlar"}</p></div><button type="button" className="portal-icon-button" onClick={() => void refresh()} aria-label="Mesajları yenile"><RefreshCw size={17} /></button></header>
    {loadError && <div className="portal-error" role="alert">{loadError} <button type="button" onClick={() => void refresh()}>Tekrar dene</button></div>}
    <div className="portal-message-scroll" ref={scroller} role="log" aria-label="Mesaj geçmişi" aria-live="polite" aria-relevant="additions" onScroll={() => {
      const root = scroller.current;
      if (root) { scrollToEnd.current = root.scrollHeight - root.scrollTop - root.clientHeight < 80; if (scrollToEnd.current) setNewBelow(false); }
    }}>
      {older && <button type="button" className="portal-older" onClick={() => void loadOlder()} disabled={loadingOlder}>{loadingOlder ? "Yükleniyor…" : "Önceki mesajları göster"}</button>}
      {loading ? <p className="portal-empty">Mesajlar yükleniyor…</p> : !messages.length && !loadError ? <div className="portal-empty"><MessageCircle size={30} /><h3>Konuşmayı başlat</h3><p>{viewer === "STUDENT" ? "Bir sorunu, görüşme talebini veya paylaşmak istediğin konuyu buradan yazabilirsin." : "İlk mesajını aşağıdan yaz. Yanıtlar bu konuşmada birikecek."}</p></div> : null}
      {messages.map((message) => <article key={message.id} className={`portal-bubble ${message.sender === viewer ? "is-mine" : ""}`} data-message-id={message.id} data-unread={message.sender !== viewer && !message.readAt}>
        <span className="portal-bubble-author">{message.sender === viewer ? "Sen" : peerName}</span>
        <p>{message.body}</p><time dateTime={message.createdAt}>{dateFormat.format(new Date(message.createdAt))}</time>
      </article>)}
    </div>
    {newBelow && <button className="portal-new" type="button" onClick={() => { scrollToEnd.current = true; if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; setNewBelow(false); }}>Yeni mesajlar <ArrowDown size={14} /></button>}
    {readError && <p className="portal-hint" role="status">{readError}</p>}
    <form className="portal-compose" onSubmit={send}>
      {viewer === "ADMIN" && <div className="portal-quick-replies" aria-label="Yanıt taslakları"><span>Hızlı taslak:</span>{["Mesajını aldım, inceleyip sana dönüş yapacağım.", "Bunu bir sonraki görüşmemizde birlikte ele alalım."].map((text, index) => <button type="button" disabled={sending || !active} key={text} onClick={() => updateDraft(`${draft.body}${draft.body ? "\n" : ""}${text}`.slice(0, 5000))}>{index === 0 ? "İnceleyeceğim" : "Görüşmede konuşalım"}</button>)}</div>}
      <label htmlFor="portal-message-body">Mesajın</label>
      <textarea id="portal-message-body" value={draft.body} onChange={(event) => updateDraft(event.target.value)} rows={3} maxLength={5000} disabled={sending || !active} placeholder="Mesajını buraya yaz…" onKeyDown={(event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); }
      }} />
      <div className="portal-compose-footer"><span className="portal-hint">{draft.body.length}/5000 · Ctrl + Enter ile gönder</span><button className="portal-send" type="submit" disabled={sending || loading || !!loadError || !active || !draft.body.trim()}><Send size={16} />{sending ? "Gönderiliyor…" : "Mesajı gönder"}</button></div>
      {sendError && <p className="portal-error" role="alert">{sendError} Mesajın aşağıdaki taslakta duruyor.</p>}
      {notice && <p className="portal-success" role="status">{notice}</p>}
    </form>
  </section>;
}
