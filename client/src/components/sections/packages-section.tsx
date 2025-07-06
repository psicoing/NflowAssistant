import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Briefcase, Building2, ArrowRight, Sparkles, Gift, User, UserCheck, Monitor, Headphones } from "lucide-react";

export default function PackagesSection() {
  const packageCategories = [
    {
      icon: User,
      title: "Adolescentes",
      subtitle: "SALUD MENTAL",
      description: "Apoyo para gestionar emociones, estrés escolar y relaciones sociales",
      bgColor: "from-orange-400 to-orange-600",
      headerColor: "from-orange-500 to-orange-600",
      character: "👩‍🦱", // Young woman character
      items: ["💬", "📱", "🎯", "🔥", "📊", "⚙️"],
      features: ["Gestión emocional", "Estrés escolar", "Relaciones sociales"]
    },
    {
      icon: Users,
      title: "Padres y Madres",
      subtitle: "SALUD MENTAL FAMILIAR",
      description: "Orientación para comprender y apoyar el desarrollo emocional de los hijos",
      bgColor: "from-orange-400 to-orange-600",
      headerColor: "from-orange-500 to-orange-600",
      character: "👨‍👩‍👧", // Family characters
      items: ["❤️", "🏠", "🎯", "💬", "📊", "🔧"],
      features: ["Comunicación familiar", "Apoyo emocional", "Resolución conflictos"]
    },
    {
      icon: Briefcase,
      title: "Empresas",
      subtitle: "SELECCIÓN DE PERSONAL",
      description: "Servicio de desarrollo personalizado de apps con IA para la transformación digital de tu empresa",
      bgColor: "from-yellow-400 to-yellow-600",
      headerColor: "from-yellow-500 to-yellow-600",
      character: "👨‍💼", // Business man character
      items: ["📋", "📁", "🔍", "💼", "📈", "⚡"],
      features: ["Desarrollo IA", "Apps empresariales", "Transformación digital"],
      brand: "JOBDA",
      footerText: "Selección de Personal"
    },

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          {packageCategories.map((pkg, index) => {
            const brandName = pkg.brand || "NFLOW";
            const footerText = pkg.footerText || "Salud Mental";
            const itemBgColor = pkg.brand === "JOBDA" ? "bg-yellow-200/60" : "bg-orange-200/60";
            
            return (
              <Card 
                key={index} 
                className="relative overflow-hidden transition-all duration-500 cursor-pointer group h-[500px] bg-gray-300 border-4 border-gray-400 hover:shadow-2xl hover:shadow-nflow-orange/20 hover:-translate-y-2 rounded-3xl"
              >
                {/* Package Box Design - Outer Frame */}
                <div className={`absolute inset-2 bg-gradient-to-b ${pkg.bgColor} rounded-2xl shadow-xl`}>
                  {/* Package Header - Brand */}
                  <div className={`bg-gradient-to-r ${pkg.headerColor} text-white text-center py-3 px-4 rounded-t-2xl`}>
                    <div className="text-lg font-bold tracking-wider">{brandName}</div>
                    <div className="text-xs opacity-90 font-medium">{pkg.subtitle}</div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-6 h-full relative flex flex-col justify-between">
                    {/* Character Display */}
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3 drop-shadow-lg">{pkg.character}</div>
                    </div>

                    {/* Items Grid - 3x2 layout like in images */}
                    <div className="grid grid-cols-3 gap-3 mb-6 flex-1 content-start">
                      {pkg.items.map((item, idx) => (
                        <div key={idx} className={`w-10 h-10 ${itemBgColor} rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-sm`}>
                          <span className="text-lg">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Package Title */}
                    <div className="text-center mb-4">
                      <h3 className="text-white font-bold text-lg drop-shadow-lg">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  {/* Package Footer */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${pkg.headerColor} text-white text-center py-2 rounded-b-2xl`}>
                    <div className="text-xs font-medium opacity-90">{footerText}</div>
                  </div>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${pkg.bgColor} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 pointer-events-none`}></div>
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