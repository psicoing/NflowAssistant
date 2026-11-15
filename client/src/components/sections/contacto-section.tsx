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
    color: "bg-[#426f69]"
  },
  {
    icon: Mail,
    title: "Soporte Técnico",
    description: "Ayuda con problemas de la plataforma",
    color: "bg-[#557d65]"
  },
  {
    icon: Phone,
    title: "Consulta Comercial",
    description: "Información sobre planes y precios",
    color: "bg-[#6a7760]"
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
    <section id="contacto" className="px-4 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 max-w-4xl border-b border-[#cbded6] pb-7 dark:border-[#315d5b] sm:mb-16">
          <h2 className="mb-6 text-3xl font-semibold tracking-[-0.04em] text-[#173e3d] dark:text-[#f2f4e8] sm:text-5xl">
            Contacto
          </h2>
          <p className="max-w-3xl text-base leading-7 text-[#526b68] dark:text-[#c3d8d1] sm:text-lg">
            Estamos aquí para ayudarte. Ponte en contacto con nosotros a través 
            de cualquiera de estos canales y te responderemos lo antes posible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:mb-14 lg:grid-cols-4">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div 
                key={index} 
                className={`rounded-2xl border border-[#d6e3dc] bg-[#f3f6ef] p-5 text-center transition-colors dark:border-[#315d5b] dark:bg-[#173e3d] ${
                  method.action ? 'cursor-pointer hover:bg-[#eaf1eb] dark:hover:bg-[#20494a]' : ''
                }`}
                onClick={method.action || undefined}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#174f50] text-[#d6e69a]">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#234844] dark:text-[#f2f4e8]">{method.title}</h3>
                <p className="mb-2 break-words font-medium text-[#557d65] dark:text-[#c9dd83]">{method.value}</p>
                <p className="text-sm text-[#647b75] dark:text-[#c3d8d1]">{method.description}</p>
              </div>
            );
          })}
        </div>

        {/* Support Options */}
        <div className="mb-12 rounded-[1.5rem] border border-[#cbded6] bg-[#eaf1eb] p-6 dark:border-[#315d5b] dark:bg-[#173e3d] sm:p-8">
          <h3 className="mb-8 text-center text-2xl font-semibold text-[#173e3d] dark:text-[#f2f4e8] sm:mb-10 sm:text-3xl">
            ¿Cómo podemos ayudarte?
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`${option.color} rounded-2xl p-6 mb-4 mx-auto w-fit`}>
                  <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-[#234844] dark:text-[#f2f4e8]">{option.title}</h4>
                  <p className="text-sm leading-6 text-[#647b75] dark:text-[#c3d8d1]">{option.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Contact Buttons */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <Button 
            onClick={() => handleOpenContact("Consulta General sobre NUXA")}
            className="h-auto rounded-2xl border border-[#55776a] bg-[#174f50] p-5 text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Consulta General</div>
              <div className="text-sm opacity-90">Información sobre NUXA</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => handleOpenContact("Soporte Técnico - NUXA")}
            className="h-auto rounded-2xl border border-[#55776a] bg-[#174f50] p-5 text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <div className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Soporte Técnico</div>
              <div className="text-sm opacity-90">Ayuda con la plataforma</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => handleOpenContact("Consulta Comercial - Planes y Precios")}
            className="h-auto rounded-2xl border border-[#55776a] bg-[#174f50] p-5 text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Ventas</div>
              <div className="text-sm opacity-90">Planes empresariales</div>
            </div>
          </Button>
        </div>

        {/* 100% Automatizado */}
        <div className="rounded-[1.5rem] border border-[#315d5b] bg-[#123f43] p-6 text-center sm:p-8">
          <Bot className="mx-auto mb-4 h-9 w-9 text-[#d6e69a]" />
          <h3 className="mb-4 text-xl font-semibold text-[#f2f4e8] sm:text-2xl">100% Automatizado</h3>
          <div className="space-y-3 text-base text-[#e2e9df] sm:text-lg">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Todo es <strong>anónimo y confidencial</strong></span>
            </div>
            <p className="text-sm text-[#c3d8d1] sm:text-base">
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