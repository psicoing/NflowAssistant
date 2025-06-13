import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function TestFlowButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const testCompleteFlow = async () => {
    setIsLoading(true);
    
    try {
      // 1. Create test user
      const testUsername = `testuser_${Date.now()}`;
      const testPassword = "test123";
      
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: testUsername,
          password: testPassword,
          email: `${testUsername}@test.com`
        }),
      });

      const registerData = await registerResponse.json();

      if (registerData.success) {
        toast({
          title: "Usuario de prueba creado",
          description: `Usuario: ${testUsername} | Contraseña: ${testPassword}`,
          duration: 8000,
        });

        // 2. Create and capture PayPal order for testing
        const createOrderResponse = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: registerData.userId,
            amount: "5.99",
            currency: "EUR",
            subscriptionPlan: "group"
          }),
        });

        const orderData = await createOrderResponse.json();
        
        // Simulate successful payment capture
        const subscriptionResponse = await fetch(`/api/paypal/capture-order/${orderData.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: registerData.userId
          }),
        });

        if (subscriptionResponse.ok) {
          // 3. Set user session and redirect to chat
          localStorage.setItem("userId", registerData.userId.toString());
          
          toast({
            title: "¡Flujo completo exitoso!",
            description: "Usuario registrado, pago procesado y acceso al chat habilitado",
            duration: 5000,
          });

          setTimeout(() => {
            setLocation("/chat");
          }, 2000);
        } else {
          throw new Error("Subscription activation failed");
        }
      } else {
        throw new Error(registerData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Test flow error:", error);
      toast({
        title: "Error en el flujo de prueba",
        description: "Hubo un problema en el proceso de prueba",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={testCompleteFlow}
      disabled={isLoading}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      {isLoading ? "Probando..." : "Probar Flujo Completo"}
    </Button>
  );
}