import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import MufredatClient from "@/components/MufredatClient";

export const metadata: Metadata = {
  title: "Konu Takibi | Orhan Yaşlı",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MufredatPage() {
  const student = await requireStudent();
  if (!student) redirect("/ogrenci/giris");

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <MufredatClient defaultGradeId={guessGradeId(student.gradeLevel)} />
      </div>
    </main>
  );
}

// Öğrencinin serbest metin alanındaki hedef sınavına (ör. "LGS", "YKS-Sayısal")
// bakarak açılışta makul bir sınıf sekmesi seçer; tutmazsa öğrenci zaten
// üstteki sekmelerden istediğini seçebilir.
function guessGradeId(gradeLevel: string | null): string {
  const g = (gradeLevel ?? "").toUpperCase();
  if (g.includes("LGS")) return "8";
  if (g.includes("YKS") || g.includes("MEZUN")) return "12";
  return "8";
}
