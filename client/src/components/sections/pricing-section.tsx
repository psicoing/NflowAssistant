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

  // Check for pending user (requires payment) or existing user
  const pendingUserId = localStorage.getItem("pendingUserId");
  const existingUserId = localStorage.getItem("userId");
  
  // Priority: pendingUserId (needs payment) > newUserId > existingUserId
  const currentUserId = pendingUserId || newUserId || existingUserId;
  const isPendingPayment = !!pendingUserId;
  
  // Check current subscription status
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
      toast({
        title: "Creando orden de pago...",
        description: "Redirigiendo a PayPal",
        duration: 2000,
      });

      // Create PayPal order
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          subscriptionPlan: planId,
          amount: getAmount(planId),
          currency: "EUR"
        }),
      });

      if (!response.ok) {
        throw new Error("Error creating payment order");
      }

      const orderData = await response.json();
      
      // Store payment info for return handling
      localStorage.setItem("paymentPlan", planId);
      localStorage.setItem("paymentAmount", getAmount(planId));
      
      // Redirect through our payment redirect page
      const redirectUrl = `/payment-redirect?orderId=${orderData.id}&plan=${planId}`;
      console.log("Redirecting to payment page:", redirectUrl);
      window.location.href = redirectUrl;

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
