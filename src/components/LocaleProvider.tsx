"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Locale, Dictionary } from "@/lib/i18n";
import { dictionaries } from "@/lib/i18n";

type LocaleContextType = {
  locale: Locale;
  dict: Dictionary;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("tr");
  const dict = dictionaries[locale];

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "tr" ? "en" : "tr"));
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, dict, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
