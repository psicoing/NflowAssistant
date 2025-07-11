import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/components/LanguageProvider";

// Declare PayPal global type
declare global {
  interface Window {
    paypal: any;
  }
}

export default function PricingSection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguageContext();
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);

  const pricingTiers = [
    {
      id: "basic",
      name: "Plan Básico",
      price: "€2.99",
      description: "Perfecto para quienes quieren probar NFLOW o solo necesitan orientación puntual",
      icon: Calendar,
      questions: "10 al mes",
      features: [
        "10 preguntas al chatbot IA",
        "Acceso a recursos premium", 
        "Consejos personalizados IA",
        "Contenido actualizado semanalmente",
        "Sin publicidad",
        "Respuesta estándar",
        "Cancelación fácil en cualquier momento"
      ],
      buttonText: "Seleccionar Plan",
      buttonClass: "bg-nflow-blue hover:bg-nflow-blue-dark"
    },
    {
      id: "pro",
      name: "Plan Pro",
      price: "€5.99",
      description: "El punto óptimo para quienes quieren avanzar y sacar más partido a la plataforma",
      icon: Users,
      questions: "20 al mes",
      features: [
        "20 preguntas al chatbot IA",
        "Acceso a recursos premium",
        "Consejos personalizados IA", 
        "Contenido actualizado semanalmente",
        "Sin publicidad",
        "Ejercicios y retos personalizados IA",
        "Respuesta prioritaria",
        "Cancelación fácil en cualquier momento"
      ],
      buttonText: "Seleccionar Plan",
      buttonClass: "bg-nflow-orange hover:bg-nflow-orange-light",
      popular: true
    },
    {
      id: "premium",
      name: "Plan Premium",
      price: "€7.99",
      description: "Para los que buscan lo mejor y lo quieren ya. Máxima interacción y seguimiento automático",
      icon: User,
      questions: "30 al mes",
      features: [
        "30 preguntas al chatbot IA",
        "Acceso a recursos premium",
        "Consejos personalizados IA",
        "Contenido actualizado semanalmente", 
        "Sin publicidad",
        "Ejercicios y retos personalizados IA",
        "Respuesta ultra rápida y preferente",
        "Plan de seguimiento automático",
        "Acceso anticipado a nuevas funciones",
        "Cancelación fácil en cualquier momento"
      ],
      buttonText: "Seleccionar Plan",
      buttonClass: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
    },
    {
      id: "annual",
      name: "Plan Anual \"Total\"",
      price: "€69",
      priceDetail: "año",
      savings: "Ahorra hasta un 28% respecto a Premium mensual",
      equivalentPrice: "(Equivalente a solo €5,75/mes)",
      description: "La salud mental, sin postureos, a lo grande y sin sustos de precio",
      icon: User,
      questions: "40 al mes",
      features: [
        "Hasta 40 preguntas al chatbot IA cada mes",
        "Acceso ilimitado a todos los recursos premium",
        "Consejos personalizados IA",
        "Contenido actualizado semanalmente",
        "Sin publicidad",
        "Ejercicios y retos personalizados IA",
        "Respuesta ultra rápida y preferente",
        "Plan de seguimiento automático",
        "Acceso anticipado a nuevas funciones y betas",
        "Prioridad en el soporte técnico y de usuario",
        "1 sesión de orientación inicial con experto real",
        "Cancelación fácil en cualquier momento"
      ],
      buttonText: "Seleccionar Plan Anual",
      buttonClass: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      annual: true,
      philosophy: {
        title: "Filosofía del Plan Anual",
        points: [
          "Sin complicaciones: pagas una vez, olvidas los cobros mensuales y disfrutas sin interrupciones",
          "A tu ritmo, sin prisas ni postureo: tú decides cuándo y cómo usar tus preguntas mensuales",
          "Compromiso con tu mejora: premia a los que apuestan por su salud mental de verdad"
        ]
      },
      whyChoose: {
        title: "¿Por qué elegir el Anual?",
        points: [
          "Porque sale mucho más a cuenta que cualquier plan mensual",
          "Porque todo el contenido, soporte y funciones avanzadas están incluidas desde el primer día",
          "Porque la tranquilidad de la salud mental no tiene por qué renovarse cada 30 días"
        ]
      }
    }
  ];

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
      pro: "5.99",
      premium: "7.99",
      annual: "69.00"
    };
    return priceMap[planId as keyof typeof priceMap];
  };

  const getPayPalPlanId = (planId: string) => {
    // These would be your actual PayPal plan IDs from PayPal dashboard
    const planMap = {
      basic: process.env.VITE_PAYPAL_BASIC_PLAN_ID || 'P-basic',
      pro: process.env.VITE_PAYPAL_PRO_PLAN_ID || 'P-pro', 
      premium: process.env.VITE_PAYPAL_PREMIUM_PLAN_ID || 'P-premium',
      annual: process.env.VITE_PAYPAL_ANNUAL_PLAN_ID || 'P-annual'
    };
    return planMap[planId as keyof typeof planMap];
  };

  return (
    <section id="precios" className="py-20 px-4 bg-nflow-navy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Planes de Suscripción NFLOW</h2>
          <h3 className="text-2xl font-semibold text-gray-300 mb-6">Salud mental digital sin postureo</h3>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto">
            Solo tú, tu mejora personal y la IA. Todo 100% automático, seguro y privado. Aquí lo que ves es lo que hay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    {t('pricing.popular')}
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 ${tier.popular ? 'bg-nflow-orange' : 'bg-nflow-blue'} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className={`text-sm mb-4 ${tier.popular ? 'text-blue-100' : 'text-gray-400'} leading-relaxed`}>
                    {tier.description}
                  </p>
                  <div className="text-4xl font-bold text-white">{tier.price}</div>
                  <div className={`text-sm ${tier.popular ? 'text-blue-200' : 'text-gray-400'} mb-2`}>
                    {tier.priceDetail || 'por mes'}
                  </div>
                  {tier.savings && (
                    <div className="text-xs text-green-400 font-semibold mb-1">{tier.savings}</div>
                  )}
                  {tier.equivalentPrice && (
                    <div className="text-xs text-gray-400 mb-2">{tier.equivalentPrice}</div>
                  )}
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    tier.popular ? 'bg-nflow-orange/20 text-nflow-orange' : 'bg-nflow-blue/20 text-nflow-blue'
                  }`}>
                    {tier.questions}
                  </div>
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
                    {t('pricing.activeSubscription')}
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

        {/* Plan Anual Special Section */}
        <div className="mt-12 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-3xl p-8 border border-green-700/40">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-green-300 mb-4">Plan Anual "Total" - Filosofía Sin Postureo</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Filosofía del Plan Anual</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li>• <strong>Sin complicaciones:</strong> pagas una vez, olvidas los cobros mensuales y disfrutas sin interrupciones</li>
                  <li>• <strong>A tu ritmo, sin prisas ni postureo:</strong> tú decides cuándo y cómo usar tus preguntas mensuales</li>
                  <li>• <strong>Compromiso con tu mejora:</strong> premia a los que apuestan por su salud mental de verdad</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">¿Por qué elegir el Anual?</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li>• Porque sale mucho más a cuenta que cualquier plan mensual</li>
                  <li>• Porque todo el contenido, soporte y funciones avanzadas están incluidas desde el primer día</li>
                  <li>• Porque la tranquilidad de la salud mental no tiene por qué renovarse cada 30 días</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-gray-800/50 p-4 rounded-lg">
              <p className="text-sm text-gray-300 italic">
                "Elige el Plan Anual y olvídate de pagar cada mes. Porque lo bueno, si es de verdad, mejor sin postureo y sin sorpresas. Aquí lo que ves es lo que hay."
              </p>
            </div>
          </div>
        </div>

        {/* How to Choose Section */}
        <div className="mt-16 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-3xl p-8 border border-gray-700/50">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">¿Cómo elegir tu plan?</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-nflow-blue rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Plan Básico</h4>
              <p className="text-sm text-gray-300">
                Acceso mensual limitado, perfecto para quienes quieren probar NFLOW o solo necesitan orientación puntual.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-nflow-orange rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Plan Pro</h4>
              <p className="text-sm text-gray-300">
                Doble de preguntas, ejercicios personalizados y prioridad de respuesta. El punto óptimo para quienes quieren avanzar.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Plan Premium</h4>
              <p className="text-sm text-gray-300">
                El plan más completo: máxima interacción mensual, seguimiento automático y respuestas preferentes.
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation Policy Section */}
        <div className="mt-8 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl p-6 border border-green-700/30">
          <div className="text-center">
            <h4 className="text-xl font-bold text-green-300 mb-3">✓ Sin Compromisos a Largo Plazo</h4>
            <p className="text-gray-300 text-base mb-4 max-w-3xl mx-auto">
              <strong>Cancela cuando quieras, sin penalizaciones ni complicaciones.</strong> Entendemos que tus necesidades pueden cambiar.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-1">Cancelación Inmediata</div>
                <div className="text-sm text-gray-300">Desde tu cuenta de usuario</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-1">Sin Preguntas</div>
                <div className="text-sm text-gray-300">No te pedimos motivos ni justificaciones</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-1">Acceso Hasta el Final</div>
                <div className="text-sm text-gray-300">Mantén el servicio hasta que termine tu período</div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-gradient-to-r from-nflow-orange/10 to-orange-600/10 rounded-2xl p-6 border border-nflow-orange/20">
            <h4 className="text-lg font-bold text-white mb-2">Filosofía NFLOW</h4>
            <p className="text-gray-300 text-sm max-w-2xl">
              NFLOW es salud mental digital sin postureo: sin grupos, sin coach, sin promesas mágicas.<br/>
              <span className="text-nflow-orange font-medium">Solo tú, tu mejora personal y la IA.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}