import { Brain, AlertCircle, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AgeNoticeSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-nflow-dark to-nflow-navy">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700/50 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600/20 rounded-full">
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Importante: Chat disponible a partir de los 12 años
              </h2>
            </div>

            <div className="space-y-6 text-gray-300">
              <div className="text-center">
                <p className="text-lg leading-relaxed">
                  Este asistente emocional está diseñado para personas de <span className="text-blue-400 font-semibold">12 a 95 años</span>.
                </p>
                <p className="mt-3 text-gray-400">
                  A partir de los 12 años, consideramos que ya se puede leer, escribir y reflexionar de manera suficiente como para interactuar con un chatbot psicológico.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start space-x-3 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                  <Users className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-green-400 font-semibold mb-2">Adaptación Automática</h3>
                    <p className="text-sm text-gray-300">
                      El contenido y el lenguaje del chat se adaptan automáticamente según la edad del usuario, garantizando una experiencia ajustada, respetuosa y adecuada para cada etapa de la vida.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-400 font-semibold mb-2">Restricción de Edad</h3>
                    <p className="text-sm text-gray-300">
                      Si tienes menos de 12 años, este chat no está habilitado para ti. Recomendamos buscar apoyo presencial con un adulto de confianza.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <div className="flex justify-center items-center mb-2">
                  <Shield className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 font-semibold">Uso Responsable</span>
                </div>
                <p className="text-sm text-gray-400">
                  Nuestro compromiso es proporcionar apoyo psicológico adecuado y seguro para cada usuario, respetando las necesidades específicas de cada grupo de edad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}