import CtaSection from "@/components/CtaSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WorkflowSection from "@/components/WorkflowSection";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <WorkflowSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer/>
    </>
  );
}
