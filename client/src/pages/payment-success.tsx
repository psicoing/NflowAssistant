import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [activationComplete, setActivationComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment details from URL
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get('paymentId');
        const payerId = urlParams.get('PayerID');
        const orderId = urlParams.get('orderId') || localStorage.getItem('currentOrderId');

        if (!paymentId || !payerId || !orderId) {
          throw new Error('Missing payment information');
        }

        // Capture the payment and activate account
        const response = await fetch(`/api/paypal/capture-order/${orderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId,
            payerId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process payment');
        }

        const result = await response.json();
        
        if (result.status === 'COMPLETED') {
          setActivationComplete(true);
          
          toast({
            title: "¡Cuenta Activada!",
            description: "Tu suscripción está activa. Accede al chat de apoyo psicológico.",
            duration: 5000,
          });

          // Clear stored payment data
          localStorage.removeItem('currentOrderId');
          localStorage.removeItem('paymentPlan');
          localStorage.removeItem('paymentAmount');

        } else {
          throw new Error('Payment not completed');
        }

      } catch (error) {
        console.error('Payment processing error:', error);
        toast({
          title: "Error en la activación",
          description: "Hubo un problema procesando tu pago. Contacta soporte.",
          variant: "destructive",
          duration: 10000,
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [toast]);

  const handleGoToChat = () => {
    setLocation("/chat");
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800/50 border-nflow-blue backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin w-12 h-12 border-4 border-nflow-blue border-t-transparent rounded-full"></div>
            </div>
            <CardTitle className="text-2xl text-white">Procesando Pago</CardTitle>
            <CardDescription className="text-gray-400">
              Estamos activando tu cuenta NFLOW...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md bg-gray-800/50 border-green-500 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-white">
            {activationComplete ? "¡Cuenta Activada!" : "Pago Completado"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {activationComplete 
              ? "Tu suscripción NFLOW está activa. Accede al chat de apoyo psicológico profesional."
              : "Tu pago se procesó correctamente pero hubo un problema con la activación."
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {activationComplete && (
            <div className="text-center space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 text-sm">
                  ✓ Suscripción activa por 30 días<br/>
                  ✓ Acceso completo al chat de IA<br/>
                  ✓ Soporte psicológico 24/7
                </p>
              </div>
              
              <Button 
                onClick={handleGoToChat}
                className="w-full bg-nflow-blue hover:bg-nflow-blue/90 text-white"
                size="lg"
              >
                Ir al Chat de Apoyo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
          
          {!activationComplete && (
            <div className="text-center space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  Tu pago se procesó pero necesitamos activar tu cuenta manualmente.
                  Contacta soporte para activación inmediata.
                </p>
              </div>
              
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