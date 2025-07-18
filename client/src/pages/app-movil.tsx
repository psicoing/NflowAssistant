import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Download, Chrome, Share, Plus, Home, CheckCircle, Monitor, Tablet, Wifi, Zap, Shield, Globe, Star, ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "wouter";

export default function AppMovil() {
  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-nflow-dark via-gray-900 to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-nflow-orange/10 to-nflow-blue/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-to-l from-green-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <Badge variant="outline" className="mb-6 border-nflow-orange/30 text-nflow-orange bg-nflow-orange/5 px-6 py-3 text-lg">
                <Smartphone className="w-5 h-5 mr-2" />
                Aplicación Web Progresiva
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
                NFLOW en tu{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange via-nflow-orange-light to-nflow-blue">
                  móvil
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                Instala NFLOW directamente en tu dispositivo móvil sin necesidad de App Store o Google Play. 
                Una experiencia nativa completa con todas las funcionalidades.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white px-8 py-4 text-lg font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Instalar NFLOW Ahora
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Ver Tutorial
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is PWA Section */}
        <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Qué es una{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange to-nflow-blue">
                  PWA?
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Una Aplicación Web Progresiva (PWA) combina lo mejor de las aplicaciones web y móviles nativas
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-nflow-orange to-nflow-orange-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Rápida y Eficiente</h3>
                  <p className="text-gray-300">Carga instantánea y funcionamiento fluido, incluso con conexión lenta</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-nflow-blue to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Segura y Confiable</h3>
                  <p className="text-gray-300">Conexión HTTPS segura y funcionamiento offline cuando es necesario</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Universal</h3>
                  <p className="text-gray-300">Funciona en cualquier dispositivo con navegador moderno</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Installation Guide */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-nflow-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Guía de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange to-nflow-blue">
                  Instalación
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Sigue estos sencillos pasos para tener NFLOW en tu pantalla de inicio
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Android Instructions */}
              <div>
                <Card className="bg-gradient-to-br from-green-900/20 via-gray-800/40 to-gray-900/60 border border-green-500/30 backdrop-blur-xl mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-white">
                      <Chrome className="w-8 h-8 text-green-500 mr-3" />
                      Android / Chrome
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          1
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">Abre NFLOW en Chrome</h4>
                          <p className="text-gray-300 text-sm">Navega a la página web de NFLOW usando Google Chrome en tu Android</p>
                          <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-nflow-orange text-sm font-mono">https://nflow.biz/</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          2
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">Busca el mensaje de instalación</h4>
                          <p className="text-gray-300 text-sm">Chrome mostrará automáticamente una barra en la parte inferior preguntando si quieres instalar la app</p>
                          <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-300 text-sm">💡 <strong>Tip:</strong> Si no aparece, toca el menú (⋮) y busca "Instalar app"</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          3
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center">
                            Toca "Instalar" <Download className="w-4 h-4 ml-2 text-green-500" />
                          </h4>
                          <p className="text-gray-300 text-sm">Confirma la instalación y NFLOW se añadirá a tu pantalla de inicio</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">¡Listo para usar!</h4>
                          <p className="text-gray-300 text-sm">NFLOW aparecerá como cualquier otra app en tu dispositivo Android</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Android Visual Example */}
                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/30">
                  <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-4 text-center">Así se ve en Android:</h4>
                    <div className="bg-gray-900 rounded-lg p-4 text-center">
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-3">
                        <p className="text-green-300 text-sm">🔗 ¿Instalar NFLOW?</p>
                        <p className="text-gray-300 text-xs">Esta aplicación se puede instalar en tu dispositivo</p>
                      </div>
                      <div className="flex space-x-2 justify-center">
                        <div className="bg-green-500 text-white px-3 py-1 rounded text-xs">Instalar</div>
                        <div className="bg-gray-600 text-white px-3 py-1 rounded text-xs">Ahora no</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* iOS Instructions */}
              <div>
                <Card className="bg-gradient-to-br from-blue-900/20 via-gray-800/40 to-gray-900/60 border border-blue-500/30 backdrop-blur-xl mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-white">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      iPhone / Safari
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          1
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">Abre NFLOW en Safari</h4>
                          <p className="text-gray-300 text-sm">Es importante usar Safari (navegador nativo de iOS) para la instalación</p>
                          <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-nflow-orange text-sm font-mono">https://nflow.biz/</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          2
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center">
                            Toca el botón compartir <Share className="w-4 h-4 ml-2 text-blue-500" />
                          </h4>
                          <p className="text-gray-300 text-sm">Busca el ícono de compartir en la barra inferior de Safari (cuadrado con flecha hacia arriba)</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          3
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">Desplázate y busca la opción</h4>
                          <p className="text-gray-300 text-sm">En el menú que aparece, desplázate hacia abajo hasta encontrar "Añadir a pantalla de inicio"</p>
                          <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-300 text-sm">⚠️ <strong>Importante:</strong> Debe ser exactamente esa opción con el ícono +</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          4
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center">
                            Confirma "Añadir" <Plus className="w-4 h-4 ml-2 text-blue-500" />
                          </h4>
                          <p className="text-gray-300 text-sm">Puedes personalizar el nombre si quieres, luego toca "Añadir" en la esquina superior derecha</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">¡Perfecto!</h4>
                          <p className="text-gray-300 text-sm">NFLOW estará en tu pantalla de inicio con su propio ícono, como cualquier app nativa</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* iOS Visual Example */}
                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/30">
                  <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-4 text-center">Así se ve en iPhone:</h4>
                    <div className="bg-gray-900 rounded-lg p-4 text-center">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm">
                          <Share className="w-4 h-4" />
                          <span>Compartir</span>
                        </div>
                        <div className="h-px bg-gray-700"></div>
                        <div className="flex items-center justify-center space-x-2 text-blue-400 text-sm">
                          <Plus className="w-4 h-4" />
                          <span>Añadir a pantalla de inicio</span>
                        </div>
                      </div>
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-2">
                        <p className="text-blue-300 text-xs">NFLOW aparecerá en tu pantalla de inicio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-nflow-dark to-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ventajas de NFLOW{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange to-nflow-blue">
                  como PWA
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-nflow-orange to-nflow-orange-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Acceso Directo</h3>
                  <p className="text-gray-300 text-sm">Ícono en pantalla de inicio para acceso inmediato</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-nflow-blue to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Pantalla Completa</h3>
                  <p className="text-gray-300 text-sm">Experiencia inmersiva sin barra de navegador</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Sin Tiendas</h3>
                  <p className="text-gray-300 text-sm">Instalación directa sin App Store o Google Play</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Actualizaciones Automáticas</h3>
                  <p className="text-gray-300 text-sm">Siempre la última versión sin descargas manuales</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Preguntas{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange to-nflow-blue">
                  Frecuentes
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">¿Es seguro instalar NFLOW como PWA?</h3>
                  <p className="text-gray-300">Sí, es completamente seguro. Las PWA utilizan la misma tecnología de seguridad que las páginas web (HTTPS) y no tienen acceso a datos sensibles de tu dispositivo.</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">¿Funciona igual que una app nativa?</h3>
                  <p className="text-gray-300">Sí, una vez instalada, NFLOW funciona exactamente como una aplicación nativa: aparece en tu pantalla de inicio, se abre en pantalla completa y funciona sin conexión cuando es posible.</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">¿Ocupa mucho espacio en mi móvil?</h3>
                  <p className="text-gray-300">No, las PWA ocupan muy poco espacio comparado con las apps nativas. NFLOW ocupará menos de 5MB en tu dispositivo.</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">¿Cómo desinstalo NFLOW si ya no la quiero?</h3>
                  <p className="text-gray-300">Puedes desinstalar NFLOW como cualquier otra app: mantén presionado el ícono y selecciona "Desinstalar" o "Eliminar". En iOS, también puedes ir a Configuración → General → Almacenamiento.</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/30 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">¿Funciona sin conexión a internet?</h3>
                  <p className="text-gray-300">NFLOW puede mostrar contenido previamente cargado sin conexión, pero necesitas internet para el chat con IA y para sincronizar nuevos datos.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-b from-gray-800 to-nflow-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para tener NFLOW{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nflow-orange to-nflow-blue">
                en tu móvil?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Comienza ahora mismo y ten acceso inmediato a tu psicólogo de bolsillo
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white px-8 py-4 text-lg font-semibold"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Ir a NFLOW e Instalar
                </Button>
              </Link>
              
              <Link href="/#precios">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-nflow-orange/30 text-nflow-orange hover:bg-nflow-orange/10 px-8 py-4 text-lg"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Ver Planes y Precios
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                ✅ Compatible con todos los navegadores modernos • ✅ Sin costo adicional • ✅ Instalación en segundos
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}