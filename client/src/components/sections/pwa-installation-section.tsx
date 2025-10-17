import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Download, Chrome, Share, Plus, Home, CheckCircle } from "lucide-react";
import nuxaLogo from "@assets/generated_images/NUXA_logo_with_circle_person_ba9dba6f.png";

export default function PWAInstallationSection() {
  return (
    <section id="app-movil" className="py-20 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-gradient-to-l from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-4 py-2">
            <Smartphone className="w-4 h-4 mr-2" />
            Aplicación Móvil
          </Badge>
          
          {/* NUXA Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={nuxaLogo} 
              alt="NUXA App Logo" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain"
            />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Instala NUXA en tu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              móvil sin tiendas
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            NUXA es una aplicación web progresiva (PWA). Puedes instalarla directamente 
            desde tu navegador sin necesidad de App Store o Google Play.
          </p>
        </div>

        {/* Installation Steps */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Android/Chrome Steps */}
          <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Chrome className="w-8 h-8 text-emerald-500 mr-3" />
                <h3 className="text-2xl font-bold text-white">Android / Chrome</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Abre NUXA en Chrome</h4>
                    <p className="text-gray-300 text-sm">Navega a la página web de NUXA usando Google Chrome</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      Toca el menú <Chrome className="w-4 h-4 ml-2" />
                    </h4>
                    <p className="text-gray-300 text-sm">Busca los tres puntos verticales en la esquina superior derecha</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      Selecciona "Instalar app" <Download className="w-4 h-4 ml-2" />
                    </h4>
                    <p className="text-gray-300 text-sm">Aparecerá la opción de instalación directamente en el menú</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">¡Listo!</h4>
                    <p className="text-gray-300 text-sm">NUXA aparecerá en tu pantalla de inicio como cualquier otra app</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* iOS/Safari Steps */}
          <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">iPhone / Safari</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Abre NUXA en Safari</h4>
                    <p className="text-gray-300 text-sm">Navega a la página web de NUXA usando Safari (navegador nativo)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      Toca el botón compartir <Share className="w-4 h-4 ml-2" />
                    </h4>
                    <p className="text-gray-300 text-sm">Busca el ícono de compartir en la barra inferior de Safari</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      "Añadir a pantalla de inicio" <Plus className="w-4 h-4 ml-2" />
                    </h4>
                    <p className="text-gray-300 text-sm">Desplázate hacia abajo en el menú para encontrar esta opción</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">¡Perfecto!</h4>
                    <p className="text-gray-300 text-sm">NUXA estará disponible en tu pantalla de inicio con su propio ícono</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <Card className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-gray-800/60 border border-emerald-500/20 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ventajas de instalar NUXA como PWA
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Acceso Directo</h4>
                <p className="text-gray-300 text-sm">Ícono en pantalla de inicio, como cualquier app nativa</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Experiencia Nativa</h4>
                <p className="text-gray-300 text-sm">Funciona como una app real, sin barra de navegador</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Sin Tiendas</h4>
                <p className="text-gray-300 text-sm">Instalación directa, sin pasar por App Store o Google Play</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}