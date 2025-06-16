import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Users, Briefcase, Heart, ArrowRight, Download, Sparkles } from "lucide-react";
import { useState } from "react";
import appImage1 from "@assets/image_1749306853621.png";
import appImage2 from "@assets/image_1749306865658.png";

export default function MobileAppsSection() {
  const [activeApp, setActiveApp] = useState(1); // Set INS NEURONMEG as default active

  const appCategories = [
    {
      icon: Heart,
      title: "NFLOW Familias",
      description: "Bienestar familiar",
      longDescription: "Herramientas especializadas para fortalecer los vínculos familiares y la comunicación",
      color: "from-nflow-blue to-blue-600",
      bgColor: "bg-nflow-blue/10",
      borderColor: "border-nflow-blue/30",
      features: ["Sesiones familiares", "Comunicación asertiva", "Resolución de conflictos"]
    },
    {
      icon: Briefcase,
      title: "INS NEURONMEG",
      description: "Psicología del Futuro",
      longDescription: "Instituto de psicología especializado en consultas presenciales, a domicilio y por videollamada con métodos innovadores",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      features: ["Consultas presenciales", "Visitas a domicilio", "Videollamadas"]
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
    },
    {
      icon: Users,
      title: "NFLOW Adultos",
      description: "Salud mental adulta",
      longDescription: "Terapia personalizada con IA avanzada para el cuidado individual de la salud mental en adultos",
      color: "from-nflow-orange to-orange-600",
      bgColor: "bg-nflow-orange/10",
      borderColor: "border-nflow-orange/30",
      features: ["Terapia 24/7", "Seguimiento emocional", "Técnicas personalizadas"]
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
            <Sparkles className="w-4 h-4 mr-2" />
            Ecosistema Completo
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Cuatro Soluciones
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange via-nflow-orange-light to-nflow-blue">
              Especializadas
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Cada solución está diseñada con un propósito específico, ofreciendo 
            herramientas y funcionalidades adaptadas a diferentes grupos de edad y necesidades.
          </p>
        </div>

        {/* Modern Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {appCategories.map((app, index) => {
            const Icon = app.icon;
            const isActive = activeApp === index;
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-all duration-500 cursor-pointer group h-[400px] ${
                  isActive 
                    ? 'bg-gradient-to-br from-gray-800/95 via-gray-700/90 to-gray-800/95 border-2 border-nflow-orange/50 shadow-2xl shadow-nflow-orange/20 scale-105' 
                    : 'bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 border border-gray-700/40 hover:border-gray-600/60 hover:shadow-xl hover:shadow-nflow-orange/10 hover:-translate-y-1'
                }`}
                onClick={() => setActiveApp(index)}
              >
                {/* Gradient overlay que aparece on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${app.bgColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                
                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${app.color} opacity-10 rounded-bl-[80px]`}></div>
                
                <CardContent className="relative p-8 h-full flex flex-col justify-between">
                  {/* Top section - Icon and title */}
                  <div>
                    <div className="mb-6 relative">
                      <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                      </div>
                      
                      {/* Floating accent dots */}
                      <div className={`absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br ${app.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce delay-100`}></div>
                      <div className={`absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br ${app.color} rounded-full opacity-0 group-hover:opacity-70 transition-all duration-300 animate-bounce delay-200`}></div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                      {app.title}
                    </h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {app.description}
                    </p>
                  </div>

                  {/* Middle section - Features */}
                  <div className="space-y-3 mb-8">
                    {app.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                        <div className={`w-1.5 h-1.5 bg-gradient-to-r ${app.color} rounded-full mr-3 shadow-sm group-hover:shadow-md transition-shadow duration-300`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>


                </CardContent>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <div className={`w-3 h-3 bg-gradient-to-r ${app.color} rounded-full animate-pulse shadow-lg`}></div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Enhanced Feature Showcase - Información de la app activa */}
        <div className="relative">
          <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left - Active App Details */}
                <div>
                  <Badge variant="outline" className={`mb-6 ${appCategories[activeApp].bgColor} border-current px-4 py-2 text-sm`} style={{color: `hsl(${appCategories[activeApp].color.includes('orange') ? '24 95% 53%' : appCategories[activeApp].color.includes('blue') ? '217 91% 60%' : appCategories[activeApp].color.includes('yellow') ? '43 96% 56%' : '142 71% 45%'})`}}>
                    <Sparkles className="w-3 h-3 mr-2" />
                    Aplicación Destacada
                  </Badge>
                  
                  <h3 className="text-4xl font-bold text-white mb-6">
                    {appCategories[activeApp].title}
                  </h3>
                  
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    {appCategories[activeApp].longDescription}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {appCategories[activeApp].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-gray-800/60 transition-colors duration-300">
                        <div className={`w-3 h-3 bg-gradient-to-r ${appCategories[activeApp].color} rounded-full mr-4 shadow-sm`}></div>
                        <span className="text-gray-300 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  

                </div>

                {/* Right - App Interface */}
                <div className="relative flex justify-center">
                  <div className="relative group">
                    {/* Glowing background effect */}
                    <div className={`absolute -inset-6 bg-gradient-to-r ${appCategories[activeApp].color} rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500`}></div>
                    
                    <div className="relative transform group-hover:scale-105 transition-transform duration-700">
                      <Card className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <CardContent className="p-0">
                          <img 
                            src={activeApp % 2 === 0 ? appImage1 : appImage2} 
                            alt={`${appCategories[activeApp].title} Interface`}
                            className="w-full h-auto object-cover transition-all duration-700"
                          />
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Floating info badge */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg px-4 py-2 min-w-[200px] text-center">
                      <p className="text-white font-semibold text-sm">{appCategories[activeApp].title}</p>
                      <p className="text-gray-400 text-xs">{appCategories[activeApp].description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}