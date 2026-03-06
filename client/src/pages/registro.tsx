import { ArrowRight, Gift, Sparkles, User, Building2, Heart, Briefcase, GraduationCap, Building, Hospital, CheckCircle, ExternalLink, ShieldCheck, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const PLANES_INDIVIDUAL = [
  { id: "basico", label: "Plan Básico", price: "€2.99/mes" },
  { id: "pro",    label: "Plan Pro",    price: "€5.99/mes" },
  { id: "anual",  label: "Plan Anual",  price: "€32/año"   },
];

const PLANES_MEDIANA = [
  { id: "empresa_100", label: "100 trabajadores", price: "€5.000/año"  },
  { id: "empresa_200", label: "200 trabajadores", price: "€10.000/año" },
  { id: "empresa_300", label: "300 trabajadores", price: "€15.000/año" },
];


export default function Registro() {
  // Individual plan form state
  const [form, setForm] = useState({ nombre: "", apellidos: "", email: "", plan: "basico" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ skrillLink: string } | null>(null);
  const [error, setError] = useState("");

  // Empresa licitacion form state
  const [eForm, setEForm] = useState({ empresa: "", nombre: "", apellidos: "", email: "" });
  const [eLoading, setELoading] = useState(false);
  const [eResult, setEResult] = useState(false);
  const [eError, setEError] = useState("");

  // Mediana empresa form state
  const [mForm, setMForm] = useState({ empresa: "", nombre: "", apellidos: "", email: "", plan: "empresa_100" });
  const [mLoading, setMLoading] = useState(false);
  const [mResult, setMResult] = useState<{ skrillLink: string } | null>(null);
  const [mError, setMError] = useState("");

  const [skrillModalOpen, setSkrillModalOpen] = useState(false);

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

  async function handleEmpresaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEError("");
    setELoading(true);
    try {
      const res = await apiRequest("POST", "/api/registro-empresa", eForm);
      const data = await res.json();
      if (data.success) {
        setEResult(true);
      } else {
        setEError(data.message || "Error al procesar la solicitud");
      }
    } catch {
      setEError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setELoading(false);
    }
  }

  async function handleMedianaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMError("");
    setMLoading(true);
    try {
      const res = await apiRequest("POST", "/api/registro-empresa-media", mForm);
      const data = await res.json();
      if (data.success) {
        setMResult({ skrillLink: data.skrillLink });
      } else {
        setMError(data.message || "Error al procesar la solicitud");
      }
    } catch {
      setMError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setMLoading(false);
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

            {/* Planes empresa - formulario */}
            <Card className="border-2 border-blue-200 shadow-xl overflow-hidden mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60" />
              <CardContent className="relative p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-xl font-bold text-gray-900">Planes para empresas y organizaciones</h2>
                      <div className="inline-flex items-center gap-1 bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        ACTIVO
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Licencias corporativas · ISO 45003 · Panel de gestión</p>
                  </div>
                </div>

                {eResult ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud recibida!</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-left">
                      <p className="text-amber-800 text-sm font-semibold mb-1">⏱ Te contactamos en 24 horas</p>
                      <p className="text-amber-700 text-xs leading-relaxed">
                        Tu solicitud de licitación ha sido registrada. Nos pondremos en contacto contigo en un plazo máximo de <strong>24 horas</strong> para iniciar el proceso.
                      </p>
                    </div>
                    <a href="https://jobda.org/nuxa-licencias" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg">
                        <Building2 className="w-4 h-4 mr-2" />
                        Iniciar licitación ahora
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleEmpresaSubmit} className="space-y-4">
                    {/* Licitaciones badge */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-blue-900 font-bold text-sm">Licitaciones a partir de 40.000 trabajadores</p>
                        <p className="text-blue-600 text-xs">Proceso oficial de contratación pública y privada · ISO 45003</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="empresa" className="text-sm font-medium text-gray-700">Nombre de la organización</Label>
                      <Input
                        id="empresa"
                        placeholder="Nombre de tu empresa u organización"
                        value={eForm.empresa}
                        onChange={e => setEForm(f => ({ ...f, empresa: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="e-nombre" className="text-sm font-medium text-gray-700">Nombre contacto</Label>
                        <Input
                          id="e-nombre"
                          placeholder="Tu nombre"
                          value={eForm.nombre}
                          onChange={e => setEForm(f => ({ ...f, nombre: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="e-apellidos" className="text-sm font-medium text-gray-700">Apellidos</Label>
                        <Input
                          id="e-apellidos"
                          placeholder="Tus apellidos"
                          value={eForm.apellidos}
                          onChange={e => setEForm(f => ({ ...f, apellidos: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="e-email" className="text-sm font-medium text-gray-700">Correo de contacto</Label>
                      <Input
                        id="e-email"
                        type="email"
                        placeholder="contacto@organizacion.com"
                        value={eForm.email}
                        onChange={e => setEForm(f => ({ ...f, email: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    {eError && (
                      <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{eError}</p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={eLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                    >
                      {eLoading ? "Procesando..." : (
                        <>
                          Solicitar información de licitación
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                      Te contactamos en menos de 24h · Proceso totalmente gratuito
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Planes mediana empresa */}
            <Card className="border-2 border-indigo-200 shadow-xl overflow-hidden mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-60" />
              <CardContent className="relative p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-xl font-bold text-gray-900">Planes para empresas y organizaciones medias</h2>
                      <div className="inline-flex items-center gap-1 bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        ACTIVO
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Hasta 300 trabajadores · ISO 45003 · Panel de gestión</p>
                  </div>
                </div>

                {mResult ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud recibida!</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-left">
                      <p className="text-amber-800 text-sm font-semibold mb-1">⏱ Activación en 24 horas</p>
                      <p className="text-amber-700 text-xs leading-relaxed">
                        Tu solicitud ha sido registrada. Recibirás un correo de activación en un plazo máximo de <strong>24 horas</strong> con tus credenciales de acceso a NUXA. Mientras tanto, puedes completar el pago:
                      </p>
                    </div>
                    <a href={mResult.skrillLink} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold shadow-lg">
                        Pagar con Skrill
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleMedianaSubmit} className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Elige tu plan</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {PLANES_MEDIANA.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setMForm(f => ({ ...f, plan: p.id }))}
                            className={`border-2 rounded-xl p-3 text-center transition-all cursor-pointer ${
                              mForm.plan === p.id
                                ? "border-indigo-500 bg-indigo-100 shadow-sm"
                                : "border-gray-200 bg-white hover:border-indigo-300"
                            }`}
                          >
                            <div className="font-semibold text-gray-900 text-xs">{p.label}</div>
                            <div className="text-indigo-600 font-bold text-sm">{p.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="m-empresa" className="text-sm font-medium text-gray-700">Nombre de la empresa</Label>
                      <Input
                        id="m-empresa"
                        placeholder="Nombre de tu organización"
                        value={mForm.empresa}
                        onChange={e => setMForm(f => ({ ...f, empresa: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="m-nombre" className="text-sm font-medium text-gray-700">Nombre contacto</Label>
                        <Input
                          id="m-nombre"
                          placeholder="Tu nombre"
                          value={mForm.nombre}
                          onChange={e => setMForm(f => ({ ...f, nombre: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="m-apellidos" className="text-sm font-medium text-gray-700">Apellidos</Label>
                        <Input
                          id="m-apellidos"
                          placeholder="Tus apellidos"
                          value={mForm.apellidos}
                          onChange={e => setMForm(f => ({ ...f, apellidos: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="m-email" className="text-sm font-medium text-gray-700">Correo de contacto</Label>
                      <Input
                        id="m-email"
                        type="email"
                        placeholder="contacto@empresa.com"
                        value={mForm.email}
                        onChange={e => setMForm(f => ({ ...f, email: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>

                    {mError && (
                      <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{mError}</p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={mLoading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold shadow-lg"
                    >
                      {mLoading ? "Procesando..." : (
                        <>
                          Recibir enlace de pago Skrill
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                      Activación en 24h · Sin permanencia · Cancela cuando quieras
                    </p>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setSkrillModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#6B2D8B] hover:bg-[#5a2575] text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Skrill 100% seguro
                      </button>
                    </div>
                  </form>
                )}
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
                    <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud recibida!</h3>

                    {/* 24h activation notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-left">
                      <p className="text-amber-800 text-sm font-semibold mb-1">⏱ Activación en 24 horas</p>
                      <p className="text-amber-700 text-xs leading-relaxed">
                        Tu solicitud ha sido registrada. Recibirás un correo de activación en un plazo máximo de <strong>24 horas</strong> con tus credenciales de acceso a NUXA. Mientras tanto, puedes completar el pago:
                      </p>
                    </div>

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
                        {PLANES_INDIVIDUAL.map(p => (
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

                    {/* Skrill security badge */}
                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => setSkrillModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#6B2D8B] hover:bg-[#5a2575] text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Skrill 100% seguro
                      </button>
                    </div>
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

      {/* Skrill legal info modal */}
      <Dialog open={skrillModalOpen} onOpenChange={setSkrillModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#6B2D8B]">
              <ShieldCheck className="w-5 h-5" />
              Información legal de Skrill
            </DialogTitle>
          </DialogHeader>
          <div className="bg-[#4a1a6e] rounded-xl p-5 mt-2">
            <p className="text-white text-sm leading-relaxed">
              Copyright 2024 Paysafe Holdings UK Limited. Todos los derechos reservados. Skrill® es una marca registrada de Paysafe Holdings UK Limited. Paysafe Payment Solutions Limited está registrada en Irlanda con el número de empresa 626665 y su domicilio social se encuentra en 70 Sir John Rogerson's Quay, Dublín 2, D02 R296, Irlanda, operando como Skrill, Skrill Money Transfer, Rapid Transfer y Skrill Quick Checkout. Paysafe Payment Solutions Limited está autorizada por el Banco Central de Irlanda (Registro: C184986) según los Reglamentos de las Comunidades Europeas (Dinero electrónico) de 2011 para la emisión de dinero electrónico e instrumentos de pago. Paysafe Payment Solutions Limited está autorizada como Proveedora de Servicios de Criptoactivos por el Banco Central de Irlanda.
            </p>
          </div>
          <div className="flex justify-center mt-2">
            <a href="https://www.skrill.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#6B2D8B] underline hover:text-[#5a2575]">
              www.skrill.com
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
