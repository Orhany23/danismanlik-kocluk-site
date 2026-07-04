"use client";

import { useEffect } from "react";
// Senin yeni oluşturduğumuz modern komponentlerin
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";

// Sitende zaten var olan diğer bölümler (Bunları koruyoruz)
import AboutSection from "@/components/AboutSection";
import WhoForSection from "@/components/WhoForSection";
import ExamSection from "@/components/ExamSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import CookieBanner from "@/components/CookieBanner";

export default function HomePage() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      // küçük gecikme: bölümler render olduktan sonra kaydır
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView();
      }, 100);
    }
  }, []);

  return (
    <>
      {/* Yeni Modern Kahraman Alanı */}
      <Hero />
      
      {/* Eski Hakkımda Kısmı */}
      <AboutSection />
      
      {/* Yeni Modern Hizmetler Alanı */}
      <Services />
      
      {/* Yeni Modern Süreç Alanı */}
      <Process />
      
      {/* Sitenin Geri Kalan Diğer Bölümleri */}
      <WhoForSection />
      <ExamSection />
      <FAQSection />
      <ContactSection />
      <CookieBanner />
    </>
  );
}
