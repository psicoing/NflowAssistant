import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Gift, TrendingUp, Users, Briefcase, GraduationCap, Heart, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

export default function EmpresaPrivada() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="Empresa Privada - NUXA | Salud Mental Laboral"
        description="Descubre cómo tu empresa privada puede utilizar NUXA: ofrecer bienestar a trabajadores o explotar el servicio como modelo de negocio."
        keywords="NUXA empresa privada, salud mental laboral, bienestar corporativo, prevención psicosocial, ISO 45003"
        ogTitle="NUXA para Empresa Privada"
        ogDescription="Dos formas claras de utilizar NUXA en tu empresa privada: bienestar o modelo de rendimiento."
        canonicalUrl="https://nuxa.life/empresa-privada"
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

        <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium text-sm">Empresa Privada</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              ¿Cómo puedo usar <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">NUXA</span>?
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              NUXA no es una solución única y cerrada. Para la empresa privada, existen dos formas muy claras y legítimas de utilizar la plataforma.
            </p>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
              No es lo mismo ofrecer bienestar que explotar un servicio. Y NUXA distingue perfectamente ambas opciones.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">

              <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-3xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Gift className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Opción 1</span>
                    <h2 className="text-2xl font-bold text-white">Ofrecer NUXA</h2>
                  </div>
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Una empresa privada puede decidir ofrecer NUXA como un valor añadido, sin ánimo directo de explotación económica.
                </p>

                <h3 className="text-white font-semibold mb-4 text-lg">Ejemplos habituales:</h3>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Empresas que regalan NUXA a sus trabajadores como medida de bienestar</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Mutuas privadas que lo ofrecen a sus mutualistas</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Centros educativos privados o semiconcertados que lo facilitan a sus alumnos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Fundaciones o entidades privadas con fines sociales o preventivos</span>
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-4 text-lg">En este modelo:</h3>
                <div className="space-y-2 mb-8">
                  {[
                    "La empresa no cobra al usuario final",
                    "NUXA se integra como herramienta de apoyo y prevención",
                    "Refuerza la imagen de responsabilidad, cuidado y compromiso",
                    "No hay intermediación comercial ni margen económico"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-300 text-sm font-medium">
                    Una fórmula muy valorada en RRHH, PRL, bienestar corporativo y educación privada.
                  </p>
                  <p className="text-emerald-200 text-sm mt-2 font-semibold">
                    Aquí, NUXA se ofrece, no se vende.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-3xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">Opción 2</span>
                    <h2 className="text-2xl font-bold text-white">Explotar NUXA</h2>
                  </div>
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Existe otra posibilidad muy distinta: no regalar NUXA, sino explotarlo como modelo de rendimiento económico.
                </p>

                <h3 className="text-white font-semibold mb-4 text-lg">Pensado para:</h3>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Empresas privadas y autónomos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Consultoras y centros educativos privados</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Profesionales o entidades con capacidad de generar usuarios</span>
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-4 text-lg">En este caso:</h3>
                <div className="space-y-2 mb-8">
                  {[
                    "La empresa actúa como usuario licenciatario y explotador",
                    "Genera usuarios propios dentro de la plataforma",
                    "Obtiene un rendimiento económico por cada usuario activo",
                    "Cada usuario tiene un valor, y parte queda en la empresa explotadora"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-purple-300 text-sm font-medium">
                    Ideal para quien tiene comunidad, acceso a colectivos, estructura comercial o educativa, y entiende el valor del servicio.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/30 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  ¿Cómo funciona el modelo de explotación?
                </h2>
                <p className="text-gray-300 text-lg">
                  Quien elige esta vía debe saber algo importante: <strong className="text-amber-300">no es un regalo, es un modelo de negocio.</strong>
                </p>
              </div>

              <p className="text-gray-300 mb-6 text-center">
                Para entender porcentajes, condiciones, límites y responsabilidades, es imprescindible acceder a la pestaña de gestión de licitaciones.
              </p>

              <div className="text-center">
                <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl">
                    Gestión de Licitaciones
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>

              <p className="text-gray-400 text-sm text-center mt-4">
                NUXA no improvisa este modelo. Está definido, ordenado y regulado.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Dos conceptos claros (y diferentes)
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                <Gift className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Ofrecer NUXA</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>Bienestar, prevención, valor social</p>
                  <p>Trabajadores, mutualistas o alumnos</p>
                  <p className="font-semibold text-emerald-300">Sin rendimiento económico directo</p>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8 text-center">
                <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-400 mb-4">Explotar NUXA</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>Generación de usuarios</p>
                  <p>Rendimiento económico</p>
                  <p className="font-semibold text-purple-300">Modelo profesional y estructurado</p>
                </div>
              </div>
            </div>

            <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                Ambos modelos son válidos, pero no son lo mismo. NUXA permite a la empresa privada elegir cómo quiere posicionarse:
                como entidad que <strong className="text-emerald-400">cuida y ofrece</strong>, o como entidad que <strong className="text-purple-400">gestiona y obtiene rendimiento</strong>.
              </p>
              <p className="text-gray-400 mt-4">
                Lo importante es tenerlo claro desde el inicio. NUXA se adapta a ambos modelos, pero cada uno tiene su lógica, su responsabilidad y su forma de uso.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-lg px-10 py-5 rounded-xl">
                Solicitar información
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}