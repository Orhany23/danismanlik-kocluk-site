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
import HashScrollHandler from "@/components/HashScrollHandler";

export default function HomePage() {
  return (
    <>
      <HashScrollHandler />
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
