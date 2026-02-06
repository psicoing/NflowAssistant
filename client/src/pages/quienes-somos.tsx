import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import InstitutoSection from "@/components/sections/instituto-section";
import ProfessionalMeritSection from "@/components/sections/professional-merit-section";
import FounderSection from "@/components/sections/founder-section";
import NosotrosSection from "@/components/sections/nosotros-section";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function QuienesSomosPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="Quiénes Somos - NUXA | Instituto NeuronMeg"
        description="Conoce al equipo detrás de NUXA. Más de 30 años de experiencia en psicología clínica, acreditación oficial y compromiso con la innovación en salud mental digital."
        keywords="quiénes somos NUXA, Instituto NeuronMeg, Ramón Molons, psicólogo colegiado, salud mental digital, acreditación profesional"
        ogTitle="Quiénes Somos - NUXA | Experiencia y Profesionalismo"
        ogDescription="Conoce al equipo profesional detrás de NUXA. Compromiso, innovación y más de 30 años de experiencia clínica."
        canonicalUrl="https://nuxa.life/quienes-somos"
      />
      <Header showBanner={false} />
      <main className="pt-16">
        {/* Banner de Licitación */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 border-b border-emerald-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
            <p className="text-white font-semibold text-sm md:text-base">
              NUXA es un proyecto de licitación de software para empresas privadas y públicas en el sector de la salud mental personal y laboral
            </p>
          </div>
        </div>

        {/* Botón de Volver */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10 flex items-center gap-2"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Button>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Quiénes <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Somos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Profesionales dedicados a mejorar el bienestar emocional con soluciones digitales innovadoras
            </p>
          </div>
        </section>

        {/* Secciones */}
        <InstitutoSection />
        <FounderSection />
        <ProfessionalMeritSection />
        <NosotrosSection />
      </main>
      <Footer />
    </div>
  );
}
