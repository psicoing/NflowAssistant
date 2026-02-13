import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Brain, Globe, BookOpen, Puzzle, Mail, Heart, CheckCircle, Gift } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SorteoRecursos() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const sorteoMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/sorteo", { email, source: "recursos_gratuitos" });
      return res.json();
    },
    onSuccess: (data) => {
      setSubmitted(true);
      toast({
        title: data.alreadyRegistered ? "Ya participas" : "¡Inscripción completada!",
        description: data.message,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar tu participación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      sorteoMutation.mutate(email);
    }
  };

  const benefits = [
    { icon: Brain, text: "Chat interactivo ilimitado" },
    { icon: Globe, text: "Soporte en múltiples idiomas" },
    { icon: BookOpen, text: "Recursos psicológicos guiados" },
    { icon: Puzzle, text: "Herramientas prácticas para el día a día" },
  ];

  const commitments = [
    "Confirmar tu participación",
    "Avisarte si eres seleccionado/a",
    "Informarte de futuras convocatorias",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <SEOHead
        title="Sorteo NUXA - Accede gratis 1 mes | Salud Mental Digital"
        description="Participa en el sorteo mensual de NUXA y accede gratis durante 30 días a todas las herramientas de bienestar emocional."
        ogTitle="Sorteo NUXA - 1 Mes Gratis"
        ogDescription="Sorteamos accesos completos de 30 días para experimentar todo el potencial de NUXA."
        canonicalUrl="https://nuxa.life/sorteo-recursos"
      />
      <Header />

      <main className="pt-20">
        <section className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-5 py-2 mb-6">
              <Gift className="w-5 h-5 text-pink-400" />
              <span className="text-pink-300 font-medium text-sm">Sorteo Mensual</span>
            </div>

            <div className="flex justify-center mb-6">
              <span className="text-5xl">💌</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Accede a NUXA{" "}
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                gratis durante 1 mes
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              En NUXA creemos que la salud mental no debería ser un lujo.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-8 mb-8">
            <p className="text-gray-300 text-center mb-6 leading-relaxed">
              De forma periódica, sorteamos accesos completos de <strong className="text-white">30 días</strong> para que puedas experimentar todo el potencial del asistente:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                  <b.icon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{b.text}</span>
                </div>
              ))}
            </div>

            {!submitted ? (
              <>
                <p className="text-gray-400 text-sm text-center mb-2">
                  Si quieres participar en el sorteo, déjanos tu correo electrónico.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 h-12"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sorteoMutation.isPending}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold h-12 px-6 rounded-lg"
                  >
                    {sorteoMutation.isPending ? "Enviando..." : "Entrar en el sorteo"}
                    <Mail className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                <div className="space-y-2 mb-6">
                  <p className="text-gray-500 text-xs text-center">Solo lo utilizaremos para:</p>
                  {commitments.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 justify-center">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-gray-500 text-xs">{c}</span>
                    </div>
                  ))}
                </div>

                <p className="text-center text-gray-600 text-xs italic">
                  Nada de spam. Nada de ventas agresivas. Solo acceso a bienestar real.
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <p className="text-white font-semibold text-lg mb-2">¡Estás en el sorteo!</p>
                <p className="text-gray-400 text-sm">Te avisaremos si eres seleccionado/a. Mucha suerte.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation("/recursos")}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg shadow-emerald-500/20"
            >
              <Heart className="w-5 h-5 mr-2" />
              Acceder a los recursos gratuitos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="text-center text-gray-600 text-xs mt-4">
            No es necesario participar en el sorteo para acceder a los recursos gratuitos.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}