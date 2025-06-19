import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PayPalReturn() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const processPayPalReturn = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const subscriptionID = urlParams.get('subscription_id');
        const token = urlParams.get('token');
        
        console.log('PayPal return parameters:', { subscriptionID, token });

        if (subscriptionID) {
          // Process subscription activation
          const response = await fetch('/api/paypal/capture-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subscriptionID: subscriptionID,
              subscriptionPlan: 'basic'
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Subscription activation result:', result);
            
            setStatus('success');
            setMessage('Tu cuenta NFLOW ha sido activada exitosamente. Ya puedes acceder al chat de apoyo psicológico.');
            
            toast({
              title: "¡Cuenta Activada!",
              description: "Tu suscripción está activa. Redirigiendo al chat...",
              duration: 5000,
            });

            // Redirect to chat after a delay
            setTimeout(() => {
              setLocation("/chat");
            }, 3000);
          } else {
            throw new Error('Failed to activate subscription');
          }
        } else {
          throw new Error('No subscription ID found in URL');
        }

      } catch (error) {
        console.error('PayPal return processing error:', error);
        setStatus('error');
        setMessage('Hubo un problema procesando tu pago. Por favor contacta soporte con tu comprobante de pago.');
        
        toast({
          title: "Error en la activación",
          description: "Contacta soporte para activar tu cuenta manualmente.",
          variant: "destructive",
          duration: 10000,
        });
      }
    };

    processPayPalReturn();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {status === 'processing' && (
              <div className="animate-spin w-12 h-12 border-4 border-nflow-blue border-t-transparent rounded-full"></div>
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 text-green-500" />
            )}
            {status === 'error' && (
              <AlertTriangle className="w-16 h-16 text-red-500" />
            )}
          </div>
          
          <CardTitle className="text-2xl text-white">
            {status === 'processing' && 'Procesando Pago'}
            {status === 'success' && '¡Pago Exitoso!'}
            {status === 'error' && 'Error en el Pago'}
          </CardTitle>
          
          <CardDescription className="text-gray-400">
            {status === 'processing' && 'Estamos activando tu cuenta NFLOW...'}
            {status === 'success' && 'Tu cuenta ha sido activada exitosamente'}
            {status === 'error' && 'Hubo un problema con tu pago'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              {message}
            </p>
          </div>

          {status === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <ul className="text-green-400 text-sm space-y-1">
                <li>✓ Suscripción activa por 30 días</li>
                <li>✓ Acceso completo al chat de IA</li>
                <li>✓ Soporte psicológico 24/7</li>
              </ul>
            </div>
          )}

          {status === 'success' && (
            <Button 
              onClick={() => setLocation("/chat")}
              className="w-full bg-nflow-blue hover:bg-nflow-blue/90 text-white"
              size="lg"
            >
              Ir al Chat de Apoyo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/activar-cuenta")}
                className="w-full bg-nflow-blue hover:bg-nflow-blue/90 text-white"
              >
                Intentar de Nuevo
              </Button>
              
              <Button 
                onClick={() => setLocation("/")}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Volver al Inicio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}