"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LegalModals from "@/components/LegalModals";
import CookieBanner from "@/components/CookieBanner";

// Panel sayfalarının (admin + öğrenci) kendi başlığı ve gezinmesi var;
// kamu navbarı, footer ve WhatsApp butonu oralarda görünmemeli.
const PANEL_PREFIXES = ["/admin", "/ogrenci"];

function isPanel(pathname: string): boolean {
  return PANEL_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isPanel(pathname)) return null;
  return (
    <>
      <Navbar />
      <ScrollProgress />
    </>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isPanel(pathname)) return null;
  return (
    <>
      <Footer />
      <WhatsAppButton />
      <LegalModals />
      <CookieBanner />
    </>
  );
}
