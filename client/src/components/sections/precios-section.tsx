import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, Star, Crown, Shield, Zap, Users } from "lucide-react";

const pricingPlans = [
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
    name: "Plan Grupal",
    price: "49.99",
    period: "mes",
    originalPrice: "149.99", 
    description: "Ideal para familias, equipos de trabajo o grupos pequeños",
    features: [
      "Hasta 10 usuarios incluidos",
      "Todas las características del Plan Individual",
      "Dashboard de administración grupal",
      "Informes de bienestar del grupo",
      "Sesiones grupales virtuales",
      "Soporte dedicado",
      "Configuración personalizada"
    ],
    recommended: false,
    icon: Users,
    gradient: "from-purple-500 to-purple-600"
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

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div 
                key={index} 
                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                  plan.recommended ? 'ring-4 ring-nflow-orange ring-opacity-50' : ''
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

                <div className="p-8">
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
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      plan.recommended 
                        ? 'bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Comenzar Ahora
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-gray-900 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿Necesitas un plan empresarial?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Ofrecemos soluciones personalizadas para empresas de todos los tamaños con 
            características adicionales, integraciones y soporte dedicado.
          </p>
          <Button 
            onClick={() => setLocation("/partners")}
            className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold"
          >
            Contactar Ventas
          </Button>
        </div>
      </div>
    </section>
  );
}