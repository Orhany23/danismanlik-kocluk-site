"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function Footer() {
  const { dict } = useLocale();
  const t = dict.footer;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="font-serif text-[1.3rem] font-bold bg-gradient-to-r from-[#c084fc] to-[var(--clr-accent)] bg-clip-text text-transparent">
              {t.brand}
            </span>
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
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (targets[i] === "privacy") {
                      document.getElementById("modal-privacy")?.classList.add("show");
                    } else {
                      scrollTo(targets[i]);
                    }
                  }}
                  className="!text-left w-full"
                >
                  {link}
                </button>
              );
            })}
          </div>
          <div className="footer-col">
            <h4>{t.contact}</h4>
            {t.contactLinks.map((link, i) => {
              const hrefs = ["mailto:Pskdanorhanyasli@proton.me", "tel:+905432500417", "https://wa.me/905432500417", "https://t.me/YasliOrhan"];
              return (
                <a key={i} href={hrefs[i]} target={i >= 2 ? "_blank" : undefined} rel={i >= 2 ? "noopener noreferrer" : undefined}>
                  {link}
                </a>
              );
            })}
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
            <a href="/admin/login" className="hover:underline opacity-75">
              Yönetici
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
