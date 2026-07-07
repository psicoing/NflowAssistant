import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, CheckCircle, Users, Building2, Landmark,
  TrendingUp, Shield, Star, Handshake, Zap, Globe, BarChart3,
  HeartHandshake, Award, Clock
} from "lucide-react";

const beneficios = [
  {
    icon: TrendingUp,
    titulo: "Ingresos recurrentes",
    descripcion: "Genera comisiones mensuales por cada usuario activo dentro de tu red. Sin límite de ganancias.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Zap,
    titulo: "Activación inmediata",
    descripcion: "Tu panel de gestión de licencias queda operativo en 24-48h tras la firma del acuerdo.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    titulo: "Soporte dedicado",
    descripcion: "Acceso a materiales de venta, formación y un gestor de cuenta exclusivo para partners.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Globe,
    titulo: "Multilingüe y multimercado",
    descripcion: "NUXA opera en más de 150 idiomas. Puedes distribuir en cualquier mercado o sector.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: BarChart3,
    titulo: "Panel de métricas",
    descripcion: "Acceso a tu dashboard con estadísticas de uso, usuarios activos y facturación en tiempo real.",
    color: "text-cyan-500",
    bg: "bg-cyan-50",
  },
  {
    icon: HeartHandshake,
    titulo: "Marca blanca opcional",
    descripcion: "Posibilidad de integrar NUXA bajo tu propia marca para grandes organizaciones.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
];

const tiposPartner = [
  {
    icon: Users,
    tipo: "Partner Individual",
    descripcion: "Profesionales de la salud, coaches, consultores o divulgadores que quieren ofrecer NUXA a sus clientes o seguidores.",
    ejemplos: ["Psicólogos y terapeutas", "Coaches de bienestar", "Divulgadores digitales", "Formadores y mentores"],
    color: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50 border-violet-200",
  },
  {
    icon: Building2,
    tipo: "Partner Empresarial",
    descripcion: "Empresas de consultoría, RRHH, seguros o tecnología que integran NUXA en su oferta de servicios corporativos.",
    ejemplos: ["Consultoras de RRHH", "Compañías de seguros", "Mutuas laborales", "Empresas de software B2B"],
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    icon: Landmark,
    tipo: "Partner Institucional",
    descripcion: "Administraciones públicas, universidades, hospitales e instituciones que despliegan NUXA a gran escala.",
    ejemplos: ["Ayuntamientos", "Universidades y escuelas", "Hospitales y centros de salud", "Ministerios y organismos"],
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 border-amber-200",
  },
];

const pasos = [
  { num: "01", titulo: "Solicita acceso", desc: "Rellena el formulario en jobda.org/partners con tu perfil y tipo de organización." },
  { num: "02", titulo: "Revisión", desc: "Nuestro equipo analiza tu solicitud y te contacta en 48-72h hábiles." },
  { num: "03", titulo: "Firma del acuerdo", desc: "Firmáis el contrato de licencia/comisión adaptado a tu tipo de partner." },
  { num: "04", titulo: "Acceso al panel", desc: "Recibes acceso a tu dashboard, materiales y soporte dedicado." },
  { num: "05", titulo: "Empieza a distribuir", desc: "Activa usuarios o gestiona licencias y genera ingresos recurrentes." },
];

export default function ProgramaPartners() {
  return (
    <>
      <SEOHead
        title="Programa de Partners NUXA | Distribuye Salud Mental con IA"
        description="Únete al programa de partners de NUXA. Gestiona licencias, genera ingresos recurrentes y ofrece apoyo psicológico con IA a empresas, instituciones y particulares."
        keywords="programa partners NUXA, licencias salud mental IA, distribuir NUXA, partner empresarial, ingresos recurrentes bienestar"
        canonicalUrl="https://nuxa.life/programa-partners"
        ogUrl="https://nuxa.life/programa-partners"
      />

      <div className="min-h-screen bg-white">
        <Header showBanner={false} />

        <main className="pt-16">

          {/* Hero */}
          <section className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 py-20 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 mb-6">
                <Award className="w-4 h-4 text-orange-400" />
                Programa oficial de distribución
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Distribuye NUXA y genera{" "}
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  ingresos recurrentes
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                NUXA es el asistente de inteligencia artificial para salud mental. Como partner, puedes gestionar licencias
                para empresas, instituciones o particulares y ganar comisiones mensuales mientras contribuyes al bienestar
                de las personas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg">
                    Aplicar como Partner
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <Link href="/precios">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl">
                    Ver tarifas
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="bg-gradient-to-r from-orange-500 to-red-500 py-10 px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
              {[
                { valor: "150+", etiqueta: "Idiomas soportados" },
                { valor: "ISO 45003", etiqueta: "Norma de referencia" },
                { valor: "24/7", etiqueta: "Disponibilidad" },
                { valor: "GPT-4o", etiqueta: "Motor de IA" },
              ].map((s) => (
                <div key={s.etiqueta}>
                  <div className="text-3xl font-bold">{s.valor}</div>
                  <div className="text-white/80 text-sm mt-1">{s.etiqueta}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Beneficios */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Qué obtienes como partner?</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                  Acceso a todo lo que necesitas para distribuir y gestionar licencias de NUXA de forma profesional.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beneficios.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.titulo} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className={`w-12 h-12 ${b.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${b.color}`} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{b.titulo}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{b.descripcion}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Tipos de partner */}
          <section className="py-20 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Qué tipo de partner eres?</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                  El programa se adapta a tu perfil. Desde profesionales independientes hasta grandes instituciones.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {tiposPartner.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.tipo} className={`rounded-2xl border-2 p-6 ${t.bg}`}>
                      <div className={`w-12 h-12 bg-gradient-to-br ${t.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{t.tipo}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{t.descripcion}</p>
                      <ul className="space-y-1.5">
                        {t.ejemplos.map((e) => (
                          <li key={e} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Cómo funciona */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
                <p className="text-gray-500 text-lg">Proceso simple y rápido para empezar a distribuir.</p>
              </div>
              <div className="space-y-4">
                {pasos.map((p, i) => (
                  <div key={p.num} className="flex gap-5 items-start bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{p.num}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{p.titulo}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA final */}
          <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
            <div className="max-w-3xl mx-auto text-center">
              <Handshake className="w-16 h-16 text-orange-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Listo para unirte?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                Rellena el formulario de solicitud en nuestra plataforma de partners y nuestro equipo se pondrá en contacto contigo en 48-72h.
              </p>
              <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-xl">
                  Solicitar acceso al programa
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <p className="text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Respuesta en 48-72h hábiles
              </p>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}
