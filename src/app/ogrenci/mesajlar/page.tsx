import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import StudentMessages from "@/components/messages/StudentMessages";
import "@/components/messages/messages.css";

export const metadata = { title: "Mesajlarım | Orhan Yaşlı", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  if (!await requireStudent()) redirect("/ogrenci/giris");
  return <div className="student-shell"><main className="student-main portal-student-page">
    <Link href="/ogrenci" className="portal-back"><ArrowLeft size={17} /> Panelime dön</Link>
    <h1>Mesajlarım</h1><p className="portal-page-lead">Danışmanına buradan yazabilir, yanıtlarını aynı konuşmada takip edebilirsin.</p>
    <StudentMessages />
    <Link className="portal-back" href="/ogrenci#calisma-gonder">Çalışma, PDF veya fotoğraf teslim etmek için → Çalışma gönder</Link>
  </main></div>;
}
