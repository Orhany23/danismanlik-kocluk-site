// Harici tema store'u — useSyncExternalStore ile tüketilir. Böylece
// setState-in-effect kalıbına düşmeden (react-hooks/set-state-in-effect)
// DOM sınıfından türeyen tema durumunu okuruz.
type Theme = "light" | "dark";

const listeners = new Set<() => void>();

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getServerTheme(): Theme {
  return "light";
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem("theme", next);
  } catch {}
  listeners.forEach((l) => l());
}
