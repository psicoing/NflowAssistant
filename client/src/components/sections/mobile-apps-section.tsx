import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Users, Briefcase, Heart } from "lucide-react";
import appImage1 from "@assets/image_1749306853621.png";
import appImage2 from "@assets/image_1749306865658.png";

export default function MobileAppsSection() {
  const appCategories = [
    {
      icon: Heart,
      title: "NFLOW Individual",
      description: "Salud mental personal",
      color: "bg-nflow-orange"
    },
    {
      icon: Users,
      title: "NFLOW Familiar",
      description: "Bienestar familiar",
      color: "bg-nflow-blue"
    },
    {
      icon: Briefcase,
      title: "JOBDA Personal",
      description: "Selección de talento",
      color: "bg-yellow-500"
    },
    {
      icon: Smartphone,
      title: "NFLOW Laboral",
      description: "Wellness empresarial",
      color: "bg-green-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-nflow-dark to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nflow-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nflow-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-nflow-orange/30 text-nflow-orange">
            Suite de Aplicaciones
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ecosistema Móvil
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange to-nflow-orange-light">
              NFLOW
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Aplicaciones especializadas que transforman la salud mental y el bienestar 
            en diferentes contextos de la vida
          </p>
        </div>

        {/* Apps Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Phone Mockups */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Card className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-gray-700/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                  <CardContent className="p-0">
                    <img 
                      src={appImage1} 
                      alt="NFLOW Apps Suite"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-500 mt-8">
                <Card className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-gray-700/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                  <CardContent className="p-0">
                    <img 
                      src={appImage2} 
                      alt="NFLOW Interfaces"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* App Categories */}
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Cuatro Soluciones Especializadas
              </h3>
              <p className="text-gray-300 text-lg">
                Cada aplicación está diseñada con un propósito específico, 
                ofreciendo herramientas y funcionalidades adaptadas a diferentes necesidades.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appCategories.map((app, index) => {
                const Icon = app.icon;
                return (
                  <Card key={index} className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105 group">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{app.title}</h4>
                      <p className="text-gray-400 text-sm">{app.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-nflow-orange/30 to-nflow-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-8 h-8 text-nflow-orange" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Multiplataforma</h4>
            <p className="text-gray-300 text-sm">
              iOS y Android con sincronización en tiempo real
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-nflow-blue/30 to-nflow-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-nflow-blue" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">IA Especializada</h4>
            <p className="text-gray-300 text-sm">
              Algoritmos adaptativos para cada contexto
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Colaborativo</h4>
            <p className="text-gray-300 text-sm">
              Equipos multidisciplinarios y seguimiento grupal
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Empresarial</h4>
            <p className="text-gray-300 text-sm">
              Métricas avanzadas y reportes profesionales
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}