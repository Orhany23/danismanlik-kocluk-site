"use client";

import { useEffect } from "react";

// Bölümlere kaydırıldıkça .visible sınıfı ekler. setState kullanmaz —
// yalnızca classList mutasyonu yapar; bu yüzden set-state-in-effect lint'i
// tetiklenmez ve React'in yönetmediği bu attribute hydration sorunu çıkarmaz.
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right, .reveal-scale")
    );
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
      },
      // Pozitif alt margin: öğeler görünüme girmeden ~%20 önce belirmeye başlar,
      // böylece hızlı kaydırmada içerik ekrana geldiğinde çoktan görünür olur.
      { rootMargin: "0px 0px 20% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
