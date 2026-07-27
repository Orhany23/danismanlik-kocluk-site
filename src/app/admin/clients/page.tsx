"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
};

async function fetchClients(): Promise<Client[]> {
  const res = await fetch("/api/clients");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/clients/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", notes: "" });
    fetchClients();
  };

  const editClient = (c: Client) => {
    setForm({ name: c.name, email: c.email, phone: c.phone, notes: c.notes });
    setEditingId(c.id);
    setShowForm(true);
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Bu danışanı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    fetchClients();
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Danışanlar</h2>
          <p className="text-sm text-gray-500 mt-1">{clients.length} kayıtlı danışan.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: "", email: "", phone: "", notes: "" }); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--clr-primary)] to-[var(--clr-accent)] text-white text-sm font-semibold hover:opacity-90">
          {showForm ? "İptal" : "Yeni Danışan"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-control" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-control" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="form-control" rows={3} />
            </div>
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--clr-primary)] to-[var(--clr-accent)] text-white text-sm font-semibold hover:opacity-90">
            {editingId ? "Güncelle" : "Danışan Ekle"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 font-medium">Ad Soyad</th>
                <th className="px-6 py-3 font-medium">E-posta</th>
                <th className="px-6 py-3 font-medium">Telefon</th>
                <th className="px-6 py-3 font-medium">Kayıt</th>
                <th className="px-6 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link href={`/admin/clients/${c.id}`} className="text-gray-700 hover:text-[var(--clr-primary)] hover:underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.email || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.phone || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(c.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/clients/${c.id}`} className="text-xs text-[var(--clr-primary)] hover:underline">Detay</Link>
                      <button onClick={() => editClient(c)} className="text-xs text-[var(--clr-primary)] hover:underline">Düzenle</button>
                      <button onClick={() => deleteClient(c.id)} className="text-xs text-red-500 hover:underline">Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">Henüz danışan bulunmuyor.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
