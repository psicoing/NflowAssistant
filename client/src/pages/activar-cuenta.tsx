import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, MessageCircle, Zap, CheckCircle, Smartphone, Phone, Mail, Gift, Users, Star, Gem } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useReferralCode } from "@/hooks/useReferralCode";
import SoporteActivacionBanner from "@/components/SoporteActivacionBanner";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

export default function ActivarCuenta() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [stripeLoading, setStripeLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'individual' | 'premium'>('individual'); // Individual por defecto (más popular)
  const { referralCode, isValidating, isValid, updateReferralCode } = useReferralCode();

  // Definición de planes
  const plans = [
    {
      id: 'individual' as const,
      name: 'Plan Individual',
      price: '5.99',
      originalPrice: '19.99',
      period: 'mes',
      discount: 70,
      icon: Star,
      gradient: 'from-orange-500 to-orange-600',
      description: 'La opción más popular para un apoyo completo y personalizado',
      features: [
        'Consultas ilimitadas con NEUROPSI-AI',
        'Acceso completo a todos los recursos',
        'Soporte prioritario 24/7',
        'Planes de bienestar personalizados'
      ],
      popular: true
    },
    {
      id: 'premium' as const,
      name: 'Plan Premium',
      price: '32',
      originalPrice: '35.56',
      period: '12 meses',
      discount: 10,
      icon: Gem,
      gradient: 'from-purple-500 to-purple-600',
      description: 'Acceso completo anual para usuarios que buscan la experiencia definitiva',
      features: [
        'Acceso completo por 12 meses',
        'Acceso completo anual al asistente IA',
        'Todas las características del plan de €7.99',
        'Contenido exclusivo y actualizaciones',
        'Análisis avanzado personalizado'
      ],
      popular: false
    }
  ];

  // Handle Stripe payment with custom checkout session
  const handleStripePayment = async (plan: 'basic' | 'individual' | 'premium') => {
    setStripeLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          referralCode: referralCode.trim() || null,
          plan: plan
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.url) {
        console.log('✅ Redirecting to Stripe checkout:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('Error creating checkout session');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast({
        title: "Error de pago",
        description: "No se pudo iniciar el proceso de pago. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setStripeLoading(false);
    }
  };

  // Cargar Stripe script y hacer scroll al top
  useEffect(() => {
    // Scroll al inicio de la página al cargar
    window.scrollTo(0, 0);
    
    if (!document.querySelector('script[src*="stripe.com"]')) {
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/buy-button.js';
      stripeScript.async = true;
      document.head.appendChild(stripeScript);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Activar Tu Cuenta NFLOW
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Elige tu método de pago para comenzar
            </p>
            
            {/* Información importante sobre la empresa */}
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 max-w-2xl mx-auto mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-blue-200 font-bold text-lg">Información Importante</h3>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                <strong className="text-white">NFLOW</strong> es una marca registrada que pertenece a <strong className="text-blue-300">Empordajobs SL</strong>
              </p>
              <p className="text-blue-200 text-xs mt-2">
                💳 En tu extracto bancario aparecerá el cargo como "Empordajobs SL" - es completamente normal y seguro
              </p>
            </div>
          </div>

          {/* Código de Referencia */}
          <div className="max-w-md mx-auto mb-8">
            {referralCode && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Gift className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">¡Código Aplicado!</h3>
                      <p className="text-sm text-green-600">
                        Código: <span className="font-mono font-bold">{referralCode}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-yellow-400" />
                    <Label htmlFor="referralCode" className="text-white font-medium">
                      ¿Tienes un código de referencia? (Opcional)
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="referralCode"
                      type="text"
                      placeholder="Ej: NFLOWCEOTESTPA_1234"
                      value={referralCode}
                      onChange={(e) => updateReferralCode(e.target.value)}
                      className="bg-white/90 border-white/30 text-gray-800 placeholder:text-gray-500"
                      data-testid="input-referral-code"
                    />
                    
                    {isValidating && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    
                    {isValid === true && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                    
                    {isValid === false && referralCode && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600">
                        <span className="text-sm">❌</span>
                      </div>
                    )}
                  </div>
                  
                  {isValid === false && referralCode && (
                    <p className="text-sm text-red-300">
                      Código no válido. Puedes continuar sin él.
                    </p>
                  )}
                  
                  {isValid === true && (
                    <p className="text-sm text-green-300">
                      ✓ Código válido. Tu partner recibirá una comisión del 10%.
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-300">
                    Los códigos de referencia apoyan a partners que promocionan NFLOW
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Planes disponibles */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card 
                  key={plan.id}
                  className={`relative backdrop-blur-sm border-2 transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500 shadow-lg shadow-orange-500/20' 
                      : 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500 shadow-lg shadow-purple-500/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      MÁS POPULAR
                    </div>
                  )}
                  
                  <CardHeader className={`text-center pb-4 bg-gradient-to-r ${plan.gradient} rounded-t-lg`}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-lg line-through opacity-60 text-white">€{plan.originalPrice}</span>
                      <span className="text-4xl font-bold text-white">€{plan.price}</span>
                      <span className="text-lg text-white">/{plan.period}</span>
                    </div>
                    <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold inline-block text-white">
                      AHORRA {plan.discount}%
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pt-6 bg-gray-800/50">
                    <p className="text-gray-300 text-sm text-center mb-4">{plan.description}</p>
                    
                    <ul className="text-sm text-gray-300 mb-4 space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleStripePayment(plan.id)}
                      disabled={stripeLoading}
                      className={`w-full py-6 text-lg font-semibold rounded-lg bg-gradient-to-r ${plan.gradient} hover:opacity-90 transition-all`}
                      size="lg"
                    >
                      {stripeLoading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pagar €{plan.price}/{plan.period}
                        </>
                      )}
                    </Button>
                    
                    <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-3">
                      <p className="text-green-300 text-xs text-center">
                        ⚡ Activación 100% automática
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <SoporteActivacionBanner />

          {/* Planes personalizados */}
          <div className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 border border-purple-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm shadow-lg">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                🏢 ¿Necesitas un Plan Personal o de Empresa?
              </h3>
              
              <p className="text-purple-200 mb-4">
                Ofrecemos soluciones personalizadas para individuos y empresas con necesidades específicas
              </p>

              {/* Información sobre tarifas en desarrollo */}
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-yellow-400 text-lg">⚡</span>
                  <h5 className="text-yellow-200 font-bold text-sm">¿Has visto otras tarifas publicadas?</h5>
                </div>
                <p className="text-yellow-200 text-xs text-center mb-2">
                  Algunas opciones de tarifas están publicadas pero aún no están activas automáticamente
                </p>
                <p className="text-yellow-100 text-xs text-center font-medium">
                  💫 <strong>¡Ponte en contacto con nosotros y te activamos el plan que quieras!</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-3">
                  <p className="text-purple-300 text-sm font-medium">
                    💼 Planes Empresariales • 👤 Planes Personalizados • 🎯 Soluciones a Medida
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-white font-medium mb-2">Ponte en contacto con nosotros:</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href="tel:+34660452136"
                    className="flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-bold">+34 660 45 21 36</span>
                  </a>
                  
                  <a 
                    href="mailto:jobda@jobda.es?subject=Plan Personalizado NFLOW"
                    className="flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-lg border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="font-bold">jobda@jobda.es</span>
                  </a>
                </div>
              </div>
            </div>
          </div>







          <div className="text-center mt-8">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 shadow-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                ← Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}