import type { MetadataRoute } from "next";

const BASE = "https://psdorhanyasli.com.tr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    // Hukuki sayfalar da indekslenebilir olmalı (daha önce sitemap'te yoktu).
    { url: `${BASE}/gizlilik`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/kullanim-kosullari`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
