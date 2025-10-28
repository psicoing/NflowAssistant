import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PartnersSection from "@/components/sections/partners-section";
import CommercialPartnersSection from "@/components/sections/commercial-partners-section";
import ReferralInfoSection from "@/components/sections/referral-info-section";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PartnersPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="Programa de Partners - NUXA | Gana con Salud Mental"
        description="Únete al programa de Partners de NUXA. Gana hasta 40% de comisión por cada referido. Profesionales, clínicas e instituciones pueden generar ingresos mientras ayudan a mejorar el bienestar mental."
        keywords="partners NUXA, programa de afiliados, comisiones salud mental, referidos, partners comerciales, ingresos recurrentes, psicólogos partners"
        ogTitle="Programa de Partners NUXA - Gana hasta 40% de Comisión"
        ogDescription="Genera ingresos recurrentes mientras ayudas a mejorar el bienestar mental. Únete a nuestra red global de profesionales."
        canonicalUrl="https://nuxa.life/partners"
      />
      <Header showBanner={false} />
      <main className="pt-16">
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

        {/* Hero Section con título */}
        <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Programa de <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Partners</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Genera ingresos recurrentes mientras ayudas a transformar la salud mental con IA
            </p>
          </div>
        </section>

        {/* Secciones de Partners */}
        <PartnersSection />
        <ReferralInfoSection />
        <CommercialPartnersSection />
      </main>
      <Footer />
    </div>
  );
}
