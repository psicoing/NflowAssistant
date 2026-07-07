import { useLocation } from "wouter";
import { Building2, User, Heart, Landmark, MapPin, Stethoscope, GraduationCap, ArrowRight, Sparkles, MessageCircle, CheckCircle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const categorias = [
  {
    icon: User,
    titulo: "Individual",
    descripcion: "Para personas que buscan apoyo emocional personal con IA.",
    color: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50 hover:bg-violet-100",
    border: "border-violet-200",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    icon: Building2,
    titulo: "Empresas",
    descripcion: "Planes para equipos y organizaciones privadas.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: Heart,
    titulo: "Mutuas",
    descripcion: "Integración con mutuas de accidentes de trabajo y salud.",
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50 hover:bg-rose-100",
    border: "border-rose-200",
    iconBg: "bg-rose-100 text-rose-600",
  },
  {
    icon: Landmark,
    titulo: "Organizaciones Públicas",
    descripcion: "Administración general del estado y organismos públicos.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 hover:bg-amber-100",
    border: "border-amber-200",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    icon: MapPin,
    titulo: "Ayuntamientos",
    descripcion: "Servicios municipales de bienestar y atención ciudadana.",
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-50 hover:bg-green-100",
    border: "border-green-200",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    icon: Stethoscope,
    titulo: "Centros de Salud",
    descripcion: "Apoyo psicológico complementario para centros sanitarios.",
    color: "from-teal-500 to-cyan-500",
    bg: "bg-teal-50 hover:bg-teal-100",
    border: "border-teal-200",
    iconBg: "bg-teal-100 text-teal-600",
  },
  {
    icon: GraduationCap,
    titulo: "Institutos",
    descripcion: "Bienestar emocional para alumnado, docentes y familias.",
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50 hover:bg-purple-100",
    border: "border-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
  },
];

export default function RegistroSeleccion() {
  const [, setLocation] = useLocation();

  return (
    <>
      <SEOHead
        title="Registro | NUXA – Salud Mental con IA"
        description="Selecciona tu tipo de organización para acceder a los planes NUXA adaptados a tus necesidades."
        canonicalUrl="https://nuxa.life/registro"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* FREE TRIAL banner */}
          <button
            onClick={() => setLocation("/registro/planes")}
            className="w-full mb-10 group relative overflow-hidden rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
            <div className="relative px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-emerald-800">¿No estás seguro? Pruébalo gratis</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    GRATIS
                  </span>
                </div>
                <p className="text-emerald-700 text-sm leading-relaxed mb-2">
                  Accede ahora con 2 consultas sin coste ni tarjeta de crédito. Habla con NUXA y decide después si quieres continuar con un plan.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["2 preguntas gratis", "Sin tarjeta de crédito", "Acceso inmediato"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 text-emerald-700 font-semibold text-sm group-hover:gap-3 transition-all">
                <MessageCircle className="w-5 h-5" />
                <span>Empezar ahora</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Bienvenido a NUXA
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              ¿Cómo quieres acceder?
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Selecciona tu perfil y te mostramos las opciones más adecuadas para ti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.titulo}
                  onClick={() => setLocation("/registro/planes")}
                  className={`group flex flex-col items-start gap-3 p-6 rounded-2xl border ${cat.bg} ${cat.border} transition-all duration-200 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900 text-base mb-1">{cat.titulo}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{cat.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                    Ver planes <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            Todos los perfiles acceden a la misma plataforma NUXA · ISO 45003
          </p>
        </div>
      </div>
    </>
  );
}
