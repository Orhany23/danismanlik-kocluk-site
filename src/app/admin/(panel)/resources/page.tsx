"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminDialog } from "@/components/admin/DialogProvider";
import { CardListSkeleton } from "@/components/admin/Skeleton";

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
  isTemplate: boolean;
  createdAt: string;
};

const TYPE_LABELS: Record<string, string> = {
  LINK: "Bağlantı",
  VIDEO: "Video",
  FILE: "Dosya",
  NOTE: "Not",
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
  isTemplate: false,
};

export default function AdminResourcesPage() {
  const { confirm } = useAdminDialog();
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

  // Mevcut kaynağın görünürlüğünü (studentId) veya seviyesini günceller
  const updateResource = async (id: string, patch: { studentId?: string | null; gradeLevel?: string | null }) => {
    const res = await fetch(`/api/admin/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Güncelleme başarısız.");
    } else {
      setError("");
    }
    load();
  };

  const remove = async (id: string) => {
    const ok = await confirm({
      title: "Kaynak silinsin mi?",
      description: "Kaynak öğrenci panelinden de kaldırılır.",
      confirmLabel: "Sil",
      tone: "danger",
    });
    if (!ok) return;
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    load();
  };

  const [assignPick, setAssignPick] = useState<Record<string, string>>({});
  const [assigning, setAssigning] = useState<string | null>(null);

  // Bir şablonun bağımsız kopyasını seçilen öğrenciye atar (metni yeniden
  // yazmadan) — kopya o öğrencinin panelinde "Sana Özel" olarak belirir.
  const assignToStudent = async (resourceId: string) => {
    const studentId = assignPick[resourceId];
    if (!studentId) return;
    setAssigning(resourceId);
    setError("");
    try {
      const res = await fetch(`/api/admin/resources/${resourceId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Atama başarısız.");
      } else {
        const name = students.find((s) => s.id === studentId)?.name || "danışan";
        setSuccess(`"${resources.find((r) => r.id === resourceId)?.title}" ${name} panelinde yayınlandı.`);
        setAssignPick((p) => ({ ...p, [resourceId]: "" }));
        await load();
        setTimeout(() => setSuccess(""), 3000);
      }
    } finally {
      setAssigning(null);
    }
  };

  const isNote = form.type === "NOTE";
  const templates = resources.filter((r) => r.isTemplate);
  const published = resources.filter((r) => !r.isTemplate);

  return (
    <div className="max-w-5xl space-y-8">
      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-1">Yeni kaynak ekle</h3>
        <p className="text-sm text-gray-400 mb-5">
          <strong>Şablon</strong> olarak işaretlersen kimseye görünmez, kütüphanende kalır — dilediğin zaman
          tek tıkla bir danışana atarsın (metni yeniden yazmadan). İşaretlemezsen: öğrenci seçmediğinde{" "}
          <strong>herkese açık kütüphanede</strong>, seçtiğinde yalnızca o öğrenciye özel görünür.
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

          <label className="col-span-2 flex items-center gap-2 text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <input
              type="checkbox"
              checked={form.isTemplate}
              onChange={(e) => setForm({ ...form, isTemplate: e.target.checked, studentId: "" })}
            />
            <span><strong>Şablon</strong> — kütüphanemde kalsın, kimseye otomatik gösterme</span>
          </label>

          {!form.isTemplate && (
            <label className="text-sm font-medium text-gray-700">
              Kime?
              <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
                <option value="">Herkese açık (kütüphane)</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.email}</option>)}
              </select>
            </label>
          )}

          <label className="text-sm font-medium text-gray-700">
            Seviye (opsiyonel)
            <span className="block text-xs font-normal text-gray-500">Seviye yalnızca etiket/filtreleme içindir; kaynağın kimlere görüneceğini etkilemez. Görünürlüğü &quot;Kime?&quot; alanı belirler.</span>
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

      {/* Şablon Kütüphanesi */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">📚 Şablon kütüphanem ({templates.length})</h3>
        <p className="text-sm text-gray-400 mb-3">Kimseye görünmez. Bir danışan seç, &quot;Ata&quot; de — kopyası onun paneline düşer.</p>
        {loading ? (
          <CardListSkeleton rows={2} header={false} />
        ) : templates.length === 0 ? (
          <p className="text-sm text-gray-400">Henüz şablon eklenmedi.</p>
        ) : (
          <div className="space-y-2">
            {templates.map((r) => (
              <div key={r.id} className="bg-amber-50/50 rounded-xl border border-amber-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400">{TYPE_LABELS[r.type] || r.type}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Şablon</span>
                    </div>
                    <p className="font-medium text-gray-800 mt-1">{r.title}</p>
                    {r.category && <p className="text-xs text-gray-400">{r.category}</p>}
                  </div>
                  <button onClick={() => remove(r.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex-shrink-0">
                    Sil
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-amber-100">
                  <select
                    className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white flex-1 min-w-[160px]"
                    value={assignPick[r.id] || ""}
                    onChange={(e) => setAssignPick((p) => ({ ...p, [r.id]: e.target.value }))}
                  >
                    <option value="">Danışan seç…</option>
                    {students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.email}</option>)}
                  </select>
                  <button
                    onClick={() => assignToStudent(r.id)}
                    disabled={!assignPick[r.id] || assigning === r.id}
                    style={{ backgroundColor: "var(--clr-primary)" }}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {assigning === r.id ? "Atanıyor…" : "Ata"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Yayındaki kaynaklar ({published.length})</h3>
        {loading ? (
          <CardListSkeleton rows={3} header={false} />
        ) : published.length === 0 ? (
          <p className="text-sm text-gray-400">Henüz kaynak eklenmedi.</p>
        ) : (
          <div className="space-y-2">
            {published.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">{TYPE_LABELS[r.type] || r.type}</span>
                    {r.pinned && <span className="text-xs text-amber-600">★ öne çıkan</span>}
                    {!r.published && <span className="text-xs text-gray-400">(gizli)</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.student ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {r.student ? `Özel: ${r.student.name}` : "Herkese açık"}
                    </span>
                    {!r.student && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.gradeLevel ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                        {r.gradeLevel ? `Seviye: ${r.gradeLevel}` : "Tüm sınıflar"}
                      </span>
                    )}
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
                {/* Mevcut kaynağın görünürlüğünü ve seviyesini değiştirme */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                  <label className="text-xs text-gray-500 flex items-center gap-1.5">
                    Kime?
                    <select
                      className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                      value={r.studentId ?? ""}
                      onChange={(e) => updateResource(r.id, { studentId: e.target.value || null })}
                    >
                      <option value="">Herkese açık</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs text-gray-500 flex items-center gap-1.5">
                    Seviye
                    <select
                      className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                      value={r.gradeLevel ?? ""}
                      onChange={(e) => updateResource(r.id, { gradeLevel: e.target.value || null })}
                    >
                      <option value="">Tüm sınıflar</option>
                      <option value="LGS">LGS</option>
                      <option value="YKS-Sayısal">YKS — Sayısal</option>
                      <option value="YKS-EA">YKS — Eşit Ağırlık</option>
                      <option value="YKS-Sözel">YKS — Sözel</option>
                      <option value="YKS-Dil">YKS — Dil</option>
                      <option value="Mezun">Mezun</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
