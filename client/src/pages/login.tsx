import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogIn, User } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Guardar datos de usuario en localStorage
        localStorage.setItem("userId", data.userId.toString());
        localStorage.setItem("username", formData.username);
        localStorage.setItem("hasCompletedPayment", data.hasCompletedPayment.toString());
        
        // 🚀 CRITICAL: Guardar email para activación automática de pagos
        localStorage.setItem("user_email", data.email || formData.email || "");
        console.log('💾 Email guardado para activación automática:', data.email || formData.email);
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido de vuelta, ${formData.username}`,
        });

        // Invalidar cache de autenticación y suscripción
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        await queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
        
        // Debug login response
        console.log("Login response data:", JSON.stringify(data, null, 2));
        
        // Pequeño delay para asegurar que el cache se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirigir según estado de suscripción
        if (data.hasCompletedPayment && data.subscriptionStatus === 'active' && data.hasActiveSubscription) {
          console.log("Usuario con suscripción activa, redirigiendo al chat");
          setLocation("/chat");
        } else {
          console.log("Usuario sin suscripción activa");
          console.log("userType:", data.userType);
          console.log("hasCompletedPayment:", data.hasCompletedPayment);
          console.log("subscriptionStatus:", data.subscriptionStatus);
          console.log("hasActiveSubscription:", data.hasActiveSubscription);
          
          // Si hay indicios de pago pero no está activo, sugerir activación
          if (data.subscriptionStatus === 'pending_payment' || !data.hasActiveSubscription) {
            toast({
              title: "¿Completaste el pago?",
              description: "Si ya pagaste, activa tu cuenta para acceder al chat",
            });
            
            // Redirigir automáticamente a activación después de un momento
            setTimeout(() => {
              setLocation("/activar");
            }, 2000);
          } else {
            // Personalizar mensaje según tipo de usuario
            if (data.userType === 'business') {
              toast({
                title: "Suscripción empresarial requerida",
                description: "Para acceder al chat tu empresa necesita una suscripción activa",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Suscripción requerida",
                description: "Para acceder al chat necesitas una suscripción activa",
                variant: "destructive",
              });
            }
          }
          
          setLocation("/");
          // Scroll to pricing section after redirect, personalizado por userType
          setTimeout(() => {
            const pricingSection = document.getElementById("precios");
            if (pricingSection) {
              pricingSection.scrollIntoView({ behavior: "smooth" });
              
              // Si es usuario empresarial, hacer scroll a la sección empresarial después de un momento
              if (data.userType === 'business') {
                setTimeout(() => {
                  const businessSection = pricingSection.querySelector('.grid.md\\:grid-cols-3:last-child');
                  if (businessSection) {
                    businessSection.scrollIntoView({ behavior: "smooth" });
                  }
                }, 500);
              }
            }
          }, 100);
        }
      } else {
        setError(data.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-400">
              Accede a tu cuenta de NFLOW
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="border-red-600 bg-red-600/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-200">
                  Usuario
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center text-gray-400">
                <span>¿No tienes cuenta? </span>
                <button
                  type="button"
                  onClick={() => setLocation("/registro")}
                  className="text-orange-500 hover:underline"
                >
                  Regístrate aquí
                </button>
              </div>

              <button
                type="button"
                onClick={() => setLocation("/")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Volver al inicio
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}