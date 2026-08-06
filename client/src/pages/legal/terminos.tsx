import { Link } from "wouter";
import { ArrowLeft, Shield, FileText, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";

export default function TerminosCondiciones() {
  return (
    <>
      <SEOHead
        title="Términos y Condiciones de Uso | NUXA"
        description="Términos y condiciones de uso de NUXA, plataforma de psicología IA. Conoce tus derechos, obligaciones y las condiciones que rigen el uso del servicio."
        canonicalUrl="https://nuxa.life/legal/terminos"
        ogUrl="https://nuxa.life/legal/terminos"
      />
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
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Términos y Condiciones
                </CardTitle>
                <p className="text-blue-100 mt-2">
                  EMPORDAJOBS SL - NUXA Platform
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Company Info */}
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Información de la Empresa</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Razón Social:</strong> EMPORDAJOBS SL</p>
                  <p><strong>CIF:</strong> B02701100</p>
                  <p><strong>Domicilio:</strong> Portbou, Girona, España</p>
                  <p><strong>Email:</strong> empordajobs@gmail.com</p>
                  <p><strong>Teléfono:</strong> +34 660 45 21 36</p>
                  <p><strong>Horario:</strong> Lunes a Viernes: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <h2>1. Objeto y Aceptación</h2>
            <p>
              Los presentes Términos y Condiciones regulan el uso de la plataforma digital NUXA, 
              propiedad de EMPORDAJOBS SL (en adelante, "la Empresa"), con CIF B02701100 y domicilio 
              en Portbou, Girona, España.
            </p>
            <p>
              El acceso y uso de la plataforma implica la aceptación expresa e íntegra de estos 
              términos y condiciones. Si no está de acuerdo con alguna de las condiciones, le 
              rogamos que no utilice nuestros servicios.
            </p>

            <h2>2. Descripción del Servicio</h2>
            <p>
              NUXA es una aplicación para la salud mental de personas individuales, familias y trabajadores. 
              Ofrece soluciones innovadoras que integren salud mental y desarrollo laboral, alineadas con los 
              principios de la normativa ISO 45003, centrada en el bienestar psicológico en el entorno de trabajo. 
              NUXA funciona como un recurso digital de apoyo emocional continuo que proporciona:
            </p>
            <ul>
              <li>Asistente conversacional de apoyo psicológico basado en IA</li>
              <li>Sistema de suscripciones para acceso premium</li>
              <li>Recursos educativos sobre salud mental</li>
              <li>Gestión de conversaciones y historiales</li>
              <li>Herramientas de autoayuda y bienestar</li>
              <li>Soporte multiidioma</li>
            </ul>

            <h2>3. Registro y Verificación</h2>
            <p>
              Para acceder a los servicios de la plataforma, los usuarios deben registrarse 
              proporcionando información veraz y actualizada. El registro incluye:
            </p>
            <ul>
              <li>Datos de identificación básicos</li>
              <li>Información de contacto válida</li>
              <li>Aceptación de términos y condiciones</li>
              <li>Configuración de preferencias de perfil</li>
            </ul>

            <h2>4. Planes de Suscripción</h2>
            <p>
              La plataforma ofrece diferentes opciones de suscripción:
            </p>
            <ul>
              <li><strong>Plan Básico:</strong> €2.99/mes - Acceso completo al chat de apoyo</li>
              <li><strong>Plan Grupal:</strong> €4.99/mes - Funcionalidades adicionales</li>
              <li><strong>Plan Individual:</strong> €6.99/mes - Soporte personalizado premium</li>
            </ul>
            <p>
              Los pagos se procesan de forma segura mediante PayPal y Stripe. Las suscripciones 
              se renuevan automáticamente salvo cancelación expresa.
            </p>

            <h2>5. Responsabilidades</h2>
            <h3>5.1 De la Plataforma</h3>
            <ul>
              <li>Mantener la funcionalidad y seguridad de la plataforma</li>
              <li>Proteger los datos personales según RGPD</li>
              <li>Proporcionar soporte técnico adecuado</li>
              <li>Garantizar la disponibilidad del servicio</li>
            </ul>

            <h3>5.2 De los Usuarios</h3>
            <ul>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Utilizar la plataforma de forma responsable</li>
              <li>Mantener la confidencialidad de sus credenciales</li>
              <li>Respetar los términos de uso establecidos</li>
            </ul>

            <h2>6. Protección de Datos</h2>
            <p>
              EMPORDAJOBS SL cumple estrictamente con el Reglamento General de Protección de 
              Datos (RGPD) y la Ley Orgánica de Protección de Datos (LOPD). Los datos personales 
              se tratan con las máximas garantías de seguridad y confidencialidad.
            </p>
            <p>
              Para más información, consulte nuestra{" "}
              <Link href="/legal/privacidad">
                <a className="text-blue-600 hover:underline">Política de Privacidad</a>
              </Link>.
            </p>

            <h2>7. Limitación de Responsabilidad</h2>
            <p>
              EMPORDAJOBS SL proporciona una herramienta de apoyo psicológico mediante IA, 
              pero no sustituye la atención médica profesional. Los usuarios deben:
            </p>
            <ul>
              <li>Consultar profesionales cualificados para problemas graves</li>
              <li>No depender exclusivamente de los consejos de la IA</li>
              <li>Buscar ayuda inmediata en casos de emergencia</li>
              <li>Entender que la plataforma es complementaria, no sustitutiva</li>
            </ul>

            <h2>8. Propiedad Intelectual</h2>
            <p>
              Todos los derechos de propiedad intelectual de la plataforma NUXA, incluyendo 
              diseño, código, marca y contenidos, pertenecen a EMPORDAJOBS SL.
            </p>
            <p>
              Queda prohibida la reproducción, distribución o modificación no autorizada de 
              cualquier elemento de la plataforma.
            </p>

            <h2>9. Modificaciones</h2>
            <p>
              EMPORDAJOBS SL se reserva el derecho de modificar estos términos y condiciones 
              en cualquier momento. Los cambios serán notificados a los usuarios con la debida 
              antelación y entrarán en vigor tras su publicación en la plataforma.
            </p>

            <h2>10. Legislación Aplicable</h2>
            <p>
              Estos términos y condiciones se rigen por la legislación española. Para cualquier 
              controversia que pudiera derivarse, las partes se someten a la jurisdicción de 
              los Juzgados y Tribunales de Girona.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mt-8">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Fecha de última actualización:</strong> 29 de enero de 2025
              </p>
              <p className="text-sm text-gray-600">
                Para cualquier duda sobre estos términos, contacte con nosotros en{" "}
                <a href="mailto:empordajobs@gmail.com" className="text-blue-600 hover:underline">
                  empordajobs@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}