import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Briefcase, Building2, ArrowRight, Sparkles, Gift } from "lucide-react";

export default function PackagesSection() {
  const packageCategories = [
    {
      icon: Users,
      title: "Adolescentes",
      subtitle: "SALUD MENTAL",
      description: "Apoyo para gestionar emociones, estrés escolar y relaciones sociales",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      packageImage: "📦", // Will be replaced with actual package design
      features: ["Gestión emocional", "Estrés escolar", "Relaciones sociales"]
    },
    {
      icon: Heart,
      title: "Padres y Madres",
      subtitle: "SALUD MENTAL",
      description: "Orientación para comprender y apoyar el desarrollo emocional de los hijos",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      packageImage: "📦",
      features: ["Comunicación familiar", "Apoyo emocional", "Resolución conflictos"]
    },
    {
      icon: Briefcase,
      title: "Empresas",
      subtitle: "DESARROLLO PROFESIONAL",
      description: "Servicio de desarrollo personalizado de apps con IA para la transformación digital de tu empresa",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      packageImage: "📦",
      features: ["Desarrollo IA", "Apps empresariales", "Transformación digital"]
    },
    {
      icon: Building2,
      title: "Salud Laboral",
      subtitle: "SALUD MENTAL LABORAL",
      description: "Soporte para el manejo del estrés, ansiedad y bienestar en el entorno profesional",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      packageImage: "📦",
      features: ["Prevención burnout", "Bienestar laboral", "Gestión estrés"]
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
            <Gift className="w-4 h-4 mr-2" />
            Soluciones Especializadas
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            NFLOW,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange via-nflow-orange-light to-nflow-blue">
              un psicólogo en tu bolsillo
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Nuestras soluciones están diseñadas para atender las necesidades específicas de diferentes 
            grupos, ofreciendo herramientas y recursos adaptados a cada situación.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {packageCategories.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <Card 
                key={index} 
                className="relative overflow-hidden transition-all duration-500 cursor-pointer group h-[500px] bg-gradient-to-br from-gray-800/90 via-gray-700/80 to-gray-800/90 border border-gray-700/40 hover:border-gray-600/60 hover:shadow-2xl hover:shadow-nflow-orange/20 hover:-translate-y-2"
              >
                {/* Package Box Design */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardContent className="relative p-6 h-full flex flex-col">
                  {/* Package Header - NFLOW Branding */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4 rounded-t-lg mb-4 -mx-6 -mt-6">
                    <div className="text-sm font-bold tracking-wider">NFLOW</div>
                    <div className="text-xs opacity-90">{pkg.subtitle}</div>
                  </div>

                  {/* Package Content Area */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 flex-1 flex flex-col">
                    {/* Icon and Character */}
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-orange-600" />
                      </div>
                      
                      {/* Package Icons/Elements */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-purple-400 rounded"></div>
                        </div>
                        <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-400 rounded"></div>
                        </div>
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-green-400 rounded"></div>
                        </div>
                        <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                        </div>
                        <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-indigo-400 rounded"></div>
                        </div>
                      </div>
                    </div>

                    {/* Package Title */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                      {pkg.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-700 text-center mb-4 leading-relaxed flex-1">
                      {pkg.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Package Footer/Bottom */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4 rounded-b-lg mt-4 -mx-6 -mb-6">
                    <div className="text-xs font-medium">Herramientas especializadas</div>
                  </div>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-nflow-orange/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-12">
              <Badge variant="outline" className="mb-6 border-nflow-orange/30 text-nflow-orange bg-nflow-orange/5 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Disponible Ahora
              </Badge>
              
              <h3 className="text-4xl font-bold text-white mb-6">
                Encuentra la solución perfecta para ti
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Cada paquete NFLOW está diseñado con herramientas específicas y recursos 
                adaptados para diferentes grupos de edad y necesidades particulares.
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Comenzar ahora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}