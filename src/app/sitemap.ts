import type { MetadataRoute } from "next";
import { getAllStudies } from "@/lib/dailyResearch";

const SITE = "https://psdorhanyasli.com.tr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/makaleler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...getAllStudies().map((s) => ({
      url: `${SITE}/makaleler/${s.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
