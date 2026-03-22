import { Link } from "wouter";
import { Sparkles, ArrowRight, Star, ExternalLink } from "lucide-react";
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

import PWAInstallationSection from "@/components/sections/pwa-installation-section";
import AppMovilSection from "@/components/sections/app-movil-section";
import MultilanguageCardSection from "@/components/sections/multilanguage-card-section";
import StudentsCardSection from "@/components/sections/students-card-section";
import MentalHealthHeroSection from "@/components/sections/mental-health-hero-section";
import BorderlessSupportSection from "@/components/sections/borderless-support-section";
import YouthMentalHealthSection from "@/components/sections/youth-mental-health-section";
import LGBTISupportSection from "@/components/sections/lgbti-support-section";
import BlogSection from "@/components/sections/blog-section";
import NFlowShowcaseSection from "@/components/sections/nflow-showcase-section";
import ContactoSection from "@/components/sections/contacto-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import IntroCardSection from "@/components/sections/intro-card-section";
import NeuropsiDemoSection from "@/components/sections/neuropsi-demo-section";
import NFlowCarouselSection from "@/components/sections/nflow-carousel-section";
import FamilyImageSection from "@/components/sections/family-image-section";
import NFlowComparisonSection from "@/components/sections/nflow-comparison-section";
import ProfessionalSummarySection from "@/components/sections/professional-summary-section";
import QueEsNflowSection from "@/components/sections/que-es-nflow-section";
import FreeResourcesCardSection from "@/components/sections/free-resources-card-section";
import FamilySupportHeroSection from "@/components/sections/family-support-hero-section";
import NflowToNuxaTransitionSection from "@/components/sections/nflow-to-nuxa-transition-section";
import NuxaPurposeSection from "@/components/sections/nuxa-purpose-section";
import NuxaBrandEvolutionSection from "@/components/sections/nuxa-brand-evolution-section";
import NuxaPhonesShowcaseSection from "@/components/sections/nuxa-phones-showcase-section";
import { 
  NuxaRobotForestSection,
  NuxaRobotZenSection,
  NuxaRobotMountainSection,
  NuxaRobotLibrarySection,
  NuxaRobotAuroraSection,
  NuxaRobotLivingRoomSection,
  NuxaRobotBambooSection,
  NuxaRobotTeenagersSection,
  NuxaRobotVsGptSection,
  NuxaRobotListeningSection,
  NuxaRobotRevealSection,
  NuxaRobotProfessionalSection,
  NuxaRobotFamilyTherapySection,
  NuxaRobotTransformationSection,
  NuxaRobotWellnessHealingSection,
  NuxaRobotConnectingSection,
  NuxaRobotMultilingualSection,
  NuxaRobotPhoneShowcaseSection,
  NuxaRobotWelcomingSection,
  NuxaRobotFreeResourcesSection,
  NuxaRobotNeuroscienceSection,
  NuxaRobotCarouselSection,
  NuxaRobotFamilyPortraitSection,
  NuxaRobotComparisonSection,
  NuxaRobotYouthEmpowermentSection,
  NuxaRobotGlobalAccessSection,
  NuxaRobotAgeSafeSection,
  NuxaRobotSuperheroSection,
  NuxaRobotServicesSection,
  NuxaRobotChatExamplesSection,
  NuxaRobotPwaGuideSection,
  NuxaRobotMobileAppSection,
  NuxaRobotFeaturesSection,
  NuxaRobotPersonasSection,
  NuxaRobotExplainingSection,
  NuxaRobotPremiumSection,
  NuxaRobotTestimonialsSection,
  NuxaRobotLgbtqSection,
  NuxaRobotBlogReadingSection,
  NuxaRobotShowcaseSection,
  NuxaRobotContactSection,
} from "@/components/sections/nuxa-robot-scenes";
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
        <NuxaRobotForestSection />
        <FamilySupportHeroSection />
        
        <NuxaRobotFamilyTherapySection />
        <NflowToNuxaTransitionSection />
        
        <NuxaRobotTransformationSection />
        <NuxaBrandEvolutionSection />
        
        <NuxaRobotListeningSection />
        <MentalHealthHeroSection />
        
        <NuxaRobotConnectingSection />
        <BorderlessSupportSection />
        
        <NuxaRobotMultilingualSection />
        <MultilanguageCardSection />
        
        <StudentsCardSection />
        
        <NuxaRobotRevealSection />

        {/* Free Demo Banner */}
        <div className="relative bg-white py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/prueba-gratis">
              <div className="group relative overflow-hidden rounded-3xl cursor-pointer">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-400/20 via-transparent to-transparent rounded-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-400/15 via-transparent to-transparent rounded-3xl" />

                {/* Decorative stars */}
                <div className="absolute top-4 right-8 opacity-40">
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                </div>
                <div className="absolute top-8 right-16 opacity-25">
                  <Star className="w-2 h-2 text-yellow-200 fill-yellow-200" />
                </div>
                <div className="absolute bottom-5 left-10 opacity-30">
                  <Star className="w-2.5 h-2.5 text-pink-300 fill-pink-300" />
                </div>

                {/* Content */}
                <div className="relative px-8 py-7 flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">NUXA AI</span>
                      <span className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-0.5 rounded-full tracking-wide">
                        FREE
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mb-1">
                      Free Demo
                    </h3>
                    <p className="text-white/75 text-sm font-medium tracking-wide">
                      No credit card required · Start in seconds · 2 free conversations
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center gap-2.5 bg-white text-purple-700 font-bold text-sm px-6 py-3 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      <span>Try it now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* NeuronMeg Banner */}
        <div className="bg-white py-4 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 shadow-md px-6 py-6">
              <div className="flex flex-col gap-4">
                {/* Top row: icon + text */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center shadow-sm mt-0.5">
                    <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-teal-600 text-xs font-bold tracking-widest uppercase">Alternativa profesional</span>
                      <span className="inline-flex items-center bg-teal-100 border border-teal-300 text-teal-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Psicólogos colegiados
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight mb-1">
                      ¿Prefieres hablar con un profesional?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      NUXA no sustituye a un psicólogo. Si buscas atención profesional, <span className="font-semibold text-teal-700">NeuronMeg</span> ofrece videollamadas y visitas a domicilio con psicólogos colegiados — una opción completamente legítima y recomendada.
                    </p>
                  </div>
                </div>
                {/* Bottom row: buttons */}
                <div className="flex flex-row gap-3 flex-wrap">
                  <a
                    href="https://neuronmeg.online/plans"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow transition-colors"
                  >
                    Ver tarifas
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://neuronmeg.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-teal-50 text-teal-700 font-semibold text-sm px-5 py-2.5 rounded-xl border border-teal-300 shadow-sm transition-colors"
                  >
                    neuronmeg.online
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NuxaPurposeSection />
        
        <NuxaRobotPhoneShowcaseSection />
        <NuxaPhonesShowcaseSection />
        
        <NuxaRobotWelcomingSection />
        <IntroCardSection />
        
        <NuxaRobotFreeResourcesSection />
        <FreeResourcesCardSection />
        
        <NuxaRobotNeuroscienceSection />
        <NeuropsiDemoSection />
        
        <NuxaRobotCarouselSection />
        <NFlowCarouselSection />
        
        <NuxaRobotFamilyPortraitSection />
        <FamilyImageSection />
        
        <NuxaRobotComparisonSection />
        <NFlowComparisonSection />
        
        <NuxaRobotYouthEmpowermentSection />
        <YouthMentalHealthSection />
        
        <NuxaRobotGlobalAccessSection />
        <GlobalSupportSection />
        
        <NuxaRobotAgeSafeSection />
        <AgeNoticeSection />
        
        <NuxaRobotSuperheroSection />
        <HeroSection />
        
        <NuxaRobotServicesSection />
        <ServicesSection />
        
        <NuxaRobotChatExamplesSection />
        <ChatExamplesSection />
        
        <NuxaRobotPwaGuideSection />
        <PWAInstallationSection />
        
        <NuxaRobotMobileAppSection />
        <AppMovilSection />
        
        <NuxaRobotFeaturesSection />
        <FeaturesSection />
        
        <NuxaRobotPersonasSection />
        <PersonasSection />
        
        <NuxaRobotExplainingSection />
        <QueEsNflowSection />
        
        <NuxaRobotPremiumSection />
        <PaidAppNotice />
        
        <NuxaRobotTestimonialsSection />
        <TestimonialsSection />
        
        <NuxaRobotLgbtqSection />
        <LGBTISupportSection />
        
        <NuxaRobotBlogReadingSection />
        <BlogSection />
        
        <NuxaRobotShowcaseSection />
        <NFlowShowcaseSection />
        
        <NuxaRobotProfessionalSection />
        <ProfessionalSummarySection />
        
        <NuxaRobotContactSection />
        <ContactoSection />
        
        <NuxaRobotAuroraSection />
      </main>
      <Footer />
    </div>
  );
}
