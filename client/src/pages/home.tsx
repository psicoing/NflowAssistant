import { useState, useEffect } from "react";
import { entityDefinition, nuxaHomeDescription } from "@shared/seo/entity-definition";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { Sparkles, ArrowRight, Brain, Calculator, ExternalLink, X, Phone, ShieldCheck, Globe2, Clock3 } from "lucide-react";
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
import TechnicalStrengthsSection from "@/components/sections/technical-strengths-section";
import AudienceSection from "@/components/sections/audience-section";
import IntroCardSection from "@/components/sections/intro-card-section";
import NeuropsiDemoSection from "@/components/sections/neuropsi-demo-section";
import NFlowCarouselSection from "@/components/sections/nflow-carousel-section";
import FamilyImageSection from "@/components/sections/family-image-section";
import NFlowComparisonSection from "@/components/sections/nflow-comparison-section";
import ProfessionalSummarySection from "@/components/sections/professional-summary-section";
import QueEsNflowSection from "@/components/sections/que-es-nflow-section";
import FreeResourcesCardSection from "@/components/sections/free-resources-card-section";
import GiftPrizesSection from "@/components/sections/gift-prizes-section";
import FamilySupportHeroSection from "@/components/sections/family-support-hero-section";
import NflowToNuxaTransitionSection from "@/components/sections/nflow-to-nuxa-transition-section";
import NuxaPurposeSection from "@/components/sections/nuxa-purpose-section";
import InsNeuronmegSection from "@/components/sections/ins-neuronmeg-section";
import NuxaBrandEvolutionSection from "@/components/sections/nuxa-brand-evolution-section";
import NuxaPhonesShowcaseSection from "@/components/sections/nuxa-phones-showcase-section";
import HomepageProfessionalDialog from "@/components/sections/homepage-professional-dialog";
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
  NuxaRobotLgbtqSection,
  NuxaRobotBlogReadingSection,
  NuxaRobotShowcaseSection,
  NuxaRobotContactSection,
} from "@/components/sections/nuxa-robot-scenes";
import { SEOHead } from "@/components/SEOHead";
import { StructuredData, NFlowOrganizationData, NFlowWebAppData } from "@/components/StructuredData";
import { trackEvent } from "@/lib/analytics";
import { useLanguageContext } from "@/components/LanguageProvider";

const AWARENESS_BANNER_KEY = "nuxa-awareness-banner-dismissed";

// ── Professional Directory Data ──────────────────────────────────────────────
type CountryCtx = 'es' | 'fr' | 'uk' | 'us';

interface DirResource { label: string; url: string; desc: string; }
interface DirConfig {
  badge: string;
  publicText: string;
  proText: string;
  btnLabel: string;
  directUrl?: string;   // for ES: direct link, no modal
  resources?: DirResource[]; // for FR/UK/US: opens modal
  flag: string;
}

const DIR_DATA: Record<CountryCtx, DirConfig> = {
  es: {
    flag: 'es',
    badge: 'Directorio profesional',
    publicText: 'Encuentra un/a psicólogo/a colegiado/a según tu necesidad, ubicación o especialidad.',
    proText: 'Busca un/a profesional especializado/a para derivaciones o colaboraciones entre colegiados.',
    btnLabel: 'COPC',
    directUrl: 'https://www.copc.cat/es/directori-professional',
  },
  fr: {
    flag: 'fr',
    badge: 'Répertoire professionnel',
    publicText: 'Trouvez un professionnel de santé mentale et consultez les options disponibles selon vos besoins.',
    proText: 'Localisez des professionnels pour des orientations et une collaboration entre professionnels.',
    btnLabel: 'Annuaire Santé',
    resources: [
      { label: 'Annuaire Santé', url: 'https://www.annuaire-sante.ameli.fr/', desc: 'Trouver un professionnel de santé en France' },
      { label: 'Mon soutien psy', url: 'https://www.ameli.fr/assure/sante/themes/sante-mentale/mon-soutien-psy', desc: 'Séances de soutien psychologique remboursées par l\'Assurance Maladie' },
    ],
  },
  uk: {
    flag: 'uk',
    badge: 'Professional Directory',
    publicText: 'Find a qualified and registered mental-health professional according to your needs and location.',
    proText: 'Find other professionals for referrals, specialist support and collaboration.',
    btnLabel: 'NHS / HCPC',
    resources: [
      { label: 'NHS Talking Therapies', url: 'https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/nhs-talking-therapies/', desc: 'Self-refer to free NHS talking therapy services' },
      { label: 'HCPC Register', url: 'https://www.hcpc-uk.org/check-the-register/', desc: 'Check a therapist is registered with the HCPC' },
      { label: 'NHS Mental Health Services', url: 'https://www.nhs.uk/mental-health/', desc: 'NHS mental health services and support' },
    ],
  },
  us: {
    flag: 'us',
    badge: 'Professional Directory',
    publicText: 'Find a licensed psychologist by city, state or ZIP code through the APA Psychologist Locator.',
    proText: 'Find mental-health treatment services through SAMHSA FindTreatment.gov.',
    btnLabel: 'APA / SAMHSA',
    resources: [
      { label: 'APA Psychologist Locator', url: 'https://locator.apa.org/', desc: 'Find a licensed psychologist by location and specialty' },
      { label: 'SAMHSA FindTreatment.gov', url: 'https://findtreatment.gov/', desc: 'Government portal for mental-health treatment services' },
    ],
  },
};

// ── Professional Directory Modal ─────────────────────────────────────────────
function ProfessionalDirModal({ cfg, onClose }: { cfg: DirConfig; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#f3f6ef] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#cbded6] bg-[#eaf1eb] px-6 py-5">
          <div>
            <span className="mb-2 inline-flex items-center rounded-full border border-[#cbded6] bg-[#f3f6ef] px-2.5 py-0.5 text-xs font-semibold text-[#42695f]">
              {cfg.badge}
            </span>
            <div className="flex flex-col gap-1.5">
              <div>
                <span className="text-[#234844] font-bold text-sm">
                  {cfg.flag === 'fr' ? 'Pour le public : ' : 'For the public: '}
                </span>
                <span className="text-[#526b68] text-sm leading-relaxed">{cfg.publicText}</span>
              </div>
              <div>
                <span className="text-[#234844] font-bold text-sm">
                  {cfg.flag === 'fr' ? 'Pour les professionnels : ' : 'For professionals: '}
                </span>
                <span className="text-[#526b68] text-sm leading-relaxed">{cfg.proText}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-[#64827a] transition-colors hover:text-[#173e3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65]"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resources */}
        <div className="px-6 py-5">
          <p className="text-xs font-bold text-[#64827a] uppercase tracking-wider mb-3">
            Recursos oficiales
          </p>
          <div className="flex flex-col gap-3">
            {cfg.resources?.map(r => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#cbded6] bg-[#eaf1eb] px-4 py-3 transition-colors hover:bg-[#dce8dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65]"
              >
                <div className="min-w-0">
                  <p className="text-[#234844] font-bold text-sm">{r.label}</p>
                  <p className="text-[#526b68] text-xs leading-snug mt-0.5">{r.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#55776a] flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AwarenessBanner({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-y border-[#cbded6] bg-[#eaf1eb] text-[#234844]">
      <div className="max-w-5xl mx-auto px-5">
        {/* Header row — always visible, clickable to expand */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="group flex w-full items-center gap-3 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#557d65]"
        >
          <p className="flex-1 text-center text-sm font-semibold leading-snug sm:text-base">
            Redes sociales, a partir de los 16 años
          </p>
          <span aria-hidden="true" className={`flex-shrink-0 text-[#55776a] transition-transform duration-300 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}>
            ⌄
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={e => { e.stopPropagation(); onClose(); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClose(); } }}
            aria-label="Cerrar"
            className="flex-shrink-0 cursor-pointer rounded-lg p-1 text-[#64827a] transition-colors hover:bg-[#dce8dc] hover:text-[#173e3d]"
          >
            <X className="w-4 h-4" />
          </span>
        </button>

        {/* Expandable content */}
        {expanded && (
          <div className="space-y-2 border-t border-[#cbded6] pb-5 pt-3">
            <p className="text-sm leading-relaxed text-[#526b68]">
              Las redes sociales forman parte de la vida cotidiana y pueden influir en cómo se sienten los jóvenes. Hablar de sus hábitos digitales ayuda a tomar decisiones con más claridad.
            </p>
            <p className="text-sm leading-relaxed text-[#526b68]">
              NUXA ofrece a familias y jóvenes un espacio para reflexionar sobre bienestar y hábitos digitales, a su propio ritmo.
            </p>
            <p className="text-sm font-semibold italic text-[#42695f]">
              Vuelve a disfrutar de lo real: la naturaleza, el tiempo de calidad y las experiencias que de verdad importan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function HomepageConversionBlock() {
  const { currentLanguage } = useLanguageContext();
  const copy = {
    es: {
      eyebrow: "Empieza cuando lo necesites",
      title: "Un psicólogo en tu bolsillo",
      description: "Habla con NUXA cuando necesites ordenar lo que sientes, sin esperas y sin juicios. Para ti, tu familia o tu equipo.",
      trial: "Probar gratis ahora",
      call: "Llamar al asistente NUXA",
      pricing: "2 consultas gratuitas · Sin tarjeta · Después, desde 2,99 €/mes y sin permanencia",
      essentials: "Lo esencial, desde el primer día",
      freeTitle: "2 consultas gratis",
      freeText: "Sin introducir datos de pago.",
      languagesTitle: "Más de 150 idiomas",
      languagesText: "Conecta desde cualquier lugar.",
      availableTitle: "Siempre disponible",
      availableText: "De día, de noche y cuando más importa.",
    },
    en: {
      eyebrow: "Start whenever you need",
      title: "A psychologist in your pocket",
      description: "Talk to NUXA whenever you need to make sense of how you feel, without waiting or judgement. For you, your family or your team.",
      trial: "Try it free now",
      call: "Call the NUXA assistant",
      pricing: "2 free consultations · No card · Then from €2.99/month, cancel anytime",
      essentials: "The essentials, from day one",
      freeTitle: "2 free consultations",
      freeText: "No payment details required.",
      languagesTitle: "More than 150 languages",
      languagesText: "Connect from anywhere.",
      availableTitle: "Always available",
      availableText: "Day, night and when it matters most.",
    },
    fr: {
      eyebrow: "Commencez quand vous en avez besoin",
      title: "Un psychologue dans votre poche",
      description: "Parlez à NUXA lorsque vous avez besoin de comprendre ce que vous ressentez, sans attente et sans jugement. Pour vous, votre famille ou votre équipe.",
      trial: "Essayer gratuitement",
      call: "Appeler l’assistant NUXA",
      pricing: "2 consultations gratuites · Sans carte · Puis dès 2,99 €/mois, sans engagement",
      essentials: "L’essentiel, dès le premier jour",
      freeTitle: "2 consultations gratuites",
      freeText: "Aucune donnée de paiement requise.",
      languagesTitle: "Plus de 150 langues",
      languagesText: "Connectez-vous où que vous soyez.",
      availableTitle: "Toujours disponible",
      availableText: "De jour, de nuit et lorsque cela compte le plus.",
    },
  } as const;
  const content = copy[currentLanguage as keyof typeof copy] || copy.es;

  const handleFreeTrialClick = () => {
    trackEvent("free_trial_cta_clicked", {
      placement: "homepage_hero",
      audience: "individual",
    });
  };

  const handlePhoneClick = () => {
    trackEvent("homepage_phone_cta_clicked", {
      placement: "homepage_hero",
      audience: "individual",
    });
  };

  return (
    <section
      aria-labelledby="homepage-conversion-title"
      className="border-y border-[#cbded6] bg-[#f3f6ef] px-4 py-10 text-[#173e3d] sm:py-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border-b border-[#b9cdb7] pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#55776a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#77977e]" aria-hidden="true" />
              {content.eyebrow}
            </div>
            <h1 id="homepage-conversion-title" className="max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-[3.25rem]">
              {content.title} <span className="text-[#557d65]">24/7</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#526b68] sm:text-lg">
              {content.description}{" "}
              <HomepageProfessionalDialog currentLanguage={currentLanguage} />
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/prueba-gratis"
                onClick={handleFreeTrialClick}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f6ef] motion-reduce:transition-none sm:px-7"
              >
                {content.trial}
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
              </Link>
              <a
                href="tel:+17817822371"
                onClick={handlePhoneClick}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#9cb8aa] px-5 py-3 text-sm font-semibold text-[#315e57] transition-colors hover:bg-[#e5eee6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f6ef] motion-reduce:transition-none sm:px-6"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {content.call}
              </a>
            </div>
            <p className="mt-3 text-xs font-medium text-[#647b75]">
              {content.pricing}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#d6e3dc] bg-[#e9efe8] p-5 sm:p-6">
            <p className="mb-4 text-sm font-semibold text-[#234844]">{content.essentials}</p>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-start gap-3 rounded-xl bg-[#f4f6ef] p-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#557d65]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#234844]">{content.freeTitle}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#647b75]">{content.freeText}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-[#f4f6ef] p-3">
                <Globe2 className="mt-0.5 h-5 w-5 flex-none text-[#557d65]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#234844]">{content.languagesTitle}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#647b75]">{content.languagesText}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-[#f4f6ef] p-3">
                <Clock3 className="mt-0.5 h-5 w-5 flex-none text-[#557d65]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#234844]">{content.availableTitle}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#647b75]">{content.availableText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [awarenessBanner, setAwarenessBanner] = useState(false);
  const [countryCtx, setCountryCtx] = useState<CountryCtx>('es');
  const [dirModalOpen, setDirModalOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(AWARENESS_BANNER_KEY)) setAwarenessBanner(true);
  }, []);

  useEffect(() => {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('fr')) setCountryCtx('fr');
    else if (lang === 'en-gb' || lang.startsWith('en-gb')) setCountryCtx('uk');
    else if (lang.startsWith('en')) setCountryCtx('us');
    else setCountryCtx('es');
  }, []);

  const closeAwarenessBanner = () => {
    setAwarenessBanner(false);
    localStorage.setItem(AWARENESS_BANNER_KEY, "1");
  };

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="NUXA - Tu asistente de bienestar emocional, disponible 24/7"
        description={nuxaHomeDescription}
        keywords="asistente de bienestar emocional, NUXA, salud mental, apoyo emocional, ansiedad, depresión, ISO 45003, bienestar laboral, inteligencia artificial"
        ogTitle="NUXA - Tu asistente de bienestar emocional 24/7"
        ogDescription={nuxaHomeDescription}
        ogUrl="https://nuxa.life"
        canonicalUrl="https://nuxa.life/"
      />
      <StructuredData type="Organization" data={NFlowOrganizationData} />
      <StructuredData type="WebApplication" data={NFlowWebAppData} />
      <Header showBanner={false} />
      <main className="pt-16">

        <NuxaRobotForestSection />

        <HomepageConversionBlock />

        <AudienceSection />

        <TechnicalStrengthsSection />

        {/* Awareness banner — collapsible + dismissible, above NUXA hero card */}
        {awarenessBanner && (
          <AwarenessBanner onClose={closeAwarenessBanner} />
        )}

        <FamilySupportHeroSection />

        {/* Banners profesionales */}
        <div className="bg-[#f3f6ef] px-4 py-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <p className="text-center text-[#526b68] font-medium text-sm">
              Si NUXA no cumple tus expectativas, escoge profesional
            </p>

            {/* Professional Directory Banner — adapts by country */}
            {(() => {
              const cfg = DIR_DATA[countryCtx];
              return (
                <>
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-[#cbded6] bg-[#123f43]">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-[#6d9d8c]/30" />

                    <div className="relative flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:px-7">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#d6e69a] text-[#173e3d]">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="inline-flex items-center border-b border-[#6d9d8c]/60 pb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#c9dd83]">
                            {cfg.badge}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div>
                              <span className="text-[#e8eee7] font-semibold text-sm">
                              {countryCtx === 'es' ? 'Para la ciudadanía: ' : countryCtx === 'fr' ? 'Pour le public : ' : 'For the public: '}
                            </span>
                              <span className="text-[#c3d8d1] text-sm leading-relaxed">{cfg.publicText}</span>
                          </div>
                          <div>
                              <span className="text-[#e8eee7] font-semibold text-sm">
                              {countryCtx === 'es' ? 'Para profesionales: ' : countryCtx === 'fr' ? 'Pour les professionnels : ' : 'For professionals: '}
                            </span>
                              <span className="text-[#c3d8d1] text-sm leading-relaxed">{cfg.proText}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {cfg.directUrl ? (
                          <a
                            href={cfg.directUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#d6e69a] px-5 py-2.5 text-sm font-semibold text-[#173e3d] transition-colors hover:bg-[#e3edb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eff5c7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f43] motion-reduce:transition-none"
                          >
                            {cfg.btnLabel}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <button
                            onClick={() => setDirModalOpen(true)}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#d6e69a] px-5 py-2.5 text-sm font-semibold text-[#173e3d] transition-colors hover:bg-[#e3edb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eff5c7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f43] motion-reduce:transition-none"
                          >
                            {cfg.btnLabel}
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {dirModalOpen && (
                    <ProfessionalDirModal cfg={cfg} onClose={() => setDirModalOpen(false)} />
                  )}
                </>
              );
            })()}

            {/* NeuronMeg Banner */}
            <a href="https://neuronmeg.online" target="_blank" rel="noopener noreferrer" className="block rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65] focus-visible:ring-offset-2">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-[#cbded6] bg-[#e7eee7] transition-colors hover:bg-[#e1ebe3]">
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-[#8aa895]/35" />

                <div className="relative flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:px-7">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#174f50] text-[#d6e69a]">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-flex items-center border-b border-[#a8bd9e] pb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#55776a]">
                        Instituto NeuronMeg
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div>
                          <span className="font-semibold text-[#234844] text-sm">Para la ciudadanía: </span>
                          <span className="text-[#526b68] text-sm leading-relaxed">Formación, recursos y apoyo psicológico especializado para personas y familias.</span>
                      </div>
                      <div>
                          <span className="font-semibold text-[#234844] text-sm">Para profesionales: </span>
                          <span className="text-[#526b68] text-sm leading-relaxed">Consulta tarifas, formación continua y red de colaboración entre psicólogos.</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                      <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#174f50] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#103f42]">
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
        <div className="bg-[#f3f6ef] px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/prueba-gratis">
              <div className="group relative overflow-hidden rounded-[1.75rem] border border-[#cbded6] bg-[#123f43] transition-colors hover:bg-[#16484a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6e69a] focus-visible:ring-offset-2">
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#6d9d8c]/30" />
                <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-8 h-56 w-56 rounded-full border border-[#6d9d8c]/20" />

                {/* Content */}
                <div className="relative px-8 py-7 flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Icon */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#d6e69a] text-[#173e3d]">
                    <Sparkles className="h-6 w-6" />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-[#c3d8d1] text-xs font-semibold tracking-widest uppercase">NUXA</span>
                      <span className="inline-flex items-center border border-[#6d9d8c]/50 bg-white/5 text-[#d6e69a] text-xs font-semibold px-3 py-0.5 rounded-full tracking-wide">
                        GRATIS
                      </span>
                    </div>
                    <h3 className="mb-1 text-2xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-3xl">
                      Prueba gratuita
                    </h3>
                    <p className="text-[#c3d8d1] text-sm font-medium tracking-wide">
                      Sin tarjeta · Empieza en segundos · 2 conversaciones gratis
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex-shrink-0">
                    <div className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d6e69a] px-5 py-2.5 text-sm font-semibold text-[#173e3d] transition-colors group-hover:bg-[#e3edb8]">
                      <span>Pruébalo ahora</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <NuxaPurposeSection />
        <InsNeuronmegSection />
        
        <NuxaRobotPhoneShowcaseSection />
        <NuxaPhonesShowcaseSection />
        
        <NuxaRobotWelcomingSection />
        <IntroCardSection />
        
        <NuxaRobotFreeResourcesSection />
        <FreeResourcesCardSection />
        <GiftPrizesSection />

        {/* ── Herramientas gratuitas ── */}
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="mb-4 inline-flex items-center gap-2 border-b border-[#b9cdb7] pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#55776a]">
                Recursos de consulta
              </span>
              <h2 className="mb-2 text-2xl font-semibold tracking-[-0.035em] text-[#173e3d] sm:text-3xl">Sin registro. Sin tarjeta.</h2>
              <p className="text-[#647b75]">Úsalas ahora mismo.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Link href="/test-bienestar"
                className="group block rounded-[1.5rem] border border-[#cbded6] bg-[#f3f6ef] p-6 transition-colors hover:bg-[#eaf1eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65] sm:p-7">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1ebe3] text-[#47736a]"><Brain aria-hidden="true" className="h-5 w-5" /></div>
                <h3 className="mb-2 text-xl font-semibold text-[#234844] transition-colors group-hover:text-[#557d65]">Test de Bienestar Emocional</h3>
                <p className="mb-4 text-sm leading-relaxed text-[#647b75]">
                  16 preguntas basadas en PHQ-9 y GAD-7. Recibe tu informe personalizado de estado de ánimo y ansiedad en 5 minutos.
                </p>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="rounded-full border border-[#cbded6] bg-[#eaf1eb] px-3 py-1 text-xs text-[#42695f]">16 preguntas</span>
                  <span className="rounded-full border border-[#cbded6] bg-[#eaf1eb] px-3 py-1 text-xs text-[#42695f]">5 minutos</span>
                  <span className="rounded-full border border-[#cbded6] bg-[#eaf1eb] px-3 py-1 text-xs text-[#42695f]">Gratis</span>
                </div>
                <p className="inline-block text-sm font-semibold text-[#42695f] transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">Empezar el test →</p>
              </Link>

              <Link href="/calculadora-burnout"
                className="group block rounded-[1.5rem] border border-[#cbded6] bg-[#eaf1eb] p-6 transition-colors hover:bg-[#e1ebe3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557d65] sm:p-7">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce8dc] text-[#47736a]"><Calculator aria-hidden="true" className="h-5 w-5" /></div>
                <h3 className="mb-2 text-xl font-semibold text-[#234844] transition-colors group-hover:text-[#557d65]">Calculadora de Burnout</h3>
                <p className="mb-4 text-sm leading-relaxed text-[#647b75]">
                  Calcula el coste real del burnout en tu empresa: absentismo, presentismo y rotación. Datos para convencer a dirección.
                </p>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="rounded-full border border-[#cbded6] bg-[#f3f6ef] px-3 py-1 text-xs text-[#42695f]">Para empresas</span>
                  <span className="rounded-full border border-[#cbded6] bg-[#f3f6ef] px-3 py-1 text-xs text-[#42695f]">10 sectores</span>
                  <span className="rounded-full border border-[#cbded6] bg-[#f3f6ef] px-3 py-1 text-xs text-[#42695f]">Gratis</span>
                </div>
                <p className="inline-block text-sm font-semibold text-[#42695f] transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">Calcular ahora →</p>
              </Link>
            </div>
          </div>
        </section>

        <NuxaRobotNeuroscienceSection />
        <NeuropsiDemoSection />
        
        <NuxaRobotCarouselSection />
        <NFlowCarouselSection />
        
        <NuxaRobotFamilyPortraitSection />
        <FamilyImageSection />
        
        <NuxaRobotComparisonSection />
        <div id="comparativa">
          <NFlowComparisonSection />
        </div>
        
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
        <section className="max-w-5xl mx-auto px-6 py-12" aria-labelledby="home-nuxa-definition">
          <h2 id="home-nuxa-definition" className="text-2xl font-bold mb-4">{entityDefinition.es.heading}</h2>
          <p className="text-white/85 mb-4">{entityDefinition.es.text}</p>
          <p className="text-white/85 mb-4">{entityDefinition.es.offer}</p>
          <nav className="flex flex-wrap gap-4 text-emerald-300" aria-label="Información institucional">
            <Link href="/es/about-nuxa">Sobre NUXA</Link>
            <Link href="/bienestar-emocional">Guía de bienestar</Link>
            <Link href="/es/safety">Seguridad y límites</Link>
            <Link href="/es/editorial-policy">Política editorial</Link>
            <Link href="/prueba-gratis">Prueba y condiciones</Link>
            <Link href="/precios">Precios</Link>
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
}
