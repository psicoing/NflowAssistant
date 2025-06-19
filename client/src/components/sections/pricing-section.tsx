import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Declare PayPal global type
declare global {
  interface Window {
    paypal: any;
  }
}

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
      "Plan de seguimiento personalizado",
      "Acceso anticipado a nuevas funcionalidades"
    ],
    buttonText: "Seleccionar Plan",
    buttonClass: "bg-nflow-orange hover:bg-nflow-orange-light"
  }
];

export default function PricingSection() {
  const [viewType, setViewType] = useState<"cards" | "list">("cards");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);

  // Check if user is coming from registration
  useEffect(() => {
    const storedUserId = localStorage.getItem("newUserId");
    const storedUsername = localStorage.getItem("newUsername");
    
    if (storedUserId && storedUsername) {
      setIsNewUser(true);
      setNewUserId(storedUserId);
      toast({
        title: "¡Bienvenido a NFLOW!",
        description: `${storedUsername}, selecciona tu plan para continuar`,
        duration: 5000,
      });
    }
  }, [toast]);

  // Check current subscription status
  const currentUserId = newUserId || localStorage.getItem("userId");
  const { data: subscriptionStatus } = useQuery<{hasActiveSubscription: boolean}>({
    queryKey: ["/api/subscription-status"],
    queryFn: async () => {
      if (!currentUserId) return { hasActiveSubscription: false };
      const response = await fetch(`/api/subscription-status?userId=${currentUserId}`);
      if (!response.ok) return { hasActiveSubscription: false };
      return response.json();
    },
    retry: false,
    enabled: !!currentUserId
  });

  const handleSubscribe = async (planId: string) => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "Debes estar registrado para suscribirte",
        variant: "destructive",
      });
      return;
    }

    try {
      // For demo purposes, simulate successful payment
      toast({
        title: "Procesando pago...",
        description: "Simulando pago exitoso para demostración",
        duration: 2000,
      });

      // Simulate payment processing delay
      setTimeout(async () => {
        try {
          // Activate subscription directly
          const response = await fetch("/api/activate-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: currentUserId,
              subscriptionPlan: planId,
              amount: getAmount(planId)
            }),
          });

          if (!response.ok) {
            throw new Error("Error activating subscription");
          }

          // Clear registration data and set user session
          localStorage.removeItem("newUserId");
          localStorage.removeItem("newUsername");
          localStorage.setItem("userId", currentUserId!);
          
          toast({
            title: "¡Pago exitoso!",
            description: "Tu suscripción está activa. Redirigiendo al chat...",
            duration: 3000,
          });
          
          setTimeout(() => {
            setLocation("/chat");
          }, 2000);

        } catch (error) {
          console.error("Subscription activation error:", error);
          toast({
            title: "Error en la activación",
            description: "Hubo un problema activando tu suscripción. Intenta de nuevo.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }, 1500);

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error en el pago",
        description: "Hubo un problema iniciando el pago. Intenta de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const getAmount = (planId: string) => {
    const priceMap = {
      basic: "2.99",
      group: "5.99",
      individual: "7.99"
    };
    return priceMap[planId as keyof typeof priceMap];
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
          {isNewUser && (
            <div className="mt-6 p-4 bg-nflow-orange/20 border border-nflow-orange/30 rounded-xl max-w-md mx-auto">
              <p className="text-nflow-orange font-semibold">
                ¡Último paso! Selecciona tu plan para activar tu cuenta
              </p>
            </div>
          )}
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

                {subscriptionStatus?.hasActiveSubscription ? (
                  <Button 
                    disabled
                    className="w-full py-3 rounded-xl font-semibold bg-green-600 text-white"
                  >
                    Suscripción Activa
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${tier.buttonClass} text-white`}
                  >
                    {tier.buttonText}
                  </Button>
                )}
                <div id="paypal-button-container"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
