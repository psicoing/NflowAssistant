import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import ServicesSection from "@/components/sections/services-section";
import FeaturesSection from "@/components/sections/features-section";
import PersonasSection from "@/components/sections/personas-section";
import MobileAppsSection from "@/components/sections/mobile-apps-section";
import PricingSection from "@/components/sections/pricing-section";
import InstitutoSection from "@/components/sections/instituto-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturesSection />
        <PersonasSection />
        <MobileAppsSection />
        <PricingSection />
        <InstitutoSection />
      </main>
      <Footer />
    </div>
  );
}
