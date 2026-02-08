import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowRight, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function QuickActivate() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const handleQuickActivation = async () => {
    try {
      if (!username.trim()) {
        toast({
          title: "Error",
          description: "Por favor ingresa tu nombre de usuario",
          variant: "destructive",
        });
        return;
      }

      setIsActivating(true);
      
      // Try both Stripe and PayPal activation
      const stripeResponse = await fetch('/api/stripe/manual-activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim()
        }),
        credentials: 'include',
      });

      if (stripeResponse.ok) {
        const result = await stripeResponse.json();
        
        toast({
          title: "¡Cuenta Activada!",
          description: `Usuario ${username} activado exitosamente. Iniciando sesión...`,
          duration: 5000,
        });

        // Auto-login and redirect to chat
        setTimeout(() => {
          setLocation("/chat");
        }, 2000);
        return;
      }

      // If Stripe fails, try PayPal
      const paypalResponse = await fetch('/api/paypal/manual-activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim()
        }),
        credentials: 'include',
      });

      if (paypalResponse.ok) {
        const result = await paypalResponse.json();
        
        toast({
          title: "¡Cuenta Activada!",
          description: `Usuario ${username} activado exitosamente. Iniciando sesión...`,
          duration: 5000,
        });

        // Auto-login and redirect to chat
        setTimeout(() => {
          setLocation("/chat");
        }, 2000);
        return;
      }

      throw new Error('No se pudo activar la cuenta');

    } catch (error) {
      console.error('Quick activation error:', error);
      toast({
        title: "Error en la activación",
        description: "No se pudo activar la cuenta. Verifica el nombre de usuario o contacta soporte.",
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
          <div className="w-16 h-16 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            Activación Rápida
          </CardTitle>
          
          <CardDescription className="text-gray-300">
            Activa tu cuenta después del pago (Stripe o PayPal)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-nflow-orange/20 border border-nflow-orange/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-nflow-orange mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-nflow-orange font-medium">
                  Pago completado exitosamente
                </p>
                <p className="text-xs text-orange-200">
                  Ingresa tu nombre de usuario para activar automáticamente tu cuenta NUXA.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Nombre de Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleQuickActivation()}
              />
            </div>
            
            <Button 
              onClick={handleQuickActivation}
              disabled={isActivating || !username.trim()}
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
                  Activar y Acceder al Chat
                </>
              )}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-400">
              Funciona con pagos de Stripe y PayPal
            </p>
            <Button 
              variant="ghost"
              onClick={() => setLocation("/login")}
              className="text-gray-400 hover:text-white text-sm"
            >
              Volver al login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}