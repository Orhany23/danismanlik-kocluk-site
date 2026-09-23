"use client";

import { useEffect } from "react";

/**
 * Very small progressive-enhancement layer:
 * exposes pointer position as CSS variables for ambient lighting.
 * No React state, no re-render loop, disabled for coarse pointers/reduced motion.
 */
export default function AmbientPointer() {
  useEffect(() => {
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    let raf = 0;
    const root = document.documentElement;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
