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
import MultilanguageCardSection from "@/components/sections/multilanguage-card-section";
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
import NeuropsiDemoSection from "@/components/sections/neuropsi-demo-section";
import NFlowCarouselSection from "@/components/sections/nflow-carousel-section";
import FamilyImageSection from "@/components/sections/family-image-section";
import NFlowComparisonSection from "@/components/sections/nflow-comparison-section";
import ProfessionalSummarySection from "@/components/sections/professional-summary-section";
import ProfessionalMeritSection from "@/components/sections/professional-merit-section";
import ReferralInfoSection from "@/components/sections/referral-info-section";
import CommercialPartnersSection from "@/components/sections/commercial-partners-section";
import QueEsNflowSection from "@/components/sections/que-es-nflow-section";
import FreeResourcesCardSection from "@/components/sections/free-resources-card-section";
import FamilySupportHeroSection from "@/components/sections/family-support-hero-section";
import NuxaPurposeSection from "@/components/sections/nuxa-purpose-section";
import NuxaBrandEvolutionSection from "@/components/sections/nuxa-brand-evolution-section";
import { SEOHead } from "@/components/SEOHead";
import { StructuredData, NFlowOrganizationData, NFlowWebAppData } from "@/components/StructuredData";

export default function Home() {

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="NUXA - Tu Psicólogo IA 24/7 | Salud Mental"
        description="Tu psicólogo IA disponible 24/7. Apoyo emocional en español para personas, familias y trabajadores. ISO 45003. Confidencial y personalizado."
        keywords="psicólogo IA, NUXA, salud mental, apoyo emocional, chat psicológico, ansiedad, depresión, ISO 45003, bienestar laboral, terapia online, psicólogo virtual, inteligencia artificial"
        ogTitle="NUXA - Tu Psicólogo IA Disponible 24/7"
        ogDescription="Apoyo emocional profesional con IA. Atención en español las 24 horas. Salud mental para personas, familias y trabajadores."
        ogUrl="https://nuxa.life"
        canonicalUrl="https://nuxa.life"
      />
      <StructuredData type="Organization" data={NFlowOrganizationData} />
      <StructuredData type="WebApplication" data={NFlowWebAppData} />
      <Header showBanner={false} />
      <main className="pt-16">
        <FamilySupportHeroSection />
        <NuxaPurposeSection />
        <NuxaBrandEvolutionSection />
        <MentalHealthHeroSection />
        <BorderlessSupportSection />
        <MultilanguageCardSection />
        <IntroCardSection />
        <FreeResourcesCardSection />
        <NeuropsiDemoSection />
        <NFlowCarouselSection />
        <FamilyImageSection />
        <NFlowComparisonSection />
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
        <QueEsNflowSection />
        <PaidAppNotice />
        <TestimonialsSection />
        <LGBTISupportSection />
        
        {/* Menu Sections - All services in one page */}
        <BlogSection />
        <PreciosSection />
        <PartnersSection />
        <ReferralInfoSection />
        <NFlowShowcaseSection />
        <NosotrosSection />
        <ContactoSection />
        
        <CommercialPartnersSection />
        
        <InstitutoSection />
        {/* <PackagesSection /> */}
        
        <ProfessionalSummarySection />
        <ProfessionalMeritSection />
      </main>
      <Footer />
    </div>
  );
}
