import { ArrowRight, Gift, Sparkles, User, Building2, Heart, Briefcase, GraduationCap, Building, Hospital, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const PLANES = [
  { id: "basico", label: "Plan Básico", price: "€2.99/mes", color: "border-purple-300 bg-purple-50 text-purple-700" },
  { id: "pro",    label: "Plan Pro",    price: "€5.99/mes", color: "border-indigo-300 bg-indigo-50 text-indigo-700" },
  { id: "anual",  label: "Plan Anual",  price: "€32/año",   color: "border-blue-300 bg-blue-50 text-blue-700" },
];

export default function Registro() {
  const [form, setForm] = useState({ nombre: "", apellidos: "", email: "", plan: "basico" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ skrillLink: string } | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/registro-individual", form);
      const data = await res.json();
      if (data.success) {
        setResult({ skrillLink: data.skrillLink });
      } else {
        setError(data.message || "Error al procesar la solicitud");
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

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

            {/* Planes empresa - ACTIVO arriba del todo */}
            <Card className="border-2 border-blue-200 shadow-xl overflow-hidden mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60" />
              <CardContent className="relative p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-9 h-9 text-white" />
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold text-sm px-5 py-2 rounded-full shadow-lg animate-pulse mb-4">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  ACTIVO
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Planes para empresas y organizaciones
                </h2>
                <p className="text-gray-600 text-base max-w-lg mx-auto leading-relaxed mb-5">
                  Muy pronto podrás contratar NUXA directamente para tu organización. Licencias corporativas 
                  con panel de gestión, cumplimiento <strong>ISO 45003</strong> y soporte dedicado.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-blue-100">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span className="text-gray-600">Plan Profesional €149.50/mes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-blue-100">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span className="text-gray-600">Plan Empresarial €598/mes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-blue-100">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span className="text-gray-600">Plan Corporativo a medida</span>
                  </div>
                </div>
                <a href="https://jobda.org/nuxa-licencias" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 font-semibold shadow-lg">
                    <Building2 className="w-5 h-5 mr-2" />
                    Licitar software NUXA
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Planes individuales - mini formulario */}
            <Card className="border-2 border-purple-200 shadow-xl overflow-hidden mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-60" />
              <CardContent className="relative p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Planes individuales para personas</h2>
                    <p className="text-sm text-gray-500">Apoyo emocional con IA, 24/7 en +150 idiomas</p>
                  </div>
                </div>

                {result ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud recibida!</h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Hemos enviado un enlace de pago a tu correo. También puedes pagar directamente aquí:
                    </p>
                    <a href={result.skrillLink} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg">
                        Pagar con Skrill
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                    <p className="text-xs text-gray-400 mt-4">
                      ¿Ya tienes cuenta?{" "}
                      <Link href="/login" className="text-purple-600 underline font-medium">Iniciar sesión</Link>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Plan selector */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Elige tu plan</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {PLANES.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, plan: p.id }))}
                            className={`border-2 rounded-xl p-3 text-center transition-all cursor-pointer ${
                              form.plan === p.id
                                ? "border-purple-500 bg-purple-100 shadow-sm"
                                : "border-gray-200 bg-white hover:border-purple-300"
                            }`}
                          >
                            <div className="font-semibold text-gray-900 text-sm">{p.label}</div>
                            <div className="text-purple-600 font-bold text-base">{p.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre</Label>
                        <Input
                          id="nombre"
                          placeholder="Tu nombre"
                          value={form.nombre}
                          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="apellidos" className="text-sm font-medium text-gray-700">Apellidos</Label>
                        <Input
                          id="apellidos"
                          placeholder="Tus apellidos"
                          value={form.apellidos}
                          onChange={e => setForm(f => ({ ...f, apellidos: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    {error && (
                      <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                    >
                      {loading ? "Procesando..." : (
                        <>
                          Recibir enlace de pago Skrill
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                      Recibirás un email con el enlace de pago. Sin permanencia. Cancela cuando quieras.
                      {" · "}
                      <Link href="/login" className="text-purple-600 underline">Ya tengo cuenta</Link>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 text-sm text-gray-400">o accede de otra forma</span>
              </div>
            </div>

            {/* Sorteo - ancho completo */}
            <div className="max-w-xl mx-auto mb-10">
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
            </div>

            {/* ¿Quieres que tu organización licencie NUXA? */}
            <Card className="border border-gray-200 shadow-lg overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    ¿Quieres que tu organización licencie NUXA?
                  </h3>
                  <p className="text-sm text-gray-500 mb-5">Habla con el responsable de tu organización para que contrate NUXA y toda tu comunidad tenga acceso.</p>
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

                <div className="mt-5 p-4 bg-gray-100 rounded-xl">
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
