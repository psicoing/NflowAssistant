import { Building2, Users, Heart, ArrowRight, Briefcase, Hospital, GraduationCap, Building, Gift, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
        title="Acceso a NUXA | Licencias Empresariales y Sorteo Gratuito"
        description="NUXA funciona mediante licencias corporativas. También puedes acceder gratis participando en nuestro sorteo mensual de 30 días."
        canonicalUrl="/registro"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                ¿Cómo acceder a NUXA?
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tienes dos formas de experimentar todo el potencial de nuestro asistente de salud mental con IA
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">

              <Card className="border-2 border-emerald-300 shadow-xl overflow-hidden relative group hover:shadow-2xl transition-shadow">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-emerald-500 text-white text-xs px-3 py-1 animate-pulse">
                    <Gift className="w-3 h-3 mr-1" />
                    100% Gratis
                  </Badge>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-9 h-9" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">
                    Sorteo Mensual Gratuito
                  </h2>
                  <p className="text-emerald-100 text-sm">
                    Acceso completo durante 30 días
                  </p>
                </div>
                <CardContent className="p-5 bg-gradient-to-b from-emerald-50/50 to-white">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    <strong>¡Puedes acceder gratis sin abonar nada!</strong> Cada mes sorteamos accesos completos 
                    para que cualquier persona pueda experimentar NUXA sin coste alguno.
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Chat interactivo ilimitado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Soporte en +150 idiomas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Sin tarjeta de crédito</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Sin compromiso alguno</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>¿Cómo funciona?</strong> Deja tu correo electrónico. Cada mes seleccionamos 
                        participantes al azar y les activamos 30 días de acceso completo. Sin spam.
                      </p>
                    </div>
                  </div>

                  <Link href="/sorteo-recursos">
                    <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                      <Gift className="w-5 h-5 mr-2" />
                      Participar en el sorteo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Solo necesitas tu correo electrónico
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-9 h-9" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">
                    Licencia Corporativa
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Acceso continuo para organizaciones
                  </p>
                </div>
                <CardContent className="p-5">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          El registro individual no está disponible
                        </p>
                        <p className="text-xs text-gray-600">
                          NUXA opera mediante <strong>licencias de software</strong> contratadas por empresas, 
                          entidades públicas y centros de salud.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Los usuarios particulares acceden a NUXA a través de su entorno laboral o comunitario. 
                    Solicita a tu organización que active NUXA.
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Cumple ISO 45003</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Panel de gestión empresarial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Soporte dedicado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Planes desde 50.000 usuarios</span>
                    </div>
                  </div>

                  <a href="https://jobda.org/partners" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                      <Building2 className="w-5 h-5 mr-2" />
                      Información para empresas
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Contacto directo con nuestro equipo comercial
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200 shadow-lg overflow-hidden mb-6">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    ¿Quieres usar NUXA? Solicita a tu entorno que lo licencie
                  </h3>
                  
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
            
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
