"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LegalModals from "@/components/LegalModals";

// Site menüsü, footer ve WhatsApp butonu admin panelinde görünmemeli.
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <Footer />
      <WhatsAppButton />
      <LegalModals />
    </>
  );
}
