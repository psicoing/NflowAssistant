import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import InstitutoSection from "@/components/sections/instituto-section";
import ProfessionalMeritSection from "@/components/sections/professional-merit-section";
import FounderSection from "@/components/sections/founder-section";
import NosotrosSection from "@/components/sections/nosotros-section";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Building2, Hospital, GraduationCap, Briefcase, Scale, ShieldCheck } from "lucide-react";
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

        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-2 mb-6">
                <Target className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium text-sm">Estrategia de Mercado</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ámbitos de crecimiento de{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">NUXA</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                NUXA está diseñada para entornos privados comprometidos con el bienestar emocional y la prevención psicosocial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-950/30 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Empresas privadas</h3>
                </div>
                <ul className="space-y-2">
                  <li className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>Programas de PRL
                  </li>
                  <li className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>Implementación de ISO 45003
                  </li>
                  <li className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>Employee Wellbeing
                  </li>
                  <li className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>Prevención de riesgos psicosociales
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-rose-900/30 to-rose-950/30 border border-rose-500/20 rounded-2xl p-6 hover:border-rose-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                    <Hospital className="w-5 h-5 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Mutuas privadas</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Solución digital de acompañamiento emocional, sin necesidad de clasificación como producto sanitario.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Universidades y centros privados</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Apoyo emocional en entornos educativos no públicos.
                </p>
              </div>

              <div className="bg-gradient-to-br from-violet-900/30 to-violet-950/30 border border-violet-500/20 rounded-2xl p-6 hover:border-violet-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Colegios profesionales</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Servicios digitales colectivos para el cuidado psicológico de sus miembros.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Marco de actuación</h2>
              </div>

              <p className="text-gray-300 mb-5">NUXA opera con una delimitación clara y responsable:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {[
                  "No realiza diagnóstico clínico",
                  "No efectúa cribado ni detección de trastornos",
                  "No clasifica patologías",
                  "No sustituye la intervención de profesionales sanitarios",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                    <span className="text-red-400 text-lg font-bold">✕</span>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-teal-300 font-semibold text-lg mb-5">
                Es una herramienta de apoyo emocional y orientación psicoeducativa.
              </p>

              <p className="text-gray-300 mb-4">Cumple estrictamente con:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {[
                  "Reglamento General de Protección de Datos (RGPD)",
                  "Evaluación de Impacto en Protección de Datos (EIPD)",
                  "Consentimientos informados claros",
                  "Infraestructura alojada en la Unión Europea",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700/50 pt-6 text-center space-y-1">
                <p className="text-white font-semibold text-lg">NUXA es acompañamiento digital responsable.</p>
                <p className="text-gray-400">Bienestar emocional, sin medicalización innecesaria.</p>
              </div>
            </div>
          </div>
        </section>

        <InstitutoSection />
        <FounderSection />
        <ProfessionalMeritSection />
        <NosotrosSection />
      </main>
      <Footer />
    </div>
  );
}
