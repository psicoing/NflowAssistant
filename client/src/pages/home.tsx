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

import InstitutoSection from "@/components/sections/instituto-section";
import PWAInstallationSection from "@/components/sections/pwa-installation-section";
import LanguageBannerSection from "@/components/sections/language-banner-section";
import MentalHealthHeroSection from "@/components/sections/mental-health-hero-section";
import BorderlessSupportSection from "@/components/sections/borderless-support-section";
import YouthMentalHealthSection from "@/components/sections/youth-mental-health-section";
import LGBTISupportSection from "@/components/sections/lgbti-support-section";
import PromotionalBanner from "@/components/PromotionalBanner";
import { useState } from "react";

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-nflow-dark">
      {showBanner && <PromotionalBanner onClose={() => setShowBanner(false)} />}
      <Header showBanner={showBanner} />
      <main className={showBanner ? "pt-28" : "pt-16"}>
        <LanguageBannerSection />
        <MentalHealthHeroSection />
        <BorderlessSupportSection />
        <YouthMentalHealthSection />
        <GlobalSupportSection />
        <AgeNoticeSection />
        <HeroSection />
        <ServicesSection />
        <ChatExamplesSection />
        <PWAInstallationSection />
        <FeaturesSection />
        <PersonasSection />

        <PaidAppNotice />
        <LGBTISupportSection />
        <InstitutoSection />
        {/* <PackagesSection /> */}
      </main>
      <Footer />
    </div>
  );
}
