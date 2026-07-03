"use client";

import { useEffect, useState, useCallback } from "react";

type Student = { id: string; name: string; email: string };
type Resource = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string | null;
  body: string | null;
  category: string | null;
  gradeLevel: string | null;
  studentId: string | null;
  student: Student | null;
  published: boolean;
  pinned: boolean;
  createdAt: string;
};

const TYPE_LABELS: Record<string, string> = {
  LINK: "🔗 Bağlantı",
  VIDEO: "▶️ Video",
  FILE: "📄 Dosya",
  NOTE: "📝 Not",
};

const empty = {
  title: "",
  description: "",
  type: "LINK",
  url: "",
  body: "",
  category: "",
  gradeLevel: "",
  studentId: "",
  pinned: false,
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [r, s] = await Promise.all([
      fetch("/api/admin/resources").then((x) => x.json()).catch(() => ({ resources: [] })),
      fetch("/api/admin/students").then((x) => x.json()).catch(() => ({ students: [] })),
    ]);
    setResources(r.resources || []);
    setStudents(s.students || []);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load async; state güncellemesi fetch sonrası
  useEffect(() => { void load(); }, [load]);

  const submit = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Bir hata oluştu.");
      } else {
        setSuccess("Kaynak başarıyla eklendi!");
        setForm({ ...empty });
        await load();
        setTimeout(() => setSuccess(""), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (id: string, field: "published" | "pinned", value: boolean) => {
    await fetch(`/api/admin/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Bu kaynağı silmek istediğine emin misin?")) return;
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    load();
  };

  const isNote = form.type === "NOTE";

  return (
    <div className="max-w-5xl space-y-8">
      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-1">Yeni kaynak ekle</h3>
        <p className="text-sm text-gray-400 mb-5">
          Bir öğrenci seçmezsen kaynak <strong>herkese açık kütüphanede</strong> görünür. Öğrenci seçersen yalnızca o öğrenciye özel olur.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <label className="col-span-2 text-sm font-medium text-gray-700">
            Başlık *
            <input className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="örn. Aktif Hatırlama Tekniği" />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Tür
            <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Kategori
            <input className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="örn. Çalışma Teknikleri" />
          </label>

          {!isNote ? (
            <label className="col-span-2 text-sm font-medium text-gray-700">
              Bağlantı (URL) *
              <input className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </label>
          ) : (
            <label className="col-span-2 text-sm font-medium text-gray-700">
              Not metni *
              <textarea className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[110px]" value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Öğrenciye gösterilecek metin..." />
            </label>
          )}

          <label className="col-span-2 text-sm font-medium text-gray-700">
            Açıklama
            <input className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Kısa açıklama (opsiyonel)" />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Kime?
            <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
              <option value="">Herkese açık (kütüphane)</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.email}</option>)}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Seviye (opsiyonel)
            <span className="block text-xs font-normal text-gray-500">Boş bırakılırsa kaynak tüm öğrencilere görünür; seviye seçilirse yalnızca o hedefi seçen öğrenciler görür.</span>
            <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" value={form.gradeLevel}
              onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}>
              <option value="">Tüm sınıflar (herkes görür)</option>
              <option value="LGS">LGS</option>
              <option value="YKS-Sayısal">YKS — Sayısal</option>
              <option value="YKS-EA">YKS — Eşit Ağırlık</option>
              <option value="YKS-Sözel">YKS — Sözel</option>
              <option value="YKS-Dil">YKS — Dil</option>
              <option value="Mezun">Mezun</option>
              <option value="Diğer">Diğer</option>
            </select>
          </label>

          <label className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
            Öne çıkar (listede üstte gösterilir)
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">✓ {success}</p>}

        <button onClick={submit} disabled={saving}
          style={{ backgroundColor: "var(--clr-primary)" }}
          className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
          {saving ? "Ekleniyor..." : "Kaynağı ekle"}
        </button>
      </div>

      {/* List */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Mevcut kaynaklar ({resources.length})</h3>
        {loading ? (
          <p className="text-sm text-gray-400">Yükleniyor...</p>
        ) : resources.length === 0 ? (
          <p className="text-sm text-gray-400">Henüz kaynak eklenmedi.</p>
        ) : (
          <div className="space-y-2">
            {resources.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">{TYPE_LABELS[r.type] || r.type}</span>
                    {r.pinned && <span className="text-xs text-amber-600">★ öne çıkan</span>}
                    {!r.published && <span className="text-xs text-gray-400">(gizli)</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.student ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {r.student ? `Özel: ${r.student.name}` : "Herkese açık"}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 mt-1 truncate">{r.title}</p>
                  {r.category && <p className="text-xs text-gray-400">{r.category}</p>}
                  {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-[var(--clr-primary)] break-all">{r.url}</a>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggle(r.id, "published", !r.published)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    {r.published ? "Gizle" : "Yayınla"}
                  </button>
                  <button onClick={() => remove(r.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
