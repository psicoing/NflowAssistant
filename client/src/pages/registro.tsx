import { ArrowRight, Gift, Sparkles, User } from "lucide-react";
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
        title="Acceso a NUXA | Planes Individuales, Sorteo Gratuito y Licencias"
        description="Accede a NUXA con planes individuales desde €2.99/mes, participa en el sorteo mensual gratuito o solicita una licencia corporativa."
        canonicalUrl="/registro"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-5xl mx-auto">

            {/* Banner ACTIVO */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-red-600 text-white font-bold text-sm px-5 py-2 rounded-full shadow-lg animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                ACTIVO
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                ¿Cómo acceder a NUXA?
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Elige la opción que mejor se adapte a ti
              </p>
            </div>

            {/* Aviso próximamente - planes individuales */}
            <Card className="border-2 border-purple-200 shadow-xl overflow-hidden mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-60" />
              <CardContent className="relative p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-9 h-9 text-white" />
                  </div>
                </div>
                <Badge className="bg-purple-600 text-white text-sm px-4 py-1.5 mb-4 shadow">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Próximamente
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Planes individuales para personas
                </h2>
                <p className="text-gray-600 text-base max-w-lg mx-auto leading-relaxed mb-5">
                  Muy pronto podrás registrarte en NUXA de forma individual y acceder a planes personales 
                  desde <strong>€2.99/mes</strong>. Apoyo emocional con IA, disponible 24/7 en +150 idiomas.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-purple-100">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span className="text-gray-600">Plan Básico desde €2.99/mes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-purple-100">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span className="text-gray-600">Plan Pro €5.99/mes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-purple-100">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span className="text-gray-600">Plan Anual €32/año</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-purple-600 underline font-medium">Iniciar sesión</Link>
                </p>
              </CardContent>
            </Card>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 text-sm text-gray-400">o accede de otra forma</span>
              </div>
            </div>

            {/* Sorteo */}
            <div className="max-w-xl mx-auto mb-8">
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
                  <h2 className="text-xl font-bold mb-1">Sorteo Mensual Gratuito</h2>
                  <p className="text-emerald-100 text-sm">Acceso completo durante 30 días</p>
                </div>
                <CardContent className="p-5 bg-gradient-to-b from-emerald-50/50 to-white">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    <strong>¡Puedes acceder gratis sin abonar nada!</strong> Cada mes sorteamos accesos completos 
                    para que cualquier persona pueda experimentar NUXA sin coste alguno.
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {["Chat interactivo ilimitado", "Soporte en +150 idiomas", "Sin tarjeta de crédito", "Sin compromiso alguno"].map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>¿Cómo funciona?</strong> Deja tu correo. Cada mes seleccionamos participantes al azar y les activamos 30 días de acceso completo. Sin spam.
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
                  <p className="text-xs text-gray-400 text-center mt-2">Solo necesitas tu correo electrónico</p>
                </CardContent>
              </Card>
            </div>

            
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
