"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { dict, toggleLocale } = useLocale();
  const t = dict.nav;
  const [menuOpen, setMenuOpen] = useState(false);
  // Oturum varsa Giriş Yap / Kayıt Ol yerine "Panelim" gösterilir
  const [panelHref, setPanelHref] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        const role = d?.user?.role;
        if (role === "STUDENT") setPanelHref("/ogrenci");
        else if (role === "ADMIN") setPanelHref("/admin");
        else setPanelHref(null);
      })
      .catch(() => setPanelHref(null));
  }, []);

  const sectionIds: Record<string, string> = { whoFor: "who-for" };

  const scrollTo = (key: string) => {
    const id = sectionIds[key] ?? key;
    setMenuOpen(false);
    // Alt sayfadaysak (ör. /ogrenci) ana sayfadaki bölüme yönlendir
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 h-[var(--navbar-h)] flex items-center bg-[var(--clr-bg2)]/90 backdrop-blur-md shadow-[0_2px_20px_var(--clr-shadow)] transition-all duration-300">
      <div className="container flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="nav-logo flex items-center gap-2.5">
          <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center" style={{ background: "var(--clr-accent)" }}>
            <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
              <g fill="none" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round">
                <path d="M24 10v28" />
                <path d="M12 12v7c0 7 5 11 12 11s12-4 12-11v-7" />
              </g>
            </svg>
          </div>
          <span className="text-[1.3rem] font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--clr-text)" }}>
            {t.brand}
          </span>
        </button>

        <ul className="hidden lg:flex items-center gap-1.5">
          {(["about","services","exams","articles","contact"] as const).map((key) => (
            <li key={key}>
              <button onClick={() => scrollTo(key)} className="nav-link">
                {t[key]}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-actions flex items-center gap-3">
          <ThemeToggle className="p-1.5 rounded-lg border border-[var(--clr-border)] text-[var(--clr-text2)] hover:border-[var(--clr-primary)] hover:text-[var(--clr-primary)] transition-colors" />
          <button
            id="lang-toggle"
            onClick={toggleLocale}
            className="text-[0.75rem] font-bold tracking-wider px-2.5 py-1 rounded-lg border border-[var(--clr-primary)] text-[var(--clr-primary)] hover:bg-[var(--clr-primary)] hover:text-white transition-colors"
          >
            {t.lang}
          </button>
          {panelHref ? (
            <a
              href={panelHref}
              className="btn btn-ghost !py-2.5 !px-5 !text-[0.85rem] !hidden lg:!inline-flex"
            >
              Panelim
            </a>
          ) : (
            <>
              <a
                href="/ogrenci/giris"
                className="nav-link text-[0.82rem] !font-semibold hidden lg:inline-flex items-center"
              >
                Giriş Yap
              </a>
              <a
                href="/ogrenci/kayit"
                className="btn btn-ghost !py-2.5 !px-5 !text-[0.85rem] !hidden lg:!inline-flex"
              >
                Kayıt Ol
              </a>
            </>
          )}
          <button onClick={() => scrollTo("contact")} className="btn btn-primary !py-2.5 !px-5 !text-[0.85rem] !hidden lg:!inline-flex">
            {t.appointment}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2 rounded-lg text-[var(--clr-text)] hover:bg-[var(--clr-accent-tint)]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <path d="M6 6l12 12M18 6L6 18" />
                : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-menu-panel lg:hidden">
          {(["about","services","exams","articles","contact"] as const).map((key) => (
            <button key={key} onClick={() => scrollTo(key)} className="mobile-menu-link">
              {t[key]}
            </button>
          ))}
          <div className="mobile-menu-link flex items-center justify-between">
            <span>{t.theme}</span>
            <ThemeToggle className="p-1.5 rounded-lg border border-[var(--clr-border)] text-[var(--clr-text2)] hover:border-[var(--clr-primary)] hover:text-[var(--clr-primary)] transition-colors" />
          </div>
          {panelHref ? (
            <a href={panelHref} className="btn btn-ghost !py-3 mt-3 justify-center !text-[0.9rem]">Panelim</a>
          ) : (
            <div className="flex gap-2 mt-3">
              <a href="/ogrenci/giris" className="btn btn-ghost !py-3 flex-1 justify-center !text-[0.9rem]">Giriş Yap</a>
              <a href="/ogrenci/kayit" className="btn btn-ghost !py-3 flex-1 justify-center !text-[0.9rem]">Kayıt Ol</a>
            </div>
          )}
          <button onClick={() => scrollTo("contact")} className="btn btn-primary !py-3 mt-2 justify-center">
            {t.appointment}
          </button>
        </div>
      )}
    </nav>
  );
}
