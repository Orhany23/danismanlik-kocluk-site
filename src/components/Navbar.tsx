"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLocale } from "@/components/LocaleProvider";
import ThemeToggle from "@/components/ThemeToggle";

// Menü sırası ziyaretçinin karar sırasına göre: önce ne aldığı (Paketler),
// sonra kapsam (Hizmetler), sonra kim olduğum (Hakkımda), içerik ve iletişim.
// (NN/g: gezinme etiketleri kullanıcının diliyle ve karar sırasıyla eşleşmeli.)
type NavItem =
  | { key: "packages" | "articles"; kind: "page"; href: string }
  | { key: "services" | "about" | "contact"; kind: "section"; id: string };

const NAV_ITEMS: NavItem[] = [
  { key: "packages", kind: "page", href: "/paketler" },
  { key: "services", kind: "section", id: "services" },
  { key: "about", kind: "section", id: "about" },
  { key: "articles", kind: "page", href: "/makaleler" },
  { key: "contact", kind: "section", id: "contact" },
];

export default function Navbar() {
  const { dict, toggleLocale } = useLocale();
  const t = dict.nav;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  // Oturum varsa Giriş Yap / Kayıt Ol yerine "Panelim" gösterilir.
  const { data: session } = useSession();
  const role = session?.user?.role;
  const panelHref =
    role === "STUDENT" ? "/ogrenci" : role === "ADMIN" ? "/admin" : null;

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    // Alt sayfadaysak (ör. /paketler) ana sayfadaki bölüme yönlendir
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // WCAG 2.2 / NN/g: açılır menü Escape ile kapanmalı ve odak tetikleyiciye dönmeli.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              {item.kind === "page" ? (
                <Link href={item.href} className="nav-link">
                  {t[item.key]}
                </Link>
              ) : (
                <button onClick={() => scrollTo(item.id)} className="nav-link">
                  {t[item.key]}
                </button>
              )}
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
            <a
              href="/ogrenci/giris"
              className="nav-link text-[0.82rem] !font-semibold hidden lg:inline-flex items-center"
            >
              Giriş Yap
            </a>
          )}
          <button onClick={() => scrollTo("contact")} className="btn btn-primary !py-2.5 !px-5 !text-[0.85rem] !hidden lg:!inline-flex">
            {t.appointment}
          </button>
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? t.menuClose : t.menuOpen}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 rounded-lg text-[var(--clr-text)] hover:bg-[var(--clr-accent-tint)]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen
                ? <path d="M6 6l12 12M18 6L6 18" />
                : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu-panel lg:hidden">
          {NAV_ITEMS.map((item) =>
            item.kind === "page" ? (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="mobile-menu-link block"
              >
                {t[item.key]}
              </Link>
            ) : (
              <button key={item.key} onClick={() => scrollTo(item.id)} className="mobile-menu-link">
                {t[item.key]}
              </button>
            )
          )}
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
