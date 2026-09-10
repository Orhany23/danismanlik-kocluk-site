import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı | Orhan Yaşlı",
  robots: { index: false, follow: true },
};

// Adres yanlış yazıldığında ya da eski bir bağlantı açıldığında gelinen sayfa.
// Çıkmaz sokak olmasın diye buradan devam edilebilecek yolları veriyoruz.
const ROUTES = [
  { href: "/", title: "Ana sayfa", desc: "Hizmetler, süreç ve sıkça sorulanlar" },
  { href: "/paketler", title: "Paketler", desc: "Koçluk ve danışmanlık paketlerini karşılaştır" },
  { href: "/makaleler", title: "Makaleler", desc: "Öğrenme ve sınav psikolojisi üzerine yazılar" },
  { href: "/ogrenci/giris", title: "Öğrenci girişi", desc: "Portala giriş yap, çalışmanı yükle" },
];

export default function NotFound() {
  return (
    <div className="notfound-wrap">
      <div className="notfound-inner">
        <span className="notfound-code">404</span>
        <h1 className="notfound-title">Aradığın sayfa burada değil</h1>
        <p className="notfound-lead">
          Adres değişmiş ya da bağlantı eskimiş olabilir. Aşağıdan devam edebilirsin.
        </p>

        <nav className="notfound-routes" aria-label="Önerilen sayfalar">
          {ROUTES.map((r) => (
            <Link key={r.href} href={r.href} className="notfound-route">
              <span className="notfound-route-title">{r.title}</span>
              <span className="notfound-route-desc">{r.desc}</span>
            </Link>
          ))}
        </nav>

        <p className="notfound-foot">
          Aradığın şeyi bulamadıysan{" "}
          <Link href="/#contact" className="auth-link">iletişim formundan</Link> yazabilirsin.
        </p>
      </div>
    </div>
  );
}
