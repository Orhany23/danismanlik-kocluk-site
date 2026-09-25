"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageCircle, Plus, Search } from "lucide-react";
import MessageThread, { emptyDraft, type MessageDraft } from "./MessageThread";

type Person = { id: string; name: string; gradeLevel: string | null; active: boolean };
type Conversation = { studentId: string; student: Person; updatedAt: string; needsReply: boolean; unread: number; lastMessage: { body: string; sender: string } | null };
const dateFormat = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "Europe/Istanbul" });

export default function AdminInbox({ initialPerson = null }: { initialPerson?: Person | null }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Person | null>(initialPerson);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newConversation, setNewConversation] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [drafts, setDrafts] = useState<Record<string, MessageDraft>>({});
  const sequence = useRef(0);
  const invalidateRequests = useCallback(() => { sequence.current += 1; }, []);

  const load = useCallback(async () => {
    if (document.hidden) return;
    const requestId = ++sequence.current;
    try {
      const params = new URLSearchParams({ q: query, filter, page: String(page) });
      const res = await fetch(`/api/admin/conversations${newConversation ? "/recipients" : ""}?${params}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mesajlar yüklenemedi.");
      if (requestId !== sequence.current) return;
      if (newConversation) setPeople(data.students);
      else {
        setConversations(data.conversations);
        // Seçili hesap dışarıda pasifleştirilmişse yazmayı kapat.
        setSelected((current) => current ? data.conversations.find((c: Conversation) => c.studentId === current.id)?.student ?? current : null);
      }
      setHasMore(data.hasMore); setError("");
    } catch (err) { if (requestId === sequence.current) setError(err instanceof Error ? err.message : "Mesajlar yüklenemedi."); }
    finally { if (requestId === sequence.current) setLoading(false); }
  }, [query, filter, page, newConversation]);

  useEffect(() => {
    const debounce = setTimeout(() => void load(), 200);
    const timer = setInterval(() => void load(), 15000);
    document.addEventListener("visibilitychange", load);
    return () => { invalidateRequests(); clearTimeout(debounce); clearInterval(timer); document.removeEventListener("visibilitychange", load); };
  }, [load, invalidateRequests]);

  const select = (person: Person) => { setSelected(person); setNewConversation(false); };
  const changeDraft = (draft: MessageDraft) => { if (selected) setDrafts((previous) => ({ ...previous, [selected.id]: draft })); };

  return <div className={`portal-inbox ${selected ? "has-selection" : ""}`}>
    <aside className="portal-conversation-list" aria-label="Konuşmalar">
      <div className="portal-list-head"><h2>{newConversation ? "Kişi seç" : "Konuşmalar"}</h2><button type="button" className="portal-icon-button" aria-label={newConversation ? "Konuşmalara dön" : "Yeni konuşma"} onClick={() => { setNewConversation(!newConversation); setQuery(""); setPage(0); }}>{newConversation ? <ArrowLeft size={18} /> : <Plus size={18} />}</button></div>
      <label className="portal-search"><Search size={16} /><input aria-label="İsme göre ara" value={query} placeholder="İsme göre ara…" onChange={(event) => { setQuery(event.target.value); setPage(0); }} /></label>
      {!newConversation && <div className="portal-filters" aria-label="Konuşma filtresi">{[["all", "Tümü"], ["unread", "Okunmamış"], ["waiting", "Yanıt bekleyen"]].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setFilter(value); setPage(0); }}>{label}</button>)}</div>}
      {error && <p className="portal-error" role="alert">{error} <button type="button" onClick={() => void load()}>Tekrar dene</button></p>}
      {loading ? <p className="portal-empty">Yükleniyor…</p> : newConversation ? <div>{people.map((person) => <button key={person.id} type="button" className="portal-person" onClick={() => select(person)}><strong>{person.name}</strong><small>{person.gradeLevel || "Portal hesabı"}</small></button>)}{!people.length && <p className="portal-empty">Aktif kişi bulunamadı.</p>}{hasMore && <p className="portal-hint portal-list-note">İlk 30 kişi gösteriliyor. Aramayı daralt.</p>}</div> : <div>{conversations.map((conversation) => <button type="button" key={conversation.studentId} className={`portal-person ${selected?.id === conversation.studentId ? "is-selected" : ""}`} onClick={() => select(conversation.student)} aria-current={selected?.id === conversation.studentId ? "true" : undefined}>
        <span className="portal-person-line"><strong>{conversation.student.name}</strong><time dateTime={conversation.updatedAt}>{dateFormat.format(new Date(conversation.updatedAt))}</time></span>
        <span className="portal-person-preview">{conversation.lastMessage?.sender === "ADMIN" ? "Sen: " : ""}{conversation.lastMessage?.body}</span>
        <span className="portal-person-line"><small>{conversation.needsReply ? "Yanıt bekliyor" : "Yanıtlandı"}{!conversation.student.active ? " · Pasif" : ""}</small>{conversation.unread > 0 && <span className="portal-badge">{conversation.unread} yeni</span>}</span>
      </button>)}{!conversations.length && !error && <div className="portal-empty"><MessageCircle size={26} /><p>{query || filter !== "all" ? "Bu filtrede konuşma yok." : "Henüz konuşma yok. + ile ilk mesajı başlatabilirsin."}</p></div>}
      {(page > 0 || hasMore) && <div className="portal-pagination"><button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>Önceki</button><span>{page + 1}</span><button type="button" disabled={!hasMore} onClick={() => setPage(page + 1)}>Sonraki</button></div>}</div>}
    </aside>
    <div className="portal-conversation-detail">{selected ? <><button className="portal-back portal-mobile-back" type="button" onClick={() => setSelected(null)}><ArrowLeft size={17} /> Konuşmalara dön</button><MessageThread key={selected.id} endpoint={`/api/admin/conversations/${encodeURIComponent(selected.id)}`} viewer="ADMIN" peerName={selected.name} active={selected.active} draft={drafts[selected.id] ?? emptyDraft} onDraftChange={changeDraft} onChange={load} /></> : <div className="portal-inbox-empty"><MessageCircle size={40} /><h2>Mesajlarını buradan yönet</h2><p>Bir konuşma seç veya yeni bir konuşma başlat.</p><button type="button" className="portal-send" onClick={() => { setNewConversation(true); setQuery(""); }}><Plus size={16} /> Yeni konuşma</button></div>}</div>
  </div>;
}
