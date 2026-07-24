"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, LinkIcon, FileUp, Camera, Check, Clock, ExternalLink } from "lucide-react";

type WorkType = "NOTE" | "LINK" | "FILE" | "PHOTO";
type Work = {
  id: string;
  type: WorkType;
  title: string | null;
  note: string | null;
  url: string | null;
  fileName: string | null;
  hasFile?: boolean;
  seen: boolean;
  createdAt: string;
};

const TABS: { type: WorkType; label: string; icon: React.ReactNode }[] = [
  { type: "NOTE", label: "Not", icon: <FileText strokeWidth={1.7} aria-hidden="true" /> },
  { type: "LINK", label: "Bağlantı", icon: <LinkIcon strokeWidth={1.7} aria-hidden="true" /> },
  { type: "FILE", label: "PDF", icon: <FileUp strokeWidth={1.7} aria-hidden="true" /> },
  { type: "PHOTO", label: "Fotoğraf", icon: <Camera strokeWidth={1.7} aria-hidden="true" /> },
];

// Fotoğrafı tarayıcıda küçültür: en büyük kenar 1600px, JPEG ~0.82. Vercel'in
// istek limiti altında kalmak ve Blob kotasını korumak için. Görsel değilse ya
// da küçültme başarısızsa orijinali döndürür.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bmp = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.82));
    if (!blob) return file;
    const name = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

const TYPE_META: Record<WorkType, { label: string; icon: React.ReactNode }> = {
  NOTE: { label: "Not", icon: <FileText strokeWidth={1.6} aria-hidden="true" /> },
  LINK: { label: "Bağlantı", icon: <LinkIcon strokeWidth={1.6} aria-hidden="true" /> },
  FILE: { label: "PDF", icon: <FileText strokeWidth={1.6} aria-hidden="true" /> },
  PHOTO: { label: "Fotoğraf", icon: <Camera strokeWidth={1.6} aria-hidden="true" /> },
};

export default function StudentWorkForm() {
  const [type, setType] = useState<WorkType>("NOTE");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const data: { works?: Work[] } = await fetch("/api/student/work")
      .then((r) => r.json())
      .catch(() => ({ works: [] }));
    setWorks(data.works ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setTitle("");
    setNote("");
    setUrl("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setMsg(null);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("type", type);
      fd.set("title", title);
      fd.set("note", note);
      if (type === "LINK") fd.set("url", url);
      if (type === "FILE" || type === "PHOTO") {
        if (!file) {
          setMsg({ ok: false, text: "Lütfen bir dosya seç." });
          setSaving(false);
          return;
        }
        const toSend = type === "PHOTO" ? await compressImage(file) : file;
        fd.set("file", toSend);
      }

      const res = await fetch("/api/student/work", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Gönderilemedi." });
      } else {
        setMsg({ ok: true, text: "Gönderildi! Koçun panelinde görecek." });
        reset();
        load();
      }
    } catch {
      setMsg({ ok: false, text: "Bir hata oluştu. Tekrar dene." });
    } finally {
      setSaving(false);
    }
  };

  const accept = type === "FILE" ? "application/pdf" : "image/*";

  return (
    <section className="student-section" id="calisma-gonder">
      <div className="student-section-head">
        <h2>Bugün Ne Çalıştın?</h2>
        <span className="student-section-count">{works.length}</span>
      </div>
      <p className="work-lead">
        Bugün yaptığın çalışmayı paylaş — not, bağlantı, PDF ya da fotoğraf. Koçun panelinde görüp takip eder.
      </p>

      <form className="work-form" onSubmit={submit}>
        <div className="work-tabs" role="tablist" aria-label="Çalışma türü">
          {TABS.map((tab) => (
            <button
              key={tab.type}
              type="button"
              role="tab"
              aria-selected={type === tab.type}
              className={`work-tab ${type === tab.type ? "is-active" : ""}`}
              onClick={() => {
                setType(tab.type);
                setMsg(null);
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <input
          className="form-control"
          type="text"
          placeholder="Başlık (örn. Matematik — Türev denemesi)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={160}
        />

        {type === "NOTE" && (
          <textarea
            className="form-control work-textarea"
            placeholder="Bugün ne çalıştın? Nasıl geçti, nerede zorlandın?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={4000}
            rows={4}
          />
        )}

        {type === "LINK" && (
          <>
            <input
              className="form-control"
              type="url"
              placeholder="https://... (Google Drive, foto, video vb.)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <textarea
              className="form-control work-textarea"
              placeholder="Kısa açıklama (isteğe bağlı)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={4000}
              rows={2}
            />
          </>
        )}

        {(type === "FILE" || type === "PHOTO") && (
          <>
            <label className="work-file">
              <input
                ref={fileRef}
                type="file"
                accept={accept}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <span className="work-file-inner">
                {type === "FILE" ? <FileUp strokeWidth={1.6} /> : <Camera strokeWidth={1.6} />}
                {file ? file.name : type === "FILE" ? "PDF seç (en fazla 4 MB)" : "Fotoğraf seç veya çek"}
              </span>
            </label>
            <textarea
              className="form-control work-textarea"
              placeholder="Kısa açıklama (isteğe bağlı)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={4000}
              rows={2}
            />
          </>
        )}

        {msg && <p className={`work-msg ${msg.ok ? "is-ok" : "is-err"}`}>{msg.text}</p>}

        <button type="submit" className="auth-btn work-submit" disabled={saving}>
          {saving ? "Gönderiliyor…" : "Gönder"}
        </button>
      </form>

      {works.length > 0 && (
        <div className="work-history">
          <h3 className="work-history-title">Gönderdiklerin</h3>
          <ul className="work-history-list">
            {works.map((w) => (
              <li key={w.id} className="work-history-item">
                <span className="work-history-icon" aria-hidden="true">{TYPE_META[w.type].icon}</span>
                <div className="work-history-main">
                  <span className="work-history-name">
                    {w.title || w.fileName || TYPE_META[w.type].label}
                  </span>
                  {w.note && <span className="work-history-note">{w.note}</span>}
                  {w.type === "LINK" && w.url && (
                    <a className="work-history-link" href={w.url} target="_blank" rel="noopener noreferrer">
                      Bağlantıyı aç <ExternalLink strokeWidth={1.8} />
                    </a>
                  )}
                  {w.hasFile && (
                    <a className="work-history-link" href={`/api/student/work/${w.id}/file`} target="_blank" rel="noopener noreferrer">
                      {w.type === "PHOTO" ? "Fotoğrafı aç" : "Dosyayı aç"} <ExternalLink strokeWidth={1.8} />
                    </a>
                  )}
                </div>
                <span className={`work-history-status ${w.seen ? "is-seen" : ""}`}>
                  {w.seen ? <><Check strokeWidth={2.2} /> Görüldü</> : <><Clock strokeWidth={1.8} /> Bekliyor</>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
