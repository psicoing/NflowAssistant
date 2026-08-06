import { useState, useEffect } from "react";
import { X, Mail, Heart, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

const LS_KEY = "nuxa_lead_captured";

interface EmailCaptureGateProps {
  source?: string;
}

export function EmailCaptureGate({ source = "recursos-gratuitos" }: EmailCaptureGateProps) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Mostrar el modal solo si el usuario no ha interactuado antes
    if (!localStorage.getItem(LS_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(LS_KEY, "dismissed");
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Introduce un email válido.");
      return;
    }
    if (!consent) {
      setError("Debes aceptar recibir comunicaciones para continuar.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiRequest("POST", "/api/leads", { email, source, consent });
      localStorage.setItem(LS_KEY, email);
      setDone(true);
      setTimeout(() => setVisible(false), 2200);
    } catch {
      setError("Ha habido un problema. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Gracias!</h3>
            <p className="text-gray-400 text-sm">
              Te hemos enviado un email de bienvenida. Disfruta de los recursos 🧠
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  Mantente al día con NUXA
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  Novedades, recordatorios y recursos exclusivos
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2 mb-6">
              {[
                { icon: Bell, text: "Recordatorios mensuales de bienestar" },
                { icon: Heart, text: "Recursos y guías nuevas antes que nadie" },
                { icon: Shield, text: "Sin spam · Baja cuando quieras con un clic" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500"
                required
              />

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setConsent(!consent)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      consent
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-600 group-hover:border-emerald-500/60"
                    }`}
                  >
                    {consent && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-400 text-xs leading-relaxed">
                  Acepto recibir novedades, recordatorios de NUXA y recursos de bienestar. Puedo darme de baja en cualquier momento.{" "}
                  <a href="/legal/privacidad" className="text-emerald-400 hover:underline" target="_blank">
                    Política de privacidad
                  </a>
                </span>
              </label>

              {error && (
                <p className="text-red-400 text-xs">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2.5 rounded-xl"
              >
                {loading ? "Guardando..." : "Suscribirme a novedades de NUXA"}
              </Button>
            </form>

            {/* Skip */}
            <div className="text-center mt-3">
              <button
                onClick={dismiss}
                className="text-gray-500 hover:text-gray-400 text-xs transition-colors"
              >
                Continuar sin suscribirme
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
