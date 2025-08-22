import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Star } from "lucide-react";

const personas = [
  {
    id: "adolescentes",
    title: "Adolescentes", 
    description: "Apoyo para gestionar emociones, estrés escolar y relaciones sociales",
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
    appName: "NFLOW",
    subtitle: "Salud Mental",
    character: "👩‍🎓",
    accessories: ["📱", "☕", "🎧", "📚", "💭"]
  },
  {
    id: "padres",
    title: "Padres y Madres",
    description: "Orientación para comprender y apoyar el desarrollo emocional de tus hijos",
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-600", 
    appName: "NFLOW",
    subtitle: "Salud Mental Familiar",
    character: "👨‍👩‍👧‍👦",
    accessories: ["❤️", "🏠", "🎯", "📖", "🤝"]
  },
  {
    id: "empresas",
    title: "Empresas",
    description: "Servicio de desarrollo personalizado de apps con IA para la transformación digital de tu empresa",
    bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    appName: "JOBDA",
    subtitle: "SELECCIÓN DE PERSONAL",
    character: "👨‍💼",
    accessories: ["💼", "📊", "🔍", "📋", "💡"]
  },
  {
    id: "laboral",
    title: "Salud Laboral", 
    description: "Soporte para el manejo del estrés, ansiedad y desafíos en el entorno profesional",
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
    appName: "NFLOW", 
    subtitle: "SALUD MENTAL LABORAL",
    character: "👷‍♀️",
    accessories: ["🎧", "⚡", "🛠️", "💪", "🌟"]
  }
];

export default function PersonasSection() {
  const [, setLocation] = useLocation();
  
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          NFLOW, un psicólogo en tu bolsillo
        </h2>
        <div className="w-24 h-1 bg-nflow-blue mx-auto mb-6"></div>
        <p className="text-xl text-gray-300 mb-16 max-w-4xl mx-auto">
          Nuestras soluciones están diseñadas para atender las necesidades específicas de diferentes 
          grupos, ofreciendo herramientas y recursos adaptados a cada situación.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {personas.map((persona) => {
            return (
              <div 
                key={persona.id}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                {/* Product Package */}
                <div className="relative mb-6">
                  {/* Blister Pack Background */}
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl p-4 shadow-2xl border-2 border-gray-400 relative overflow-hidden">
                    {/* Cardboard header */}
                    <div className={`${persona.bgColor} rounded-t-2xl -mx-4 -mt-4 mb-4 p-3 shadow-lg`}>
                      <div className="text-white font-bold text-center text-sm mb-1">{persona.appName}</div>
                      <div className="text-white/80 text-xs text-center font-medium">{persona.subtitle}</div>
                      
                      {/* Hanging hole */}
                      <div className="absolute top-2 right-4 w-4 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    </div>

                    {/* Clear plastic section with character */}
                    <div className="bg-gradient-to-br from-white/20 to-white/40 rounded-2xl p-4 backdrop-blur-sm border border-white/30 relative">
                      {/* Main Character */}
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                          {persona.character}
                        </div>
                      </div>

                      {/* Accessories Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {persona.accessories.map((accessory, index) => (
                          <div 
                            key={index}
                            className="bg-white/50 rounded-lg p-2 text-center shadow-sm transform group-hover:rotate-6 transition-transform duration-300"
                            style={{ transitionDelay: `${index * 100}ms` }}
                          >
                            <span className="text-lg">{accessory}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Plastic shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
                  </div>
                </div>

                {/* Description */}
                <div className="text-center">
                  <h3 className="text-white font-bold text-xl mb-3">{persona.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{persona.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to Action Button */}
        <div className="text-center mt-16">
          <Button 
            onClick={() => setLocation("/registro")}
            className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl animate-pulse hover:animate-none"
          >
            <Star className="w-6 h-6 mr-3" />
            ¡Comenzar Ahora!
          </Button>
        </div>
      </div>
    </section>
  );
}
