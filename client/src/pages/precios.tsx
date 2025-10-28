import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PreciosSection from "@/components/sections/precios-section";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PreciosPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="Precios - NUXA | Planes desde €2.99/mes"
        description="Planes de suscripción NUXA: Básico €2.99/mes, Individual €5.99/mes, Premium €32/año. Apoyo emocional 24/7 con IA en 150+ idiomas. Planes empresariales disponibles."
        keywords="precios psicólogo IA, suscripción salud mental, plan terapia online, NUXA precios, ISO 45003 empresas"
        ogTitle="Planes y Precios NUXA - Apoyo Mental Accesible"
        ogDescription="Desde €2.99/mes. Apoyo emocional profesional 24/7 para personas y empresas en 150+ idiomas."
        canonicalUrl="https://nuxa.life/precios"
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

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Planes y <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Precios</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Apoyo emocional profesional 24/7 para personas y empresas
            </p>
          </div>
        </section>

        {/* Sección de Precios */}
        <PreciosSection />
      </main>
      <Footer />
    </div>
  );
}
