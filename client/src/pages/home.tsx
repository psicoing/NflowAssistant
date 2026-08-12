import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { Sparkles, ArrowRight, Star, ExternalLink, X } from "lucide-react";
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

const AWARENESS_BANNER_KEY = "nuxa-awareness-banner-dismissed";

function AwarenessBanner({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-800/40">
      <div className="max-w-5xl mx-auto px-5">
        {/* Header row — always visible, clickable to expand */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center gap-3 py-3.5 text-left group"
        >
          <p className="flex-1 text-white font-black text-sm sm:text-base leading-snug text-center">
            Redes sociales, a partir de los 16 años
          </p>
          <span className={`text-indigo-300 text-xs font-semibold flex-shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
            ▼
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={e => { e.stopPropagation(); onClose(); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClose(); } }}
            aria-label="Cerrar"
            className="flex-shrink-0 text-indigo-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </span>
        </button>

        {/* Expandable content */}
        {expanded && (
          <div className="pb-5 space-y-2 border-t border-indigo-800/40 pt-3">
            <p className="text-indigo-200 text-sm leading-relaxed">
              Las redes sociales como Facebook, Instagram, X (Twitter) y TikTok no están diseñadas para el bienestar de los menores. Su exposición temprana genera ansiedad, baja autoestima y dependencia digital.
            </p>
            <p className="text-indigo-200 text-sm leading-relaxed">
              NUXA apoya a familias y jóvenes a tomar decisiones con claridad, reducir la dependencia digital y desarrollar hábitos emocionales saludables. Protege la salud mental desde edades tempranas.
            </p>
            <p className="text-indigo-100 text-sm font-semibold italic">
              Vuelve a disfrutar de lo real: la naturaleza, el tiempo de calidad y las experiencias que de verdad importan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [awarenessBanner, setAwarenessBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(AWARENESS_BANNER_KEY)) setAwarenessBanner(true);
  }, []);

  const closeAwarenessBanner = () => {
    setAwarenessBanner(false);
    localStorage.setItem(AWARENESS_BANNER_KEY, "1");
  };

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

        {/* Barra de valor - recursos gratuitos */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 px-4 text-center">
          <p className="text-white text-sm font-semibold tracking-wide">
            ✦ Recursos emocionales gratuitos, sin pagar, ¡abiertos a todo el mundo!
          </p>
        </div>

        {/* Sección "Para quién es NUXA" — futurista */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 py-16 px-4 overflow-hidden">
          {/* Partículas de fondo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-teal-400 rounded-full animate-ping opacity-50" />
            <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping delay-700 opacity-40" />
            <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1500 opacity-50" />
            <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-teal-300 rounded-full animate-ping delay-2000 opacity-30" />
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Cabecera */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20 mb-4">
                <div className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
                <span className="text-xs text-teal-300 font-semibold uppercase tracking-widest">¿Para quién es NUXA?</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Para cualquier{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  persona, empresa
                </span>{" "}
                u organización
              </h2>
            </div>

            {/* Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Particulares */}
              <a href="/prueba-gratis" className="group relative flex flex-col items-start rounded-2xl border border-indigo-400/20 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-indigo-400/40 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-1.5 mb-3 text-2xl">
                  <span>👱‍♂️</span><span>👱‍♀️</span><span>👨‍🦳</span><span>👩‍🦳</span><span>👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="relative font-bold text-white text-lg mb-2">Particulares</h3>
                <p className="relative text-slate-300 text-sm leading-relaxed flex-1">Cualquier persona que quiera apoyo emocional, gestionar el estrés o mejorar su bienestar mental. Prueba gratis, sin tarjeta.</p>
                <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 group-hover:gap-2.5 transition-all duration-200">
                  Probar gratis →
                </span>
              </a>

              {/* Empresas */}
              <a href="/empresa-privada" className="group relative flex flex-col items-start rounded-2xl border border-emerald-400/20 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-emerald-400/40 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-1.5 mb-3 text-2xl">
                  <span>🧑‍💼</span><span>🏪</span><span>🏬</span><span>🏢</span><span>🏙️</span>
                </div>
                <h3 className="relative font-bold text-white text-lg mb-2">Empresas</h3>
                <p className="relative text-slate-300 text-sm leading-relaxed flex-1">Cuida el bienestar de tu equipo, reduce el absentismo y cumple con la norma ISO 45003 de riesgos psicosociales en el trabajo.</p>
                <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:gap-2.5 transition-all duration-200">
                  Solución para empresas →
                </span>
              </a>

              {/* Organizaciones públicas */}
              <a href="/sector-publico" className="group relative flex flex-col items-start rounded-2xl border border-sky-400/20 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-sky-400/40 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-1.5 mb-3 text-2xl">
                  <span>🏛️</span><span>🏥</span><span>🏫</span><span>🎓</span><span>🤝</span>
                </div>
                <h3 className="relative font-bold text-white text-lg mb-2">Organizaciones públicas</h3>
                <p className="relative text-slate-300 text-sm leading-relaxed flex-1">Instituciones educativas, sanitarias y administraciones que quieren ofrecer apoyo psicológico accesible a sus usuarios o ciudadanos.</p>
                <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400 group-hover:gap-2.5 transition-all duration-200">
                  Sector público →
                </span>
              </a>
            </div>

            {/* CTA principal */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/prueba-gratis"
                className="btn-orange-glow inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xl px-12 py-5 rounded-2xl transition-all duration-200 shadow-lg shadow-orange-500/30"
              >
                <span className="text-2xl">🚀</span>
                {t('home.cta.button')}
                <span className="text-2xl">→</span>
              </a>
              <a
                href="/recursos-gratuitos"
                className="btn-orange-glow inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xl px-12 py-5 rounded-2xl transition-all duration-200 shadow-lg shadow-orange-500/30"
              >
                <span className="text-2xl">🎁</span>
                Recursos gratis
                <span className="text-2xl">→</span>
              </a>
            </div>
            <p className="text-center text-slate-400 text-sm mt-3">{t('home.cta.subtitle')}</p>

            {/* Testimoniales inline */}
            <div className="mt-14">
              <p className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">Lo que dicen quienes ya usan NUXA</p>
              <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-8">Personas reales, resultados reales</h2>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    quote: "Llevaba meses sin dormir bien por el estrés del trabajo. Después de tres semanas con NUXA ya tengo rutinas que funcionan. No lo esperaba de una IA.",
                    name: "Marta G.",
                    role: "Diseñadora, Barcelona",
                  },
                  {
                    quote: "Lo probé con escepticismo. A los cinco minutos me di cuenta de que escucha de verdad. Sin juicios, sin prisas. Lo tengo instalado en el móvil y lo uso cada noche.",
                    name: "Javier M.",
                    role: "Autónomo, Madrid",
                  },
                  {
                    quote: "Como madre con dos hijos pequeños no tenía tiempo para ir al psicólogo. NUXA está cuando yo puedo — a las 11 de la noche si hace falta. Eso no tiene precio.",
                    name: "Laura P.",
                    role: "Enfermera, Valencia",
                  },
                ].map((t, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Awareness banner — collapsible + dismissible, above NUXA hero card */}
        {awarenessBanner && (
          <AwarenessBanner onClose={closeAwarenessBanner} />
        )}

        <FamilySupportHeroSection />

        {/* Banners profesionales */}
        <div className="bg-white py-5 px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <p className="text-center text-gray-600 font-semibold text-base">
              Si NUXA no cumple tus expectativas, escoge profesional
            </p>

            {/* COPC Banner */}
            <div className="relative overflow-hidden rounded-3xl shadow-xl border border-teal-300 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 transition-all duration-500">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

              <div className="relative px-7 py-7 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center bg-white/20 border border-white/30 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      📋 Directorio profesional
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <span className="text-white font-bold text-sm">Para la ciudadanía: </span>
                      <span className="text-white/85 text-sm leading-relaxed">Encuentra un/a psicólogo/a colegiado/a según tu necesidad, ubicación o especialidad.</span>
                    </div>
                    <div>
                      <span className="text-white font-bold text-sm">Para profesionales: </span>
                      <span className="text-white/85 text-sm leading-relaxed">Busca un/a profesional especializado/a para derivaciones o colaboraciones entre colegiados.</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href="https://www.copc.cat/es/directori-professional"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
                  >
                    COPC
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* NeuronMeg Banner */}
            <a href="https://neuronmeg.online" target="_blank" rel="noopener noreferrer" className="block">
              <div className="relative overflow-hidden rounded-3xl shadow-xl border border-indigo-400 bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative px-7 py-7 flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-flex items-center bg-white/20 border border-white/30 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        🏛️ Instituto NeuronMeg
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div>
                        <span className="text-white font-bold text-sm">Para la ciudadanía: </span>
                        <span className="text-white/85 text-sm leading-relaxed">Formación, recursos y apoyo psicológico especializado para personas y familias.</span>
                      </div>
                      <div>
                        <span className="text-white font-bold text-sm">Para profesionales: </span>
                        <span className="text-white/85 text-sm leading-relaxed">Consulta tarifas, formación continua y red de colaboración entre psicólogos.</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all duration-300">
                      neuronmeg.online
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </a>

          </div>
        </div>

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
