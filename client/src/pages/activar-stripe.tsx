import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function ActivarStripe() {
  const [, setLocation] = useLocation();
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const handleActivateStripe = async () => {
    try {
      setIsActivating(true);
      
      const response = await fetch('/api/stripe/auto-activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "¡Cuenta Activada!",
          description: "Tu suscripción de Stripe ha sido activada exitosamente.",
          duration: 5000,
        });

        // Redirect to chat after activation
        setTimeout(() => {
          setLocation("/chat");
        }, 2000);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to activate');
      }
    } catch (error) {
      console.error('Activation error:', error);
      toast({
        title: "Error en la activación",
        description: "No se pudo activar automáticamente. Contacta soporte.",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            Activar Suscripción Stripe
          </CardTitle>
          
          <CardDescription className="text-gray-300">
            Completa tu pago de Stripe y activa tu cuenta NUXA
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-blue-300 font-medium">
                  Pago procesado por Stripe
                </p>
                <p className="text-xs text-blue-200">
                  Si ya completaste el pago, haz clic en "Activar Cuenta" para acceder al chat.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-200 text-sm text-center">
              Haz clic en el botón para activar tu cuenta NUXA después de completar el pago con Stripe.
            </p>
            
            <Button 
              onClick={handleActivateStripe}
              disabled={isActivating}
              className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {isActivating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Activando...</span>
                </div>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Activar Cuenta
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button 
              variant="ghost"
              onClick={() => setLocation("/chat")}
              className="text-gray-400 hover:text-white text-sm"
            >
              O ir al chat directamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}