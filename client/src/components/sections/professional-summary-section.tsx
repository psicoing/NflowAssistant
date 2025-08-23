import { CheckCircle, Users } from "lucide-react";

export default function ProfessionalSummarySection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Apoyo Profesional Respaldado por la Ciencia
            </h2>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            
            {/* Key Features List */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8">
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Orientación adaptada a cada etapa de la vida</span>
              </div>
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Lenguaje cercano y basado en evidencia científica</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Disponible 24/7 para ti o tu empresa</span>
              </div>
            </div>

            {/* Professional Statement */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-6 mb-8 border-l-4 border-orange-500">
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    <strong>NFlow no es un chatbot cualquiera:</strong> está desarrollado por profesionales, 
                    con contenidos actualizados y rigurosos que te ayudan a mejorar tu bienestar y el de tu equipo.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Badge */}
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-full border border-orange-200">
                <span className="text-orange-700 font-medium text-sm">
                  Tu apoyo emocional profesional disponible 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}