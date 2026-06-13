import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export const metadata = {
  title: "Öğrenci Paneli | Orhan Yaşlı",
  robots: { index: false, follow: false },
};

export default async function StudentDashboard() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session || role !== "STUDENT") {
    redirect("/ogrenci/giris");
  }

  return (
    <div className="student-shell">
      <header className="student-top">
        <div className="student-top-inner">
          <div className="student-brand">
            <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
              <g fill="none" stroke="#E8590C" strokeWidth="3.4" strokeLinecap="round">
                <path d="M24 10v28" />
                <path d="M12 12v7c0 7 5 11 12 11s12-4 12-11v-7" />
              </g>
            </svg>
            <span>Öğrenci Paneli</span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="student-logout">Çıkış Yap</button>
          </form>
        </div>
      </header>

      <main className="student-main">
        <h1 className="student-hello">Merhaba, {session.user?.name?.split(" ")[0]} 👋</h1>
        <p className="student-lead">
          Hesabın hazır. Sana özel kaynaklar ve çalışma içerikleri çok yakında burada olacak.
        </p>

        <div className="student-grid">
          <div className="student-card student-card--soon">
            <span className="student-card-tag">Çok Yakında</span>
            <h3>Kaynak Kütüphanesi</h3>
            <p>Ders çalışma teknikleri, deneme analizleri ve önerilen kaynaklar burada toplanacak.</p>
          </div>
          <div className="student-card student-card--soon">
            <span className="student-card-tag">Çok Yakında</span>
            <h3>Sana Özel İçerikler</h3>
            <p>Orhan Yaşlı&apos;nın senin için özel olarak paylaştığı içerikler bu alanda görünecek.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
