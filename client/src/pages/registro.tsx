import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, User, ShieldCheck, RefreshCw, Coins, Brain } from "lucide-react";
import { useReferralCode } from "@/hooks/useReferralCode";
import { SEOHead } from "@/components/SEOHead";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function Registro() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    birthDate: ""
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState({ username: "", password: "" });
  const [acceptedNotice, setAcceptedNotice] = useState(false);
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState(false);
  const [showFreeAccessInfo, setShowFreeAccessInfo] = useState(false);
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

    if (!acceptedNotice) {
      setError("Debes aceptar el Aviso sobre NUXA para continuar");
      setIsLoading(false);
      return;
    }

    // Validación de fecha de nacimiento
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
          birthDate: formData.birthDate,
          userType: "individual",
          referralCode: referralCode.trim() || null,
          acceptedNuxaNotice: true,
          noticeVersion: "enero-2026"
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
                  <span className="font-semibold text-emerald-400">100% Confidencial.</span> Email solo para pago. No enviamos confirmaciones ni correos de recuperación. <span className="font-semibold">Todo queda entre tú y NUXA.</span>
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

          {/* Acceso Gratuito Banner */}
          <div className="px-4 sm:px-6 pt-3 sm:pt-4">
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/40 rounded-lg p-3 sm:p-4">
              <button
                type="button"
                onClick={() => setShowFreeAccessInfo(!showFreeAccessInfo)}
                className="w-full flex items-center justify-between text-left gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                  <span className="text-emerald-300 font-medium text-sm sm:text-base">¿Tienes acceso gratuito?</span>
                </div>
                <span className="text-emerald-400 text-sm flex-shrink-0">{showFreeAccessInfo ? '▲' : '▼'}</span>
              </button>
              
              {showFreeAccessInfo && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-emerald-500/20 space-y-2 sm:space-y-3">
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    Si tu <span className="text-emerald-400 font-medium">empresa</span>, <span className="text-emerald-400 font-medium">mutua</span> o <span className="text-emerald-400 font-medium">administración pública</span> te ha dado acceso gratuito a NUXA, ya te habrán proporcionado tus códigos de acceso (usuario y contraseña).
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    No necesitas registrarte. Ve directamente a iniciar sesión.
                  </p>
                  <Button
                    type="button"
                    onClick={() => setLocation("/login")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    Ir a Iniciar Sesión
                  </Button>
                </div>
              )}
            </div>
          </div>

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

              <div className="flex items-start space-x-3 pt-4 border-t border-gray-600">
                <Checkbox 
                  id="acceptNotice" 
                  checked={acceptedNotice}
                  onCheckedChange={(checked) => setAcceptedNotice(checked === true)}
                  className="mt-0.5 border-gray-500 data-[state=checked]:bg-nflow-blue data-[state=checked]:border-nflow-blue"
                />
                <label htmlFor="acceptNotice" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                  He leído y acepto el{" "}
                  <button
                    type="button"
                    onClick={() => setIsLegalNoticeOpen(true)}
                    className="text-nflow-blue hover:underline font-medium"
                  >
                    Aviso sobre NUXA
                  </button>
                  {" "}y el carácter orientativo, preventivo y no asistencial de la plataforma.
                </label>
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

    <Dialog open={isLegalNoticeOpen} onOpenChange={setIsLegalNoticeOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-gray-800 border-gray-700">
        <DialogHeader className="pb-4 border-b border-gray-700">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>AVISO SOBRE NUXA</span>
              <span className="block text-xs font-normal text-gray-400">Actualización: enero 2026</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4 space-y-6 text-gray-300">
          <p className="leading-relaxed">
            <strong className="text-white">NUXA</strong> es una plataforma de software de orientación y apoyo emocional, diseñada con fines preventivos e informativos.
          </p>
          
          <p className="leading-relaxed">
            NUXA <strong className="text-white">no presta asistencia sanitaria</strong>, no constituye una consulta psicológica ni médica, y no sustituye en ningún caso la evaluación, el diagnóstico o el tratamiento por parte de profesionales cualificados.
          </p>
          
          <p className="leading-relaxed">
            La plataforma permite a los usuarios reflexionar, orientarse y acceder a recursos de apoyo emocional, así como interactuar con funcionalidades digitales (texto y voz, como medios de interacción digital) destinadas a mejorar la comprensión del propio estado emocional y facilitar la orientación temprana.
          </p>
          
          <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4">
            <p className="text-amber-200 font-medium">
              El uso de NUXA tiene un carácter <strong>no asistencial, no clínico y no terapéutico</strong>.
            </p>
            <p className="text-amber-300/80 text-sm mt-2">
              En situaciones de malestar intenso, riesgo para la salud o emergencia, se recomienda acudir a los servicios sanitarios correspondientes o contactar con profesionales de referencia.
            </p>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <h4 className="font-bold text-white mb-3">Uso por empresas, mutuas y entidades</h4>
            <p className="leading-relaxed mb-3">
              NUXA se ofrece a empresas, mutuas, aseguradoras y otras entidades en régimen de licencia o arrendamiento de software.
            </p>
            <p className="leading-relaxed mb-3">
              El licenciante pone a disposición del licenciatario una herramienta digital de orientación y apoyo psicoemocional de carácter preventivo e informativo. El uso de la plataforma no constituye acto sanitario, ni implica la prestación de servicios clínicos, médicos o psicológicos directos por parte del licenciante.
            </p>
            <p className="leading-relaxed">
              La integración de NUXA en programas de bienestar, prevención o apoyo psicosocial no sustituye los circuitos asistenciales propios de cada entidad, ni la intervención profesional cuando esta sea necesaria.
            </p>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <p className="leading-relaxed font-semibold text-white text-center italic">
              NUXA actúa exclusivamente como herramienta digital de orientación preventiva.
            </p>
          </div>
          
          <div className="text-center pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Última actualización del aviso: enero 2026
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}