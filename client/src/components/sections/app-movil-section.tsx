import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Smartphone, Download, Bell, Shield, Zap, Globe, Apple, PlayCircle, Star } from "lucide-react";

const appFeatures = [
  {
    icon: Bell,
    title: "Notificaciones Inteligentes",
    description: "Recordatorios personalizados para ejercicios de bienestar y seguimiento del estado de ánimo"
  },
  {
    icon: Shield,
    title: "Modo Offline",
    description: "Accede a recursos esenciales y ejercicios de relajación sin conexión a internet"
  },
  {
    icon: Zap,
    title: "Respuesta Instantánea",
    description: "Chat optimizado para móvil con respuestas de IA ultra-rápidas"
  },
  {
    icon: Globe,
    title: "Sincronización Multi-dispositivo",
    description: "Continúa tus conversaciones desde cualquier dispositivo sin perder el contexto"
  }
];

const appBenefits = [
  "Acceso inmediato en situaciones de crisis",
  "Interfaz optimizada para uso con una mano",
  "Consumo mínimo de batería y datos",
  "Privacidad y seguridad máxima",
  "Funciones exclusivas para móvil"
];

export default function AppMovilSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="app-movil" className="px-4 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center sm:mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Smartphone className="h-9 w-9 text-[#557d65]" />
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#173e3d] sm:text-5xl">
              Aplicación Móvil
            </h2>
          </div>
          <p className="mx-auto max-w-3xl text-base leading-7 text-[#526b68] sm:text-lg">
            Lleva tu bienestar mental siempre contigo. Nuestra app móvil te ofrece 
            todas las funcionalidades de NUXA optimizadas para tu smartphone.
          </p>
        </div>

        <div className="mb-12 grid items-center gap-10 rounded-[1.75rem] border border-[#cbded6] bg-[#eaf1eb] p-5 sm:p-8 lg:mb-14 lg:grid-cols-2 lg:gap-12 lg:p-10">
          {/* Phone Mockup */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="rounded-[3rem] border border-[#607c73] bg-[#173e3d] p-3 shadow-[0_28px_55px_-30px_rgba(17,62,61,0.65)]">
                <div className="h-[560px] w-[min(280px,calc(100vw-5rem))] overflow-hidden rounded-[2.5rem] bg-[#123f43] p-4">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-white text-xs mb-4">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white/50 rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* App Header */}
                  <div className="mb-4 rounded-2xl border border-white/10 bg-[#174f50] p-4">
                    <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f6ef] p-1">
                        <img src="/favicon.png" alt="NUXA" className="w-full h-full rounded-md" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">NUXA</h3>
                        <p className="text-white/80 text-xs">Tu asistente de bienestar</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Preview */}
                  <div className="mb-4 space-y-3">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/10 p-3">
                      <p className="text-sm text-[#f2f4e8]">¡Hola! ¿Cómo te sientes hoy?</p>
                    </div>
                    <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#d6e69a] p-3">
                      <p className="text-sm text-[#173e3d]">Me siento algo ansioso...</p>
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/10 p-3">
                      <p className="text-sm text-[#f2f4e8]">Te entiendo. Vamos a practicar una técnica de respiración.</p>
                    </div>
                  </div>

                  {/* Features Icons */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="rounded-xl bg-[#3f7772] p-2 text-center">
                      <Bell className="w-4 h-4 text-white mx-auto" />
                    </div>
                    <div className="rounded-xl bg-[#60866d] p-2 text-center">
                      <Shield className="w-4 h-4 text-white mx-auto" />
                    </div>
                    <div className="rounded-xl bg-[#55776a] p-2 text-center">
                      <Zap className="w-4 h-4 text-white mx-auto" />
                    </div>
                    <div className="rounded-xl bg-[#718b70] p-2 text-center">
                      <Globe className="w-4 h-4 text-white mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -right-3 -top-3 rounded-full border border-[#cbded6] bg-[#f3f6ef] p-2 text-[#47736a]">
                <Download className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-7">
            <h3 className="mb-7 text-2xl font-semibold tracking-[-0.035em] text-[#173e3d] sm:text-3xl">
              Funcionalidades Exclusivas
            </h3>
            
            {appFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4 border-b border-[#cbded6] pb-5 last:border-0">
                  <div className="flex-shrink-0 rounded-xl bg-[#dce8dc] p-2.5 text-[#47736a]">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-[#234844]">{feature.title}</h4>
                    <p className="text-sm leading-6 text-[#647b75]">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12 rounded-[1.5rem] border border-[#cbded6] bg-[#f3f6ef] p-6 sm:p-8">
          <h3 className="mb-8 text-center text-2xl font-semibold tracking-[-0.035em] text-[#173e3d] sm:text-3xl">
            ¿Por qué usar la app móvil?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Star className="h-5 w-5 flex-shrink-0 text-[#638b72]" />
                <span className="text-sm text-[#526b68]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Download Buttons */}
        <div className="text-center">
          <h3 className="mb-6 text-2xl font-semibold text-[#173e3d]">
            Descarga NUXA ahora
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-6 text-[#647b75] sm:text-base">
            Disponible próximamente en App Store y Google Play. 
            Regístrate ahora para acceder a la versión web mientras esperamos el lanzamiento móvil.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center space-x-3 rounded-2xl border border-[#cbded6] bg-[#f3f6ef] p-4 opacity-60">
              <Apple className="h-7 w-7 text-[#42695f]" />
              <div className="text-left">
                <p className="text-xs text-[#647b75]">Próximamente en</p>
                <p className="font-semibold text-[#234844]">App Store</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 rounded-2xl border border-[#cbded6] bg-[#f3f6ef] p-4 opacity-60">
              <PlayCircle className="h-7 w-7 text-[#42695f]" />
              <div className="text-left">
                <p className="text-xs text-[#647b75]">Próximamente en</p>
                <p className="font-semibold text-[#234844]">Google Play</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setLocation("/login")}
            className="rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Comenzar con la Versión Web
            <Smartphone className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}