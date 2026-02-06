import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Landmark, Target, Users, School, Hospital, Building, CheckCircle, ArrowRight, ExternalLink, Shield, Heart, Brain, Globe } from "lucide-react";
import { useLocation } from "wouter";

export default function SectorPublico() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="Sector Público - NUXA | Salud Mental en la Administración"
        description="NUXA para la administración pública: herramienta de salud mental gratuita para funcionarios, docentes, sanitarios y alumnado."
        keywords="NUXA administración pública, salud mental funcionarios, bienestar laboral público, prevención psicosocial, educación pública"
        ogTitle="NUXA para el Sector Público"
        ogDescription="Una infraestructura pública de apoyo y prevención emocional. Uso gratuito para el usuario final."
        canonicalUrl="https://nuxa.life/sector-publico"
      />
      <Header showBanner={false} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Button>
        </div>

        <section className="bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-2 mb-6">
              <Landmark className="w-5 h-5 text-indigo-400" />
              <span className="text-indigo-300 font-medium text-sm">Administración Pública</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              ¿Cómo puede usarse <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">NUXA</span>?
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              En el ámbito de la empresa pública y la administración, el enfoque de NUXA es claro y coherente con su finalidad social.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl px-6 py-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 font-semibold text-lg">NUXA se ofrece a coste cero para la persona usuaria final</span>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Target className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">El objetivo de la Administración</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                A la Administración — ya sea estatal, autonómica o local — le interesa disponer de:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                { icon: Heart, text: "Entornos de salud laboral" },
                { icon: School, text: "Entornos de salud educativa" },
                { icon: Shield, text: "Herramientas de prevención psicosocial" },
                { icon: Globe, text: "Sistemas accesibles, escalables y homogéneos" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-gray-200 font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
              <p className="text-indigo-200 text-lg">
                NUXA responde exactamente a esta necesidad: una plataforma común, válida para múltiples colectivos, integrada dentro del entorno público.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Users className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">¿A quién puede ofrecerse NUXA en lo público?</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Building, text: "Funcionarios y personal laboral de la Administración" },
                { icon: Hospital, text: "Personal sanitario de hospitales y centros de salud" },
                { icon: School, text: "Docentes y personal educativo" },
                { icon: Users, text: "Alumnado de centros educativos públicos" },
                { icon: Heart, text: "Servicios sociales y colectivos comunitarios" },
                { icon: Landmark, text: "Personal de ayuntamientos, consejos comarcales y diputaciones" }
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-violet-900/30 to-violet-800/15 border border-violet-500/20 rounded-xl p-5">
                  <item.icon className="w-8 h-8 text-violet-400 mb-3" />
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-300 text-sm font-medium">Uso gratuito para el usuario final</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-300 text-sm font-medium">Acceso dentro del entorno público</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Landmark className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Entornos donde NUXA encaja de forma natural</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">Administraciones locales</h3>
                {["Pequeños ayuntamientos", "Administraciones locales", "Consejos comarcales y diputaciones"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">Educación y sanidad</h3>
                {["Centros educativos públicos, escuelas e institutos", "Universidades", "Hospitales y grandes complejos sanitarios"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-400 text-center mt-8 text-lg">
              Desde estructuras pequeñas hasta organizaciones públicas de gran escala. La plataforma se adapta al entorno, no al revés.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Brain className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">¿Qué gana la Administración?</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Acceso universal", desc: "Recursos de apoyo emocional para todos" },
                { title: "Prevención", desc: "Del malestar psicosocial en el entorno laboral" },
                { title: "Clima laboral", desc: "Mejora del ambiente de trabajo y educativo" },
                { title: "Descongestión", desc: "Reducción de saturación en circuitos asistenciales" },
                { title: "Homogeneidad", desc: "Herramienta controlada y uniforme" },
                { title: "Imagen moderna", desc: "Administración responsable y comprometida" }
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/20 rounded-xl p-6 text-center">
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
              <p className="text-emerald-300 font-medium text-lg">
                Todo ello sin exigir pago al trabajador, alumno o ciudadano.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-indigo-900/40 to-violet-900/30 border border-indigo-500/30 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Conclusión</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                En la administración pública, NUXA no se concibe como un servicio individual de pago, sino como una <strong className="text-indigo-300">infraestructura pública de apoyo y prevención</strong>.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Una herramienta común que permite a las administraciones cuidar a sus trabajadores, apoyar a su alumnado, reforzar la salud laboral y educativa, y ofrecer bienestar sin barreras económicas.
              </p>
              <p className="text-gray-400 mb-8">
                Desde el pequeño ayuntamiento hasta el gran hospital. NUXA está pensada para servir al interés público, con orden, escala y sentido común.
              </p>
              <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-lg px-10 py-5 rounded-xl">
                  Solicitar información
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}