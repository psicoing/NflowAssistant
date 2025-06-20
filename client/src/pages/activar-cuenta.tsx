import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, MessageCircle, Zap, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

declare global {
  interface Window {
    paypal: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

interface PayPalStatus {
  buttonRendered: boolean;
  error: boolean;
  errorMessage: string;
}

export default function ActivarCuenta() {
  const [, setLocation] = useLocation();
  const [paypalStatus, setPaypalStatus] = useState<PayPalStatus>({
    buttonRendered: false,
    error: false,
    errorMessage: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  // Cargar scripts de forma ligera (sin dependencias npm)
  useEffect(() => {
    // PayPal
    if (!window.paypal && !document.querySelector('script[src*="paypal.com/sdk"]')) {
      const paypalScript = document.createElement('script');
      paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=sb&vault=true&intent=subscription';
      paypalScript.async = true;
      document.head.appendChild(paypalScript);
    }
    
    // Stripe (solo CDN, sin npm)
    if (!document.querySelector('script[src*="stripe.com"]')) {
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/buy-button.js';
      stripeScript.async = true;
      document.head.appendChild(stripeScript);
    }
  }, []);

  // Configurar PayPal - Simplificado sin dependencias del servidor
  useEffect(() => {
    const loadPayPal = async () => {
      if (window.paypal && paypalContainerRef.current && !paypalStatus.buttonRendered) {
        try {
          console.log('Iniciando renderizado de PayPal...');
          
          await window.paypal.Buttons({
            createSubscription: function(data: any, actions: any) {
              console.log('Creando suscripción PayPal...');
              return actions.subscription.create({
                'plan_id': 'P-8X502396U4202261ENBKC32A'
              });
            },
            onApprove: async function(data: any, actions: any) {
              console.log('PayPal aprobado:', data);
              setIsLoading(true);
              try {
                // Redirigir directamente sin llamadas al servidor
                window.location.href = `/paypal-return?subscription_id=${data.subscriptionID}&token=${data.orderID}`;
              } catch (error) {
                console.error('Error:', error);
                setPaypalStatus(prev => ({
                  ...prev,
                  error: true,
                  errorMessage: 'Error de conexión'
                }));
              } finally {
                setIsLoading(false);
              }
            },
            onError: function(err: any) {
              console.error('PayPal Error:', err);
              setPaypalStatus(prev => ({
                ...prev,
                error: true,
                errorMessage: 'Error en el proceso de pago'
              }));
            },
            onCancel: function(data: any) {
              console.log('PayPal payment cancelled:', data);
              setPaypalStatus(prev => ({
                ...prev,
                error: true,
                errorMessage: 'Pago cancelado'
              }));
            }
          }).render(paypalContainerRef.current);

          console.log('PayPal buttons renderizado exitosamente');
          setPaypalStatus(prev => ({ ...prev, buttonRendered: true }));
        } catch (error) {
          console.error('Error loading PayPal:', error);
          setPaypalStatus(prev => ({
            ...prev,
            error: true,
            errorMessage: 'Error al cargar PayPal: ' + (error instanceof Error ? error.message : 'Unknown error')
          }));
        }
      }
    };

    let attempts = 0;
    const maxAttempts = 20; // máximo 10 segundos

    const checkPayPal = () => {
      attempts++;
      if (window.paypal) {
        console.log('PayPal SDK disponible, cargando botones...');
        loadPayPal();
      } else if (attempts < maxAttempts) {
        console.log(`Esperando PayPal SDK... (${attempts}/${maxAttempts})`);
        setTimeout(checkPayPal, 500);
      } else {
        console.error('Timeout esperando PayPal SDK');
        setPaypalStatus(prev => ({
          ...prev,
          error: true,
          errorMessage: 'PayPal no se pudo cargar. Intenta recargar la página.'
        }));
      }
    };

    // Solo intentar una vez
    if (!paypalStatus.buttonRendered && !paypalStatus.error) {
      checkPayPal();
    }
  }, [paypalStatus.buttonRendered, paypalStatus.error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Activar Tu Cuenta NFLOW
            </h1>
            <p className="text-xl text-gray-300">
              Elige tu método de pago preferido para comenzar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Opción 1: PayPal */}
            <Card className="bg-gray-800/50 border-nflow-orange backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-nflow-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">1º Opción: PayPal</CardTitle>
                <CardDescription className="text-gray-300">
                  Recomendado - Activación automática
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-700/50 border border-nflow-orange rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">Plan Básico</h4>
                    <span className="text-lg font-bold text-nflow-orange">€2.99/mes</span>
                  </div>
                  <ul className="text-sm text-gray-300 mb-4 space-y-1">
                    <li>• Chat ilimitado con IA</li>
                    <li>• Soporte 24/7</li>
                    <li>• Activación automática</li>
                  </ul>
                  
                  {/* PayPal Button Container */}
                  <div ref={paypalContainerRef} className="min-h-[50px] relative border border-gray-600/50 rounded-lg">
                    {!paypalStatus.buttonRendered && !paypalStatus.error && (
                      <div className="absolute inset-0 bg-gray-800/80 flex flex-col items-center justify-center rounded-lg p-4">
                        <div className="animate-spin w-6 h-6 border-2 border-nflow-blue border-t-transparent rounded-full mb-2"></div>
                        <span className="text-gray-300 text-sm text-center">
                          Cargando PayPal...
                        </span>
                      </div>
                    )}
                    
                    {paypalStatus.error && (
                      <div className="absolute inset-0 bg-red-900/20 border border-red-500/50 flex flex-col items-center justify-center rounded-lg p-4">
                        <p className="text-red-400 text-sm text-center mb-2">
                          {paypalStatus.errorMessage}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.reload()}
                          className="text-xs border-red-500/50 text-red-400 hover:bg-red-900/30"
                        >
                          Reintentar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {isLoading && (
                  <div className="text-center text-gray-300">
                    <div className="animate-spin w-6 h-6 border-2 border-nflow-orange border-t-transparent rounded-full mx-auto mb-2"></div>
                    Preparando pago...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opción 2: Stripe (Liviano - Solo CDN) */}
            <Card className="bg-gray-800/50 border-purple-500 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">2º Opción: Stripe</CardTitle>
                <CardDescription className="text-gray-300">
                  Alternativa rápida si PayPal no funciona
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-700/50 border border-purple-500 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">Plan Básico</h4>
                    <span className="text-lg font-bold text-purple-400">€2.99/mes</span>
                  </div>
                  <ul className="text-sm text-gray-300 mb-4 space-y-1">
                    <li>• Chat ilimitado con IA</li>
                    <li>• Soporte 24/7</li>
                    <li>• Activación instantánea</li>
                  </ul>
                  
                  {/* Stripe Button (solo CDN) */}
                  <div className="min-h-[50px] relative border border-gray-600/50 rounded-lg p-2 bg-white/5 flex items-center justify-center">
                    <stripe-buy-button
                      buy-button-id="buy_btn_1Rc7kCCmvVkETA1m5aYwB4IH"
                      publishable-key="pk_live_51JIZjtCmvVkETA1mxdBylAQvElIPw0haPvP3mutq99SezEZVrFryWzz5zbX5gU2RFP15uFsR2XTKx5yYgkcJhADM00sR04papy"
                    />
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Procesado por Stripe (sin dependencias npm)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>







          <div className="text-center mt-8">
            <Link href="/">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
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