import PricingSection from "@/components/sections/pricing-section";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function PreciosPage() {
  return (
    <>
      
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
                Salud mental digital sin postureo
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Solo tú, tu mejora personal y la IA. Todo 100% automático, seguro y privado. 
                Aquí lo que ves es lo que hay.
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