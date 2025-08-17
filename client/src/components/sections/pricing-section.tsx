import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users, User, Building, Shield, TrendingUp, Phone, Mail, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

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
      price: "€49",
      priceDetail: "año",
      savings: "Ahorra hasta un 48% respecto a Premium mensual",
      equivalentPrice: "(Equivalente a solo €4,08/mes)",
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
        "Pago único - sin renovación automática",
        "365 días de acceso completo garantizado",
        "Sin sorpresas ni cobros adicionales"
      ],
      buttonText: "Seleccionar Plan Anual",
      buttonClass: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      annual: true,
      philosophy: {
        title: "Filosofía del Plan Anual",
        points: [
          "Pago único: pagas una vez y olvidas renovaciones por todo el año",
          "A tu ritmo, sin prisas ni postureo: tú decides cuándo y cómo usar tus 40 preguntas mensuales",
          "Sin compromisos automáticos: después del año decides si continúas o no"
        ]
      },
      whyChoose: {
        title: "¿Por qué elegir el Anual?",
        points: [
          "Porque sale mucho más a cuenta que cualquier plan mensual",
          "Porque todo el contenido y funciones avanzadas están incluidas desde el primer día",
          "Porque pagas una vez y te olvidas durante todo el año"
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

  const handleEnterpriseContact = (planName: string) => {
    setSelectedPlan(planName);
    setIsContactDialogOpen(true);
  };

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
      // Store the selected plan to redirect after registration
      localStorage.setItem("selectedPlan", planId);
      setLocation("/registro");
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
    <>
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
                "Elige el Plan Anual y págalo una sola vez. Un año completo sin renovaciones automáticas, sin sustos ni sorpresas. Aquí lo que ves es lo que hay."
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

      {/* Enterprise Section */}
      <div className="max-w-6xl mx-auto mt-20">
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-3xl p-8 border border-gray-700/50">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-nflow-orange mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">Planes NFLOW Empresas & Instituciones</h2>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-6">¿Por qué NFLOW para tu organización?</h3>
            <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-6">
              Mejora la salud mental de tus equipos con IA, sin postureo ni complicaciones.
            </p>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">100% Privado y Seguro</h4>
                <p className="text-sm text-gray-300">Informes agregados para RRHH sin datos personales</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">Sin Permanencia</h4>
                <p className="text-sm text-gray-300">Paga solo por los empleados que uses cada mes</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Phone className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">Soporte Especializado</h4>
                <p className="text-sm text-gray-300">Atención directa para implementación y seguimiento</p>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-gray-900/70 rounded-2xl p-6 border border-gray-600/30">
            <h4 className="text-xl font-bold text-white mb-6 text-center">Tabla de Precios (IVA incluido)</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Nº Usuarios</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-300">Precio Mensual</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-300">Precio Anual</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-300">% Ahorro</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-300">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr className="hover:bg-gray-800/50">
                    <td className="py-4 px-4 font-medium text-white">10 usuarios</td>
                    <td className="py-4 px-4 text-right font-semibold text-white">96,68 €</td>
                    <td className="py-4 px-4 text-right font-semibold text-green-400">1.044,17 €</td>
                    <td className="py-4 px-4 text-right text-green-400 font-semibold">10%</td>
                    <td className="py-4 px-4 text-center">
                      <Button 
                        size="sm" 
                        className="bg-nflow-blue hover:bg-nflow-blue-dark text-white"
                        onClick={() => handleEnterpriseContact("10 usuarios")}
                      >
                        Consultar
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 bg-nflow-blue/10 border-l-4 border-nflow-orange">
                    <td className="py-4 px-4 font-medium text-white">
                      25 usuarios
                      <span className="ml-2 px-2 py-1 bg-nflow-orange text-white text-xs rounded-full">Pack Pyme</span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-white">180,29 €</td>
                    <td className="py-4 px-4 text-right font-semibold text-green-400">1.947,14 €</td>
                    <td className="py-4 px-4 text-right text-green-400 font-semibold">10%</td>
                    <td className="py-4 px-4 text-center">
                      <Button 
                        size="sm" 
                        className="bg-nflow-orange hover:bg-nflow-orange-light text-white"
                        onClick={() => handleEnterpriseContact("Pack Pyme - 25 usuarios")}
                      >
                        Consultar
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800/50">
                    <td className="py-4 px-4 font-medium text-white">50 usuarios</td>
                    <td className="py-4 px-4 text-right font-semibold text-white">361,79 €</td>
                    <td className="py-4 px-4 text-right font-semibold text-green-400">3.907,33 €</td>
                    <td className="py-4 px-4 text-right text-green-400 font-semibold">10%</td>
                    <td className="py-4 px-4 text-center">
                      <Button 
                        size="sm" 
                        className="bg-nflow-blue hover:bg-nflow-blue-dark text-white"
                        onClick={() => handleEnterpriseContact("50 usuarios")}
                      >
                        Consultar
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 bg-purple-900/20 border-l-4 border-purple-500">
                    <td className="py-4 px-4 font-medium text-white">
                      100 usuarios
                      <span className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">Pack Empresa</span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-white">482,79 €</td>
                    <td className="py-4 px-4 text-right font-semibold text-green-400">5.214,13 €</td>
                    <td className="py-4 px-4 text-right text-green-400 font-semibold">10%</td>
                    <td className="py-4 px-4 text-center">
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => handleEnterpriseContact("Pack Empresa - 100 usuarios")}
                      >
                        Consultar
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800/50">
                    <td className="py-4 px-4 font-medium text-white">250 usuarios</td>
                    <td className="py-4 px-4 text-right font-semibold text-white">1.087,79 €</td>
                    <td className="py-4 px-4 text-right font-semibold text-green-400">11.748,01 €</td>
                    <td className="py-4 px-4 text-right text-green-400 font-semibold">10%</td>
                    <td className="py-4 px-4 text-center">
                      <Button 
                        size="sm" 
                        className="bg-nflow-blue hover:bg-nflow-blue-dark text-white"
                        onClick={() => handleEnterpriseContact("250 usuarios")}
                      >
                        Consultar
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 bg-green-900/20 border-l-4 border-green-500">
                    <td className="py-4 px-4 font-medium text-white">
                      500 usuarios
                      <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">Institución</span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-white">1.692,79 €</td>
                    <td className="py-4 px-4 text-right font-semibold text-green-400">18.282,13 €</td>
                    <td className="py-4 px-4 text-right text-green-400 font-semibold">10%</td>
                    <td className="py-4 px-4 text-center">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleEnterpriseContact("Institución - 500 usuarios")}
                      >
                        Consultar
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 bg-gradient-to-r from-gold-900/20 to-yellow-900/20 border-l-4 border-yellow-500">
                    <td className="py-4 px-4 font-medium text-white">
                      1000+ usuarios
                      <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs rounded-full">Premium</span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-300">A consultar</td>
                    <td className="py-4 px-4 text-right text-gray-300">A consultar</td>
                    <td className="py-4 px-4 text-right text-yellow-400 font-semibold">Especial</td>
                    <td className="py-4 px-4 text-center">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                        onClick={() => handleEnterpriseContact("Premium - 1000+ usuarios")}
                      >
                        Contactar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pricing Explanation */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
                <h5 className="font-semibold text-blue-300 mb-2">💳 Plan Mensual</h5>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Mayor flexibilidad y sin compromiso</li>
                  <li>• Ideal para proyectos temporales</li>
                  <li>• Cancela cuando quieras</li>
                  <li>• Pago mensual recurrente</li>
                </ul>
              </div>
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
                <h5 className="font-semibold text-green-300 mb-2">💰 Plan Anual (Recomendado)</h5>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>• <strong>10% de descuento garantizado</strong></li>
                  <li>• Pago único anual - sin sorpresas</li>
                  <li>• Presupuesto fijo para todo el año</li>
                  <li>• Prioridad en soporte técnico</li>
                </ul>
              </div>
            </div>

            {/* Small Business Note */}
            <div className="mt-6 bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
              <p className="text-purple-300 text-sm text-center">
                <strong>¿Menos de 10 usuarios?</strong> Utiliza los planes individuales estándar mostrados arriba.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-8 text-center">
              <h5 className="text-lg font-semibold text-white mb-4">¿Listo para mejorar el bienestar de tu equipo?</h5>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  className="bg-nflow-orange hover:bg-nflow-orange-light text-white px-8 py-3"
                  onClick={() => window.open('mailto:empordajobs@gmail.com?subject=Consulta%20NFLOW%20Empresas&body=Hola,%20me%20interesa%20conocer%20más%20sobre%20los%20planes%20de%20NFLOW%20para%20empresas.', '_blank')}
                >
                  Solicitar Información
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-500 text-gray-300 hover:bg-gray-800 px-8 py-3"
                  onClick={() => window.open('tel:+34660452136', '_blank')}
                >
                  Llamar: +34 660 45 21 36
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Respuesta en menos de 24 horas • Implementación personalizada • Soporte técnico incluido
              </p>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Enterprise Contact Dialog */}
    <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Consulta Empresarial
          </DialogTitle>
          <DialogDescription className="text-center">
            {selectedPlan && (
              <span className="block font-semibold text-nflow-blue mb-2">
                Plan: {selectedPlan}
              </span>
            )}
            Solicita información personalizada para tu empresa
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Contacta con nuestro equipo</h4>
              <p className="text-sm text-gray-600 mb-3">
                Respuesta en menos de 24 horas • Consulta sin compromiso
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-nflow-blue hover:bg-nflow-blue-dark text-white"
                onClick={() => {
                  const subject = `Consulta NFLOW Empresas - ${selectedPlan || 'Plan empresarial'}`;
                  const body = `Hola,\n\nMe interesa conocer más sobre ${selectedPlan || 'los planes empresariales'} de NFLOW.\n\nPor favor, envíenme información detallada sobre:\n- Precios y condiciones\n- Proceso de implementación\n- Soporte técnico\n- Funcionalidades específicas\n\nGracias.`;
                  window.open(`mailto:empordajobs@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                  setIsContactDialogOpen(false);
                }}
              >
                ✉️ Enviar Email
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-nflow-blue text-nflow-blue hover:bg-nflow-blue/10"
                onClick={() => {
                  window.open('tel:+34660452136', '_blank');
                  setIsContactDialogOpen(false);
                }}
              >
                📞 Llamar: +34 660 45 21 36
              </Button>
            </div>
            
            <div className="text-center pt-2 border-t">
              <p className="text-xs text-gray-500">
                EMPORDAJOBS SL • CIF: B02701100<br />
                Especialistas en salud mental empresarial
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}