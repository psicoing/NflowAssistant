import { useState } from "react";
import { useLocation } from "wouter";
import { Building2, Users, Heart, ArrowRight, Briefcase, Hospital, GraduationCap, Building, Gift, Sparkles, UserPlus, Eye, EyeOff, Calendar, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Registro() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedNotice, setAcceptedNotice] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    birthDate: "",
  });
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptedNotice) {
      setError("Debes aceptar el aviso informativo para registrarte.");
      return;
    }

    if (!formData.username || !formData.password || !formData.email || !formData.birthDate) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userType: "individual",
          acceptedNuxaNotice: true,
          noticeVersion: "1.0",
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("userId", data.userId?.toString() || "");
        localStorage.setItem("username", formData.username);
        localStorage.setItem("user_email", formData.email);

        toast({
          title: "Registro completado",
          description: `Bienvenido/a, ${formData.username}. Tu cuenta ha sido creada.`,
        });

        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setLocation("/precios");
      } else {
        setError(data.message || "Error al crear la cuenta.");
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Registro en NUXA | Acceso Individual, Sorteo Gratuito y Licencias"
        description="Regístrate en NUXA como usuario individual, participa en nuestro sorteo mensual gratuito, o solicita una licencia corporativa para tu organización."
        canonicalUrl="/registro"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                ¿Cómo acceder a NUXA?
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Elige la opción que mejor se adapte a ti
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-8">

              <Card className="border-2 border-emerald-300 shadow-xl overflow-hidden relative group hover:shadow-2xl transition-shadow">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-emerald-500 text-white text-xs px-3 py-1 animate-pulse">
                    <Gift className="w-3 h-3 mr-1" />
                    Gratis
                  </Badge>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-5 text-white text-center">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-8 h-8" />
                  </div>
                  <h2 className="text-lg font-bold mb-1">Sorteo Mensual</h2>
                  <p className="text-emerald-100 text-xs">30 días gratis</p>
                </div>
                <CardContent className="p-4 bg-gradient-to-b from-emerald-50/50 to-white">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    <strong>Accede gratis sin abonar nada.</strong> Cada mes sorteamos accesos completos.
                  </p>
                  
                  <div className="space-y-1.5 mb-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-gray-600">Chat ilimitado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-gray-600">Sin tarjeta de crédito</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-gray-600">Sin compromiso</span>
                    </div>
                  </div>

                  <Link href="/sorteo-recursos">
                    <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-all">
                      <Gift className="w-4 h-4 mr-2" />
                      Participar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-400 text-center mt-2">Solo tu correo electrónico</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-300 shadow-xl overflow-hidden relative group hover:shadow-2xl transition-shadow md:order-first md:order-none">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-orange-500 text-white text-xs px-3 py-1">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Individual
                  </Badge>
                </div>
                <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-5 text-white text-center">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h2 className="text-lg font-bold mb-1">Registro Individual</h2>
                  <p className="text-orange-100 text-xs">Para particulares</p>
                </div>
                <CardContent className="p-4">
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div>
                      <Label htmlFor="username" className="text-xs text-gray-600">Usuario</Label>
                      <Input
                        id="username"
                        placeholder="Tu nombre de usuario"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="h-9 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs text-gray-600">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="h-9 text-sm pl-8"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-xs text-gray-600">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="h-9 text-sm pr-9"
                          minLength={6}
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="birthDate" className="text-xs text-gray-600">Fecha de nacimiento</Label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                          className="h-9 text-sm pl-8"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="notice"
                        checked={acceptedNotice}
                        onCheckedChange={(checked) => setAcceptedNotice(checked === true)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="notice" className="text-xs text-gray-500 leading-tight cursor-pointer">
                        Acepto el{" "}
                        <Link href="/legal/aviso-legal" className="text-blue-600 underline">aviso informativo</Link>{" "}
                        y la{" "}
                        <Link href="/legal/privacidad" className="text-blue-600 underline">política de privacidad</Link>
                      </Label>
                    </div>

                    {error && (
                      <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg transition-all"
                    >
                      {isLoading ? "Registrando..." : "Crear cuenta"}
                      <UserPlus className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                  <p className="text-xs text-gray-400 text-center mt-2">Mayores de 18 años</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-5 text-white text-center">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-lg font-bold mb-1">Licencia Corporativa</h2>
                  <p className="text-blue-100 text-xs">Para organizaciones</p>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Acceso continuo para empresas, entidades públicas, centros de salud y organizaciones educativas.
                  </p>

                  <div className="space-y-1.5 mb-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span className="text-gray-600">Cumple ISO 45003</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span className="text-gray-600">Panel de gestión</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span className="text-gray-600">Soporte dedicado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span className="text-gray-600">Desde 50.000 usuarios</span>
                    </div>
                  </div>

                  <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition-all">
                      <Building2 className="w-4 h-4 mr-2" />
                      Info empresas
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-gray-400 text-center mt-2">Equipo comercial</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200 shadow-lg overflow-hidden mb-6">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    ¿Quieres usar NUXA? Solicita a tu entorno que lo licencie
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <Briefcase className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Tu empresa</h4>
                      <p className="text-sm text-gray-600">Recursos Humanos o Prevención de Riesgos Laborales</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <Hospital className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Tu centro de salud</h4>
                      <p className="text-sm text-gray-600">Atención primaria o salud mental</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <GraduationCap className="w-8 h-8 text-purple-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Tu centro educativo</h4>
                      <p className="text-sm text-gray-600">Universidad, instituto o colegio</p>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <Building className="w-8 h-8 text-amber-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Entidad pública</h4>
                      <p className="text-sm text-gray-600">Ayuntamiento, servicios sociales, etc.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                      </div>
                      <h3 className="text-xl font-bold">
                        ¡Anima a tu entorno a activar NUXA!
                      </h3>
                    </div>
                    
                    <p className="text-white/90 mb-4 leading-relaxed">
                      El bienestar psicológico debería ser accesible para todos. Si crees que NUXA puede ayudar 
                      a las personas de tu empresa, centro de salud o comunidad, <strong>¡propónlo!</strong>
                    </p>
                    
                    <div className="bg-white/15 rounded-xl p-4 mb-4">
                      <p className="text-sm font-medium mb-2">💡 Puedes decir algo como:</p>
                      <p className="text-white/90 text-sm italic">
                        "He conocido NUXA, una herramienta de IA para el bienestar emocional. 
                        Creo que podría ser útil para nuestro equipo. ¿Podríamos valorar activarla?"
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <span>✓</span> Reduce el estrés laboral
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <span>✓</span> Apoyo 24/7 en +150 idiomas
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <span>✓</span> Cumple ISO 45003
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center border-t border-gray-200 pt-6">
                  <p className="text-gray-500 text-sm mb-4">
                    ¿Ya tienes una cuenta?
                  </p>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Iniciar sesión
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 p-4 bg-gray-100 rounded-xl">
                  <p className="text-xs text-gray-500 text-center">
                    <strong>¿Por qué este modelo?</strong> NUXA prioriza la seguridad y el marco legal. 
                    Al operar mediante licencias corporativas, garantizamos un entorno controlado y 
                    profesional para el bienestar psicológico de los usuarios.
                  </p>
                </div>
              </CardContent>
            </Card>
            
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
