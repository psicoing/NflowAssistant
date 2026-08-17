import { Check } from 'lucide-react';
import { Link } from 'wouter';

export default function NFlowComparisonSection() {
  const comparisons = [
    {
      dimension: "Estructura clara",
      nflow: "Bloques temáticos organizados (empática, refuerzo, síntomas, técnicas, recursos).",
      gpt5: "Respuesta breve sin bloques definidos.",
      benefit: "Más organizado"
    },
    {
      dimension: "Referencia a manuales diagnósticos",
      nflow: "Cita DSM-5-TR y CIE-11.",
      gpt5: "Menciona criterios, pero sin citar manuales.",
      benefit: "Más seguro clínicamente"
    },
    {
      dimension: "Algoritmo de urgencia",
      nflow: "Señales de alarma detalladas + teléfonos (024, 112, Telèfon de l'Esperança).",
      gpt5: "Advierte sobre riesgo, pero sin estructura completa.",
      benefit: "Más protegido en crisis"
    },
    {
      dimension: "Psicoeducación",
      nflow: "Incluye sección de \"Mitos y Verdades\" y explicación diagnóstica completa.",
      gpt5: "Solo breve explicación.",
      benefit: "Más completo"
    },
    {
      dimension: "Recursos adicionales",
      nflow: "Ofrece libros y recursos locales específicos.",
      gpt5: "Sugerencias generales sin recursos ampliados.",
      benefit: "Más cercano a ti"
    },
    {
      dimension: "Advertencia profesional",
      nflow: "Advertencia clara, en bloque visible.",
      gpt5: "Advertencia implícita.",
      benefit: "Más responsable"
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
            Lo que ChatGPT no puede hacer por tu salud mental
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            NUXA está diseñado específicamente para el bienestar emocional: con estructura clínica,
            recursos locales y protocolos de urgencia que los modelos generalistas no ofrecen.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="grid grid-cols-4 gap-4 text-white font-semibold">
                <div className="col-span-1"><h3 className="text-lg">Dimensión</h3></div>
                <div className="col-span-1 text-center"><h3 className="text-lg">NUXA</h3></div>
                <div className="col-span-1 text-center"><h3 className="text-lg">ChatGPT</h3></div>
                <div className="col-span-1 text-center"><h3 className="text-lg">Resultado</h3></div>
              </div>
            </div>

            {/* Rows */}
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
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-2 rounded-full text-sm font-semibold">
                      <Check className="w-4 h-4 mr-1 flex-shrink-0" />
                      {item.benefit}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Footer */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Pruébalo ahora — 2,99 €/mes
              </h3>
              <p className="text-white/90 mb-4 text-base">
                Sin permanencia · Cancela cuando quieras · Lo que ChatGPT no te da
              </p>
              <a
                href="/registro"
                className="inline-flex items-center bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Comenzar ahora
              </a>
            </div>
          </div>
        </div>

        {/* Mobile version */}
        <div className="md:hidden max-w-4xl mx-auto mt-4">
          <div className="space-y-5">
            {comparisons.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3 border-b pb-2">
                  {item.dimension}
                </h3>
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-500">
                    <div className="text-xs font-semibold text-green-700 mb-1">NUXA</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.nflow}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-500">
                    <div className="text-xs font-semibold text-gray-500 mb-1">ChatGPT</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.gpt5}</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm font-semibold">
                      <Check className="w-4 h-4 mr-1" />
                      {item.benefit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-center">
            <p className="text-white font-bold text-lg mb-1">Pruébalo — 2,99 €/mes</p>
            <p className="text-white/80 text-sm mb-3">Sin permanencia · Lo que ChatGPT no te da</p>
            <a href="/registro" className="inline-block bg-white text-orange-600 px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors">
              Comenzar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
