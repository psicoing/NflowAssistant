import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, MessageCircle, BookOpen, CreditCard, Users, Phone, Info, Smartphone, DollarSign, Star, User, Gift } from "lucide-react";
import { useLocation } from "wouter";

const menuItems = [
  {
    id: "inicio",
    name: "Inicio",
    sectionId: "top",
    icon: Home
  },
  {
    id: "ejemplos-chat",
    name: "Chatea con Nuxa",
    sectionId: "ejemplos-chat",
    icon: MessageCircle,
    isPage: true
  },
  {
    id: "recursos",
    name: "Recursos Gratis",
    sectionId: "recursos",
    icon: Gift,
    isPage: true
  },
  {
    id: "quienes-somos",
    name: "Nuestro Software",
    sectionId: "quienes-somos",
    icon: User,
    isPage: true
  },
  {
    id: "testimonios",
    name: "Opiniones",
    sectionId: "testimonials",
    icon: Star
  },
  {
    id: "blog",
    name: "Blog",
    sectionId: "blog",
    icon: BookOpen
  },
  {
    id: "precios",
    name: "Plan y Suscripción",
    sectionId: "precios",
    icon: DollarSign,
    externalUrl: "https://jobda.org/partners"
  },
  {
    id: "alquiler-nuxa",
    name: "Gestión licencias",
    sectionId: "alquiler-nuxa",
    icon: Users,
    externalUrl: "https://jobda.org/partners"
  },
  {
    id: "app-movil",
    name: "Aplicación Móvil",
    sectionId: "app-movil",
    icon: Smartphone
  },
  {
    id: "contacto-licitacion",
    name: "Contacto Licitación",
    sectionId: "contacto-licitacion",
    icon: Phone,
    externalUrl: "https://jobda.org/partners"
  }
];

export default function SmoothScrollMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleOpenMenu = () => setIsOpen(true);
    window.addEventListener("openNuxaMenu", handleOpenMenu);
    return () => window.removeEventListener("openNuxaMenu", handleOpenMenu);
  }, []);

  const scrollToSection = (sectionId: string, isPage?: boolean, externalUrl?: string) => {
    setIsOpen(false);
    
    // If it's an external URL, navigate to it
    if (externalUrl) {
      window.open(externalUrl, "_blank");
      return;
    }
    
    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If it's a separate page, navigate directly
    if (isPage || sectionId === "ejemplos-chat") {
      window.location.href = `/${sectionId}`;
      return;
    }

    // Add small delay to ensure menu closes first
    setTimeout(() => {
      // If not on home page, navigate to home first then scroll
      if (location !== "/") {
        window.location.href = `/#${sectionId}`;
        return;
      }

      // Smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100; // Account for fixed header
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({ top: elementPosition, behavior: "smooth" });
      }
    }, 300); // Small delay to allow menu animation to complete
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="bg-nflow-dark border-gray-800 w-80">
        <div className="py-6 h-full overflow-y-auto">
          <div className="flex items-center space-x-2 mb-8">
            <img src="/favicon.png" alt="NUXA" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold text-white">NUXA</span>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.sectionId, (item as any).isPage, (item as any).externalUrl)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-4">Enlaces rápidos</div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/login";
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-500 transition-all duration-300"
              >
                Comenzar Ahora
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/login";
                }}
                className="w-full border border-gray-600 text-gray-300 px-4 py-3 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}