import { Heart, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";
import lgbtiImagePath from "@assets/ChatGPT Image 18 jul 2025, 09_00_02_1752822021391.png";

export default function LGBTISupportSection() {
  const [, setLocation] = useLocation();
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-nflow-dark via-purple-950/30 to-nflow-dark relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-rainbow-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-lg"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header con badge */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full border border-purple-500/30 mb-6">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-purple-300">NFLOW LGBTI+ Apoyo Especializado</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Apoyo y Dignidad
            </span>
            <br />
            <span className="text-white">Garantizada</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Reconocemos que la comunidad LGBTI+ enfrenta vulnerabilidades únicas en salud mental. 
            En NFLOW, ofrecemos un espacio seguro, libre de juicios y con apoyo especializado.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagen de la comunidad LGBTI+ */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 shadow-2xl">
              <img 
                src={lgbtiImagePath}
                alt="Comunidad LGBTI+ unida con bandera del orgullo"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
            </div>
            
            {/* Badge flotante */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full border border-purple-400/50 shadow-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">Espacio Seguro</span>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-8">
            {/* Estadística importante */}
            <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 p-6 rounded-xl border border-red-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Realidad Preocupante</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Las personas LGBTI+ presentan tasas <strong className="text-red-400">3-4 veces mayores</strong> de 
                intentos de suicidio y trastornos de salud mental debido a discriminación, rechazo familiar y estrés de minorías.
              </p>
            </div>

            {/* Grid de características de apoyo */}
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Confidencialidad Total</h4>
                  <p className="text-sm text-gray-400">Sin juicios, sin etiquetas, solo apoyo humano</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-pink-900/20 rounded-lg border border-pink-500/30">
                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Lenguaje Inclusivo</h4>
                  <p className="text-sm text-gray-400">Respeto por tu identidad y orientación</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Apoyo Especializado</h4>
                  <p className="text-sm text-gray-400">Comprensión de las realidades LGBTI+</p>
                </div>
              </div>
            </div>

            {/* Mensaje de compromiso */}
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-6 rounded-xl border border-purple-500/30">
              <h3 className="text-lg font-semibold text-white mb-3">Nuestro Compromiso</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Queremos aportar nuestro granito de arena creando un espacio donde puedas ser tú mismo/a sin miedo, 
                donde tus emociones sean validadas y donde encuentres el apoyo que mereces.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-pink-300 font-medium">Con amor y respeto, equipo NFLOW</span>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => setLocation("/registro")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl border border-purple-400/50 shadow-lg transition-all duration-300 hover:shadow-purple-500/25 hover:scale-105"
                data-testid="button-lgbti-apoyo"
              >
                <Heart className="w-5 h-5" />
                Encuentra tu Apoyo Aquí
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}