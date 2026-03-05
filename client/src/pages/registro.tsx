import { useState } from "react";
import { Building2, Heart, ArrowRight, Briefcase, Hospital, GraduationCap, Building, Gift, Sparkles, User, Calendar, Star, Zap, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/SEOHead";
import { Link, useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const individualPlans = [
  {
    id: "basic",
    name: "Plan Básico",
    price: "€2.99",
    period: "/mes",
    questions: "10 preguntas/mes",
    color: "from-blue-500 to-blue-700",
    border: "border-blue-200",
    badge: null,
    icon: Calendar,
    features: ["10 preguntas al mes", "Respuestas en +150 idiomas", "Soporte básico 24/7", "Acceso a recursos gratuitos"],
  },
  {
    id: "pro",
    name: "Plan Pro",
    price: "€5.99",
    period: "/mes",
    questions: "20 preguntas/mes",
    color: "from-purple-500 to-indigo-700",
    border: "border-purple-300",
    badge: "Más popular",
    icon: User,
    features: ["20 preguntas al mes", "Respuestas en +150 idiomas", "Soporte prioritario 24/7", "Acceso a todos los recursos", "Historial completo"],
  },
  {
    id: "premium",
    name: "Plan Anual",
    price: "€49",
    period: "/año",
    questions: "200 preguntas/mes",
    color: "from-amber-500 to-orange-600",
    border: "border-amber-300",
    badge: "Ahorra 48%",
    icon: Star,
    features: ["200 preguntas al mes", "Respuestas en +150 idiomas", "Soporte VIP 24/7", "Acceso completo ilimitado", "Historial + exportación", "Equivale a €4.08/mes"],
  },
];

export default function Registro() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
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
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });

        toast({
          title: "Cuenta creada",
          description: "Ahora elige tu plan para activar el acceso.",
        });

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
        title="Acceso a NUXA | Planes Individuales, Sorteo Gratuito y Licencias"
        description="Accede a NUXA con planes individuales desde €2.99/mes, participa en el sorteo mensual gratuito o solicita una licencia corporativa."
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

            {/* Planes individuales */}
            <div className="mb-8">
              <div className="text-center mb-5">
                <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-sm px-4 py-1 mb-3">
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  Para personas individuales
                </Badge>
                <h2 className="text-2xl font-bold text-gray-900">Planes de suscripción</h2>
                <p className="text-gray-500 text-sm mt-1">Crea tu cuenta y elige el plan que mejor se adapte a ti</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-5">
                {individualPlans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <Card
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`border-2 shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${isSelected ? `${plan.border} ring-2 ring-offset-2 ring-purple-400 scale-[1.02]` : "border-gray-200 hover:border-gray-300"}`}
                    >
                      {plan.badge && (
                        <div className="text-center py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600">
                          <span className="text-white text-xs font-semibold tracking-wide">{plan.badge}</span>
                        </div>
                      )}
                      <div className={`bg-gradient-to-br ${plan.color} p-5 text-white text-center`}>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <div className="mt-1">
                          <span className="text-3xl font-extrabold">{plan.price}</span>
                          <span className="text-white/80 text-sm">{plan.period}</span>
                        </div>
                        <p className="text-white/80 text-xs mt-1">{plan.questions}</p>
                      </div>
                      <CardContent className="p-4">
                        <ul className="space-y-1.5 mb-4">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className={`text-center py-2 rounded-lg text-sm font-semibold transition-colors ${isSelected ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                          {isSelected ? "✓ Seleccionado" : "Seleccionar plan"}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Formulario de registro */}
              <Card className="border-2 border-purple-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white text-center">
                  <Zap className="w-6 h-6 mx-auto mb-1" />
                  <h3 className="text-lg font-bold">Crear cuenta y activar plan</h3>
                  <p className="text-purple-100 text-xs mt-0.5">
                    {selectedPlan
                      ? `Plan seleccionado: ${individualPlans.find(p => p.id === selectedPlan)?.name}`
                      : "Selecciona un plan arriba o crea tu cuenta para elegir después"}
                  </p>
                </div>
                <CardContent className="p-5">
                  <form onSubmit={handleRegister} className="grid sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <Label htmlFor="username" className="text-xs text-gray-600 font-medium">Nombre de usuario</Label>
                      <Input
                        id="username"
                        placeholder="Tu nombre de usuario"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="mt-1 h-10"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs text-gray-600 font-medium">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 h-10"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-xs text-gray-600 font-medium">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="mt-1 h-10"
                        minLength={6}
                        required
                      />
                    </div>
                    {error && (
                      <div className="sm:col-span-3">
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">{error}</p>
                      </div>
                    )}
                    <div className="sm:col-span-3">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                      >
                        {isLoading ? "Creando cuenta..." : "Crear cuenta y elegir plan"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <p className="text-xs text-gray-400 text-center mt-2">
                        Al registrarte aceptas nuestra{" "}
                        <Link href="/legal/privacidad" className="underline text-purple-600">política de privacidad</Link>{" "}
                        y el{" "}
                        <Link href="/legal/aviso-legal" className="underline text-purple-600">aviso legal</Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="text-center mt-3">
                <p className="text-sm text-gray-500">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-purple-600 underline font-medium">Iniciar sesión</Link>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 text-sm text-gray-400">o accede de otra forma</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">

              {/* Sorteo */}
              <Card className="border-2 border-emerald-300 shadow-xl overflow-hidden relative group hover:shadow-2xl transition-shadow">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-emerald-500 text-white text-xs px-3 py-1 animate-pulse">
                    <Gift className="w-3 h-3 mr-1" />
                    100% Gratis
                  </Badge>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-9 h-9" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Sorteo Mensual Gratuito</h2>
                  <p className="text-emerald-100 text-sm">Acceso completo durante 30 días</p>
                </div>
                <CardContent className="p-5 bg-gradient-to-b from-emerald-50/50 to-white">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    <strong>¡Puedes acceder gratis sin abonar nada!</strong> Cada mes sorteamos accesos completos 
                    para que cualquier persona pueda experimentar NUXA sin coste alguno.
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {["Chat interactivo ilimitado", "Soporte en +150 idiomas", "Sin tarjeta de crédito", "Sin compromiso alguno"].map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>¿Cómo funciona?</strong> Deja tu correo. Cada mes seleccionamos participantes al azar y les activamos 30 días de acceso completo. Sin spam.
                      </p>
                    </div>
                  </div>

                  <Link href="/sorteo-recursos">
                    <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                      <Gift className="w-5 h-5 mr-2" />
                      Participar en el sorteo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-400 text-center mt-2">Solo necesitas tu correo electrónico</p>
                </CardContent>
              </Card>

              {/* Corporativo */}
              <Card className="border-2 border-blue-200 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-9 h-9" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Licencia Corporativa</h2>
                  <p className="text-blue-100 text-sm">Acceso continuo para organizaciones</p>
                </div>
                <CardContent className="p-5">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Acceso continuo para empresas, entidades públicas, centros de salud y organizaciones educativas.
                  </p>

                  <div className="space-y-2 mb-4">
                    {["Cumple ISO 45003", "Panel de gestión empresarial", "Soporte dedicado", "Planes desde 50.000 usuarios"].map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">✓</span>
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>

                  <a href="https://jobda.org/nuxa-licencias" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                      <Building2 className="w-5 h-5 mr-2" />
                      Información para empresas
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-gray-400 text-center mt-2">Contacto directo con nuestro equipo comercial</p>
                </CardContent>
              </Card>
            </div>

            {/* Anima a tu entorno */}
            <Card className="border border-gray-200 shadow-lg overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    ¿Quieres que tu organización licencie NUXA?
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

                <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                  <p className="text-xs text-gray-500 text-center">
                    <strong>¿Por qué este modelo?</strong> NUXA prioriza la seguridad y el marco legal. 
                    Al operar mediante licencias corporativas garantizamos un entorno controlado y profesional para el bienestar psicológico de los usuarios.
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
