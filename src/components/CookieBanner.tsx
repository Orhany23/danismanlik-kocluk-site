"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function CookieBanner() {
  const { dict } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies-accepted");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookies-accepted", "true");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookies-accepted", "false");
    setVisible(false);
  };

  const openModal = (id: string) => {
    const content = document.getElementById(`${id}-content`);
    if (content) {
      // Load legal content into modal from i18n
      const localeEl = document.querySelector("html")?.getAttribute("lang") || "tr";
      import("@/lib/i18n").then((mod) => {
        const dict_ = mod.dictionaries[localeEl as "tr" | "en"];
        if (id === "modal-privacy") {
          content.innerHTML = `<h2>${dict_.legal.privacyTitle}</h2><p>${dict_.legal.privacyContent}</p>`;
        }
      });
    }
    document.getElementById(id)?.classList.add("show");
  };

  return (
    <div id="cookie-banner" className={`fixed bottom-0 left-0 right-0 z-[9999] bg-[var(--clr-navy)] text-white p-4 flex items-center gap-4 flex-wrap transition-transform duration-[0.4s] ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <p className="flex-1 text-[0.88rem] min-w-[200px]">
        {dict.cookie.text}{" "}
        <button onClick={() => openModal("modal-privacy")} style={{ color: "var(--clr-accent)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "0.88rem" }}>
          {dict.cookie.privacy}
        </button>
      </p>
      <button className="cookie-btn bg-[var(--clr-primary)] text-white px-5 py-2 rounded-full text-[0.85rem] font-semibold hover:bg-[var(--clr-primary-dark)] transition-colors" onClick={accept}>
        {dict.cookie.accept}
      </button>
      <button className="cookie-btn bg-transparent text-[#aaa] border border-[#555] px-5 py-2 rounded-full text-[0.85rem] font-semibold hover:border-[#aaa] hover:text-white transition-colors" onClick={reject}>
        {dict.cookie.reject}
      </button>
    </div>
  );
}
