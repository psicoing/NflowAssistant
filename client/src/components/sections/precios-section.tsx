import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, Star, Crown, Shield, Zap, Users, Building, Briefcase, Globe, Gem } from "lucide-react";

const personalPlans = [
  {
    name: "Plan Básico",
    price: "2.99",
    period: "mes",
    originalPrice: "9.99",
    description: "Perfecto para usuarios individuales que buscan apoyo básico",
    features: [
      "50 consultas mensuales al asistente IA",
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
      "Consultas ilimitadas al asistente IA",
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
    price: "2.99",
    period: "12 meses",
    originalPrice: "35.88", 
    description: "Acceso completo anual para usuarios que buscan la experiencia definitiva",
    features: [
      "Acceso completo por 12 meses",
      "Todas las características Premium incluidas",
      "Consultas ilimitadas durante el año",
      "Contenido exclusivo y actualizaciones",
      "Análisis avanzado personalizado",
      "Soporte prioritario anual",
      "Certificado de completar programas"
    ],
    recommended: false,
    icon: Gem,
    gradient: "from-purple-500 to-purple-600"
  }
];

const businessPlans = [
  {
    name: "Plan Profesional",
    price: "99.99",
    period: "mes",
    originalPrice: "299.99",
    description: "Para profesionales de la salud mental y consultores independientes",
    features: [
      "Hasta 50 clientes/pacientes",
      "Panel de administración avanzado",
      "Informes y analytics detallados",
      "Integración con calendarios",
      "Sesiones de seguimiento personalizado",
      "Soporte técnico prioritario",
      "Certificaciones y acreditaciones",
      "Herramientas de evaluación profesional"
    ],
    recommended: false,
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    name: "Plan Empresarial",
    price: "199.99",
    period: "mes",
    originalPrice: "599.99",
    description: "Ideal para empresas medianas que priorizan el bienestar de sus empleados",
    features: [
      "Hasta 200 empleados incluidos",
      "Dashboard ejecutivo con KPIs",
      "Programas de bienestar personalizados",
      "Integración con RRHH",
      "Reportes de clima laboral",
      "Sesiones grupales ilimitadas",
      "Soporte dedicado 24/7",
      "Cumplimiento normativo ISO 45003",
      "Onboarding y capacitación incluida"
    ],
    recommended: true,
    icon: Building,
    gradient: "from-nflow-orange to-orange-600"
  },
  {
    name: "Plan Corporativo",
    price: "Personalizado",
    period: "mes",
    originalPrice: "999.99+",
    description: "Solución completa para grandes corporaciones y organizaciones",
    features: [
      "Usuarios ilimitados",
      "Implementación personalizada",
      "Integración API completa",
      "Múltiples ubicaciones/países",
      "Soporte multi-idioma",
      "Gerente de cuenta dedicado",
      "SLA garantizado 99.9%",
      "Auditorías de seguridad",
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