"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function Navbar() {
  const { dict, locale, toggleLocale } = useLocale();
  const t = dict.nav;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 h-[var(--navbar-h)] flex items-center bg-[var(--clr-bg2)]/90 backdrop-blur-md shadow-[0_2px_20px_var(--clr-shadow)] transition-all duration-300">
      <div className="container flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="nav-logo flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--clr-primary)] to-[var(--clr-accent)] flex items-center justify-center">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <g transform="translate(4,4)">
                <path d="M20 4c-4 0-10 3-12 8-2 5-2 10 0 13 1 2 3 3 4 5 1 2 1 5 2 7 0 1 1 2 2 3 1 1 2 1 4 1V4z" fill="#ffffff" opacity="0.92"/>
                <path d="M20 4c4 0 10 3 12 8 2 5 2 10 0 13-1 2-3 3-4 5-1 2-1 5-2 7 0 1-1 2-2 3-1 1-2 1-4 1V4z" fill="#ffffff" opacity="0.78"/>
              </g>
            </svg>
          </div>
          <span className="font-serif text-[1.4rem] font-bold bg-gradient-to-r from-[var(--clr-primary)] to-[var(--clr-accent)] bg-clip-text text-transparent">
            {t.brand}
          </span>
        </button>

        <ul className="hidden lg:flex items-center gap-1.5">
          {(["about","services","process","whoFor","exams","faq","contact"] as const).map((key) => (
            <li key={key}>
              <button onClick={() => scrollTo(key)} className="nav-link">
                {t[key]}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-actions flex items-center gap-3">
          <button
            id="lang-toggle"
            onClick={toggleLocale}
            className="text-[0.75rem] font-bold tracking-wider px-2.5 py-1 rounded-lg border border-[var(--clr-primary)] text-[var(--clr-primary)] hover:bg-[var(--clr-primary)] hover:text-white transition-colors"
          >
            {t.lang}
          </button>
          <button onClick={() => scrollTo("contact")} className="btn btn-primary !py-2.5 !px-5 !text-[0.85rem]">
            {t.appointment}
          </button>
        </div>
      </div>
    </nav>
  );
}
