"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import PsiMark from "@/components/PsiMark";

export default function Footer() {
  const { dict } = useLocale();
  const t = dict.footer;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
            {t.servicesLinks.map((link, i) => (
              <button key={i} onClick={() => scrollTo("services")} className="!text-left w-full">
                {link}
              </button>
            ))}
          </div>
          <div className="footer-col">
            <h4>{t.about}</h4>
            {t.aboutLinks.map((link, i) => {
              const targets = ["about", "faq", "privacy"];
              if (targets[i] === "privacy") {
                return (
                  <Link key={i} href="/gizlilik" className="!text-left w-full block">
                    {link}
                  </Link>
                );
              }
              return (
                <button
                  key={i}
                  onClick={() => scrollTo(targets[i])}
                  className="!text-left w-full"
                >
                  {link}
                </button>
              );
            })}
          </div>
          <div className="footer-col">
            <h4>{t.contact}</h4>
            {t.contactLinks.map((link, i) => (
              <a key={i} href="https://wa.me/905432500417" target="_blank" rel="noopener noreferrer">
                {link}
              </a>
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
            <a href="/admin/login" className="hover:underline opacity-75">
              Yönetici
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
