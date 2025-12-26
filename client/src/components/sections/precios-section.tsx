import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, Star, Crown, Shield, Zap, Users, Building, Briefcase, Globe, Gem, Coins, Sparkles, Info } from "lucide-react";
import PurchaseCreditsModal from "@/components/modals/purchase-credits-modal";

const personalPlans = [
  {
    name: "Plan Básico",
    price: "2.99",
    period: "mes",
    originalPrice: "9.99",
    description: "Perfecto para usuarios individuales que buscan apoyo básico",
    features: [
      "Acceso diario al asistente NEUROPSI-AI",
      "Acceso a recursos educativos básicos", 
      "Soporte por email",
      "Ejercicios de relajación y mindfulness",
      "Seguimiento básico del estado de ánimo"
    ],
    recommended: false,
    icon: Shield,
    gradient: "from-blue-500 to-blue-600"
  },
  {
    name: "Plan Individual",
    price: "5.99", 
    period: "mes",
    originalPrice: "19.99",
    description: "La opción más popular para un apoyo completo y personalizado",
    features: [
      "Consultas ilimitadas con NEUROPSI-AI",
      "Acceso completo a todos los recursos",
      "Soporte prioritario 24/7",
      "Planes de bienestar personalizados",
      "Seguimiento avanzado y analíticas",
      "Sesiones de meditación guiada",
      "Acceso a webinars exclusivos"
    ],
    recommended: true,
    icon: Star,
    gradient: "from-nflow-orange to-orange-600"
  },
  {
    name: "Plan Premium",
    price: "32",
    period: "12 meses",
    originalPrice: "35.56", 
    description: "Acceso completo anual para usuarios que buscan la experiencia definitiva",
    features: [
      "Acceso completo por 12 meses",
      "Acceso completo anual al asistente IA",
      "Todas las características del plan de €5.99",
      "Contenido exclusivo y actualizaciones",
      "Análisis avanzado personalizado",
      "Soporte prioritario anual"
    ],
    recommended: false,
    icon: Gem,
    gradient: "from-purple-500 to-purple-600"
  }
];

const businessPlans = [
  {
    name: "Plan Profesional",
    price: "149.50",
    period: "mes",
    originalPrice: "299.99",
    description: "Para profesionales de la salud mental y consultores independientes",
    features: [
      "Hasta 50 clientes/pacientes",
      "Acceso profesional al asistente IA por empleado",
      "Panel de administración avanzado",
      "Informes y analytics detallados"
    ],
    recommended: false,
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    name: "Plan Empresarial",
    price: "598",
    period: "mes",
    originalPrice: "999.99",
    description: "Ideal para empresas medianas que priorizan el bienestar de sus empleados",
    features: [
      "Hasta 200 empleados incluidos",
      "Acceso profesional al asistente IA por empleado",
      "Soporte dedicado 24/7",
      "Cumplimiento normativo ISO 45003",
      "Onboarding y capacitación incluida"
    ],
    recommended: true,
    icon: Building,
    gradient: "from-orange-500 to-red-600"
  },
  {
    name: "Plan Corporativo",
    price: "Personalizado",
    period: "mes",
    originalPrice: "999.99+",
    description: "Solución completa para grandes corporaciones y organizaciones",
    features: [
      "Usuarios ilimitados",
      "Acceso premium al asistente IA por empleado",
      "Implementación personalizada",
      "Integración API completa",
      "Cumplimiento GDPR y normativas locales",
      "Desarrollo de funciones personalizadas"
    ],
    recommended: false,
    icon: Globe,
    gradient: "from-purple-600 to-indigo-700",
    isCustom: true
  }
];

export default function PreciosSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="precios" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Elige el plan perfecto para tus necesidades de bienestar mental. 
            Todos los planes incluyen nuestra garantía de satisfacción de 30 días.
          </p>
          
          <div className="inline-flex bg-nflow-orange/10 rounded-full p-1 mb-8">
            <div className="bg-nflow-orange text-white px-6 py-2 rounded-full text-sm font-medium">
              🎉 OFERTA LIMITADA - Hasta 70% de descuento
            </div>
          </div>
        </div>

        {/* Modelo Híbrido Explicación */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16 border-2 border-blue-200/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Info className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-3xl font-bold text-gray-900">
                Modelo de Precios Flexible
              </h3>
            </div>
            <p className="text-lg text-gray-700 text-center mb-6">
              NUXA ofrece <strong className="text-blue-600">dos formas de acceso</strong> para adaptarse a tus necesidades:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Crown className="w-6 h-6 text-orange-500 mr-2" />
                  <h4 className="text-xl font-bold text-gray-900">Suscripciones Mensuales</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Ideal para uso regular y continuo. Cuota mensual fija con límite de preguntas que se reinicia cada mes.
                </p>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    ✓ Se reinicia cada mes<br />
                    ✓ Perfecto para usuarios frecuentes<br />
                    ✓ Descuentos en planes anuales
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Coins className="w-6 h-6 text-purple-500 mr-2" />
                  <h4 className="text-xl font-bold text-gray-900">Pago Por Uso (Créditos)</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Compra packs de preguntas sin compromiso. Los créditos nunca caducan y se usan antes que tu cuota mensual.
                </p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    ✓ Sin caducidad, ¡nunca pierdes créditos!<br />
                    ✓ Ideal para uso ocasional<br />
                    ✓ Se consumen primero automáticamente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla Comparativa Visual Mejorada */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Todas las Opciones de un Vistazo
          </h3>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Compara precios, preguntas incluidas y elige la opción perfecta para ti
          </p>
          
          {/* Packs de Créditos */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <h4 className="text-lg font-bold text-gray-800">Pago Por Uso (Sin Compromiso)</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Pack Básico</h5>
                    <p className="text-sm text-gray-500">15 preguntas</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">€5</div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Sin caducidad</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg transition-all flex items-center justify-between relative">
                <div className="absolute -top-2 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MEJOR VALOR
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Pack Premium</h5>
                    <p className="text-sm text-gray-500">35 preguntas</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">€10</div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Sin caducidad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Suscripciones Personales */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <h4 className="text-lg font-bold text-gray-800">Suscripciones Personales</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Plan Básico</h5>
                    <p className="text-xs text-gray-500">Usuarios que empiezan</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-blue-600">€2.99</span>
                  <span className="text-gray-500">/mes</span>
                  <span className="text-sm text-gray-400 line-through">€9.99</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">10 preguntas/mes</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-orange-400 hover:shadow-xl transition-all relative">
                <div className="absolute -top-2 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> MÁS POPULAR
                </div>
                <div className="flex items-center gap-3 mb-3 mt-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Plan Individual</h5>
                    <p className="text-xs text-gray-500">La mayoría de usuarios</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-orange-600">€5.99</span>
                  <span className="text-gray-500">/mes</span>
                  <span className="text-sm text-gray-400 line-through">€19.99</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-gray-800">Preguntas ilimitadas</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Gem className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Plan Premium</h5>
                    <p className="text-xs text-gray-500">Máximo ahorro anual</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-purple-600">€32</span>
                  <span className="text-gray-500">/año</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-gray-800">Preguntas ilimitadas</span>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">~€2.67/mes</span>
              </div>
            </div>
          </div>

          {/* Planes Empresariales */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <h4 className="text-lg font-bold text-gray-800">Planes Empresariales (ISO 45003)</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Profesional</h5>
                    <p className="text-xs text-gray-500">Consultores</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-emerald-600">€149.50</span>
                  <span className="text-gray-500">/mes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-gray-700">Hasta 50 usuarios</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border-2 border-orange-300 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Empresarial</h5>
                    <p className="text-xs text-gray-500">Empresas medianas</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-orange-600">€598</span>
                  <span className="text-gray-500">/mes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">Hasta 200 empleados</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border-2 border-indigo-300 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Corporativo</h5>
                    <p className="text-xs text-gray-500">Grandes empresas</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-bold text-indigo-600">Personalizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-gray-700">Usuarios ilimitados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sin permanencia reminder */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3">
              <Check className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-800 font-medium">Sin permanencia · Anula cuando quieras en un click</span>
            </div>
          </div>
        </div>

        {/* Sección de Packs de Créditos (Pago Por Uso) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pago Por Uso - <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Sin Compromiso</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compra solo lo que necesitas. Los créditos <strong className="text-purple-600">nunca caducan</strong> y se usan automáticamente antes que tu cuota mensual.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pack Básico */}
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-xl border-2 border-blue-200 overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <Coins className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Pack Básico</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold">€5</div>
                  <div className="text-sm opacity-90 mt-1">pago único</div>
                </div>
              </div>

              <div className="p-8 bg-white">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-blue-600 mb-2">15</div>
                  <div className="text-gray-600">preguntas</div>
                  <div className="text-sm text-gray-500 mt-2">€0.33 por pregunta</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Sin caducidad, ¡nunca pierdes créditos!</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Se usan antes que tu cuota mensual</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Ideal para probar el servicio</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Sin compromiso ni suscripción</span>
                  </li>
                </ul>

                <PurchaseCreditsModal>
                  <Button className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Comprar Ahora
                  </Button>
                </PurchaseCreditsModal>
              </div>
            </div>

            {/* Pack Premium */}
            <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-xl border-2 border-purple-300 overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2 font-bold text-sm">
                ⭐ MEJOR VALOR
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 text-white pt-12">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Pack Premium</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold">€10</div>
                  <div className="text-sm opacity-90 mt-1">pago único</div>
                </div>
              </div>

              <div className="p-8 bg-white">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-purple-600 mb-2">35</div>
                  <div className="text-gray-600">preguntas</div>
                  <div className="text-sm text-gray-500 mt-2">€0.29 por pregunta</div>
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mt-2 inline-block">
                    AHORRA 12% vs Pack Básico
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Sin caducidad, ¡nunca pierdes créditos!</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Se usan antes que tu cuota mensual</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm font-semibold">Mejor relación calidad-precio</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Perfecto para uso flexible</span>
                  </li>
                </ul>

                <PurchaseCreditsModal>
                  <Button className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Comprar Ahora
                  </Button>
                </PurchaseCreditsModal>
              </div>
            </div>
          </div>
        </div>

        {/* Planes Personales (título actualizado) */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Suscripciones Mensuales - <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Planes Personales</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Para usuarios que buscan apoyo continuo con renovación automática cada mes.
          </p>
        </div>

        {/* Personal Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {personalPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div 
                key={index} 
                className={`relative bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/10 rounded-3xl shadow-2xl border border-gray-200/30 overflow-hidden transform hover:scale-105 hover:shadow-3xl transition-all duration-300 ${
                  plan.recommended ? 'ring-4 ring-nflow-orange ring-opacity-60 shadow-nflow-orange/25 bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-red-50/20 border-orange-200/40' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-nflow-orange to-orange-600 text-white text-center py-2 font-bold text-sm">
                    ⭐ MÁS POPULAR
                  </div>
                )}

                <div className={`bg-gradient-to-r ${plan.gradient} p-8 text-white ${plan.recommended ? 'pt-12' : ''}`}>
                  <div className="flex items-center justify-center mb-4">
                    <IconComponent className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg line-through opacity-60">€{plan.originalPrice}</span>
                      <span className="text-4xl font-bold">€{plan.price}</span>
                      <span className="text-lg">/{plan.period}</span>
                    </div>
                    <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold mt-2 inline-block">
                      AHORRA {Math.round((1 - parseFloat(plan.price) / parseFloat(plan.originalPrice)) * 100)}%
                    </div>
                  </div>
                </div>

                <div className={`p-8 backdrop-blur-sm ${
                  plan.recommended 
                    ? 'bg-gradient-to-b from-white/95 via-orange-50/40 to-amber-50/30'
                    : 'bg-gradient-to-b from-white/90 via-blue-50/30 to-indigo-50/20'
                }`}>
                  <p className="text-gray-600 mb-6 text-center">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => setLocation("/login")}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                      plan.recommended 
                        ? 'bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Empezar Ahora
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Business Plans Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Planes NFLOW Empresas & Instituciones
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones profesionales diseñadas para organizaciones que priorizan 
            el bienestar mental de sus empleados y clientes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {businessPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div 
                key={index} 
                className={`relative rounded-3xl shadow-2xl border overflow-hidden transform hover:scale-105 hover:shadow-3xl transition-all duration-300 backdrop-blur-sm ${
                  plan.recommended 
                    ? 'bg-gradient-to-br from-orange-50/40 via-white to-amber-50/25 border-orange-200/50 ring-4 ring-nflow-orange ring-opacity-60 shadow-nflow-orange/25'
                    : plan.isCustom 
                    ? 'bg-gradient-to-br from-purple-50/40 via-white to-indigo-50/30 border-purple-200/50'
                    : 'bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 border-emerald-200/40'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-nflow-orange to-orange-600 text-white text-center py-2 font-bold text-sm">
                    ⭐ MÁS POPULAR EMPRESAS
                  </div>
                )}

                <div className={`bg-gradient-to-r ${plan.gradient} p-8 text-white ${plan.recommended ? 'pt-12' : ''}`}>
                  <div className="flex items-center justify-center mb-4">
                    <IconComponent className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                  <div className="text-center">
                    {plan.isCustom ? (
                      <div>
                        <span className="text-2xl font-bold">Precio {plan.price}</span>
                        <p className="text-sm opacity-80 mt-2">Cotización personalizada</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg line-through opacity-60">€{plan.originalPrice}</span>
                        <span className="text-4xl font-bold">€{plan.price}</span>
                        <span className="text-lg">/{plan.period}</span>
                      </div>
                    )}
                    {!plan.isCustom && (
                      <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold mt-2 inline-block">
                        AHORRA {Math.round((1 - parseFloat(plan.price) / parseFloat(plan.originalPrice)) * 100)}%
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-8 backdrop-blur-sm ${
                  plan.recommended 
                    ? 'bg-gradient-to-b from-white/95 via-orange-50/40 to-amber-50/30'
                    : plan.isCustom
                    ? 'bg-gradient-to-b from-white/95 via-purple-50/40 to-indigo-50/30'
                    : 'bg-gradient-to-b from-white/90 via-emerald-50/30 to-teal-50/20'
                }`}>
                  <p className="text-gray-600 mb-6 text-center">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => plan.isCustom ? setLocation("/partners") : setLocation("/login")}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                      plan.recommended 
                        ? 'bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white'
                        : plan.isCustom
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plan.isCustom ? 'Contactar Ventas' : 'Empezar Ahora'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Info */}
        <div className="bg-gray-900 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿Tienes dudas sobre nuestros planes empresariales?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de ventas especializado te ayudará a elegir la solución perfecta 
            para tu organización. Consulta gratuita y demo personalizada incluida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/partners")}
              className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold"
            >
              Contactar Ventas
            </Button>
            <Button 
              onClick={() => setLocation("/partners")}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-2xl font-bold transition-all duration-300"
            >
              Solicitar Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}