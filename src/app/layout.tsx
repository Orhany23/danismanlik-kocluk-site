import type { Metadata } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LegalModals from "@/components/LegalModals";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orhan Yaşlı – Sınav Koçluğu ve Psikolojik Danışmanlık | Çanakkale",
  description:
    "Orhan Yaşlı ile sınav koçluğu, öğrenci koçluğu ve psikolojik danışmanlık. RPD altyapısıyla YKS/LGS koçluğu. Çanakkale yüz yüze, Türkiye geneli online.",
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
      </head>
      <body className="min-h-screen flex flex-col">
        <LocaleProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <LegalModals />
        </LocaleProvider>
      </body>
    </html>
  );
}
