import type { Metadata } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
