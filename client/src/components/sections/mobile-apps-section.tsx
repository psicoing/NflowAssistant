import { Card, CardContent } from "@/components/ui/card";
import appImage1 from "@assets/image_1749306853621.png";
import appImage2 from "@assets/image_1749306865658.png";

export default function MobileAppsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-nflow-dark to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Aplicaciones Móviles
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre nuestras aplicaciones especializadas para cada necesidad de salud mental
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* First Set of Apps */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={appImage1} 
                  alt="NFLOW Apps - Individual, Familiar, Jobda y Laboral"
                  className="w-full h-auto object-cover"
                />
              </CardContent>
            </Card>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">
                Suite Completa NFLOW
              </h3>
              <p className="text-gray-300">
                Aplicaciones especializadas para salud mental individual, familiar, 
                selección de personal y bienestar laboral
              </p>
            </div>
          </div>

          {/* Second Set of Apps */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={appImage2} 
                  alt="NFLOW Apps - Interfaces detalladas"
                  className="w-full h-auto object-cover"
                />
              </CardContent>
            </Card>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">
                Interfaces Especializadas
              </h3>
              <p className="text-gray-300">
                Diseño intuitivo y herramientas específicas para cada área de aplicación, 
                desde terapia individual hasta evaluación empresarial
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-nflow-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Multiplataforma</h4>
            <p className="text-gray-300">
              Disponible en iOS y Android con sincronización completa
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-nflow-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Especialización</h4>
            <p className="text-gray-300">
              Cada app está diseñada para necesidades específicas
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Seguridad</h4>
            <p className="text-gray-300">
              Máxima protección de datos y privacidad garantizada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}