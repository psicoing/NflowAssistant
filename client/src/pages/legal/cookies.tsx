import { Link } from "wouter";
import { ArrowLeft, Cookie, Settings, BarChart3, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PoliticaCookies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Title Card */}
        <Card className="mb-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Cookie className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Política de Cookies
                </CardTitle>
                <p className="text-amber-100 mt-2">
                  Información sobre el uso de cookies en NFLOW
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Company Info */}
        <Card className="mb-6 border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Responsable:</strong> EMPORDAJOBS SL • CIF: B02701100</p>
              <p><strong>Contacto:</strong> empordajobs@gmail.com • +34 660 45 21 36</p>
              <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
            </div>
          </CardContent>
        </Card>

        {/* What are cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cookie className="w-5 h-5 mr-2 text-amber-600" />
              ¿Qué son las cookies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando 
              visita un sitio web. Las cookies son ampliamente utilizadas para hacer que los sitios 
              web funcionen de manera más eficiente, así como para proporcionar información a los 
              propietarios del sitio.
            </p>
            <p className="text-gray-700">
              En NFLOW utilizamos cookies para mejorar su experiencia de usuario, personalizar 
              contenido y analizar el tráfico de nuestro sitio web.
            </p>
          </CardContent>
        </Card>

        {/* Types of cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tipos de cookies que utilizamos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Technical Cookies */}
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-800 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Cookies Técnicas (Necesarias)
                </h3>
                <Badge className="bg-green-600">Siempre activas</Badge>
              </div>
              <p className="text-green-700 text-sm mb-3">
                Estas cookies son esenciales para el funcionamiento básico del sitio web y no se pueden desactivar.
              </p>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• <strong>Sesión de usuario:</strong> Mantienen su sesión iniciada durante la navegación</li>
                <li>• <strong>Seguridad:</strong> Protegen contra ataques CSRF y otros riesgos de seguridad</li>
                <li>• <strong>Configuración básica:</strong> Idioma, zona horaria y preferencias técnicas</li>
                <li>• <strong>Carrito de servicios:</strong> Guardan los planes seleccionados</li>
              </ul>
            </div>

            {/* Functionality Cookies */}
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-800 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Cookies de Funcionalidad
                </h3>
                <Badge variant="outline" className="border-blue-600 text-blue-600">Configurables</Badge>
              </div>
              <p className="text-blue-700 text-sm mb-3">
                Mejoran la funcionalidad del sitio web y personalizan su experiencia.
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• <strong>Preferencias de usuario:</strong> Tema visual, configuración del dashboard</li>
                <li>• <strong>Chat personalizado:</strong> Configuración del asistente de IA</li>
                <li>• <strong>Filtros de búsqueda:</strong> Recordar categorías y preferencias</li>
                <li>• <strong>Accesibilidad:</strong> Tamaño de fuente y contraste</li>
              </ul>
            </div>

            {/* Analytics Cookies */}
            <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-800 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Cookies Analíticas
                </h3>
                <Badge variant="outline" className="border-purple-600 text-purple-600">Configurables</Badge>
              </div>
              <p className="text-purple-700 text-sm mb-3">
                Nos ayudan a entender cómo interactúa con el sitio web mediante información anónima.
              </p>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• <strong>Análisis de tráfico:</strong> Páginas más visitadas y comportamiento de usuarios</li>
                <li>• <strong>Métricas de rendimiento:</strong> Tiempo de carga y errores técnicos</li>
                <li>• <strong>Uso del chat:</strong> Frecuencia y patrones de conversación (anónimo)</li>
                <li>• <strong>Conversiones:</strong> Seguimiento de registros y suscripciones</li>
              </ul>
            </div>

            {/* Marketing Cookies */}
            <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-800 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Cookies de Marketing
                </h3>
                <Badge variant="outline" className="border-orange-600 text-orange-600">Configurables</Badge>
              </div>
              <p className="text-orange-700 text-sm mb-3">
                Se utilizan para mostrar contenido relevante y medir la eficacia de nuestras campañas.
              </p>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• <strong>Remarketing:</strong> Anuncios personalizados en otros sitios web</li>
                <li>• <strong>Redes sociales:</strong> Integración con LinkedIn y otras plataformas</li>
                <li>• <strong>Partners:</strong> Seguimiento de enlaces de socios y afiliados</li>
                <li>• <strong>Email marketing:</strong> Personalización de comunicaciones</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Third party cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies de terceros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Algunas cookies son establecidas por servicios de terceros que utilizamos para 
              mejorar la funcionalidad de nuestro sitio web:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">PayPal & Stripe</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Finalidad:</strong> Procesamiento seguro de pagos
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Duración:</strong> Sesión
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">OpenAI Services</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Finalidad:</strong> Procesamiento de conversaciones de IA
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Duración:</strong> 30 días
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Google Analytics</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Finalidad:</strong> Análisis de tráfico y comportamiento
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Duración:</strong> 2 años
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">CDN y Hosting</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Finalidad:</strong> Optimización de rendimiento
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Duración:</strong> 1 año
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gestión de cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Puede gestionar sus preferencias de cookies en cualquier momento a través de:
            </p>
            
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <Cookie className="w-4 h-4 mr-2" />
                  Panel de Configuración de Cookies
                </h4>
                <p className="text-amber-700 text-sm mb-3">
                  Acceda al panel de configuración desde cualquier página del sitio web
                </p>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  Configurar Cookies
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración del Navegador
                </h4>
                <p className="text-gray-700 text-sm mb-3">
                  También puede gestionar cookies directamente desde su navegador:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                  <li>• <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                  <li>• <strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                  <li>• <strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Duration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Duración de las cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Cookies de Sesión</h4>
                <p className="text-blue-600 font-bold text-lg">Temporal</p>
                <p className="text-blue-700 text-sm">Se eliminan al cerrar el navegador</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Cookies Funcionales</h4>
                <p className="text-green-600 font-bold text-lg">30 días</p>
                <p className="text-green-700 text-sm">Preferencias y configuración</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Cookies Analíticas</h4>
                <p className="text-purple-600 font-bold text-lg">2 años</p>
                <p className="text-purple-700 text-sm">Estadísticas y análisis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent and Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Consentimiento y derechos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              En cumplimiento del RGPD y la LSSI, solicitamos su consentimiento para el uso de 
              cookies no esenciales. Puede:
            </p>
            
            <ul className="space-y-2 text-gray-700">
              <li>• Aceptar o rechazar cookies específicas</li>
              <li>• Modificar sus preferencias en cualquier momento</li>
              <li>• Solicitar información sobre las cookies utilizadas</li>
              <li>• Retirar el consentimiento previamente otorgado</li>
            </ul>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-4 border-l-4 border-blue-400">
              <p className="text-blue-800 text-sm">
                Para ejercer estos derechos, contacte con nosotros en{" "}
                <a href="mailto:empordajobs@gmail.com" className="font-semibold hover:underline">
                  empordajobs@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final info */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-2">¿Tienes preguntas sobre nuestra política de cookies?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Estamos aquí para ayudarte con cualquier duda que puedas tener
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">📧 Email</p>
                  <p>empordajobs@gmail.com</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">📞 Teléfono</p>
                  <p>+34 660 45 21 36</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                <strong>Última actualización:</strong> 29 de enero de 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}