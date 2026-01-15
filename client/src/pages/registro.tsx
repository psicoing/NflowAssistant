import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, User, Building, ShieldCheck, RefreshCw, Coins } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReferralCode } from "@/hooks/useReferralCode";
import { SEOHead } from "@/components/SEOHead";

export default function Registro() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    birthDate: "",
    userType: "individual"
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();
  const { referralCode, isValidating, isValid, isFromUrl, updateReferralCode } = useReferralCode();

  // Función para calcular la edad
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

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

    // Validación de fecha de nacimiento (solo para usuarios individuales)
    if (formData.userType === "individual") {
      if (!formData.birthDate) {
        setError("Por favor, ingresa tu fecha de nacimiento");
        setIsLoading(false);
        return;
      }

      const age = calculateAge(formData.birthDate);
      if (age < 18) {
        setError("Para registrarte debes tener al menos 18 años. Si eres menor de edad, consulta con tus padres o tutores para el uso supervisado de la plataforma.");
        setIsLoading(false);
        return;
      }

      if (age > 95) {
        setError("La plataforma está diseñada para personas de 18 a 95 años");
        setIsLoading(false);
        return;
      }
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
          email: formData.email,
          birthDate: formData.userType === "individual" ? formData.birthDate : null,
          userType: formData.userType,
          referralCode: referralCode.trim() || null
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
          title: "¡Cuenta creada!",
          description: "Selecciona tu plan para continuar",
          duration: 3000,
        });

        // Guardar datos del usuario pendiente de pago - se borrará si no paga
        localStorage.setItem("pendingUserId", data.userId.toString());
        localStorage.setItem("pendingUsername", formData.username);
        localStorage.setItem("registrationTime", Date.now().toString());
        
        // 🚀 CRITICAL: Guardar email para activación automática de pagos
        localStorage.setItem("user_email", formData.email);
        console.log('💾 Email guardado para activación automática:', formData.email);
        
        setTimeout(() => {
          setLocation("/activar-cuenta");
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
    <>
      <SEOHead
        title="Registro - NUXA Psicólogo IA | Crear Cuenta Gratis"
        description="Crea tu cuenta en NUXA y accede a apoyo emocional profesional con IA. Psicólogo virtual 24/7 en español. Registro rápido y seguro."
        keywords="registro NUXA, crear cuenta psicólogo IA, registro salud mental, nueva cuenta terapia online"
        ogTitle="Únete a NUXA - Tu Psicólogo IA 24/7"
        canonicalUrl="https://nuxa.life/registro"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Left Side - Subscriptions Option */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-r from-blue-900/40 to-transparent">
        <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <RefreshCw className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Suscripciones</h3>
            <p className="text-sm text-blue-300 font-medium">Planes mensuales</p>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 w-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Plan Básico</span>
                <span className="text-blue-400 font-bold">€2.99/mes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Plan Individual</span>
                <span className="text-blue-400 font-bold">€5.99/mes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Plan Premium</span>
                <span className="text-blue-400 font-bold">€32/año</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              Chat ilimitado cada mes<br/>
              Renovación automática
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Credits Option */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-72 bg-gradient-to-l from-emerald-900/40 to-transparent">
        <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <Coins className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pago por Uso</h3>
            <p className="text-sm text-emerald-300 font-medium">Sin suscripción</p>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 w-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Pack Básico</span>
                <span className="text-emerald-400 font-bold">€5 → 15 preguntas</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Pack Premium</span>
                <span className="text-emerald-400 font-bold">€10 → 35 preguntas</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              Créditos que no caducan<br/>
              Sin renovación automática
            </p>
          </div>
          
          <div className="mt-4 px-4 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
            <p className="text-xs text-emerald-400 font-semibold text-center">Tú eliges cómo pagar</p>
          </div>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-nflow-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Crear Cuenta</CardTitle>
            <CardDescription className="text-gray-400">
              Únete a NUXA y comienza tu bienestar digital
            </CardDescription>
            
            {/* Privacy Notice */}
            <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-700/50 rounded-lg">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-300/90 text-left leading-relaxed">
                  <span className="font-semibold text-emerald-400">100% Confidencial.</span> Email solo para pago. Sin confirmaciones ni recuperaciones. <span className="font-semibold">Confidencial total, todo entre tú y NUXA.</span>
                </div>
              </div>
            </div>
            
            {/* Mobile Payment Info - Only visible on smaller screens */}
            <div className="lg:hidden mt-4 p-3 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 border border-purple-500/40 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-400 text-xs">ó</span>
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Coins className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-gray-300 text-center text-xs leading-relaxed">
                <span className="text-blue-400 font-semibold">Suscripción mensual</span> con acceso ilimitado, 
                o <span className="text-emerald-400 font-semibold">créditos prepago</span> sin compromiso.
              </p>
              <p className="text-gray-500 text-center text-[10px] mt-1">
                Elige tu opción después de registrarte
              </p>
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
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-nflow-blue"
                />
                <p className="text-xs text-gray-400">Solo para la pasarela de pago. No enviamos correos.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType" className="text-gray-200">
                  Tipo de Cuenta *
                </Label>
                <Select value={formData.userType} onValueChange={(value) => setFormData(prev => ({...prev, userType: value}))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-nflow-blue">
                    <SelectValue placeholder="Selecciona el tipo de cuenta" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="individual" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Usuario Individual
                      </div>
                    </SelectItem>
                    <SelectItem value="business" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Empresa/Organización
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.userType === "individual" && (
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-gray-200">
                    Fecha de Nacimiento *
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-nflow-blue"
                />
                <p className="text-xs text-gray-400">
                  Debes tener al menos 18 años para registrarte
                </p>
                </div>
              )}

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

              <div className="space-y-2">
                <Label htmlFor="referralCode" className="text-gray-200">
                  Código de Referencia (opcional)
                </Label>
                <div className="relative">
                  <Input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    placeholder="Código de partner"
                    value={referralCode}
                    onChange={(e) => updateReferralCode(e.target.value)}
                    readOnly={isFromUrl}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-nflow-blue ${isFromUrl ? 'opacity-75 cursor-not-allowed' : ''}`}
                    data-testid="input-referral-code"
                  />
                  {isValidating && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-4 w-4 border-2 border-nflow-blue border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {!isValidating && isValid === true && (
                    <div className="absolute right-3 top-3 text-green-500">✓</div>
                  )}
                  {!isValidating && isValid === false && (
                    <div className="absolute right-3 top-3 text-red-500">✗</div>
                  )}
                </div>
                {isFromUrl && (
                  <p className="text-xs text-green-400">
                    ✓ Código de referencia aplicado automáticamente
                  </p>
                )}
                {isValid === false && referralCode && (
                  <p className="text-xs text-red-400">
                    El código ingresado no es válido
                  </p>
                )}
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

              {showSuccess && (
                <Alert className="bg-green-900/20 border-green-500/30">
                  <AlertDescription className="text-green-200 text-center">
                    ¡Cuenta creada exitosamente! 
                    <br />
                    Redirigiendo a la página de activación...
                  </AlertDescription>
                </Alert>
              )}

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
    </>
  );
}