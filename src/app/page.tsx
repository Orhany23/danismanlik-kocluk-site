"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PackagesSection from "@/components/PackagesSection";
import ProcessSection from "@/components/ProcessSection";
import WhoForSection from "@/components/WhoForSection";
import DailySpark from "@/components/DailySpark";
import TestimonialsSection from "@/components/TestimonialsSection";
import ExamSection from "@/components/ExamSection";
import ArticlesSection from "@/components/ArticlesSection";
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

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PackagesSection />
      <ArticlesSection />
      <ProcessSection />
      <WhoForSection />
      <DailySpark />
      <TestimonialsSection />
      <ExamSection />
      <FAQSection />
      <ContactSection />
      <ScrollReveal />
    </>
  );
}
