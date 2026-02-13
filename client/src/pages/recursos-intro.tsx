import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { 
  Heart, Brain, Sun, Shield, Briefcase, ArrowRight, Sparkles, 
  Wind, Hand, Eye, Activity, Smile, Calendar, BookOpen, 
  AlertTriangle, Phone, ChevronRight, Star
} from "lucide-react";
import { useLocation } from "wouter";

const categories = [
  {
    id: "regulacion",
    title: "Regulación emocional",
    subtitle: "Cuando necesitas calmarte",
    description: "Técnicas guiadas para gestionar la ansiedad, el estrés o la activación emocional en el momento. No necesitas experiencia previa.",
    icon: Wind,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    tools: [
      { name: "Respiración guiada", desc: "3 técnicas: 4-7-8, Box Breathing, Coherencia cardíaca", icon: "🌬️" },
      { name: "Estimulación bilateral", desc: "Movimiento visual tipo EMDR para regulación emocional", icon: "👁️" },
      { name: "Grounding 5-4-3-2-1", desc: "Anclaje sensorial progresivo para momentos de desconexión", icon: "🖐️" },
    ]
  },
  {
    id: "autoconocimiento",
    title: "Autoconocimiento",
    subtitle: "Conocerte mejor cada día",
    description: "Herramientas para observar tus emociones, detectar patrones y entender cómo te sientes a lo largo del tiempo.",
    icon: Brain,
    color: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/30",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    tools: [
      { name: "Registro emocional", desc: "Registra cómo te sientes cada día con emojis y notas", icon: "😊" },
      { name: "Calendario de emociones", desc: "Visualiza tu historia emocional mes a mes", icon: "📅" },
      { name: "Evaluaciones profesionales", desc: "Tests validados de ansiedad, depresión y autoestima", icon: "📋" },
    ]
  },
  {
    id: "habitos",
    title: "Hábitos positivos",
    subtitle: "Construir bienestar a diario",
    description: "Pequeñas prácticas diarias que, con constancia, generan cambios reales en tu bienestar emocional.",
    icon: Sun,
    color: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    tools: [
      { name: "Diario de gratitud", desc: "Escribe 3 cosas positivas cada día", icon: "🙏" },
      { name: "Afirmaciones diarias", desc: "Mensajes positivos para empezar o cerrar tu jornada", icon: "✨" },
      { name: "Racha diaria", desc: "Elemento de gamificación que premia la constancia", icon: "🔥" },
    ]
  },
  {
    id: "momentos-dificiles",
    title: "Momentos difíciles",
    subtitle: "Cuando las cosas no van bien",
    description: "Protocolos de actuación para días complicados, señales de alerta y orientación sobre cuándo buscar ayuda profesional.",
    icon: Shield,
    color: "from-red-500/20 to-orange-500/20",
    border: "border-red-500/30",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    tools: [
      { name: "Protocolo de mal día", desc: "3 pasos de emergencia: respirar, anclarte, actuar", icon: "🆘" },
      { name: "Señales de alerta", desc: "Indicadores de cuándo deberías buscar ayuda profesional", icon: "⚠️" },
      { name: "Líneas de ayuda", desc: "Teléfonos y recursos profesionales disponibles 24h", icon: "📞" },
    ]
  },
  {
    id: "entorno-laboral",
    title: "Entorno laboral",
    subtitle: "Tu bienestar en el trabajo",
    description: "Herramienta de autoevaluación basada en la norma ISO 45003 para identificar riesgos psicosociales en tu entorno de trabajo.",
    icon: Briefcase,
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    tools: [
      { name: "Autocheck ISO 45003", desc: "6 preguntas para evaluar el riesgo psicosocial de tu puesto", icon: "🏢" },
    ]
  },
];

export default function RecursosIntro() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-nflow-dark">
      <SEOHead
        title="Recursos Gratuitos de Salud Mental - NUXA"
        description="Herramientas gratuitas de salud mental: respiración guiada, registro emocional, evaluaciones profesionales, diario de gratitud y más. Sin registro, sin coste."
        keywords="recursos salud mental gratuitos, bienestar emocional, respiración guiada, grounding, evaluación ansiedad, diario gratitud, NUXA"
        ogTitle="Recursos Gratuitos - NUXA"
        ogDescription="Tu bienestar emocional empieza aquí. Herramientas gratuitas, sin registro, para cualquier persona."
        canonicalUrl="https://nuxa.life/recursos-gratuitos"
      />
      <Header showBanner={false} />
      <main className="pt-16">

        <section className="bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-2 mb-6">
              <Heart className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium text-sm">100% Gratuito, sin registro</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Tu bienestar emocional <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">empieza aquí</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
              Herramientas prácticas y accesibles para cuidar tu salud mental. 
              Sin coste, sin registro, para cualquier persona.
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Elige la categoría que mejor se ajuste a lo que necesitas hoy y explora los recursos a tu ritmo.
            </p>
            <Button
              onClick={() => setLocation("/sorteo-recursos")}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg rounded-xl"
            >
              Ir directamente a los recursos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">¿Qué vas a encontrar?</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                5 categorías, más de 15 herramientas. Todas diseñadas para ser sencillas, efectivas e inmediatas.
              </p>
            </div>

            <div className="space-y-8">
              {categories.map((cat, index) => (
                <div key={cat.id} className={`bg-gradient-to-r ${cat.color} border ${cat.border} rounded-2xl p-6 md:p-8 transition-all hover:scale-[1.01]`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 ${cat.iconBg} rounded-2xl flex items-center justify-center`}>
                        <cat.icon className={`w-8 h-8 ${cat.iconColor}`} />
                      </div>
                      <div className="hidden md:block mt-3 text-center">
                        <span className="text-gray-500 text-xs font-mono">{String(index + 1).padStart(2, '0')}/05</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl md:text-2xl font-bold text-white">{cat.title}</h3>
                        <span className={`${cat.iconBg} ${cat.iconColor} text-xs font-semibold px-3 py-1 rounded-full`}>
                          {cat.subtitle}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-5">{cat.description}</p>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                        {cat.tools.map((tool) => (
                          <div key={tool.name} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                              <div>
                                <h4 className="text-white font-semibold text-sm mb-1">{tool.name}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed">{tool.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => setLocation("/sorteo-recursos")}
                        variant="ghost"
                        className={`${cat.iconColor} hover:bg-white/10 group`}
                      >
                        Explorar {cat.title.toLowerCase()}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Star, value: "100%", label: "Gratuito", desc: "Sin coste oculto ni suscripción" },
                { icon: Shield, value: "0", label: "Registro necesario", desc: "Acceso inmediato, sin crear cuenta" },
                { icon: Heart, value: "15+", label: "Herramientas", desc: "Técnicas validadas y accesibles" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-emerald-300 font-semibold mb-1">{stat.label}</div>
                  <p className="text-gray-400 text-sm">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-3xl p-8 md:p-12 text-center">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Una nota importante</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Estos recursos son herramientas de apoyo y autocuidado. 
                <strong className="text-white"> No sustituyen a un profesional de la salud mental.</strong> Si sientes que necesitas ayuda, 
                no dudes en buscar un psicólogo o contactar con una línea de atención.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setLocation("/sorteo-recursos")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg rounded-xl"
                >
                  Empezar a explorar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => window.open("tel:024", "_self")}
                  variant="outline"
                  className="border-amber-500/50 text-amber-300 hover:bg-amber-500/10 px-8 py-4 text-lg rounded-xl"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Línea 024 (24h)
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}