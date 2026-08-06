import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEOHead } from "@/components/SEOHead";

export default function PoliticaPrivacidad() {
  return (
    <>
      <SEOHead
        title="Política de Privacidad | NUXA"
        description="Política de privacidad de NUXA. Cómo recogemos, usamos y protegemos tus datos personales conforme al RGPD y la LOPD española."
        canonicalUrl="https://nuxa.life/legal/privacidad"
        ogUrl="https://nuxa.life/legal/privacidad"
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
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Política de Privacidad
                </CardTitle>
                <p className="text-green-100 mt-2">
                  Protección de Datos Personales - RGPD
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Responsable del Tratamiento */}
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Responsable del Tratamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Denominación:</strong> EMPORDAJOBS SL</p>
                <p><strong>CIF:</strong> B02701100</p>
                <p><strong>Domicilio:</strong> Portbou, Girona, España</p>
                <p><strong>Actividad:</strong> Servicios digitales sanitarios</p>
              </div>
              <div>
                <p><strong>Email DPO:</strong> empordajobs@gmail.com</p>
                <p><strong>Teléfono:</strong> +34 660 45 21 36</p>
                <p><strong>Asunto:</strong> "Protección de Datos"</p>
                <p><strong>Horario:</strong> L-V 9:00-18:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RGPD Compliance Alert */}
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Compromiso RGPD:</strong> Tratamos sus datos personales con las máximas garantías 
            de seguridad, confidencialidad y transparencia, aplicando las medidas técnicas y organizativas 
            más avanzadas.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <h2>1. Información General</h2>
            <p>
              En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo (RGPD) y la 
              Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía 
              de los derechos digitales, EMPORDAJOBS SL informa sobre el tratamiento de datos 
              personales que realizamos a través de la plataforma NUXA.
            </p>

            <h2>2. Datos Personales que Tratamos</h2>
            
            <h3>2.1 Datos de Identificación</h3>
            <ul>
              <li>Nombre de usuario y contraseña</li>
              <li>Información de perfil (edad, género)</li>
              <li>Fecha de registro y última conexión</li>
              <li>Preferencias de usuario</li>
            </ul>

            <h3>2.2 Datos de Contacto</h3>
            <ul>
              <li>Dirección de correo electrónico</li>
              <li>Información de suscripción</li>
              <li>Preferencias de comunicación</li>
              <li>Datos de facturación (si aplica)</li>
            </ul>

            <h3>2.3 Datos de Salud Mental - Especial Protección</h3>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <p className="text-orange-800 font-medium mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Categoría Especial de Datos (Art. 9 RGPD)
              </p>
              <ul className="text-orange-700 text-sm">
                <li>Conversaciones del chat de apoyo psicológico</li>
                <li>Información sobre estado emocional</li>
                <li>Consultas relacionadas con salud mental</li>
                <li>Historial de interacciones con la IA</li>
              </ul>
            </div>

            <h3>2.4 Datos Técnicos y de Navegación</h3>
            <ul>
              <li>Dirección IP y datos de conexión</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y tiempo de navegación</li>
              <li>Cookies y tecnologías similares</li>
            </ul>

            <h2>3. Finalidades del Tratamiento</h2>
            
            <h3>Gestión de la Plataforma</h3>
            <ul>
              <li>Registro y autenticación de usuarios</li>
              <li>Gestión de perfiles y preferencias</li>
              <li>Soporte técnico y atención al cliente</li>
              <li>Procesamiento de suscripciones</li>
            </ul>

            <h3>Servicios de Apoyo Psicológico</h3>
            <ul>
              <li>Facilitación del chat de apoyo emocional</li>
              <li>Gestión de conversaciones e historial</li>
              <li>Personalización de respuestas de IA</li>
              <li>Mejora de la calidad del servicio</li>
            </ul>

            <h3>Comercial y Marketing</h3>
            <ul>
              <li>Procesamiento de pagos mediante PayPal/Stripe</li>
              <li>Gestión de facturación y cobros</li>
              <li>Envío de comunicaciones (con consentimiento)</li>
              <li>Análisis de uso y mejoras</li>
            </ul>

            <h2>4. Base Jurídica del Tratamiento</h2>
            
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Consentimiento (Art. 6.1.a RGPD)</h4>
                <p className="text-blue-700 text-sm">
                  Para el tratamiento de datos de salud mental y comunicaciones comerciales.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Ejecución de Contrato (Art. 6.1.b RGPD)</h4>
                <p className="text-green-700 text-sm">
                  Para la prestación de servicios de la plataforma y gestión de suscripciones.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Interés Legítimo (Art. 6.1.f RGPD)</h4>
                <p className="text-purple-700 text-sm">
                  Para análisis estadísticos, mejoras técnicas y seguridad de la plataforma.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Obligación Legal (Art. 6.1.c RGPD)</h4>
                <p className="text-orange-700 text-sm">
                  Para cumplimiento de obligaciones fiscales y contables.
                </p>
              </div>
            </div>

            <h2>5. Destinatarios de los Datos</h2>
            <p>Sus datos personales pueden ser comunicados a:</p>
            
            <h3>Proveedores de Servicios</h3>
            <ul>
              <li><strong>PayPal/Stripe:</strong> Procesamiento de pagos con garantías adecuadas</li>
              <li><strong>OpenAI:</strong> Procesamiento de conversaciones para respuestas de IA</li>
              <li><strong>Proveedores de hosting:</strong> Almacenamiento seguro de datos</li>
            </ul>

            <h3>Autoridades Competentes</h3>
            <p>Solo cuando sea requerido por ley (autoridades sanitarias, fiscales, judiciales).</p>

            <Alert className="my-4 border-red-200 bg-red-50">
              <Eye className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Importante:</strong> No vendemos, alquilamos ni compartimos sus datos personales 
                con terceros para fines comerciales.
              </AlertDescription>
            </Alert>

            <h2>6. Conservación de Datos</h2>
            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Datos de Usuario</h4>
                  <p>Mientras mantenga activa su cuenta</p>
                  <p className="text-gray-600">+ 1 año tras baja para reclamaciones</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Conversaciones de Chat</h4>
                  <p>Según preferencias del usuario</p>
                  <p className="text-gray-600">Máximo 5 años desde última actividad</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Datos de Navegación</h4>
                  <p>Máximo 13 meses para cookies</p>
                  <p className="text-gray-600">Logs de acceso: 1 año</p>
                </div>
              </div>
            </div>

            <h2>7. Sus Derechos RGPD</h2>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h4 className="font-semibold">Acceso</h4>
                    <p className="text-sm text-gray-600">Obtener información sobre qué datos tratamos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">✏️</span>
                  <div>
                    <h4 className="font-semibold">Rectificación</h4>
                    <p className="text-sm text-gray-600">Corregir datos inexactos o incompletos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🗑️</span>
                  <div>
                    <h4 className="font-semibold">Supresión</h4>
                    <p className="text-sm text-gray-600">Eliminar sus datos cuando sea posible</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⏸️</span>
                  <div>
                    <h4 className="font-semibold">Limitación</h4>
                    <p className="text-sm text-gray-600">Restringir el tratamiento en ciertos casos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="font-semibold">Portabilidad</h4>
                    <p className="text-sm text-gray-600">Recibir sus datos en formato estructurado</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="font-semibold">Oposición</h4>
                    <p className="text-sm text-gray-600">Oponerse al tratamiento por motivos particulares</p>
                  </div>
                </div>
              </div>
            </div>

            <h3>Cómo ejercer sus derechos</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">📧 Contacto para ejercer derechos:</p>
              <p className="text-blue-700 text-sm">
                Envíe un email a: <strong>empordajobs@gmail.com</strong><br />
                Incluya: Asunto "Ejercicio de Derechos RGPD", descripción clara del derecho que desea ejercer
              </p>
            </div>

            <h2>8. Medidas de Seguridad</h2>
            <p>Implementamos medidas técnicas y organizativas apropiadas:</p>
            
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Medidas Técnicas
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Cifrado SSL/TLS en todas las comunicaciones</li>
                  <li>• Sistemas de autenticación robustos</li>
                  <li>• Copias de seguridad regulares</li>
                  <li>• Monitorización de seguridad 24/7</li>
                  <li>• Actualizaciones periódicas de software</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Medidas Organizativas
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Formación regular del personal</li>
                  <li>• Políticas de acceso por roles</li>
                  <li>• Auditorías internas periódicas</li>
                  <li>• Procedimientos de gestión de incidentes</li>
                  <li>• Evaluaciones de impacto en la privacidad</li>
                </ul>
              </div>
            </div>

            <h2>9. Reclamaciones</h2>
            <p>
              Tiene derecho a presentar una reclamación ante la Agencia Española de Protección 
              de Datos (AEPD) si considera que el tratamiento de sus datos personales infringe 
              la normativa aplicable.
            </p>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400 my-4">
              <h4 className="font-semibold text-red-800 mb-2">Agencia Española de Protección de Datos</h4>
              <p className="text-red-700 text-sm">
                <strong>Web:</strong> www.aepd.es<br />
                <strong>Teléfono:</strong> 912 663 517<br />
                <strong>Dirección:</strong> Calle Jorge Juan, 6 - 28001 Madrid
              </p>
            </div>

            <h2>10. Contacto</h2>
            <p>
              Para cualquier consulta sobre esta política de privacidad o el tratamiento de 
              sus datos personales, puede contactarnos:
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mt-8">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">📧 Email</p>
                  <p>empordajobs@gmail.com</p>
                  <p className="text-gray-600">Asunto: "Protección de Datos"</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">📞 Teléfono</p>
                  <p>+34 660 45 21 36</p>
                  <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                <strong>Fecha de última actualización:</strong> 29 de enero de 2025 • <strong>Versión:</strong> 1.0
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}