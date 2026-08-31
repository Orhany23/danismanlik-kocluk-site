import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/ogrenci"] },
    ],
    sitemap: "https://psdorhanyasli.com.tr/sitemap.xml",
  };
}
