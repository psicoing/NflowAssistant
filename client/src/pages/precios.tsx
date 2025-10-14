import PricingSection from "@/components/sections/pricing-section";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";

export default function PreciosPage() {
  return (
    <>
      <SEOHead
        title="Precios - NFLOW Psicólogo IA | Planes desde €2.99/mes"
        description="Planes de suscripción NFLOW: individual €2.99/mes, familiar €4.99/mes, empresarial desde €1.99/usuario. Psicólogo IA 24/7 con ISO 45003. Prueba ahora."
        keywords="precios psicólogo IA, suscripción salud mental, plan terapia online, NFLOW precios, ISO 45003 empresas"
        ogTitle="Planes y Precios NFLOW - Psicólogo IA Accesible"
        ogDescription="Desde €2.99/mes. Apoyo emocional profesional 24/7 para personas, familias y trabajadores."
        canonicalUrl="https://nflow.style/precios"
      />
      <div className="min-h-screen bg-nflow-navy">
        <Header />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 px-4 bg-nflow-navy text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Planes de Suscripción
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-8">
                Para individuos, familias y trabajadores
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Soluciones innovadoras que integren salud mental y desarrollo laboral, alineadas con 
                los principios de la normativa ISO 45003. Recurso digital de apoyo emocional continuo.
              </p>
            </div>
          </section>

          {/* Pricing Section */}
          <PricingSection />
        </main>
        <Footer />
      </div>
    </>
  );
}