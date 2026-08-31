"use client";

import { useState, useEffect } from "react";

type Appointment = {
  id: string;
  clientId: string;
  title: string;
  date: string;
  duration: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes: string;
  client?: { id: string; name: string; email: string; phone: string };
};

async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetch("/api/appointments");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", clientEmail: "", clientPhone: "", title: "", date: "", duration: "45", notes: "" });

  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // First create or find client
    const clientRes = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.clientName, email: form.clientEmail, phone: form.clientPhone }),
    });
    if (!clientRes.ok) return;
    const client = await clientRes.json();

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: client.id,
        title: form.title,
        date: form.date,
        duration: parseInt(form.duration),
        notes: form.notes,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ clientName: "", clientEmail: "", clientPhone: "", title: "", date: "", duration: "45", notes: "" });
      fetchAppointments();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchAppointments();
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Bu randevuyu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    if (res.ok) fetchAppointments();
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { PENDING: "bg-amber-100 text-amber-700", CONFIRMED: "bg-emerald-100 text-emerald-700", COMPLETED: "bg-blue-100 text-blue-700", CANCELLED: "bg-red-100 text-red-700" };
    const label: Record<string, string> = { PENDING: "Bekliyor", CONFIRMED: "Onaylandı", COMPLETED: "Tamamlandı", CANCELLED: "İptal" };
    return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${map[s] || ""}`}>{label[s] || s}</span>;
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Randevular</h2>
          <p className="text-sm text-gray-500 mt-1">Tüm randevuları yönetin.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--clr-primary)] to-[var(--clr-accent)] text-white text-sm font-semibold hover:opacity-90 transition-all">
          {showForm ? "İptal" : "Yeni Randevu"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Danışan Adı</label>
              <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="form-control" required />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Danışan E-posta</label>
              <input type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danışan Telefon</label>
              <input value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} className="form-control" />
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
            Randevu Oluştur
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700">{apt.client?.name || "—"}</div>
                    <div className="text-xs text-gray-400">{apt.client?.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(apt.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.duration} dk</td>
                  <td className="px-6 py-4">{statusBadge(apt.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                      >
                        <option value="PENDING">Bekliyor</option>
                        <option value="CONFIRMED">Onayla</option>
                        <option value="COMPLETED">Tamamla</option>
                        <option value="CANCELLED">İptal</option>
                      </select>
                      <button onClick={() => deleteAppointment(apt.id)} className="text-xs text-red-500 hover:underline">Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">Henüz randevu bulunmuyor.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
