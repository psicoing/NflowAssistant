import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Layers, Server, Users, FileText, BarChart3, AlertTriangle, CheckCircle, XCircle, Settings, Database, Activity, ShieldCheck, Building2, Landmark } from "lucide-react";
import { useLocation } from "wouter";

export default function ControlShell() {
  const [, setLocation] = useLocation();

  const allowedControls = [
    { icon: Users, text: "Alta / baja de usuarios (CSV, API, centros)" },
    { icon: Settings, text: "Límites de uso (nº usuarios, zonas, colectivos)" },
    { icon: Layers, text: "Activar / desactivar módulos" },
    { icon: FileText, text: "Auditoría (logs, no contenidos)" },
    { icon: BarChart3, text: "Alertas agregadas (no clínicas)" },
    { icon: ShieldCheck, text: "Cumplimiento legal (ISO, RGPD, trazabilidad)" },
  ];

  const prohibitedActions = [
    { icon: Eye, text: "Leer conversaciones de usuarios" },
    { icon: AlertTriangle, text: "Intervenir en la IA" },
    { icon: XCircle, text: "Modificar respuestas clínicas" },
    { icon: EyeOff, text: "\"Dirigir\" NUXA o sus criterios" },
  ];

  const layers = [
    {
      number: "1",
      title: "Núcleo NUXA",
      subtitle: "Intocable",
      color: "red",
      description: "Motor clínico, IA, prompts y lógica psicológica. Propiedad intelectual protegida. No se entrega nunca.",
      items: ["Motor clínico", "Inteligencia Artificial", "Prompts especializados", "Lógica psicológica"],
      gradient: "from-red-500/20 to-red-900/20",
      border: "border-red-500/30",
      badge: "bg-red-500/20 text-red-300",
      iconColor: "text-red-400",
    },
    {
      number: "2",
      title: "Capa de Automatismo",
      subtitle: "Por defecto",
      color: "blue",
      description: "NUXA funciona de forma autónoma, escalable y eficiente. Los usuarios interactúan sin intervención humana.",
      items: ["Interacción de usuarios", "Flujos automáticos", "Recursos y ejercicios", "IA responde sin intervención"],
      gradient: "from-blue-500/20 to-blue-900/20",
      border: "border-blue-500/30",
      badge: "bg-blue-500/20 text-blue-300",
      iconColor: "text-blue-400",
    },
    {
      number: "3",
      title: "Control Shell",
      subtitle: "Cofre de Gobierno",
      color: "amber",
      description: "Entorno sellado, separado del core de NUXA, que permite control estratégico sin tocar el motor. Aquí opera el licenciatario.",
      items: ["Gestión de accesos", "Métricas globales", "Auditoría técnica", "Gobierno del sistema"],
      gradient: "from-amber-500/20 to-amber-900/20",
      border: "border-amber-500/30",
      badge: "bg-amber-500/20 text-amber-300",
      iconColor: "text-amber-400",
    },
    {
      number: "4",
      title: "Capa Institucional",
      subtitle: "El licenciatario",
      color: "emerald",
      description: "El ministerio, la mutua, la empresa o la universidad. Gestiona el perímetro, nunca el contenido.",
      items: ["Ministerios", "Mutuas", "Empresas", "Universidades"],
      gradient: "from-emerald-500/20 to-emerald-900/20",
      border: "border-emerald-500/30",
      badge: "bg-emerald-500/20 text-emerald-300",
      iconColor: "text-emerald-400",
    },
  ];

  const comparisonTable = [
    { allowed: "Gestión de acceso", prohibited: "Leer chats" },
    { allowed: "Métricas globales", prohibited: "Cambiar respuestas" },
    { allowed: "Auditoría técnica", prohibited: "Decidir criterios clínicos" },
    { allowed: "Gobierno del sistema", prohibited: "Gobierno del contenido" },
  ];

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="Control Shell - NUXA | Cofre de Gobierno Institucional"
        description="El Control Shell de NUXA permite a los licenciatarios gobernar el perímetro del sistema sin intervenir en el contenido clínico. Control estratégico, auditoría y cumplimiento legal."
        keywords="NUXA control shell, cofre de gobierno, governance vault, control institucional, auditoría, ISO 45003, RGPD, licenciatario"
        ogTitle="Control Shell NUXA - Gobierno sin intervención"
        ogDescription="Automatizada por defecto, gobernable bajo llave. NUXA vuela sola, pero el licenciatario tiene cabina de mando."
        canonicalUrl="https://nuxa.life/control-shell"
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

        <section className="bg-gradient-to-br from-gray-900 via-amber-900/30 to-gray-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-medium text-sm">Administrative Control Shell</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Cofre de <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Gobierno</span> NUXA
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Automatizada por defecto, gobernable bajo llave.
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              NUXA es como un avión: vuela sola (autopilot), pero existe cabina, existe caja negra y existe mando maestro.
            </p>
            <div className="mt-10 inline-flex items-center gap-3 bg-amber-500/10 border border-amber-400/20 rounded-2xl px-6 py-4">
              <Lock className="w-6 h-6 text-amber-400" />
              <span className="text-amber-200 font-semibold text-lg">El licenciatario controla el perímetro, nunca el contenido</span>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Layers className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Arquitectura por capas</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                NUXA se estructura en 4 capas claramente diferenciadas. Cada una con su función, su propietario y sus límites.
              </p>
            </div>

            <div className="space-y-6">
              {layers.map((layer) => (
                <div key={layer.number} className={`bg-gradient-to-r ${layer.gradient} border ${layer.border} rounded-2xl p-6 md:p-8`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className={`w-14 h-14 ${layer.badge} rounded-xl flex items-center justify-center flex-shrink-0 text-2xl font-bold`}>
                      {layer.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{layer.title}</h3>
                        <span className={`${layer.badge} text-xs font-semibold px-3 py-1 rounded-full`}>
                          {layer.subtitle}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{layer.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {layer.items.map((item, i) => (
                          <div key={i} className="bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 text-center">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">¿Qué puede hacer el licenciatario?</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                El Control Shell habilita funciones de gobierno estratégico. No es un panel de intervención clínica.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-emerald-300">Control permitido</h3>
                </div>
                <div className="space-y-3">
                  {allowedControls.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-gray-200">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-red-300">Intervención prohibida</h3>
                </div>
                <div className="space-y-3">
                  {prohibitedActions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-red-400" />
                      </div>
                      <span className="text-gray-200">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-200 text-sm font-medium text-center">
                    Control ≠ Intervención. Esta es la línea roja ética y legal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Activity className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Control vs. Intervención</h2>
              <p className="text-gray-300 text-lg">
                Una distinción fundamental que protege al licenciatario legal y éticamente.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="bg-emerald-500/10 px-6 py-4 border-b border-white/10">
                  <span className="text-emerald-300 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Control permitido
                  </span>
                </div>
                <div className="bg-red-500/10 px-6 py-4 border-b border-white/10">
                  <span className="text-red-300 font-bold flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Intervención prohibida
                  </span>
                </div>
              </div>
              {comparisonTable.map((row, i) => (
                <div key={i} className={`grid grid-cols-2 ${i < comparisonTable.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="px-6 py-4 text-gray-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {row.allowed}
                  </div>
                  <div className="px-6 py-4 text-gray-200 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    {row.prohibited}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-3xl p-8 md:p-12 text-center">
              <Database className="w-12 h-12 text-amber-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Modelo mental para la Administración</h2>
              <blockquote className="text-xl md:text-2xl text-amber-200 font-medium italic mb-8 leading-relaxed">
                "NUXA funciona sola. El licenciatario no controla personas ni discursos, controla el perímetro, no el contenido."
              </blockquote>
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 rounded-xl p-4">
                  <Server className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-1">Automática</h4>
                  <p className="text-gray-400 text-sm">Funciona sin intervención humana 24/7</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-1">Sellada</h4>
                  <p className="text-gray-400 text-sm">Motor clínico protegido e inaccesible</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-1">Gobernable</h4>
                  <p className="text-gray-400 text-sm">Perímetro controlable por el licenciatario</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Building2 className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">¿Para quién es el Control Shell?</h2>
              <p className="text-gray-300 text-lg">
                No es para el usuario final. Es para el licenciatario institucional.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Landmark, title: "Ministerios", desc: "Salud, Educación, Trabajo" },
                { icon: Shield, title: "Mutuas", desc: "Prevención y bienestar laboral" },
                { icon: Building2, title: "Empresas", desc: "Grandes corporaciones y PYMES" },
                { icon: Users, title: "Universidades", desc: "Instituciones educativas" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
                  <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button
                onClick={() => window.open("https://jobda.org/partners", "_blank")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-xl"
              >
                Solicitar acceso al Control Shell
              </Button>
              <p className="text-gray-500 text-sm mt-4">
                Disponible exclusivamente para licenciatarios institucionales
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}