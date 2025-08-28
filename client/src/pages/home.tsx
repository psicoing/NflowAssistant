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
import BlogSection from "@/components/sections/blog-section";
import PartnersSection from "@/components/sections/partners-section";
import PreciosSection from "@/components/sections/precios-section";
import NFlowShowcaseSection from "@/components/sections/nflow-showcase-section";
import NosotrosSection from "@/components/sections/nosotros-section";
import ContactoSection from "@/components/sections/contacto-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import FounderSection from "@/components/sections/founder-section";
import IntroCardSection from "@/components/sections/intro-card-section";
import NFlowCarouselSection from "@/components/sections/nflow-carousel-section";
import FamilyImageSection from "@/components/sections/family-image-section";
import NFlowComparisonSection from "@/components/sections/nflow-comparison-section";
import ProfessionalSummarySection from "@/components/sections/professional-summary-section";

export default function Home() {

  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header showBanner={true} />
      <main className="pt-28">
        <LanguageBannerSection />
        <IntroCardSection />
        <NFlowCarouselSection />
        <FamilyImageSection />
        <NFlowComparisonSection />
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

        <FounderSection />
        <PaidAppNotice />
        <TestimonialsSection />
        <LGBTISupportSection />
        
        {/* Menu Sections - All services in one page */}
        <BlogSection />
        <PreciosSection />
        <PartnersSection />
        <NFlowShowcaseSection />
        <NosotrosSection />
        <ContactoSection />
        
        <InstitutoSection />
        {/* <PackagesSection /> */}
        
        <ProfessionalSummarySection />
      </main>
      <Footer />
    </div>
  );
}
