"use client";

import { useState, useEffect } from "react";

type CoachingSession = {
  id: string;
  clientId: string;
  title: string;
  date: string;
  duration: number;
  status: "PLANNED" | "COMPLETED" | "CANCELLED";
  notes: string;
  client?: { id: string; name: string };
};

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ clientId: "", title: "", date: "", duration: "45", notes: "" });

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) setSessions(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.map((c: any) => ({ id: c.id, name: c.name })));
      }
    } catch {}
  };

  useEffect(() => {
    fetchSessions();
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, date: new Date(form.date).toISOString(), duration: parseInt(form.duration) }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ clientId: "", title: "", date: "", duration: "45", notes: "" });
      fetchSessions();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchSessions();
  };

  const deleteSession = async (id: string) => {
    if (!confirm("Bu seansı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    fetchSessions();
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Seanslar</h2>
          <p className="text-sm text-gray-500 mt-1">Koçluk seanslarını yönetin.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--clr-primary)] to-[var(--clr-accent)] text-white text-sm font-semibold hover:opacity-90">
          {showForm ? "İptal" : "Yeni Seans"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danışan</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="form-control" required>
                <option value="">Seçiniz</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-control" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih / Saat</label>
              <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="form-control" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Süre (dk)</label>
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="form-control" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="form-control" rows={3} />
            </div>
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--clr-primary)] to-[var(--clr-accent)] text-white text-sm font-semibold hover:opacity-90">
            Seans Oluştur
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-3 font-medium">Danışan</th>
              <th className="px-6 py-3 font-medium">Başlık</th>
              <th className="px-6 py-3 font-medium">Tarih</th>
              <th className="px-6 py-3 font-medium">Süre</th>
              <th className="px-6 py-3 font-medium">Durum</th>
              <th className="px-6 py-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{s.client?.name || "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(s.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.duration} dk</td>
                <td className="px-6 py-4">
                  <select value={s.status} onChange={(e) => updateStatus(s.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    <option value="PLANNED">Planlandı</option>
                    <option value="COMPLETED">Tamamlandı</option>
                    <option value="CANCELLED">İptal</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteSession(s.id)} className="text-xs text-red-500 hover:underline">Sil</button>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">Henüz seans bulunmuyor.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
