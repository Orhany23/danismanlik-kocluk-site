"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  gradeLevel: string | null;
  active: boolean;
  createdAt: string;
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((d) => setStudents(d.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Öğrenciler</h1>
        <p className="text-sm text-gray-400">Kayıtlı öğrenci hesapları.</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Henüz kayıtlı öğrenci yok.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Ad Soyad</th>
                <th className="px-5 py-3 font-medium">E-posta</th>
                <th className="px-5 py-3 font-medium">Hedef</th>
                <th className="px-5 py-3 font-medium">Kayıt</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-5 py-3 text-gray-600">{s.email}</td>
                  <td className="px-5 py-3 text-gray-600">{s.gradeLevel || "—"}</td>
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
