import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, MessageCircle, Zap, CheckCircle, Smartphone, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import SoporteActivacionBanner from "@/components/SoporteActivacionBanner";

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
  const { toast } = useToast();
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
            createSubscription: async function(data: any, actions: any) {
              console.log('Creando suscripción PayPal...');
              
              // Crear plan dinámicamente desde el servidor
              try {
                const planResponse = await fetch('/api/paypal/create-plan', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    amount: '2.99',
                    currency: 'EUR',
                    name: 'Plan Básico NFLOW'
                  }),
                  credentials: 'include',
                });

                if (!planResponse.ok) {
                  throw new Error('Failed to create PayPal plan');
                }

                const planData = await planResponse.json();
                console.log('Plan creado:', planData.planId);

                return actions.subscription.create({
                  'plan_id': planData.planId
                });
              } catch (error) {
                console.error('Error creando plan PayPal:', error);
                throw error;
              }
            },
            onApprove: async function(data: any, actions: any) {
              console.log('🎯 PayPal Subscription Approved:', data);
              console.log('🎯 Available actions:', Object.keys(actions));
              setIsLoading(true);
              
              try {
                // For subscriptions, no capture needed - approval is enough
                console.log('✅ PayPal subscription approved, activating...');
                
                // Directly activate via API call since this is a subscription
                const response = await fetch('/api/paypal/capture-subscription', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    subscriptionId: data.subscriptionID || data.orderID,
                    subscriptionPlan: 'basic'
                  }),
                  credentials: 'include',
                });

                if (response.ok) {
                  const result = await response.json();
                  console.log('✅ PayPal subscription activated:', result);
                  
                  toast({
                    title: "¡Suscripción Activada!",
                    description: "Tu cuenta NFLOW está activa. Redirigiendo al chat...",
                    duration: 3000,
                  });
                  
                  setTimeout(() => {
                    window.location.href = '/chat';
                  }, 2000);
                } else {
                  throw new Error('Failed to activate subscription');
                }
                
              } catch (error) {
                console.error('❌ PayPal approval error:', error);
                toast({
                  title: "Error en la activación",
                  description: "Contacta soporte para activar tu cuenta manualmente.",
                  variant: "destructive",
                });
                // Fallback to return page
                window.location.href = `/paypal-return?subscriptionID=${data.subscriptionID || data.orderID}`;
              } finally {
                setIsLoading(false);
              }
            },
            onError: function(err: any) {
              console.error('❌ PayPal Error Details:', {
                message: err.message,
                details: err.details,
                name: err.name,
                stack: err.stack,
                fullError: err
              });
              
              toast({
                title: "Error PayPal",
                description: "Hubo un problema con PayPal. Intenta con Stripe como alternativa.",
                variant: "destructive",
                duration: 5000,
              });
              
              setPaypalStatus(prev => ({
                ...prev,
                error: true,
                errorMessage: `Error PayPal: ${err.message || 'Error desconocido'}`
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

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Opción 1: PayPal */}
            <Card className="bg-gray-800/50 border-orange-500 backdrop-blur-sm h-fit">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white mb-2">Plan Básico</CardTitle>
                <div className="text-2xl font-bold text-orange-400 mb-2">€2.99/mes</div>
                <CardDescription className="text-gray-300 text-sm">
                  Activación automática
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm text-gray-300 mb-4 space-y-2 text-center">
                  <li>• Chat ilimitado con IA</li>
                  <li>• Soporte 24/7</li>
                  <li>• Activación automática</li>
                </ul>
                
                {/* PayPal Button Container */}
                <div ref={paypalContainerRef} className="min-h-[50px] relative border border-gray-600/50 rounded-lg bg-gray-900/30">
                  {!paypalStatus.buttonRendered && !paypalStatus.error && (
                    <div className="absolute inset-0 bg-gray-800/80 flex flex-col items-center justify-center rounded-lg p-4">
                      <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mb-2"></div>
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

                {isLoading && (
                  <div className="text-center text-gray-300">
                    <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    Preparando pago...
                  </div>
                )}
                
                <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-3 mt-3">
                  <p className="text-blue-300 text-xs text-center">
                    💡 Consulta el recuadro del final de página para que te sientas seguro(a) y cómodo(a)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Opción 2: Stripe */}
            <Card className="bg-gray-800/50 border-purple-500 backdrop-blur-sm h-fit">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white mb-2">Plan Básico</CardTitle>
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
                
                {/* Stripe Button */}
                <div className="min-h-[50px] relative border border-gray-600/50 rounded-lg bg-gray-900/30 overflow-hidden">
                  <div className="p-2 flex items-center justify-center">
                    <stripe-buy-button
                      buy-button-id="buy_btn_1Rc7kCCmvVkETA1m5aYwB4IH"
                      publishable-key="pk_live_51JIZjtCmvVkETA1mxdBylAQvElIPw0haPvP3mutq99SezEZVrFryWzz5zbX5gU2RFP15uFsR2XTKx5yYgkcJhADM00sR04papy"
                      success-url={`${window.location.origin}/activacion-exitosa?email=${encodeURIComponent(localStorage.getItem('user_email') || '')}`}
                      cancel-url={`${window.location.origin}/activar-cuenta`}
                      customer-email=""
                    />
                  </div>
                </div>
                
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

            {/* Opción 3: Bizum */}
            <Card className="bg-gray-800/50 border-green-500 backdrop-blur-sm h-fit">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white mb-2">Plan Básico</CardTitle>
                <div className="text-2xl font-bold text-green-400 mb-2">€2.99/mes</div>
                <CardDescription className="text-gray-300 text-sm">
                  Método español - Activación en 24h
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm text-gray-300 mb-4 space-y-2 text-center">
                  <li>• Chat ilimitado con IA</li>
                  <li>• Soporte 24/7</li>
                  <li>• Activación en 24 horas</li>
                </ul>
                
                <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
                  <p className="text-green-300 text-sm font-medium mb-3 text-center">
                    📱 Instrucciones Bizum:
                  </p>
                  <div className="text-sm text-green-200 space-y-2 text-center">
                    <p className="font-semibold">1. Envía €2.99 por Bizum al:</p>
                    <p className="text-lg font-bold text-white bg-green-700/50 py-2 px-4 rounded">
                      +34 660 45 21 36
                    </p>
                    <p className="font-semibold">2. En el concepto pon:</p>
                    <div className="text-sm text-green-200 space-y-1 mb-2">
                      <p>• 1. Nombre de tu usuario</p>
                      <p>• 2. Escoge una contraseña</p>
                      <p>• 3. Tu email</p>
                    </div>
                    <p className="text-sm text-yellow-200 bg-green-700/30 py-2 px-3 rounded italic">
                      "usuario, contraseña, email"
                    </p>
                    <p className="text-xs text-green-300 mt-1">
                      ⚡ Ejemplo: "juan123, mipass2025, juan@gmail.com"
                    </p>
                    <p className="font-semibold">3. Ramón te activará en 24h sin falta</p>
                  </div>
                </div>
                
                <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-3">
                  <p className="text-orange-300 text-xs text-center">
                    💬 ¿Dudas? Llama a Ramón: +34 660 45 21 36
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
              
              {/* Credenciales profesionales de Ramón */}
              <div className="bg-indigo-900/30 border border-indigo-400/50 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-bold text-white mb-2">
                  RAMÓN MOLONS DE SAN ROMÁN
                </h4>
                <p className="text-indigo-200 text-sm font-medium mb-1">
                  PSICÓLOGO CLÍNICO Y ESCOLAR Y NEUROINGENIERO EN TELECOMUNICACIONES
                </p>
                <p className="text-indigo-300 text-xs font-bold">
                  LICENCIA ESTATAL DEL MINISTERIO DE SALUD E-17928705
                </p>
              </div>
              
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