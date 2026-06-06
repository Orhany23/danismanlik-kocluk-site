"use client";

import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import WhoForSection from "@/components/WhoForSection";
import ExamSection from "@/components/ExamSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import CookieBanner from "@/components/CookieBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <WhoForSection />
      <ExamSection />
      <FAQSection />
      <ContactSection />
      <CookieBanner />
    </>
  );
}
