import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, MessageCircle } from "lucide-react";

// PayPal configuration
declare global {
  interface Window {
    paypal: any;
  }
}

export default function ActivarCuenta() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and has pending payment
    const checkUserStatus = async () => {
      try {
        const response = await fetch("/api/subscription-status");
        if (response.ok) {
          const data = await response.json();
          if (data.hasActiveSubscription) {
            // User already has active subscription, redirect to chat
            setLocation("/chat");
          } else {
            setUserInfo(data);
          }
        } else {
          // For demo purposes, allow access without authentication
          setUserInfo({
            hasActiveSubscription: false,
            subscriptionStatus: "pending_payment",
            hasCompletedPayment: false
          });
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        // For demo purposes, allow access without authentication
        setUserInfo({
          hasActiveSubscription: false,
          subscriptionStatus: "pending_payment", 
          hasCompletedPayment: false
        });
      }
    };

    checkUserStatus();
  }, [setLocation]);

  // Initialize PayPal SDK
  useEffect(() => {
    const initPayPal = () => {
      if (window.paypal && document.getElementById('paypal-button-container-basic')) {
        window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              plan_id: 'P-8X502396U4202261ENBKC32A'
            });
          },
          onApprove: async function(data: any, actions: any) {
            try {
              setIsLoading(true);
              
              // Capture subscription and activate account
              const response = await fetch('/api/paypal/capture-subscription', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  subscriptionID: data.subscriptionID,
                  subscriptionPlan: 'basic'
                }),
              });

              if (response.ok) {
                toast({
                  title: "¡Cuenta Activada!",
                  description: "Tu suscripción está activa. Redirigiendo al chat...",
                  duration: 3000,
                });

                setTimeout(() => {
                  setLocation("/chat");
                }, 2000);
              } else {
                throw new Error('Failed to activate subscription');
              }
            } catch (error) {
              console.error('Subscription activation error:', error);
              toast({
                title: "Error en la activación",
                description: "Hubo un problema activando tu cuenta. Contacta soporte.",
                variant: "destructive",
                duration: 10000,
              });
            } finally {
              setIsLoading(false);
            }
          },
          onError: function(err: any) {
            console.error('PayPal error:', err);
            toast({
              title: "Error de PayPal",
              description: "Hubo un problema con PayPal. Intenta de nuevo.",
              variant: "destructive",
              duration: 5000,
            });
          }
        }).render('#paypal-button-container-basic');
      }
    };

    // Load PayPal SDK if not already loaded
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AUfOCCtv0adF68mMpXq5rLt-yYcpZmHwe_zITYbsSTNwrdSmmhaVqCYGkmaMs1yuwVH9Wjp2-FtIsCj7&vault=true&intent=subscription';
      script.onload = initPayPal;
      document.head.appendChild(script);
    } else {
      initPayPal();
    }
  }, [toast, setLocation]);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-nflow-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Activar tu Cuenta NFLOW</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Selecciona tu método de activación para acceder al chat de apoyo psicológico
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Opción 1: PayPal Automático */}
          <Card className="bg-gray-800/50 border-nflow-orange backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-nflow-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">1º Opción: Pago Automático</CardTitle>
              <CardDescription className="text-gray-300">
                Recomendado - Activación inmediata con PayPal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  Selecciona tu plan y paga de forma segura con PayPal. Tu cuenta se activará automáticamente.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700/50 border border-nflow-blue rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">Plan Básico</h4>
                    <span className="text-xl font-bold text-nflow-blue">€2.99/mes</span>
                  </div>
                  <ul className="text-sm text-gray-300 mb-4 space-y-1">
                    <li>• Chat ilimitado con IA especializada</li>
                    <li>• Soporte psicológico 24/7</li>
                    <li>• Recursos y ejercicios personalizados</li>
                  </ul>
                  <div id="paypal-button-container-basic" className="min-h-[50px]"></div>
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

          {/* Opción 2: Activación Manual */}
          <Card className="bg-gray-800/50 border-green-500 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">2º Opción: Activación Manual</CardTitle>
              <CardDescription className="text-gray-300">
                Si tienes problemas con PayPal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  Contáctanos por WhatsApp con tu comprobante de pago y activaremos tu cuenta manualmente.
                </p>
              </div>

              <div className="text-center">
                <a
                  href="https://wa.me/34660452136?text=Hola%2C%20quiero%20activar%20mi%20cuenta%20NFLOW.%20Tengo%20el%20comprobante%20de%20pago."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  WhatsApp: +34 660 45 21 36
                </a>
              </div>

              <Alert className="bg-green-900/20 border-green-500/30">
                <AlertDescription className="text-green-200 text-sm">
                  <strong>Instrucciones:</strong>
                  <br />
                  1. Realiza el pago del plan elegido
                  <br />
                  2. Envíanos el comprobante por WhatsApp
                  <br />
                  3. Te activaremos la cuenta en 24 horas
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}