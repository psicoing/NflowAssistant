import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogIn, User, ShieldAlert } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { useLanguageContext } from "@/components/LanguageProvider";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { t } = useLanguageContext();

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
        localStorage.setItem("user_email", data.email || "");
        console.log('💾 Email guardado para activación automática:', data.email);
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido de vuelta, ${formData.username}`,
        });

        // Invalidar cache de autenticación y suscripción
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        await queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
        
        // Pequeño delay para asegurar que el cache se actualice
        await new Promise(resolve => setTimeout(resolve, 100));

        // Admin personal → intranet directa (por role o por username de seguridad)
        if (data.role === "admin" || formData.username === "rmolons") {
          setLocation("/admin/dashboard");
          return;
        }

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
    <>
      <SEOHead
        title="Acceso - NUXA Psicólogo IA"
        description="Inicia sesión en NUXA y accede a tu psicólogo IA disponible 24/7. Apoyo emocional profesional en español para tu salud mental."
        keywords="login NUXA, acceso psicólogo IA, iniciar sesión salud mental, chat psicológico online"
        ogTitle="Inicia sesión en NUXA - Tu Psicólogo IA"
        canonicalUrl="https://nuxa.life/login"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">{t('login.title')}</CardTitle>
            <CardDescription className="text-gray-400">
              Accede a tu cuenta de NUXA
            </CardDescription>
            
            {/* Password Security Notice */}
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-600/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-emerald-400 mb-1">
                    🔐 Protege tu privacidad
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed mb-2">
                    <strong className="text-white">Primer paso al entrar:</strong> Cambia tu contraseña en el Panel de Control para que todas tus conversaciones queden protegidas y encriptadas.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                      ✓ Encriptación de alta seguridad
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                      ✓ 100% Confidencial
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
                  {t('login.username')}
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={t('login.username.placeholder')}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  {t('login.password')}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('login.password.placeholder')}
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
                {isLoading ? t('login.loading') : t('login.submit')}
              </Button>

              <div className="text-center text-gray-400">
                <button
                  type="button"
                  onClick={() => setLocation("/registro")}
                  className="text-orange-400 hover:text-orange-300 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <span>❓</span> {t('login.access')}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setLocation("/")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('login.back')}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
    </>
  );
}