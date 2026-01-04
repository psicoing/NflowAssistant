import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function AccesoMagico() {
  const [, params] = useRoute("/acceso/:token");
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params?.token;
    
    if (!token) {
      setStatus("error");
      setMessage("Token no válido");
      return;
    }

    const validateToken = async () => {
      try {
        // Using POST to prevent CSRF attacks
        const response = await fetch(`/api/auth/magic-link/${token}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage("¡Bienvenido a NUXA!");
          
          await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
          
          setTimeout(() => {
            setLocation("/chat");
          }, 2000);
        } else if (response.status === 410) {
          setStatus("expired");
          setMessage(data.message || "Este enlace ha expirado");
        } else {
          setStatus("error");
          setMessage(data.message || "Link no válido");
        }
      } catch (error) {
        console.error("Error validating magic link:", error);
        setStatus("error");
        setMessage("Error de conexión. Inténtalo de nuevo.");
      }
    };

    validateToken();
  }, [params?.token, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/80 border-gray-700 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white">Verificando acceso...</h2>
              <p className="text-gray-400">Por favor espera un momento</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{message}</h2>
              <p className="text-gray-400">Redirigiendo al chat...</p>
              <div className="flex justify-center">
                <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
              </div>
            </div>
          )}

          {status === "expired" && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Enlace expirado</h2>
              <p className="text-gray-400">{message}</p>
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => setLocation("/login")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  data-testid="button-go-login"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  data-testid="button-go-home"
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Acceso no válido</h2>
              <p className="text-gray-400">{message}</p>
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => setLocation("/login")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  data-testid="button-go-login"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  data-testid="button-go-home"
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
