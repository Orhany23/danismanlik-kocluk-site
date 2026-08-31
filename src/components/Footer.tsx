"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import PsiMark from "@/components/PsiMark";
import { Languages } from "lucide-react";

// Bağlantı hedefi tek yerde çözülür: "modal:privacy" hukuki metni açar,
// http(s) dış bağlantı, gerisi uygulama içi rota (ör. "/paketler#kocluk").
function FooterLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith("modal:")) {
    const id = `modal-${href.slice("modal:".length)}`;
    return (
      <button
        type="button"
        onClick={() => document.getElementById(id)?.classList.add("show")}
        className="!text-left w-full"
      >
        {label}
      </button>
    );
  }
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
  const { dict, toggleLocale } = useLocale();
  const t = dict.footer;

  return (
    <footer>
      <PsiMark className="psi-mark psi-footer" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-brand-name">{t.brand}</span>
            <p>{t.desc}</p>
            <button type="button" onClick={toggleLocale} className="footer-lang">
              <Languages strokeWidth={1.8} aria-hidden="true" />
              <span>{t.langLabel}: {dict.nav.lang === "EN" ? "Türkçe" : "English"}</span>
            </button>
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
            <button onClick={() => document.getElementById("modal-privacy")?.classList.add("show")} className="hover:underline">
              {t.privacy}
            </button>
            <button onClick={() => document.getElementById("modal-terms")?.classList.add("show")} className="hover:underline">
              {t.terms}
            </button>
            <button onClick={() => document.getElementById("modal-cookies")?.classList.add("show")} className="hover:underline">
              {t.cookies}
            </button>
            <Link href="/admin/login" className="hover:underline opacity-75">
              Yönetici
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
