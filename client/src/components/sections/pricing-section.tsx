import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const pricingTiers = [
  {
    id: "basic",
    name: "Plan Básico",
    price: "€2.99",
    description: "Acceso a recursos premium",
    icon: Calendar,
    features: [
      "Acceso completo a todos los recursos premium",
      "Consejos personalizados",
      "Contenido actualizado semanalmente",
      "Sin publicidad"
    ],
    buttonText: "Seleccionar Plan",
    buttonClass: "bg-nflow-blue hover:bg-nflow-blue-dark"
  },
  {
    id: "group",
    name: "Plan Grupal",
    price: "€5.99",
    description: "Chat grupal quincenal",
    icon: Users,
    features: [
      "Todo lo incluido en el Plan Básico",
      "Sesiones de chat grupal quincenales con psicólogo",
      "Recursos adicionales de terapia grupal",
      "Ejercicios prácticos guiados",
      "Prioridad en soporte"
    ],
    buttonText: "Seleccionar Plan",
    buttonClass: "bg-nflow-orange hover:bg-nflow-orange-light",
    popular: true
  },
  {
    id: "individual",
    name: "Plan Individual",
    price: "€7.99",
    description: "Chat semanal personalizado",
    icon: User,
    features: [
      "Todo lo incluido en el Plan Grupal",
      "Sesiones de chat individual semanales con psicólogo",
      "Plan de seguimiento personalizado",
      "Acceso anticipado a nuevas funcionalidades"
    ],
    buttonText: "Seleccionar Plan",
    buttonClass: "bg-nflow-orange hover:bg-nflow-orange-light"
  }
];

export default function PricingSection() {
  const [viewType, setViewType] = useState<"cards" | "list">("cards");

  // Check current subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ["/api/subscription-status", 1], // Default user ID
  });

  const handleSubscribe = (planId: string) => {
    // Initialize PayPal Checkout
    if (window.paypal) {
      window.paypal.Buttons({
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: getPayPalPlanId(planId)
          });
        },
        onApprove: async function(data: any, actions: any) {
          try {
            const response = await apiRequest("POST", "/api/subscribe", {
              subscriptionId: data.subscriptionID,
              userId: 1
            });
            
            if (response.ok) {
              alert("¡Suscripción activada exitosamente!");
              window.location.reload();
            }
          } catch (error) {
            alert("Error al procesar la suscripción");
          }
        }
      }).render('#paypal-button-container');
    }
  };

  const getPayPalPlanId = (planId: string) => {
    // These would be your actual PayPal plan IDs from PayPal dashboard
    const planMap = {
      basic: process.env.VITE_PAYPAL_BASIC_PLAN_ID || 'P-basic',
      group: process.env.VITE_PAYPAL_GROUP_PLAN_ID || 'P-group', 
      individual: process.env.VITE_PAYPAL_INDIVIDUAL_PLAN_ID || 'P-individual'
    };
    return planMap[planId as keyof typeof planMap];
  };

  return (
    <section id="precios" className="py-20 px-4 bg-nflow-navy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">NFLOW Premium</h2>
          <h3 className="text-2xl font-semibold text-gray-300 mb-6">Suscripción Premium</h3>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Desbloquea acceso completo a recursos exclusivos y servicios personalizados
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-xl p-1 flex">
            <Button
              variant={viewType === "cards" ? "default" : "ghost"}
              onClick={() => setViewType("cards")}
              className={viewType === "cards" ? "bg-nflow-orange text-white" : "text-gray-400 hover:text-white"}
            >
              Vista Tarjetas
            </Button>
            <Button
              variant={viewType === "list" ? "default" : "ghost"}
              onClick={() => setViewType("list")}
              className={viewType === "list" ? "bg-nflow-orange text-white" : "text-gray-400 hover:text-white"}
            >
              Vista Lista
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => {
            const IconComponent = tier.icon;
            
            return (
              <div 
                key={tier.id}
                className={`rounded-3xl p-8 border transition-all duration-300 relative ${
                  tier.popular
                    ? "bg-gradient-to-br from-nflow-blue to-nflow-blue-dark border-2 border-nflow-orange transform scale-105"
                    : "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-nflow-orange"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-nflow-orange text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 ${tier.popular ? 'bg-nflow-orange' : 'bg-nflow-blue'} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className={`text-sm mb-4 ${tier.popular ? 'text-blue-100' : 'text-gray-400'}`}>
                    {tier.description}
                  </p>
                  <div className="text-4xl font-bold text-white">{tier.price}</div>
                  <div className={`text-sm ${tier.popular ? 'text-blue-200' : 'text-gray-400'}`}>por mes</div>
                </div>

                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-nflow-orange flex-shrink-0" />
                      <span className={`text-sm ${tier.popular ? 'text-white' : 'text-gray-200'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${tier.buttonClass} text-white`}
                >
                  {tier.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
