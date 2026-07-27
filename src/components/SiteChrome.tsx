"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

// Site menüsü, footer ve WhatsApp butonu admin panelinde görünmemeli.
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <Navbar />
      <ScrollProgress />
    </>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
