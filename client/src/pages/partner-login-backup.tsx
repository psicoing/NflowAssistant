import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Shield, Users, TrendingUp } from "lucide-react";

export default function PartnerLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/partners/login", formData);
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Login exitoso",
          description: `Bienvenido ${data.partner.contactName}`,
        });
        setLocation("/partners/dashboard");
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Aviso para Nuevos Partners */}
          <div className="lg:mt-8">
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-orange-600" />
                  <CardTitle className="text-xl font-bold text-orange-800">
                    AVISO PARA NUEVOS PARTNERS DE NUXA
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-gray-700 leading-relaxed">
                  Estimadas colaboradoras y colaboradores,
                </p>
                <p className="text-gray-700 leading-relaxed">
                  En tiempos donde proliferan las estafas digitales, los proyectos vacíos de valor real y las alianzas interesadas, el grupo JOBDA ha decidido establecer un criterio claro y ético para formar parte del ecosistema de NUXA, nuestro servicio de salud mental inteligente y consciente.
                </p>
                
                <Alert className="border-orange-200 bg-orange-50">
                  <Shield className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 font-medium">
                    <strong>🔐 Requisito para ser partner oficial de NUXA:</strong>
                  </AlertDescription>
                </Alert>
                
                <p className="text-gray-700 leading-relaxed">
                  Para convertirse en partner del proyecto, será obligatorio adquirir:
                </p>
                
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <p className="font-semibold text-gray-800 mb-2">👉 Dos participaciones, a escoger entre:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Dos SAFE de 4.000 € cada una (modelo legal sin notaría); o bien</li>
                    <li>Dos participaciones notariales de 5.000 € cada una.</li>
                  </ul>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Esta fórmula no es simbólica. Es un filtro ético, profesional y estratégico para:
                </p>
                
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-gray-600">Compromiso real</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-gray-600">Sin oportunismo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-gray-600">Visión de futuro</span>
                  </div>
                </div>
                
                <Alert className="border-green-200 bg-green-50">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>📆 Opción de salida libre al año:</strong><br />
                    A los 12 meses, cualquier partner podrá vender sus participaciones al propio grupo JOBDA o transferirlas a terceros.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gray-900 text-white p-4 rounded-lg text-center">
                  <p className="font-bold mb-2">Con NUXA no jugamos.</p>
                  <p className="text-sm">
                    Esto no es una app más: es una herramienta sensible, potente y hecha para cuidar a millones de personas.<br />
                    Por eso, los que entran, entran de verdad.
                  </p>
                  <p className="text-orange-400 font-semibold mt-2">— Grupo JOBDA</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Login Form */}
          <div className="flex items-center justify-center lg:min-h-screen">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  Acceso Partners
                </CardTitle>
                <CardDescription className="text-center">
                  Inicia sesión en tu cuenta de partner
                </CardDescription>
              </CardHeader>
              <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="partner@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta de partner?{" "}
              <Link href="/partners/register">
                <a className="text-blue-600 hover:underline font-medium">
                  Solicitar acceso
                </a>
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              <Link href="/">
                <a className="text-gray-500 hover:underline">
                  ← Volver al inicio
                </a>
              </Link>
            </p>
          </div>
        </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}