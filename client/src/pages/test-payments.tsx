import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, CreditCard, Zap, TestTube } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function TestPayments() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [testUserEmail, setTestUserEmail] = useState("");
  const { toast } = useToast();

  const simulateStripePayment = async () => {
    if (!testUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Ingresa un email para la prueba",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular webhook de Stripe
      const response = await fetch('/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'checkout.session.completed',
          data: {
            object: {
              id: `cs_test_${Date.now()}`,
              customer_details: {
                email: testUserEmail
              }
            }
          }
        }),
      });

      if (response.ok) {
        toast({
          title: "🧪 Prueba Stripe Exitosa",
          description: "Webhook simulado procesado. Verificando activación...",
          duration: 3000,
        });

        // Invalidate cache and redirect
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        
        setTimeout(() => {
          setLocation("/chat");
        }, 2000);
      } else {
        throw new Error('Webhook simulation failed');
      }
    } catch (error) {
      console.error('Stripe test error:', error);
      toast({
        title: "Error en prueba",
        description: "No se pudo simular el pago de Stripe",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };


  const activateTestUser = async () => {
    if (!testUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Ingresa un email para activar",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/test/activate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUserEmail
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "✅ Usuario Activado",
          description: `Usuario con email ${testUserEmail} activado para pruebas`,
          duration: 3000,
        });

        // Invalidate cache and redirect
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        
        setTimeout(() => {
          setLocation("/chat");
        }, 2000);
      } else {
        throw new Error('User activation failed');
      }
    } catch (error) {
      console.error('Activation error:', error);
      toast({
        title: "Error",
        description: "No se pudo activar el usuario",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <TestTube className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            Centro de Pruebas de Pagos
          </CardTitle>
          
          <CardDescription className="text-gray-300">
            Simula webhooks de Stripe para activar suscripciones
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-yellow-400 font-medium">
                  Modo de Pruebas Activado
                </p>
                <p className="text-xs text-yellow-200">
                  Estas funciones simulan webhooks reales sin procesar pagos. Perfecto para testing sin transacciones.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail" className="text-white">
                Email del Usuario a Activar
              </Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={testUserEmail}
                onChange={(e) => setTestUserEmail(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Simulación Stripe */}
            <Card className="bg-gray-700/30 border-purple-500/50">
              <CardHeader className="text-center pb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg text-white">Simular Stripe</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={simulateStripePayment}
                  disabled={isProcessing || !testUserEmail.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isProcessing ? "Procesando..." : "Simular Webhook Stripe"}
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Activación Directa */}
          <Card className="bg-gray-700/30 border-green-500/50">
            <CardHeader className="text-center pb-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg text-white">Activación Directa</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Activa usuario sin simular pago (para debugging)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={activateTestUser}
                disabled={isProcessing || !testUserEmail.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? "Activando..." : "Activar Usuario Directamente"}
              </Button>
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-400">
              Usa emails de usuarios existentes en la base de datos
            </p>
            <Button 
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}