// Removed icon imports as we're now using emoji characters

const personas = [
  {
    id: "adolescentes",
    title: "Adolescentes", 
    description: "Apoyo para gestionar emociones, estrés escolar y relaciones sociales",
    bgColor: "bg-gradient-to-br from-nflow-orange to-orange-600",
    appName: "NFLOW",
    subtitle: "Salud Mental",
    character: "👩‍🎓"
  },
  {
    id: "padres",
    title: "Padres y Madres",
    description: "Orientación para comprender y apoyar el desarrollo emocional de tus hijos",
    bgColor: "bg-gradient-to-br from-nflow-orange to-orange-600", 
    appName: "NFLOW",
    subtitle: "Salud Mental Familiar",
    character: "👨‍👩‍👧‍👦"
  },
  {
    id: "empresas",
    title: "Empresas",
    description: "Servicio de desarrollo personalizado de apps con IA para la transformación digital de tu empresa",
    bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    appName: "JOBDA",
    subtitle: "SELECCIÓN DE PERSONAL",
    character: "👨‍💼"
  },
  {
    id: "laboral",
    title: "Salud Laboral", 
    description: "Soporte para el manejo del estrés, ansiedad y desafíos en el entorno profesional",
    bgColor: "bg-gradient-to-br from-nflow-orange to-orange-600",
    appName: "NFLOW", 
    subtitle: "SALUD MENTAL LABORAL",
    character: "👷‍♀️"
  }
];

export default function PersonasSection() {
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
                {/* Product Box */}
                <div className="perspective-1000">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-2xl border-2 border-gray-300 mb-6 transform group-hover:rotateY-5 transition-transform duration-300">
                    {/* App Box */}
                    <div className={`${persona.bgColor} rounded-xl p-4 shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform duration-300`}>
                      <div className="text-white text-center">
                        <div className="font-bold text-sm mb-1">{persona.appName}</div>
                        <div className="text-white/90 text-xs mb-3 leading-tight">{persona.subtitle}</div>
                        <div className="text-4xl mb-2">{persona.character}</div>
                      </div>
                    </div>
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
      </div>
    </section>
  );
}
