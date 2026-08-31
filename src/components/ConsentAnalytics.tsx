"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

const EVENT = "cookie-consent";

function accepted(): boolean {
  try {
    return localStorage.getItem("cookies-accepted") === "true";
  } catch {
    return false;
  }
}

/** Analitik yalnızca açık rızadan sonra yüklenir (KVKK / GDPR). */
export default function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(accepted());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}
