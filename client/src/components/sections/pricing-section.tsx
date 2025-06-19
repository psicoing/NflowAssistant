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
          {(isNewUser || isPendingPayment) && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-nflow-orange/20 border border-nflow-orange/30 rounded-xl max-w-md mx-auto">
                <p className="text-nflow-orange font-semibold">
                  ¡Selecciona tu plan para activar tu cuenta!
                </p>
              </div>
              
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl max-w-lg mx-auto">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  <h4 className="text-green-400 font-semibold">¿Problemas con PayPal?</h4>
                </div>
                <p className="text-green-200 text-sm mb-3 text-center">
                  Si tienes problemas para completar el registro con PayPal, contáctanos por WhatsApp
                </p>
                <div className="text-center">
                  <a
                    href="https://wa.me/34660452136?text=Hola%2C%20quiero%20activar%20mi%20cuenta%20NFLOW.%20Tengo%20el%20comprobante%20de%20pago."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    WhatsApp: +34 660 45 21 36
                  </a>
                </div>
                <p className="text-green-200 text-xs mt-2 text-center">
                  Envíanos tu comprobante de pago y activaremos tu cuenta manualmente
                </p>
              </div>
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
