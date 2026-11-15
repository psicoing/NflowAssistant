import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Download, Chrome, Share, Plus, Home, CheckCircle } from "lucide-react";
import nuxaLogo from "@assets/generated_images/NUXA_logo_with_circle_person_ba9dba6f.png";

export default function PWAInstallationSection() {
  return (
    <section id="app-movil" className="px-4 py-14 sm:py-20">
      <div className="max-w-6xl mx-auto sm:px-2 lg:px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-[#cbded6] bg-[#eaf1eb] px-4 py-2 text-[#42695f]">
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
          
          <h2 className="mb-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#173e3d] sm:text-5xl">
            Instala NUXA en tu{" "}
            <span className="text-[#557d65]">
              móvil sin tiendas
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-7 text-[#526b68] sm:text-lg">
            NUXA es una aplicación web progresiva (PWA). Puedes instalarla directamente 
            desde tu navegador sin necesidad de App Store o Google Play.
          </p>
        </div>

        {/* Installation Steps */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Android/Chrome Steps */}
          <Card className="overflow-hidden rounded-[1.5rem] border-[#d6e3dc] bg-[#f3f6ef] text-[#234844]">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Chrome className="mr-3 h-7 w-7 text-[#557d65]" />
                <h3 className="text-xl font-semibold text-[#173e3d]">Android / Chrome</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#174f50] text-sm font-semibold text-white">
                    1
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-[#234844]">Abre NUXA en Chrome</h4>
                    <p className="text-sm text-[#647b75]">Navega a la página web de NUXA usando Google Chrome</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#174f50] text-sm font-semibold text-white">
                    2
                  </div>
                  <div>
                    <h4 className="mb-2 flex items-center font-semibold text-[#234844]">
                      Toca el menú <Chrome className="w-4 h-4 ml-2" />
                    </h4>
                    <p className="text-sm text-[#647b75]">Busca los tres puntos verticales en la esquina superior derecha</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#174f50] text-sm font-semibold text-white">
                    3
                  </div>
                  <div>
                    <h4 className="mb-2 flex items-center font-semibold text-[#234844]">
                      Selecciona "Instalar app" <Download className="w-4 h-4 ml-2" />
                    </h4>
                    <p className="text-sm text-[#647b75]">Aparecerá la opción de instalación directamente en el menú</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#77977e] text-sm font-semibold text-white">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-[#234844]">¡Listo!</h4>
                    <p className="text-sm text-[#647b75]">NUXA aparecerá en tu pantalla de inicio como cualquier otra app</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* iOS/Safari Steps */}
          <Card className="overflow-hidden rounded-[1.5rem] border-[#d6e3dc] bg-[#f3f6ef] text-[#234844]">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#174f50] text-[#d6e69a]">
                  <Smartphone className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-semibold text-[#173e3d]">iPhone / Safari</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#174f50] text-sm font-semibold text-white">
                    1
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-[#234844]">Abre NUXA en Safari</h4>
                    <p className="text-sm text-[#647b75]">Navega a la página web de NUXA usando Safari (navegador nativo)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#174f50] text-sm font-semibold text-white">
                    2
                  </div>
                  <div>
                    <h4 className="mb-2 flex items-center font-semibold text-[#234844]">
                      Toca el botón compartir <Share className="w-4 h-4 ml-2" />
                    </h4>
                    <p className="text-sm text-[#647b75]">Busca el ícono de compartir en la barra inferior de Safari</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#174f50] text-sm font-semibold text-white">
                    3
                  </div>
                  <div>
                    <h4 className="mb-2 flex items-center font-semibold text-[#234844]">
                      "Añadir a pantalla de inicio" <Plus className="w-4 h-4 ml-2" />
                    </h4>
                    <p className="text-sm text-[#647b75]">Desplázate hacia abajo en el menú para encontrar esta opción</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#77977e] text-sm font-semibold text-white">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-[#234844]">¡Perfecto!</h4>
                    <p className="text-sm text-[#647b75]">NUXA estará disponible en tu pantalla de inicio con su propio ícono</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <Card className="rounded-[1.5rem] border-[#cbded6] bg-[#eaf1eb] text-[#234844]">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="mb-4 text-xl font-semibold text-[#173e3d] sm:text-2xl">
                Ventajas de instalar NUXA como PWA
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#174f50] text-[#d6e69a]">
                  <Home className="h-5 w-5" />
                </div>
                <h4 className="mb-2 font-semibold text-[#234844]">Acceso Directo</h4>
                <p className="text-sm text-[#647b75]">Ícono en pantalla de inicio, como cualquier app nativa</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce8dc] text-[#47736a]">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h4 className="mb-2 font-semibold text-[#234844]">Experiencia Nativa</h4>
                <p className="text-sm text-[#647b75]">Funciona como una app real, sin barra de navegador</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce8dc] text-[#47736a]">
                  <Download className="h-5 w-5" />
                </div>
                <h4 className="mb-2 font-semibold text-[#234844]">Sin Tiendas</h4>
                <p className="text-sm text-[#647b75]">Instalación directa, sin pasar por App Store o Google Play</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}