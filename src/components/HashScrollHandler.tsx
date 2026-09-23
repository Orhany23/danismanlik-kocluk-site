"use client";

import { useEffect } from "react";

/**
 * URL hash'ı ile açılan ana sayfada doğru bölüme kaydırır.
 * Ana sayfanın tamamını client component yapmak yerine küçük bir client island kullanır.
 */
export default function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return null;
}
