import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import PaidAppNotice from "@/components/sections/paid-app-notice";
import AgeNoticeSection from "@/components/sections/age-notice-section";
import ServicesSection from "@/components/sections/services-section";
import ChatExamplesSection from "@/components/sections/chat-examples-section";
import FeaturesSection from "@/components/sections/features-section";
import PersonasSection from "@/components/sections/personas-section";
import GlobalSupportSection from "@/components/sections/global-support-section";
import PackagesSection from "@/components/sections/packages-section";
import PricingSection from "@/components/sections/pricing-section";
import InstitutoSection from "@/components/sections/instituto-section";
import PWAInstallationSection from "@/components/sections/pwa-installation-section";
import LanguageBannerSection from "@/components/sections/language-banner-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      <main>
        <LanguageBannerSection />
        <GlobalSupportSection />
        <AgeNoticeSection />
        <HeroSection />
        <ServicesSection />
        <ChatExamplesSection />
        <PWAInstallationSection />
        <FeaturesSection />
        <PersonasSection />
        <PricingSection />
        <PaidAppNotice />
        <InstitutoSection />
        {/* <PackagesSection /> */}
      </main>
      <Footer />
    </div>
  );
}
