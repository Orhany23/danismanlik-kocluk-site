"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function CookieBanner() {
  const { dict } = useLocale();
  const [visible, setVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("cookies-accepted");
    }
    return false;
  });

  const accept = () => {
    localStorage.setItem("cookies-accepted", "true");
    window.dispatchEvent(new Event("cookie-consent"));
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookies-accepted", "false");
    window.dispatchEvent(new Event("cookie-consent"));
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
    <div
      id="cookie-banner"
      // Mobilde dikey istif (metin üstte, butonlar altta tek satır) ve
      // env(safe-area-inset-bottom) dolgusu: butonların iOS home indicator /
      // tarayıcı alt çubuğu arkasında kesilmesini önler.
      style={{ paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom))" }}
      className={`fixed bottom-0 left-0 right-0 z-[9999] bg-[var(--clr-navy)] text-white px-4 pt-3.5 flex flex-col sm:flex-row sm:items-center gap-3 transition-transform duration-[0.4s] ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <p className="flex-1 text-[0.88rem]">
        {dict.cookie.text}{" "}
        <button onClick={() => openModal("modal-privacy")} style={{ color: "var(--clr-accent)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "0.88rem" }}>
          {dict.cookie.privacy}
        </button>
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button className="cookie-btn flex-1 sm:flex-none bg-[var(--clr-primary)] text-white px-5 py-2 rounded-full text-[0.85rem] font-semibold hover:bg-[var(--clr-primary-dark)] transition-colors" onClick={accept}>
          {dict.cookie.accept}
        </button>
        <button className="cookie-btn flex-1 sm:flex-none bg-transparent text-[#aaa] border border-[#555] px-5 py-2 rounded-full text-[0.85rem] font-semibold hover:border-[#aaa] hover:text-white transition-colors" onClick={reject}>
          {dict.cookie.reject}
        </button>
      </div>
    </div>
  );
}
