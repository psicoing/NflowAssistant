import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StripeReturn() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const processStripeReturn = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const success = urlParams.get('success');
        
        console.log('Stripe return parameters:', { sessionId, success });

        if (success === 'true' || sessionId) {
          // Process subscription activation
          const response = await fetch('/api/stripe/capture-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: sessionId,
              subscriptionPlan: 'basic'
            }),
            credentials: 'include',
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Stripe subscription activation result:', result);
            
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
          // Auto-activate for successful payments (Stripe webhook should handle this)
          const response = await fetch('/api/stripe/auto-activate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            setStatus('success');
            setMessage('Tu cuenta NFLOW ha sido activada exitosamente. Ya puedes acceder al chat de apoyo psicológico.');
            
            toast({
              title: "¡Cuenta Activada!",
              description: "Tu suscripción está activa. Redirigiendo al chat...",
              duration: 5000,
            });

            setTimeout(() => {
              setLocation("/chat");
            }, 3000);
          } else {
            throw new Error('Auto-activation failed');
          }
        }

      } catch (error) {
        console.error('Stripe return processing error:', error);
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

    processStripeReturn();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          {status === 'processing' && (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          )}
          
          <CardTitle className="text-2xl font-bold text-white">
            {status === 'processing' && 'Procesando tu pago...'}
            {status === 'success' && '¡Pago Exitoso!'}
            {status === 'error' && 'Error en el pago'}
          </CardTitle>
          
          <CardDescription className="text-gray-300">
            {status === 'processing' && 'Verificando tu suscripción con Stripe'}
            {status === 'success' && 'Tu cuenta ha sido activada'}
            {status === 'error' && 'Hubo un problema procesando tu pago'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-200 text-center">
            {message}
          </p>
          
          {status === 'success' && (
            <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">
                  Redirigiendo al chat en 3 segundos...
                </span>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-red-300">
                    Contacta soporte: support@nflow.app
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={() => setLocation("/activar-cuenta")}
                className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Volver a intentar
              </Button>
            </div>
          )}
          
          {status === 'success' && (
            <Button 
              onClick={() => setLocation("/chat")}
              className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Ir al Chat
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}