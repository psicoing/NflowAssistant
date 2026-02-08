import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Target, Shield, Zap, Building2, GraduationCap, Heart, Globe, CheckCircle, X } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/image_1770564571355.png";

interface Competitor {
  emoji: string;
  name: string;
  carType: string;
  country: string;
  flag: string;
  description: string;
  weakness: string;
  color: string;
  gradient: string;
  border: string;
}

const competitors: Competitor[] = [
  {
    emoji: "🚗",
    name: "Wysa",
    carType: "Toyota híbrido",
    country: "Reino Unido",
    flag: "🇬🇧",
    description: "Chatbot amable, bien financiado, muy presente en empresas.",
    weakness: "Psicología correcta, profundidad limitada.",
    color: "text-gray-300",
    gradient: "from-gray-700/40 to-gray-900/40",
    border: "border-gray-500/30",
  },
  {
    emoji: "🚌",
    name: "NHS",
    carType: "Autobús urbano",
    country: "Reino Unido",
    flag: "🇬🇧",
    description: "Sistema público. Masivo. Lento.",
    weakness: "Función social, cero innovación estructural.",
    color: "text-blue-300",
    gradient: "from-blue-800/30 to-blue-950/30",
    border: "border-blue-500/30",
  },
  {
    emoji: "🚙",
    name: "Woebot Health",
    carType: "Honda",
    country: "Estados Unidos",
    flag: "🇺🇸",
    description: "CBT protocolizada, bien diseñada.",
    weakness: "Rígida, poco adaptable a contextos complejos.",
    color: "text-cyan-300",
    gradient: "from-cyan-800/30 to-cyan-950/30",
    border: "border-cyan-500/30",
  },
  {
    emoji: "🚘",
    name: "Headspace",
    carType: "Volkswagen",
    country: "Estados Unidos",
    flag: "🇺🇸",
    description: "Bienestar general, mindfulness, volumen enorme.",
    weakness: "No es clínica. Es relajación empaquetada.",
    color: "text-orange-300",
    gradient: "from-orange-800/30 to-orange-950/30",
    border: "border-orange-500/30",
  },
  {
    emoji: "🚘",
    name: "Calm",
    carType: "Citroën",
    country: "Estados Unidos",
    flag: "🇺🇸",
    description: "Sueño, sonidos, calma.",
    weakness: "Sirve para dormir, no para sostener salud mental.",
    color: "text-indigo-300",
    gradient: "from-indigo-800/30 to-indigo-950/30",
    border: "border-indigo-500/30",
  },
  {
    emoji: "🚐",
    name: "Lyra Health",
    carType: "Mercedes corporativo",
    country: "Estados Unidos",
    flag: "🇺🇸",
    description: "Psicólogos humanos + plataforma.",
    weakness: "Excelente… si tienes mucho presupuesto.",
    color: "text-emerald-300",
    gradient: "from-emerald-800/30 to-emerald-950/30",
    border: "border-emerald-500/30",
  },
  {
    emoji: "🚐",
    name: "Spring Health",
    carType: "BMW de flota",
    country: "Estados Unidos",
    flag: "🇺🇸",
    description: "Gestión de bienestar laboral, reporting impecable.",
    weakness: "Administra casos, no acompaña procesos.",
    color: "text-violet-300",
    gradient: "from-violet-800/30 to-violet-950/30",
    border: "border-violet-500/30",
  },
  {
    emoji: "🚕",
    name: "BetterHelp",
    carType: "Taxi",
    country: "Estados Unidos",
    flag: "🇺🇸",
    description: "Marketplace de terapeutas.",
    weakness: "Funciona por trayectos, no como sistema.",
    color: "text-yellow-300",
    gradient: "from-yellow-800/30 to-yellow-950/30",
    border: "border-yellow-500/30",
  },
];

const nuxaAdvantages = [
  { icon: Heart, text: "Motor clínico propio" },
  { icon: Shield, text: "Gobernanza real" },
  { icon: Target, text: "Escalado controlado" },
  { icon: Building2, text: "Licencias, no apps" },
  { icon: GraduationCap, text: "ISO 45003 integrada" },
  { icon: Zap, text: "Infraestructura, no humo" },
];

export default function CompetenciaNuxa() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <SEOHead
        title="Competencia de NUXA - Análisis del Mercado de Salud Mental Digital"
        description="Descubre cómo NUXA se posiciona frente a los principales competidores en salud mental digital: Wysa, Woebot, Headspace, Calm, BetterHelp y más."
        ogTitle="Competencia de NUXA"
        ogDescription="NUXA no es una startup americana más. NUXA es ingeniería de salud mental europea."
        canonicalUrl="https://nuxa.life/competencia-nuxa"
      />
      <Header />

      <main className="pt-20">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
          <div className="max-w-6xl mx-auto px-4 py-8">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white mb-6"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>

            <div className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-amber-500/10">
              <img
                src={heroImage}
                alt="Competencia de NUXA - Comparativa de mercado con coches"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
            </div>

            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-6">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-medium text-sm">Análisis de Mercado</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Competencia de{" "}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  NUXA
                </span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                Cada plataforma tiene su lugar. Pero no todas están diseñadas para lo mismo.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitors.map((comp, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${comp.gradient} backdrop-blur-sm border ${comp.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{comp.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{comp.name}</h3>
                      <span className={`text-sm font-medium ${comp.color} opacity-80`}>
                        {comp.carType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5">
                    <span className="text-sm">{comp.flag}</span>
                    <span className="text-xs text-gray-400">{comp.country}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm leading-relaxed">{comp.description}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-400 text-sm leading-relaxed italic">{comp.weakness}</p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gray-500/50 group-hover:bg-gray-400/70 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-amber-500/10 to-amber-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.08),transparent_70%)]" />

          <div className="max-w-5xl mx-auto px-4 relative">
            <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-amber-500/10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="text-4xl">🏎️</span>
                  <span className="text-amber-400 font-bold text-lg">NUXA — Lamborghini</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300">Europa 🇪🇺 (España 🇪🇸)</span>
                </div>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                  Diseñada desde psicología clínica europea, pensada para Estado, empresas, sanidad y educación.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {nuxaAdvantages.map((adv, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/15 rounded-xl px-5 py-4 hover:bg-amber-500/15 transition-colors"
                  >
                    <adv.icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span className="text-white font-medium text-sm">{adv.text}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-500/20 pt-8 text-center space-y-3">
                <p className="text-xl md:text-2xl font-bold text-white">
                  NUXA no es una startup americana más.
                </p>
                <p className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  NUXA es ingeniería de salud mental europea.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            ¿Qué hace diferente a NUXA?
          </h2>
          <p className="text-gray-500 text-sm text-center mb-10 italic">
            Evaluación interna basada en análisis público de funcionalidades, modelo de negocio y enfoque clínico de cada plataforma.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Plataforma</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Clínica</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">IA propia</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Gobernanza</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">ISO 45003</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Licencias B2B</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Wysa", clinical: false, ai: false, governance: false, iso: false, b2b: true },
                  { name: "Woebot", clinical: true, ai: false, governance: false, iso: false, b2b: false },
                  { name: "Headspace", clinical: false, ai: false, governance: false, iso: false, b2b: true },
                  { name: "Calm", clinical: false, ai: false, governance: false, iso: false, b2b: true },
                  { name: "Lyra Health", clinical: true, ai: false, governance: false, iso: false, b2b: true },
                  { name: "Spring Health", clinical: false, ai: false, governance: false, iso: false, b2b: true },
                  { name: "BetterHelp", clinical: true, ai: false, governance: false, iso: false, b2b: false },
                  { name: "NHS", clinical: true, ai: false, governance: true, iso: false, b2b: false },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3.5 px-4 text-gray-300 text-sm font-medium">{row.name}</td>
                    <td className="py-3.5 px-4 text-center">
                      {row.clinical ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-red-400/60 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.ai ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-red-400/60 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.governance ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-red-400/60 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.iso ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-red-400/60 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.b2b ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-red-400/60 mx-auto" />}
                    </td>
                  </tr>
                ))}
                <tr className="bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <td className="py-3.5 px-4 text-amber-400 text-sm font-bold">NUXA 🏎️</td>
                  <td className="py-3.5 px-4 text-center"><CheckCircle className="w-5 h-5 text-amber-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><CheckCircle className="w-5 h-5 text-amber-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><CheckCircle className="w-5 h-5 text-amber-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><CheckCircle className="w-5 h-5 text-amber-400 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><CheckCircle className="w-5 h-5 text-amber-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-lg px-10 py-6 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
            onClick={() => setLocation("/")}
          >
            <Trophy className="w-5 h-5 mr-2" />
            Descubre NUXA
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}