"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import PsiMark from "@/components/PsiMark";

// Bağlantı hedefi tek yerde çözülür: http(s) dış bağlantı, gerisi uygulama
// içi rota (ör. "/paketler#kocluk"). Hukuki metinler kendi sayfalarında
// yaşıyor, ayrı bir kopyası yok.
function FooterLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return <Link href={href}>{label}</Link>;
}

export default function Footer() {
  const { dict } = useLocale();
  const t = dict.footer;

  return (
    <footer>
      <PsiMark className="psi-mark psi-footer" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-brand-name">{t.brand}</span>
            <p>{t.desc}</p>
          </div>
          <div className="footer-col">
            <h4>{t.services}</h4>
            {t.servicesLinks.map((link) => (
              <FooterLink key={link.label} href={link.href} label={link.label} />
            ))}
          </div>
          <div className="footer-col">
            <h4>{t.about}</h4>
            {t.aboutLinks.map((link) => (
              <FooterLink key={link.label} href={link.href} label={link.label} />
            ))}
          </div>
          <div className="footer-col">
            <h4>{t.contact}</h4>
            {t.contactLinks.map((link) => (
              <FooterLink key={link.label} href={link.href} label={link.label} />
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t.copyright}</span>
          <div className="flex gap-4">
            <Link href="/gizlilik" className="hover:underline">
              {t.privacy}
            </Link>
            <Link href="/kullanim-kosullari" className="hover:underline">
              {t.terms}
            </Link>
            <Link href="/gizlilik#cerezler" className="hover:underline">
              {t.cookies}
            </Link>
            <Link href="/admin/login" className="hover:underline opacity-75">
              Yönetici
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
