import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, User } from "lucide-react";

export default function Registro() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: ""
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCreatedCredentials({
          username: formData.username,
          password: formData.password
        });
        setShowSuccess(true);
        
        toast({
          title: "Cuenta temporal creada",
          description: "IMPORTANTE: Debes completar el pago para activar tu cuenta",
          duration: 6000,
        });

        // Guardar datos del usuario pendiente de pago - se borrará si no paga
        localStorage.setItem("pendingUserId", data.userId.toString());
        localStorage.setItem("pendingUsername", formData.username);
        localStorage.setItem("registrationTime", Date.now().toString());
        
        setTimeout(() => {
          setLocation("/");
          // Scroll to pricing section after redirect
          setTimeout(() => {
            const pricingSection = document.getElementById("precios");
            if (pricingSection) {
              pricingSection.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }, 2000);
      } else {
        setError(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
            <div className="w-16 h-16 bg-nflow-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Crear Cuenta</CardTitle>
            <CardDescription className="text-gray-400">
              Únete a NFLOW y comienza tu bienestar digital
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

              {showSuccess && (
                <Alert className="border-green-600 bg-green-600/10">
                  <AlertDescription className="text-green-400">
                    <div className="text-center">
                      <div className="font-bold mb-2">¡Cuenta creada exitosamente!</div>
                      <div className="bg-gray-800 p-3 rounded-lg mb-2">
                        <div className="text-sm text-gray-300">Usuario creado:</div>
                        <div className="font-mono text-lg text-white">{createdCredentials.username}</div>
                        <div className="text-sm text-gray-300 mt-2">Contraseña:</div>
                        <div className="font-mono text-lg text-white">{createdCredentials.password}</div>
                      </div>
                      <div className="text-sm text-green-300">
                        Serás redirigido al login en unos segundos...
                      </div>
                    </div>
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
                  placeholder="Elige un nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-nflow-blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email (opcional)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-nflow-blue"
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
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-nflow-blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-nflow-blue"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-nflow-blue hover:bg-nflow-blue/90 text-white font-semibold"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>

              <div className="text-center text-gray-400">
                <span>¿Ya tienes cuenta? </span>
                <button
                  type="button"
                  onClick={() => setLocation("/login")}
                  className="text-nflow-blue hover:underline"
                >
                  Inicia sesión aquí
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