import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, MessageCircle, Zap, CheckCircle, Smartphone, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
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

  // Handle Stripe payment with custom checkout session
  const handleStripePayment = async () => {
    setStripeLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
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

  // Cargar Stripe script
  useEffect(() => {
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

          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
            {/* Panel informativo: Próximas opciones BBVA */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-400 backdrop-blur-sm h-fit">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white mb-2">Próximamente</CardTitle>
                <CardDescription className="text-blue-200 text-sm font-medium">
                  Nueva versión con más opciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-800/30 border border-blue-500/50 rounded-lg p-4">
                  <h4 className="text-blue-200 font-bold text-sm mb-3 text-center">
                    🏦 Próximas Pasarelas de Pago:
                  </h4>
                  <div className="text-sm text-blue-100 space-y-2">
                    <div className="bg-blue-700/30 rounded-lg p-3 mb-2">
                      <p className="font-semibold text-blue-200 mb-1">BBVA Business</p>
                      <p className="text-xs text-blue-300">En implementación - Empresa B02701100</p>
                    </div>
                    
                    <ul className="space-y-1 text-xs text-blue-200">
                      <li>• Todas las pasarelas BBVA disponibles</li>
                      <li>• Bizum empresarial integrado</li>
                      <li>• Transferencias instantáneas</li>
                      <li>• Pagos recurrentes automatizados</li>
                      <li>• Múltiples opciones de pago</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-3">
                  <p className="text-green-300 text-xs text-center font-medium">
                    ⚡ En desarrollo para máxima comodidad de pago
                  </p>
                </div>
                
                <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-3">
                  <p className="text-yellow-300 text-xs text-center">
                    📅 Disponible en la próxima actualización
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Opción 1: Stripe */}
            <Card className="bg-gray-800/50 border-purple-500 backdrop-blur-sm h-fit">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white mb-2">Stripe - Plan Básico</CardTitle>
                <div className="text-2xl font-bold text-purple-400 mb-2">€2.99/mes</div>
                <CardDescription className="text-gray-300 text-sm">
                  Alternativa si PayPal no funciona
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm text-gray-300 mb-4 space-y-2 text-center">
                  <li>• Chat ilimitado con IA</li>
                  <li>• Soporte 24/7</li>
                  <li>• Activación instantánea</li>
                </ul>
                
                {/* Stripe Button Custom */}
                <Button
                  onClick={handleStripePayment}
                  disabled={stripeLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-lg"
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
                      Pagar €2.99/mes
                    </>
                  )}
                </Button>
                
                <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-3">
                  <p className="text-green-300 text-xs text-center">
                    ⚡ Activación 100% automática
                  </p>
                </div>
                
                <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-3 mt-3">
                  <p className="text-blue-300 text-xs text-center">
                    💡 Consulta el recuadro del final de página para que te sientas seguro(a) y cómodo(a)
                  </p>
                </div>
              </CardContent>
            </Card>

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