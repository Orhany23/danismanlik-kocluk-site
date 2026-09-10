"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import TodayHighlights from "@/components/TodayHighlights";
import PackagesSection from "@/components/PackagesSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import WhoForSection from "@/components/WhoForSection";
import ServicesSection from "@/components/ServicesSection";
import DiscoverStrip from "@/components/DiscoverStrip";
import ExamSection from "@/components/ExamSection";
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

  // Sıra ziyaretçinin karar akışına göre: hemen günün içeriği (her gün yeni
  // bir sebeple geri gelinsin), sonra ne sunuluyor (paketler), nasıl işliyor
  // (süreç), güven (yorumlar, hakkımda, kimler), kapsam (hizmetler), sonra
  // keşif içerikleri ve iletişim. Makalelerin tamamı /makaleler sayfasında.
  //
  // NOT: Eskiden Paketler'den önce ayrı bir "İki kapı" (Gateway) bölümü
  // vardı — aynı iki seçeneği (Koçluk/Danışmanlık) neredeyse birebir aynı
  // başlıkla ("İki X, tek bütüncül yaklaşım.") tekrar ediyordu; puan
  // listesindeki her madde zaten Paketler'in "dahil" listesinde vardı.
  // Kaldırıldı, tek eksik bilgisi (danışmanlık gizliliği notu) Paketler
  // kartına taşındı.
  return (
    <>
      <HeroSection />
      <TodayHighlights />
      <PackagesSection />
      <ProcessSection />
      <TestimonialsSection />
      <AboutSection />
      <WhoForSection />
      <ServicesSection />
      <DiscoverStrip />
      <ExamSection />
      <FAQSection />
      <ContactSection />
      <ScrollReveal />
    </>
  );
}
