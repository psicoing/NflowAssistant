import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, Globe, Star, Shield, Gift, LogIn, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

const beneficios = [
  {
    icon: DollarSign,
    titulo: "Comisiones Competitivas",
    descripcion: "Gana hasta un 30% de comisión por cada usuario que refiera y se suscriba a nuestros servicios."
  },
  {
    icon: TrendingUp,
    titulo: "Crecimiento Sostenible",
    descripcion: "Accede a un mercado en crecimiento de salud mental digital con demanda constante."
  },
  {
    icon: Shield,
    titulo: "Respaldo Profesional",
    descripcion: "Respaldamos tu trabajo con nuestra experiencia en psicología clínica y tecnología."
  },
  {
    icon: Globe,
    titulo: "Alcance Global",
    descripcion: "Llega a usuarios de habla hispana en todo el mundo con nuestra plataforma."
  }
];

const requisitos = [
  "Experiencia en salud mental, bienestar o áreas relacionadas",
  "Red de contactos interesados en bienestar mental",
  "Compromiso con valores éticos y profesionales",
  "Capacidad para promover servicios de manera responsable"
];

const pasos = [
  {
    numero: "01",
    titulo: "Aplica",
    descripcion: "Completa tu solicitud con tu información profesional y experiencia."
  },
  {
    numero: "02",
    titulo: "Evaluación",
    descripcion: "Revisamos tu perfil y experiencia para asegurar compatibilidad."
  },
  {
    numero: "03",
    titulo: "Activación",
    descripcion: "Recibe tu código único de referido y materiales promocionales."
  },
  {
    numero: "04",
    titulo: "Gana",
    descripcion: "Comienza a referir usuarios y recibe tus comisiones."
  }
];

export default function Partners() {
  const [, setLocation] = useLocation();

  const handleStartRegistration = () => {
    setLocation("/partners/register");
  };
  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-nflow-navy to-nflow-dark py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-nflow-orange rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Programa de
              <span className="text-nflow-blue"> Partners</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Únete a nuestra red de profesionales y ayuda a expandir el acceso a la salud mental digital mientras generas ingresos adicionales.
            </p>
            <Button 
              size="lg" 
              onClick={handleStartRegistration}
              className="bg-nflow-orange hover:bg-nflow-orange-light text-white px-8 py-4 text-lg rounded-xl"
            >
              Solicitar Partnership
            </Button>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Por qué ser Partner de NFLOW?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Únete a una misión importante mientras construyes una fuente de ingresos sostenible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {beneficios.map((beneficio, index) => {
                const IconComponent = beneficio.icon;
                
                return (
                  <Card key={index} className="bg-nflow-navy border-gray-700 hover:border-nflow-blue transition-colors">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-nflow-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-nflow-orange" />
                      </div>
                      <CardTitle className="text-white">{beneficio.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-center">
                        {beneficio.descripcion}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="py-20 bg-nflow-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Cómo Funciona
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Un proceso simple y transparente para convertirte en partner.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pasos.map((paso, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-nflow-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-xl">{paso.numero}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{paso.titulo}</h3>
                  <p className="text-gray-300">{paso.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requisitos */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Requisitos para Partners
              </h2>
              <p className="text-xl text-gray-300">
                Buscamos profesionales comprometidos con la salud mental y el bienestar.
              </p>
            </div>

            <Card className="bg-nflow-navy border-gray-700">
              <CardContent className="p-8">
                <div className="space-y-4">
                  {requisitos.map((requisito, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-nflow-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-300">{requisito}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comisiones */}
        <section className="py-20 bg-gradient-to-r from-nflow-blue to-nflow-orange">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Gift className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Estructura de Comisiones
            </h2>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">15%</div>
                  <div className="text-sm opacity-90">Plan Básico</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">20%</div>
                  <div className="text-sm opacity-90">Plan Grupal</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">30%</div>
                  <div className="text-sm opacity-90">Plan Premium</div>
                </div>
              </div>
            </div>
            <p className="text-xl text-white/90 mb-8">
              Comisiones recurrentes mientras el usuario mantenga su suscripción activa.
            </p>
            <Button 
              size="lg" 
              onClick={handleStartRegistration}
              className="bg-white text-nflow-blue hover:bg-gray-100 px-8 py-4 text-lg rounded-xl"
            >
              Comenzar Ahora
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}