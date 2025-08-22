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
    <section id="app-movil" className="py-20 px-4 bg-gradient-to-br from-nflow-dark to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Smartphone className="w-12 h-12 text-nflow-orange" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Aplicación Móvil
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Lleva tu bienestar mental siempre contigo. Nuestra app móvil te ofrece 
            todas las funcionalidades de NFLOW optimizadas para tu smartphone.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Phone Mockup */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="bg-gray-800 rounded-[3rem] p-4 shadow-2xl">
                <div className="bg-nflow-dark rounded-[2.5rem] p-4 h-[600px] w-[300px] overflow-hidden">
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
                  <div className="bg-nflow-orange rounded-2xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <img src="/faro.png" alt="NFLOW" className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">NFLOW</h3>
                        <p className="text-white/80 text-xs">Tu asistente de bienestar</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Preview */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-gray-700 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-white text-sm">¡Hola! ¿Cómo te sientes hoy?</p>
                    </div>
                    <div className="bg-nflow-orange rounded-2xl rounded-tr-sm p-3 max-w-[80%] ml-auto">
                      <p className="text-white text-sm">Me siento algo ansioso...</p>
                    </div>
                    <div className="bg-gray-700 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-white text-sm">Te entiendo. Vamos a practicar una técnica de respiración.</p>
                    </div>
                  </div>

                  {/* Features Icons */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-blue-500 rounded-xl p-2 text-center">
                      <Bell className="w-4 h-4 text-white mx-auto" />
                    </div>
                    <div className="bg-green-500 rounded-xl p-2 text-center">
                      <Shield className="w-4 h-4 text-white mx-auto" />
                    </div>
                    <div className="bg-purple-500 rounded-xl p-2 text-center">
                      <Zap className="w-4 h-4 text-white mx-auto" />
                    </div>
                    <div className="bg-red-500 rounded-xl p-2 text-center">
                      <Globe className="w-4 h-4 text-white mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 rounded-full p-2">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white mb-8">
              Funcionalidades Exclusivas
            </h3>
            
            {appFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-nflow-orange rounded-xl p-3 flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            ¿Por qué usar la app móvil?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-nflow-orange flex-shrink-0" />
                <span className="text-gray-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Download Buttons */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Descarga NFLOW ahora
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Disponible próximamente en App Store y Google Play. 
            Regístrate ahora para acceder a la versión web mientras esperamos el lanzamiento móvil.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-3 opacity-50">
              <Apple className="w-8 h-8 text-white" />
              <div className="text-left">
                <p className="text-xs text-gray-400">Próximamente en</p>
                <p className="text-white font-bold">App Store</p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-3 opacity-50">
              <PlayCircle className="w-8 h-8 text-white" />
              <div className="text-left">
                <p className="text-xs text-gray-400">Próximamente en</p>
                <p className="text-white font-bold">Google Play</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setLocation("/login")}
            className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg"
          >
            Comenzar con la Versión Web
            <Smartphone className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}