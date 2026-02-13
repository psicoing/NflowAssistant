import { Building2, Users, Heart, ArrowRight, Mail, Briefcase, Hospital, GraduationCap, Building, Gift, Sparkles, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Registro() {
  return (
    <>
      <SEOHead 
        title="Acceso a NUXA | Licencias Empresariales"
        description="NUXA funciona mediante licencias corporativas. Solicita a tu empresa, centro de salud o entidad pública que active NUXA para ti. También puedes participar en nuestro sorteo mensual gratuito."
        canonicalUrl="/registro"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto">

            <Card className="border-2 border-emerald-300 shadow-xl overflow-hidden mb-6 relative">
              <div className="absolute top-3 right-3">
                <Badge className="bg-emerald-500 text-white text-xs px-3 py-1 animate-pulse">
                  <Gift className="w-3 h-3 mr-1" />
                  100% Gratis
                </Badge>
              </div>
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white text-center">
                <PartyPopper className="w-14 h-14 mx-auto mb-3 opacity-90" />
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  ¡Puedes acceder <span className="text-yellow-300">gratis</span> sin abonar nada!
                </h2>
                <p className="text-emerald-100 text-lg">
                  Sorteo mensual de acceso completo durante 30 días
                </p>
              </div>
              <CardContent className="p-6 bg-gradient-to-b from-emerald-50 to-white">
                <div className="text-center mb-5">
                  <p className="text-gray-700 text-base leading-relaxed">
                    En NUXA creemos que la <strong>salud mental no debería ser un lujo</strong>. 
                    Por eso, cada mes sorteamos accesos completos para que cualquier persona pueda 
                    experimentar todo el potencial de nuestro asistente de IA — <strong>sin coste alguno</strong>.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                    <span className="text-emerald-500 font-bold text-lg">✓</span>
                    <span className="text-sm text-gray-700">Chat interactivo ilimitado</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                    <span className="text-emerald-500 font-bold text-lg">✓</span>
                    <span className="text-sm text-gray-700">Soporte en +150 idiomas</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                    <span className="text-emerald-500 font-bold text-lg">✓</span>
                    <span className="text-sm text-gray-700">Recursos psicológicos guiados</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                    <span className="text-emerald-500 font-bold text-lg">✓</span>
                    <span className="text-sm text-gray-700">Herramientas prácticas diarias</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>¿Cómo funciona?</strong> Deja tu correo electrónico en nuestra página del sorteo. 
                        Cada mes seleccionamos participantes al azar y les activamos un acceso completo de 30 días. 
                        Sin spam, sin compromiso, sin datos bancarios.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/sorteo-recursos">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                      <Gift className="w-5 h-5 mr-2" />
                      Participar en el sorteo gratuito
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 mt-3">
                    Solo necesitas tu correo electrónico · Sin tarjeta de crédito · Sin compromiso
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
                <Building2 className="w-16 h-16 mx-auto mb-4 opacity-90" />
                <h1 className="text-3xl font-bold mb-2">
                  NUXA funciona por licencias
                </h1>
                <p className="text-blue-100 text-lg">
                  Bienestar psicológico para organizaciones
                </p>
              </div>
              
              <CardContent className="p-8">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        El registro individual no está disponible
                      </h2>
                      <p className="text-gray-700">
                        NUXA opera exclusivamente mediante <strong>licencias de software</strong> contratadas por empresas, 
                        entidades públicas, centros de salud y organizaciones. Los usuarios particulares acceden 
                        a través de su entorno laboral o comunitario.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    ¿Quieres usar NUXA?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Si estás interesado/a en acceder a NUXA, solicita a tu entorno que lo licencie:
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <Briefcase className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Tu empresa</h4>
                      <p className="text-sm text-gray-600">Recursos Humanos o Prevención de Riesgos Laborales</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <Hospital className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Tu centro de salud</h4>
                      <p className="text-sm text-gray-600">Atención primaria o salud mental</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <GraduationCap className="w-8 h-8 text-purple-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Tu centro educativo</h4>
                      <p className="text-sm text-gray-600">Universidad, instituto o colegio</p>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <Building className="w-8 h-8 text-amber-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Entidad pública</h4>
                      <p className="text-sm text-gray-600">Ayuntamiento, servicios sociales, etc.</p>
                    </div>
                  </div>
                </div>

                {/* Sección motivacional - Anima a tu entorno */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                      </div>
                      <h3 className="text-xl font-bold">
                        ¡Anima a tu entorno a activar NUXA!
                      </h3>
                    </div>
                    
                    <p className="text-white/90 mb-4 leading-relaxed">
                      El bienestar psicológico debería ser accesible para todos. Si crees que NUXA puede ayudar 
                      a las personas de tu empresa, centro de salud o comunidad, <strong>¡propónlo!</strong>
                    </p>
                    
                    <div className="bg-white/15 rounded-xl p-4 mb-4">
                      <p className="text-sm font-medium mb-2">💡 Puedes decir algo como:</p>
                      <p className="text-white/90 text-sm italic">
                        "He conocido NUXA, una herramienta de IA para el bienestar emocional. 
                        Creo que podría ser útil para nuestro equipo. ¿Podríamos valorar activarla?"
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <span>✓</span> Reduce el estrés laboral
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <span>✓</span> Apoyo 24/7 en +150 idiomas
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <span>✓</span> Cumple ISO 45003
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8 border border-indigo-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    💼 ¿Representas a una organización?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    NUXA ofrece licencias flexibles para empresas públicas y privadas, 
                    con planes adaptados a cualquier tamaño de organización.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">ISO 45003</Badge>
                    <Badge className="bg-green-100 text-green-700 border-green-200">Bienestar laboral</Badge>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">+150 idiomas</Badge>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">IA 24/7</Badge>
                  </div>
                  <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Información para empresas
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>

                <div className="text-center border-t border-gray-200 pt-6">
                  <p className="text-gray-500 text-sm mb-4">
                    ¿Ya tienes acceso a través de tu organización?
                  </p>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Iniciar sesión
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 p-4 bg-gray-100 rounded-xl">
                  <p className="text-xs text-gray-500 text-center">
                    <strong>¿Por qué este modelo?</strong> NUXA prioriza la seguridad y el marco legal. 
                    Al operar mediante licencias corporativas, garantizamos un entorno controlado y 
                    profesional para el bienestar psicológico de los usuarios.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Link href="/sorteo-recursos">
                <Button variant="link" className="text-blue-600">
                  Mientras tanto, explora nuestros recursos gratuitos →
                </Button>
              </Link>
            </div>
            
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
