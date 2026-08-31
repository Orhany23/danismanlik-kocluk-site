"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import GatewaySection from "@/components/GatewaySection";
import PackagesSection from "@/components/PackagesSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import WhoForSection from "@/components/WhoForSection";
import ServicesSection from "@/components/ServicesSection";
import DiscoverStrip from "@/components/DiscoverStrip";
import ExamSection from "@/components/ExamSection";
import DailySpark from "@/components/DailySpark";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomePage() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      // küçük gecikme: bölümler render olduktan sonra kaydır
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  // Sıra ziyaretçinin karar akışına göre: ne sunuluyor (kapılar + paketler),
  // nasıl işliyor (süreç), güven (yorumlar, hakkımda, kimler), kapsam (hizmetler),
  // sonra keşif içerikleri ve iletişim. Makalelerin tamamı /makaleler sayfasında.
  return (
    <>
      <HeroSection />
      <GatewaySection />
      <PackagesSection />
      <ProcessSection />
      <TestimonialsSection />
      <AboutSection />
      <WhoForSection />
      <ServicesSection />
      <DiscoverStrip />
      <ExamSection />
      <DailySpark />
      <FAQSection />
      <ContactSection />
      <ScrollReveal />
    </>
  );
}
