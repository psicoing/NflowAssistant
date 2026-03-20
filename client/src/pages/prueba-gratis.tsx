import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/SEOHead";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, CheckCircle, Sparkles, Lock, ArrowRight, CalendarClock, Trophy } from "lucide-react";

export default function PruebaGratis() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cupoLleno, setCupoLleno] = useState(false);
  const [checkingCupo, setCheckingCupo] = useState(true);

  useEffect(() => {
    fetch("/api/prueba-gratis/estado")
      .then((r) => r.json())
      .then((data) => {
        if (data.cupoLleno) setCupoLleno(true);
      })
      .catch(() => {})
      .finally(() => setCheckingCupo(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("POST", "/api/prueba-gratis", form);
      // Auto-create a conversation so user lands directly in the chat
      try {
        const conv = await apiRequest("POST", "/api/conversations", { title: "Mi primera consulta" });
        const data = await conv.json();
        setLocation(`/chat/${data.id}`);
      } catch {
        setLocation("/chat");
      }
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("429")) {
        setCupoLleno(true);
      } else if (msg.includes("409") || msg.toLowerCase().includes("exist")) {
        setError("Ese nombre de usuario ya está en uso. Elige otro.");
      } else {
        setError("Ha ocurrido un error. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextMonthName = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleString("es-ES", { month: "long" });
  };

  return (
    <>
      <SEOHead
        title="Prueba NUXA gratis – 2 consultas sin coste"
        description="Accede a una prueba gratuita de NUXA con 2 preguntas al asistente de salud mental con IA. Sin tarjeta de crédito."
        canonicalUrl="/prueba-gratis"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center px-4 py-16">

        <div className="w-full max-w-md">

          {checkingCupo ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Comprobando disponibilidad…</p>
            </div>
          ) : cupoLleno ? (
            /* ── CUPO LLENO ── */
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-9 h-9 text-amber-400" />
              </div>

              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wide">
                <CalendarClock className="w-3.5 h-3.5" />
                Entradas agotadas este mes
              </div>

              <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                Este mes hemos regalado<br />
                <span className="text-amber-400">250 pruebas gratuitas</span>
              </h1>

              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Las 250 entradas de este mes ya han sido reclamadas. Prueba suerte en{" "}
                <span className="text-white font-medium capitalize">{nextMonthName()}</span>, o regístrate ahora y disfruta de muchos planes adaptados a tu economía.
              </p>

              <div className="space-y-3 mb-8">
                <a
                  href="/registro/planes"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
                >
                  Ver planes desde €2.99
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLocation("/")}
                  className="w-full text-slate-400 hover:text-slate-300 text-sm py-2 transition-colors"
                >
                  Volver al inicio
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Por qué elegir un plan</p>
                <ul className="space-y-2.5">
                  {[
                    "Desde €2.99 al mes — sin permanencia",
                    "10 a 100 consultas mensuales según tu plan",
                    "Acceso inmediato sin esperar al mes siguiente",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* ── FORMULARIO NORMAL ── */
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Acceso de prueba gratuito
                </div>
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                  Prueba NUXA gratis
                </h1>
                <p className="text-slate-400 text-base leading-relaxed">
                  Crea tu cuenta en segundos y realiza tus primeras 2 consultas sin coste.
                </p>
              </div>

              {/* What you get */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Incluye en la prueba</p>
                <ul className="space-y-2.5">
                  {[
                    "2 consultas gratuitas al asistente IA",
                    "Respuestas en más de 150 idiomas",
                    "Acceso inmediato, sin tarjeta de crédito",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-400">
                    Tras las 2 consultas gratuitas, el acceso queda limitado. Podrás continuar con un plan de pago adaptado a tu perfil.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-slate-300 text-sm mb-1.5 block">
                      Nombre de usuario
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="mi_usuario"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-indigo-400"
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-slate-300 text-sm mb-1.5 block">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-indigo-400"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-slate-300 text-sm mb-1.5 block">
                      Contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-indigo-400"
                      autoComplete="new-password"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span className="animate-pulse">Creando tu acceso...</span>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        Empezar prueba gratuita
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-slate-500 mt-4">
                  Al registrarte aceptas nuestros{" "}
                  <a href="/legal/terminos" className="underline hover:text-slate-400">términos de uso</a>
                  {" "}y{" "}
                  <a href="/legal/privacidad" className="underline hover:text-slate-400">política de privacidad</a>.
                </p>
              </div>

              {/* Already have account */}
              <p className="text-center text-sm text-slate-500 mt-5">
                ¿Ya tienes cuenta?{" "}
                <button onClick={() => setLocation("/login")} className="text-indigo-400 hover:text-indigo-300 underline">
                  Inicia sesión
                </button>
              </p>
            </>
          )}

        </div>
      </div>
    </>
  );
}
