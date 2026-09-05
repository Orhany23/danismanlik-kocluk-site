import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { LocaleProvider } from "@/components/LocaleProvider";
import AuthProvider from "@/components/AuthProvider";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import ConsentAnalytics from "@/components/ConsentAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://psdorhanyasli.com.tr"),
  title: "Orhan Yaşlı – Sınav Koçluğu ve Psikolojik Danışmanlık | Çanakkale",
  description:
    "Orhan Yaşlı ile sınav koçluğu, öğrenci koçluğu ve psikolojik danışmanlık. RPD altyapısıyla YKS/LGS koçluğu. Çanakkale yüz yüze, Türkiye geneli online.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Orhan Yaşlı – Sınav Koçluğu ve Psikolojik Danışmanlık",
    description:
      "Sınav koçluğu, öğrenci koçluğu, psikolojik danışmanlık. RPD mezunu koç ile başarıya giden yol. Çanakkale ve Online.",
    type: "website",
    url: "https://psdorhanyasli.com.tr",
  },
  other: {
    "twitter:card": "summary_large_image",
    "google-adsense-account": "ca-pub-5270775518993386",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5270775518993386"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Hydration öncesi tema + js sınıfı — FOUC ve tema yanıp sönmesini önler */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;d.classList.add("js");var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))d.classList.add("dark");}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Orhan Yaşlı – Sınav Koçluğu ve Psikolojik Danışmanlık",
              url: "https://psdorhanyasli.com.tr",
              areaServed: ["Çanakkale", "Türkiye"],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Çanakkale",
                addressCountry: "TR",
              },
              founder: { "@type": "Person", name: "Orhan Yaşlı" },
              serviceType: [
                "Sınav Koçluğu",
                "Öğrenci Koçluğu",
                "Psikolojik Danışmanlık",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <LocaleProvider>
          <AuthProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </AuthProvider>
        </LocaleProvider>
        <ConsentAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
