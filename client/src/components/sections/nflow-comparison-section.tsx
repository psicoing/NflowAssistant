import { Check } from 'lucide-react';

export default function NFlowComparisonSection() {
  const comparisons = [
    {
      dimension: "Estructura clara",
      nflow: "Bloques temáticos organizados (empática, refuerzo, síntomas, técnicas, recursos).",
      gpt5: "Respuesta breve sin bloques definidos.",
      advantage: "nflow"
    },
    {
      dimension: "Referencia a manuales diagnósticos",
      nflow: "Cita DSM-5-TR y CIE-11.",
      gpt5: "Menciona criterios, pero sin citar manuales.",
      advantage: "nflow"
    },
    {
      dimension: "Algoritmo de urgencia",
      nflow: "Señales de alarma detalladas + teléfonos (024, 112, Telèfon de l'Esperança).",
      gpt5: "Advierte sobre riesgo, pero sin estructura completa.",
      advantage: "nflow"
    },
    {
      dimension: "Psicoeducación",
      nflow: "Incluye sección de \"Mitos y Verdades\" y explicación diagnóstica completa.",
      gpt5: "Solo breve explicación.",
      advantage: "nflow"
    },
    {
      dimension: "Recursos adicionales",
      nflow: "Ofrece libros y recursos locales específicos.",
      gpt5: "Sugerencias generales sin recursos ampliados.",
      advantage: "nflow"
    },
    {
      dimension: "Advertencia profesional",
      nflow: "Advertencia clara, en bloque visible.",
      gpt5: "Advertencia implícita.",
      advantage: "nflow"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Por qué NUXA supera a GPT-5?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Nuestro robot NEUROPSI-AI está específicamente entrenado para salud mental profesional, 
            ofreciendo estructura y precisión que los modelos generalistas no pueden igualar.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="grid grid-cols-4 gap-4 text-white font-semibold">
                <div className="col-span-1">
                  <h3 className="text-lg">Dimensión</h3>
                </div>
                <div className="col-span-1 text-center">
                  <h3 className="text-lg">NUXA</h3>
                </div>
                <div className="col-span-1 text-center">
                  <h3 className="text-lg">GPT-5</h3>
                </div>
                <div className="col-span-1 text-center">
                  <h3 className="text-lg">Resultado</h3>
                </div>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {comparisons.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="col-span-1">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                      {item.dimension}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-500">
                      {item.nflow}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-500">
                      {item.gpt5}
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <div className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-2 rounded-full text-sm font-semibold">
                      <Check className="w-4 h-4 mr-1" />
                      NUXA mejora
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action Footer */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Experimenta la diferencia profesional
              </h3>
              <p className="text-white/90 mb-4 text-lg">
                NEUROPSI-AI es el robot interno de NUXA: Especialización que marca la diferencia en tu bienestar mental
              </p>
              <a 
                href="/login" 
                className="inline-flex items-center bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Comenzar Ahora
              </a>
            </div>
          </div>
        </div>

        {/* Mobile-optimized version */}
        <div className="md:hidden max-w-4xl mx-auto mt-8">
          <div className="space-y-6">
            {comparisons.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 border-b pb-2">
                  {item.dimension}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center mb-2">
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        NUXA
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.nflow}</p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center mb-2">
                      <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        GPT-5
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.gpt5}</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
                      <Check className="w-4 h-4 mr-2" />
                      NUXA mejora
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}