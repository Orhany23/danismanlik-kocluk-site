"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useAdminDialog } from "@/components/admin/DialogProvider";

type Student = {
  id: string;
  name: string;
  email: string;
  gradeLevel: string | null;
  active: boolean;
  createdAt: string;
  client?: { id: string; name: string } | null;
};

export default function AdminStudentsPage() {
  const { confirm, alert } = useAdminDialog();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetFor, setResetFor] = useState<Student | null>(null);
  const [linking, setLinking] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/students", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setStudents(d.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Öğrenciye bir danışan kaydı oluşturup bağlar. Böylece bu kişiye randevu/seans
  // yazılabilir ve tüm geçmişi danışan detay sayfasında tek ekranda görünür.
  const linkStudent = async (s: Student) => {
    const ok = await confirm({
      title: `${s.name} için danışan kaydı oluşturulsun mu?`,
      description: "Böylece bu öğrenciye randevu ve seans yazabilirsin.",
      confirmLabel: "Oluştur ve bağla",
    });
    if (!ok) return;
    setLinking(s.id);
    try {
      const res = await fetch(`/api/admin/students/${s.id}/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ create: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) load();
      else await alert({ title: "Bağlantı kurulamadı", description: data.error || "Lütfen tekrar deneyin." });
    } finally {
      setLinking(null);
    }
  };

  const toggleActive = async (s: Student) => {
    const active = !s.active;
    if (!active) {
      const ok = await confirm({
        title: `${s.name} askıya alınsın mı?`,
        description: "Öğrenci hesabıyla giriş yapamaz. İstediğin zaman geri açabilirsin.",
        confirmLabel: "Askıya al",
        tone: "danger",
      });
      if (!ok) return;
    }
    setStudents((prev) => prev.map((x) => (x.id === s.id ? { ...x, active } : x)));
    await fetch(`/api/admin/students/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    }).catch(() => load());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Öğrenciler</h1>
        <p className="text-sm text-gray-400">
          Kayıtlı öğrenci hesapları. Şifresini unutan öğrencinin şifresini buradan sıfırlayabilirsin.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Henüz kayıtlı öğrenci yok.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Ad Soyad</th>
                <th className="px-5 py-3 font-medium">E-posta</th>
                <th className="px-5 py-3 font-medium">Hedef</th>
                <th className="px-5 py-3 font-medium">Kayıt</th>
                <th className="px-5 py-3 font-medium">Danışan kaydı</th>
                <th className="px-5 py-3 font-medium">Durum</th>
                <th className="px-5 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className={`border-t border-gray-50 ${s.active ? "" : "bg-gray-50/60"}`}>
                  <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-5 py-3 text-gray-600">{s.email}</td>
                  <td className="px-5 py-3 text-gray-600">{s.gradeLevel || "—"}</td>
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-5 py-3">
                    {s.client ? (
                      <Link
                        href={`/admin/clients/${s.client.id}`}
                        className="text-xs font-medium text-[var(--clr-primary)] hover:underline"
                      >
                        {s.client.name} →
                      </Link>
                    ) : (
                      <button
                        onClick={() => linkStudent(s)}
                        disabled={linking === s.id}
                        className="text-xs font-medium rounded-lg px-2.5 py-1 border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {linking === s.id ? "Bağlanıyor…" : "Danışana bağla"}
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        s.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s.active ? "Aktif" : "Askıda"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setResetFor(s)}
                        className="text-xs font-medium rounded-lg px-3 py-1.5 bg-[var(--clr-primary)] text-white hover:opacity-90"
                      >
                        Şifre sıfırla
                      </button>
                      <button
                        onClick={() => toggleActive(s)}
                        className="text-xs font-medium rounded-lg px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        {s.active ? "Askıya al" : "Aktifleştir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {resetFor && (
        <PasswordResetModal student={resetFor} onClose={() => setResetFor(null)} />
      )}
    </div>
  );
}

// Koçun öğrenciye yeni bir şifre belirlediği kutu. Şifre öğrenciye elden/mesajla
// iletilir; öğrenci panelinden kendisi değiştirebilir.
function PasswordResetModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const suggest = () => {
    // Okunması kolay geçici şifre: harf + 4 rakam
    const words = ["calisma", "hedef", "basari", "adim", "plan", "odak"];
    const w = words[Math.floor(Math.random() * words.length)];
    setPassword(`${w}${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const save = async () => {
    setStatus(null);
    if (password.length < 8) {
      setStatus({ ok: false, text: "Şifre en az 8 karakter olmalı." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/students/${student.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ ok: true, text: "Şifre değiştirildi. Yeni şifreyi öğrenciye ilet." });
      } else {
        setStatus({ ok: false, text: data.error || "Şifre sıfırlanamadı." });
      }
    } catch {
      setStatus({ ok: false, text: "Bir hata oluştu." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Şifre sıfırla</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-700">{student.name}</span> için yeni bir şifre
            belirle ve öğrenciye ilet.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Yeni şifre</label>
          <input
            type="text"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--clr-primary)]"
          />
          <button onClick={suggest} className="text-xs text-[var(--clr-primary)] hover:underline">
            Rastgele şifre öner
          </button>
        </div>

        {status && (
          <p className={`text-sm ${status.ok ? "text-emerald-600" : "text-red-600"}`}>{status.text}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={save}
            disabled={busy}
            className="text-sm font-medium rounded-lg px-4 py-2 bg-[var(--clr-primary)] text-white hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Kaydediliyor…" : "Şifreyi değiştir"}
          </button>
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline">
            {status?.ok ? "Kapat" : "Vazgeç"}
          </button>
        </div>
      </div>
    </div>
  );
}
