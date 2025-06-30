import { Link } from "wouter";
import { ArrowLeft, Scale, Building2, Globe, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AvisoLegal() {
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
        <Card className="mb-8 bg-gradient-to-r from-slate-600 to-gray-700 text-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Scale className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Aviso Legal
                </CardTitle>
                <p className="text-slate-200 mt-2">
                  Información legal sobre el uso de la plataforma NFLOW
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Company Information */}
        <Card className="mb-6 border-l-4 border-l-slate-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-slate-600" />
              Información Corporativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Razón Social:</strong> EMPORDAJOBS SL</p>
                <p><strong>CIF:</strong> B02701100</p>
                <p><strong>Domicilio Social:</strong> Portbou, Girona, España</p>
                <p><strong>Registro Mercantil:</strong> Girona</p>
              </div>
              <div>
                <p><strong>Email:</strong> empordajobs@gmail.com</p>
                <p><strong>Teléfono:</strong> +34 660 45 21 36</p>
                <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
                <p><strong>Web:</strong> nflow.app</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <h2>1. Información General</h2>
            <p>
              En cumplimiento de lo establecido en la Ley 34/2002, de 11 de julio, de Servicios 
              de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), EMPORDAJOBS SL 
              informa a los usuarios de la plataforma NFLOW de los siguientes datos:
            </p>
            <p>
              El presente aviso legal regula el uso de la plataforma NFLOW, propiedad de 
              EMPORDAJOBS SL. La navegación por la plataforma atribuye la condición de usuario 
              de la misma e implica la aceptación plena y sin reservas de todas las disposiciones 
              incluidas en este aviso legal.
            </p>

            <h2>2. Objeto y Finalidad</h2>
            <p>
              NFLOW es una plataforma digital que tiene como finalidad:
            </p>
            <ul>
              <li>Proporcionar apoyo psicológico mediante inteligencia artificial</li>
              <li>Facilitar acceso a recursos de salud mental</li>
              <li>Ofrecer herramientas de autoayuda y bienestar emocional</li>
              <li>Proporcionar un espacio seguro para el apoyo emocional</li>
              <li>Gestionar suscripciones para acceso premium</li>
              <li>Facilitar comunicación multiidioma</li>
            </ul>
            <p>
              <strong>Importante:</strong> La plataforma proporciona apoyo complementario y no 
              sustituye la atención médica profesional. En casos de emergencia, contacte 
              inmediatamente con servicios de emergencia.
            </p>

            <h2>3. Usuarios y Condiciones de Acceso</h2>
            
            <h3>3.1 Acceso General</h3>
            <p>
              El acceso y navegación en la plataforma requiere registro previo. Los servicios 
              premium requieren suscripción activa mediante PayPal o Stripe.
            </p>

            <h3>3.2 Registro de Usuarios</h3>
            <p>
              Para acceder a los servicios, los usuarios deberán registrarse proporcionando 
              datos veraces, exactos y actualizados. El usuario es responsable de mantener 
              la confidencialidad de sus credenciales de acceso.
            </p>

            <h3>3.3 Restricciones de Edad</h3>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <p className="text-orange-800 font-medium">
                La plataforma está diseñada para usuarios entre 12 y 95 años. Los menores de 
                edad deben contar con supervisión parental apropiada.
              </p>
            </div>

            <h2>4. Responsabilidades y Limitaciones</h2>
            
            <h3>4.1 Responsabilidad de la Plataforma</h3>
            <p>EMPORDAJOBS SL se compromete a:</p>
            <ul>
              <li>Mantener la funcionalidad y seguridad técnica de la plataforma</li>
              <li>Proteger los datos personales conforme al RGPD</li>
              <li>Proporcionar soporte técnico adecuado</li>
              <li>Garantizar la disponibilidad del servicio en condiciones normales</li>
              <li>Mantener la confidencialidad de las conversaciones</li>
            </ul>

            <h3>4.2 Limitación de Responsabilidad</h3>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <p className="text-red-800 font-medium mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Advertencias Importantes
              </p>
              <p className="text-red-700 text-sm">
                EMPORDAJOBS SL NO se hace responsable de:
              </p>
              <ul className="text-red-700 text-sm mt-2 space-y-1">
                <li>• El uso inadecuado de la plataforma como sustituto de atención médica profesional</li>
                <li>• Las decisiones tomadas basándose únicamente en las respuestas de la IA</li>
                <li>• Los daños derivados del uso inapropiado de la información proporcionada</li>
                <li>• La interrupción temporal del servicio por mantenimiento o causas técnicas</li>
                <li>• Los contenidos o enlaces de sitios web de terceros</li>
                <li>• Los resultados específicos del apoyo psicológico proporcionado</li>
              </ul>
            </div>

            <h3>4.3 Responsabilidad de los Usuarios</h3>
            <p>Los usuarios se comprometen a:</p>
            <ul>
              <li>Utilizar la plataforma de forma responsable y ética</li>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Respetar los derechos de terceros</li>
              <li>No utilizar la plataforma para fines ilegales o dañinos</li>
              <li>Entender las limitaciones de la IA como apoyo complementario</li>
              <li>Buscar ayuda profesional cuando sea necesario</li>
            </ul>

            <h2>5. Propiedad Intelectual e Industrial</h2>
            <p>
              Todos los contenidos de la plataforma, incluyendo textos, diseños, gráficos, 
              imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos 
              fuente, constituyen una obra cuya propiedad pertenece a EMPORDAJOBS SL.
            </p>
            
            <h3>Prohibiciones expresas:</h3>
            <ul>
              <li>La reproducción, distribución, comunicación pública y transformación</li>
              <li>La extracción y reutilización de la totalidad o parte sustancial</li>
              <li>El uso de contenidos para fines comerciales sin autorización</li>
              <li>La ingeniería inversa del código fuente</li>
              <li>La copia o imitación del diseño y funcionalidades</li>
            </ul>

            <p>
              Las marcas, nombres comerciales o signos distintivos son propiedad de 
              EMPORDAJOBS SL o de terceros, y su uso no está autorizado sin consentimiento expreso.
            </p>

            <h2>6. Protección de Datos Personales</h2>
            <p>
              EMPORDAJOBS SL cumple estrictamente con el Reglamento (UE) 2016/679 del Parlamento 
              Europeo (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y 
              garantía de los derechos digitales.
            </p>
            <p>
              Los datos personales recabados serán tratados de forma confidencial y únicamente 
              para las finalidades expresamente consentidas por el usuario.
            </p>
            <p>
              Para más información, consulte nuestra{" "}
              <Link href="/legal/privacidad">
                <a className="text-blue-600 hover:underline">Política de Privacidad</a>
              </Link>.
            </p>

            <h2>7. Política de Enlaces</h2>
            
            <h3>7.1 Enlaces Salientes</h3>
            <p>
              La plataforma puede contener enlaces a otros sitios web de terceros (recursos 
              externos, servicios de pago, etc.). EMPORDAJOBS SL no se hace responsable del 
              contenido, políticas de privacidad o prácticas de dichos sitios web.
            </p>

            <h3>7.2 Enlaces Entrantes</h3>
            <p>
              Los enlaces hacia nuestra plataforma deben dirigirse únicamente a la página 
              principal, salvo autorización expresa. Queda prohibido el deep-linking sin consentimiento.
            </p>

            <h2>8. Servicios de Pago</h2>
            <p>
              La plataforma ofrece servicios premium mediante suscripción. Los pagos se 
              procesan a través de:
            </p>
            <ul>
              <li><strong>PayPal:</strong> Procesamiento seguro con cifrado SSL</li>
              <li><strong>Stripe:</strong> Pasarela de pago certificada PCI DSS</li>
            </ul>
            <p>
              Las suscripciones se renuevan automáticamente. Los usuarios pueden cancelar 
              en cualquier momento desde su panel de usuario.
            </p>

            <h2>9. Modificaciones</h2>
            <p>
              EMPORDAJOBS SL se reserva el derecho de modificar, sin previo aviso, el presente 
              aviso legal, así como las condiciones de uso de la plataforma. Dichas modificaciones 
              serán publicadas en la plataforma.
            </p>
            <p>
              Es responsabilidad del usuario revisar periódicamente estos términos para 
              mantenerse informado de cualquier cambio.
            </p>

            <h2>10. Duración y Terminación</h2>
            <p>
              El presente aviso legal tiene carácter indefinido. EMPORDAJOBS SL se reserva 
              el derecho de suspender temporalmente o finalizar definitivamente el acceso 
              a la plataforma, sin previo aviso, en caso de incumplimiento de las condiciones 
              establecidas.
            </p>

            <h2>11. Legislación Aplicable y Jurisdicción</h2>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
              <p className="font-semibold text-gray-800 mb-2 flex items-center">
                <Scale className="w-4 h-4 mr-2" />
                Jurisdicción y Ley Aplicable
              </p>
              <p className="text-gray-700 text-sm">
                El presente aviso legal se rige por la <strong>legislación española</strong>. 
                Para la resolución de cualquier controversia que pudiera derivarse del acceso 
                o uso de la plataforma, las partes se someten expresamente a la jurisdicción 
                de los <strong>Juzgados y Tribunales de Girona</strong>.
              </p>
              <p className="text-gray-600 text-xs mt-2">
                En caso de que alguna cláusula del presente aviso legal sea declarada nula 
                o inaplicable, las restantes cláusulas seguirán siendo válidas y aplicables.
              </p>
            </div>

            <h2>12. Emergencias y Recursos de Ayuda</h2>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ En caso de emergencia:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>🚨 <strong>Emergencias:</strong> 112 (número único europeo)</li>
                <li>🏥 <strong>Urgencias médicas:</strong> 061</li>
                <li>💭 <strong>Teléfono de la Esperanza:</strong> 717 003 717</li>
                <li>📞 <strong>Línea contra el Suicidio:</strong> 024</li>
              </ul>
              <p className="text-red-600 text-xs mt-2">
                Si experimenta pensamientos de autolesión o suicidio, busque ayuda inmediata 
                contactando con servicios de emergencia o acudiendo al centro de salud más cercano.
              </p>
            </div>

            <h2>13. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con este aviso legal, puede contactar con nosotros:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    EMPORDAJOBS SL
                  </h4>
                  <p className="text-sm text-gray-600">
                    <strong>CIF:</strong> B02701100<br />
                    <strong>Domicilio:</strong> Portbou, Girona, España
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Información de Contacto
                  </h4>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> empordajobs@gmail.com<br />
                    <strong>Teléfono:</strong> +34 660 45 21 36<br />
                    <strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  <strong>Fecha de última actualización:</strong> 29 de enero de 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}