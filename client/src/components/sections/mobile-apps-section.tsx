import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Users, Briefcase, Heart, ArrowRight, Download, Star } from "lucide-react";
import { useState } from "react";
import appImage1 from "@assets/image_1749306853621.png";
import appImage2 from "@assets/image_1749306865658.png";

export default function MobileAppsSection() {
  const [activeApp, setActiveApp] = useState(0);

  const appCategories = [
    {
      icon: Heart,
      title: "NFLOW Individual",
      description: "Salud mental personal",
      longDescription: "Terapia personalizada con IA avanzada para el cuidado individual de la salud mental",
      color: "from-nflow-orange to-orange-600",
      bgColor: "bg-nflow-orange/10",
      borderColor: "border-nflow-orange/30",
      features: ["Terapia 24/7", "Seguimiento emocional", "Técnicas personalizadas"]
    },
    {
      icon: Users,
      title: "NFLOW Familiar",
      description: "Bienestar familiar",
      longDescription: "Herramientas especializadas para fortalecer los vínculos familiares y la comunicación",
      color: "from-nflow-blue to-blue-600",
      bgColor: "bg-nflow-blue/10",
      borderColor: "border-nflow-blue/30",
      features: ["Sesiones familiares", "Comunicación asertiva", "Resolución de conflictos"]
    },
    {
      icon: Briefcase,
      title: "JOBDA Personal",
      description: "Selección de talento",
      longDescription: "Evaluación psicológica profesional para procesos de selección y desarrollo de talento",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      features: ["Evaluación psicométrica", "Perfiles de personalidad", "Análisis de competencias"]
    },
    {
      icon: Smartphone,
      title: "NFLOW Laboral",
      description: "Wellness empresarial",
      longDescription: "Soluciones integrales de bienestar mental para equipos y organizaciones",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      features: ["Bienestar corporativo", "Prevención burnout", "Clima laboral"]
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 via-nflow-dark to-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-nflow-orange/5 to-nflow-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-l from-green-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <Badge variant="outline" className="mb-6 border-nflow-orange/30 text-nflow-orange bg-nflow-orange/5 px-4 py-2">
            Ecosistema Completo
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Cuatro Soluciones
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange via-nflow-orange-light to-nflow-blue">
              Especializadas
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Cada aplicación está diseñada con un propósito específico, ofreciendo 
            herramientas y funcionalidades adaptadas a diferentes necesidades.
          </p>
        </div>

        {/* Interactive Apps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* App Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {appCategories.map((app, index) => {
              const Icon = app.icon;
              const isActive = activeApp === index;
              return (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden transition-all duration-500 cursor-pointer group ${
                    isActive 
                      ? `bg-gradient-to-br ${app.bgColor} border-2 ${app.borderColor} scale-105 shadow-2xl` 
                      : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 hover:scale-102'
                  }`}
                  onClick={() => setActiveApp(index)}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">{app.title}</h4>
                    <p className="text-gray-300 mb-4">{app.description}</p>
                    
                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {app.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-400">
                          <Star className="w-3 h-3 text-nflow-orange mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant={isActive ? "default" : "outline"} 
                      size="sm" 
                      className={isActive 
                        ? `bg-gradient-to-r ${app.color} text-white border-none hover:scale-105` 
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </CardContent>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4">
                      <div className={`w-3 h-3 bg-gradient-to-r ${app.color} rounded-full animate-pulse`}></div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Phone Mockup */}
          <div className="relative flex justify-center items-center">
            <div className="relative">
              <div className="transform hover:scale-105 transition-transform duration-700">
                <Card className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                  <CardContent className="p-0">
                    <img 
                      src={activeApp % 2 === 0 ? appImage1 : appImage2} 
                      alt="NFLOW App Interface"
                      className="w-full h-auto object-cover transition-all duration-700"
                    />
                  </CardContent>
                </Card>
              </div>
              
              {/* Floating info */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-xl p-4 min-w-[280px]">
                <h5 className="text-white font-semibold mb-1">{appCategories[activeApp].title}</h5>
                <p className="text-gray-300 text-sm">{appCategories[activeApp].longDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-white mb-6">
            Descarga todas las aplicaciones
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Accede al ecosistema completo NFLOW desde cualquier dispositivo. 
            Sincronización automática y experiencia fluida entre todas las plataformas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light text-white border-none hover:scale-105 transition-transform">
              <Download className="w-5 h-5 mr-2" />
              App Store
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="w-5 h-5 mr-2" />
              Google Play
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}