import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Star, Trophy, Zap, Calendar, Users, Crown, Heart } from "lucide-react";

const niveles = [
  {
    nivel: "Bronce",
    puntos: 100,
    color: "from-amber-600 to-amber-800",
    icon: Star,
    beneficios: [
      "Descuento del 5% en renovaciones",
      "Acceso a contenido exclusivo semanal",
      "Badge de reconocimiento en perfil"
    ]
  },
  {
    nivel: "Plata",
    puntos: 500,
    color: "from-gray-400 to-gray-600",
    icon: Trophy,
    beneficios: [
      "Descuento del 10% en renovaciones",
      "Sesiones de grupo gratuitas mensuales",
      "Recursos premium adicionales",
      "Prioridad en soporte técnico"
    ]
  },
  {
    nivel: "Oro",
    puntos: 1000,
    color: "from-yellow-400 to-yellow-600",
    icon: Crown,
    beneficios: [
      "Descuento del 15% en renovaciones",
      "Consulta individual gratuita trimestral",
      "Acceso beta a nuevas funciones",
      "Kit de bienestar físico"
    ]
  },
  {
    nivel: "Diamante",
    puntos: 2500,
    color: "from-blue-400 to-purple-600",
    icon: Heart,
    beneficios: [
      "Descuento del 20% en renovaciones",
      "Consulta individual gratuita mensual",
      "Programa de mentoring personalizado",
      "Invitaciones a eventos exclusivos"
    ]
  }
];

const actividades = [
  {
    actividad: "Completar sesión de chat",
    puntos: 10,
    frecuencia: "Diario",
    icon: Zap
  },
  {
    actividad: "Usar técnicas de mindfulness",
    puntos: 15,
    frecuencia: "Diario",
    icon: Heart
  },
  {
    actividad: "Completar evaluación semanal",
    puntos: 50,
    frecuencia: "Semanal",
    icon: Calendar
  },
  {
    actividad: "Referir a un amigo",
    puntos: 100,
    frecuencia: "Ilimitado",
    icon: Users
  },
  {
    actividad: "Compartir testimonio",
    puntos: 75,
    frecuencia: "Mensual",
    icon: Star
  },
  {
    actividad: "Participar en grupo de apoyo",
    puntos: 25,
    frecuencia: "Por sesión",
    icon: Users
  }
];

export default function Recompensas() {
  // Simulamos datos del usuario actual
  const puntosActuales = 750;
  const nivelActual = "Plata";
  const proximoNivel = "Oro";
  const puntosParaProximo = 1000 - puntosActuales;
  const progreso = (puntosActuales / 1000) * 100;

  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-nflow-navy to-nflow-dark py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-nflow-orange rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Programa de
              <span className="text-nflow-blue"> Recompensas</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Gana puntos por cuidar tu bienestar mental y desbloquea beneficios exclusivos en tu viaje hacia una mejor salud mental.
            </p>
          </div>
        </section>

        {/* Estado Actual del Usuario */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-nflow-blue to-nflow-orange border-0 mb-12">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between text-white">
                  <div className="text-center md:text-left mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold mb-2">Tu Progreso</h2>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                        Nivel {nivelActual}
                      </Badge>
                      <span className="text-2xl font-bold">{puntosActuales} puntos</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg mb-2">Próximo nivel: {proximoNivel}</div>
                    <div className="w-64 mb-2">
                      <Progress value={progreso} className="h-3 bg-white/20" />
                    </div>
                    <div className="text-sm opacity-90">{puntosParaProximo} puntos restantes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cómo Ganar Puntos */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Cómo Ganar Puntos
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Cada actividad de bienestar te acerca a mejores recompensas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {actividades.map((actividad, index) => {
                const IconComponent = actividad.icon;
                
                return (
                  <Card key={index} className="bg-nflow-navy border-gray-700 hover:border-nflow-blue transition-colors">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-nflow-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-nflow-orange" />
                      </div>
                      <CardTitle className="text-white text-lg">{actividad.actividad}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-nflow-blue mb-2">
                        +{actividad.puntos} puntos
                      </div>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {actividad.frecuencia}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Niveles y Beneficios */}
        <section className="py-20 bg-nflow-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Niveles de Recompensas
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Cada nivel desbloquea beneficios únicos para potenciar tu experiencia.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {niveles.map((nivel, index) => {
                const IconComponent = nivel.icon;
                const esNivelActual = nivel.nivel === nivelActual;
                
                return (
                  <Card 
                    key={index} 
                    className={`bg-nflow-dark border-2 transition-all duration-300 ${
                      esNivelActual 
                        ? "border-nflow-orange shadow-lg shadow-nflow-orange/20 scale-105" 
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${nivel.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-xl">{nivel.nivel}</CardTitle>
                      <div className="text-nflow-blue font-bold">{nivel.puntos} puntos</div>
                      {esNivelActual && (
                        <Badge className="bg-nflow-orange text-white">Tu nivel actual</Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {nivel.beneficios.map((beneficio, beneficioIndex) => (
                          <div key={beneficioIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-nflow-blue rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300 text-sm">{beneficio}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¡Comienza a Acumular Puntos Hoy!
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Cada paso en tu viaje de bienestar mental te acerca a mejores recompensas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-nflow-orange hover:bg-nflow-orange-light text-white px-8 py-4 text-lg rounded-xl"
              >
                Iniciar Chat
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-nflow-blue text-nflow-blue hover:bg-nflow-blue hover:text-white px-8 py-4 text-lg rounded-xl"
              >
                Ver Mi Progreso
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}