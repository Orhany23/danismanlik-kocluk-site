"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { subscribe, getTheme, getServerTheme, toggleTheme } from "@/lib/theme";
import { useLocale } from "@/components/LocaleProvider";

export default function ThemeToggle({ className }: { className?: string }) {
  const { dict } = useLocale();
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const isDark = theme === "dark";
  const label = isDark ? dict.nav.themeToLight : dict.nav.themeToDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={className}
    >
      {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
    </button>
  );
}
