import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Heart, Brain, Users, Clock, Target } from "lucide-react";

const consejosCategorias = [
  {
    categoria: "Ansiedad",
    color: "bg-blue-500",
    icon: Brain,
    consejos: [
      {
        titulo: "Técnica de respiración 4-7-8",
        descripcion: "Inhala durante 4 segundos, mantén la respiración 7 segundos, exhala durante 8 segundos. Repite 3-4 veces.",
        tiempo: "5 min"
      },
      {
        titulo: "Grounding 5-4-3-2-1",
        descripcion: "Identifica 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes oír, 2 que puedes oler, 1 que puedes saborear.",
        tiempo: "3 min"
      }
    ]
  },
  {
    categoria: "Autoestima",
    color: "bg-green-500",
    icon: Heart,
    consejos: [
      {
        titulo: "Diario de logros diarios",
        descripcion: "Cada noche, escribe 3 cosas que hiciste bien durante el día, sin importar lo pequeñas que sean.",
        tiempo: "10 min"
      },
      {
        titulo: "Afirmaciones positivas",
        descripcion: "Repite frases como 'Soy capaz', 'Merezco amor y respeto', 'Estoy creciendo cada día'.",
        tiempo: "5 min"
      }
    ]
  },
  {
    categoria: "Relaciones",
    color: "bg-purple-500",
    icon: Users,
    consejos: [
      {
        titulo: "Comunicación asertiva",
        descripcion: "Expresa tus sentimientos usando 'Yo siento...' en lugar de 'Tú siempre...' para evitar conflictos.",
        tiempo: "Permanente"
      },
      {
        titulo: "Escucha activa",
        descripcion: "Mantén contacto visual, haz preguntas de seguimiento y parafrasea lo que la otra persona dice.",
        tiempo: "Permanente"
      }
    ]
  },
  {
    categoria: "Productividad",
    color: "bg-orange-500",
    icon: Target,
    consejos: [
      {
        titulo: "Técnica Pomodoro",
        descripcion: "Trabaja durante 25 minutos, descansa 5 minutos. Después de 4 ciclos, toma un descanso de 15-30 minutos.",
        tiempo: "25 min"
      },
      {
        titulo: "Regla de 2 minutos",
        descripcion: "Si una tarea toma menos de 2 minutos, hazla inmediatamente en lugar de posponerla.",
        tiempo: "2 min"
      }
    ]
  }
];

export default function Consejos() {
  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-nflow-navy to-nflow-dark py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-nflow-orange rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Consejos de
              <span className="text-nflow-blue"> Bienestar</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Técnicas y estrategias respaldadas por la psicología para mejorar tu bienestar mental y emocional día a día.
            </p>
          </div>
        </section>

        {/* Consejos por Categoría */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {consejosCategorias.map((categoria, index) => {
                const IconComponent = categoria.icon;
                
                return (
                  <div key={categoria.categoria} className="space-y-8">
                    {/* Título de Categoría */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${categoria.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{categoria.categoria}</h2>
                    </div>

                    {/* Grid de Consejos */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {categoria.consejos.map((consejo, consejoIndex) => (
                        <Card key={consejoIndex} className="bg-nflow-navy border-gray-700 hover:border-nflow-blue transition-colors">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-white text-xl">{consejo.titulo}</CardTitle>
                              <Badge variant="secondary" className="bg-nflow-orange/20 text-nflow-orange border-nflow-orange/30">
                                <Clock className="w-3 h-3 mr-1" />
                                {consejo.tiempo}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 leading-relaxed">
                              {consejo.descripcion}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-nflow-blue to-nflow-orange py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Necesitas apoyo personalizado?
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Nuestro asistente de IA está disponible 24/7 para brindarte apoyo y consejos personalizados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/chat" 
                className="bg-white text-nflow-blue px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Iniciar Chat
              </a>
              <a 
                href="/#precios" 
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-nflow-blue transition-colors"
              >
                Ver Planes
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}