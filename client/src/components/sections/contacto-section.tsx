import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Globe, Bot, ShieldCheck } from "lucide-react";
import { useState } from "react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "jobda@jobda.es",
    description: "Respuesta en menos de 24 horas",
    action: () => window.location.href = "mailto:jobda@jobda.es?subject=Consulta sobre NUXA"
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: "+34 660 45 21 36",
    description: "Lunes a Viernes, 9:00 - 18:00 CET",
    action: () => window.location.href = "tel:+34660452136"
  },
  {
    icon: MapPin,
    title: "Oficina",
    value: "Portbou, Girona",
    description: "España - Unión Europea",
    action: null
  },
  {
    icon: Globe,
    title: "Web",
    value: "https://nuxa.life",
    description: "Plataforma oficial",
    action: () => window.open("https://nuxa.life", "_blank")
  }
];

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Chat con IA",
    description: "Prueba nuestro asistente de salud mental",
    color: "bg-blue-500"
  },
  {
    icon: Mail,
    title: "Soporte Técnico",
    description: "Ayuda con problemas de la plataforma",
    color: "bg-green-500"
  },
  {
    icon: Phone,
    title: "Consulta Comercial",
    description: "Información sobre planes y precios",
    color: "bg-purple-500"
  }
];

export default function ContactoSection() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("");

  const handleOpenContact = (subject: string) => {
    setContactSubject(subject);
    setIsContactOpen(true);
  };

  return (
    <section id="contacto" className="py-20 px-4 bg-gradient-to-br from-nflow-dark to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contacto
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Ponte en contacto con nosotros a través 
            de cualquiera de estos canales y te responderemos lo antes posible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  method.action ? 'cursor-pointer hover:shadow-xl' : ''
                }`}
                onClick={method.action || undefined}
              >
                <div className="bg-nflow-orange rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-nflow-orange font-medium mb-2">{method.value}</p>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
            );
          })}
        </div>

        {/* Support Options */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            ¿Cómo podemos ayudarte?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`${option.color} rounded-2xl p-6 mb-4 mx-auto w-fit`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{option.title}</h4>
                  <p className="text-gray-300">{option.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Contact Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Button 
            onClick={() => handleOpenContact("Consulta General sobre NUXA")}
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto rounded-2xl"
          >
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Consulta General</div>
              <div className="text-sm opacity-90">Información sobre NFLOW ahora NUXA</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => handleOpenContact("Soporte Técnico - NUXA")}
            className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto rounded-2xl"
          >
            <div className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Soporte Técnico</div>
              <div className="text-sm opacity-90">Ayuda con la plataforma</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => handleOpenContact("Consulta Comercial - Planes y Precios")}
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto rounded-2xl"
          >
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Ventas</div>
              <div className="text-sm opacity-90">Planes empresariales</div>
            </div>
          </Button>
        </div>

        {/* 100% Automatizado */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-center">
          <Bot className="w-12 h-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">100% Automatizado</h3>
          <div className="text-white text-lg space-y-3">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Todo es <strong>anónimo y confidencial</strong></span>
            </div>
            <p className="text-white/80">
              NUXA funciona las 24 horas del día, los 7 días de la semana, sin intervención humana.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Contacto */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Mail className="w-6 h-6 text-emerald-600" />
              {contactSubject}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Escríbenos a nuestro correo de contacto:
            </p>
            <a 
              href={`mailto:jobda@jobda.es?subject=${encodeURIComponent(contactSubject)}`}
              className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              jobda@jobda.es
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              Te responderemos lo antes posible
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}