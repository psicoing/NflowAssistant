import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, MessageCircle, BookOpen, CreditCard, Users, Phone, Info, Smartphone, DollarSign, Star, User, Building2, Landmark, Shield, Trophy, Scale } from "lucide-react";
import { Link, useLocation } from "wouter";

// Items with href navigate to a real page (crawlable <a>).
// Items with externalUrl open in a new tab.
// Items with sectionId only scroll within the home page.
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
    href: "/ejemplos-chat",
    icon: MessageCircle,
  },
  {
    id: "recursos-gratuitos",
    name: "Recursos Gratis",
    href: "/recursos-gratuitos",
    icon: BookOpen,
  },
  {
    id: "quienes-somos",
    name: "Nuestro Software",
    href: "/quienes-somos",
    icon: User,
  },
  {
    id: "empresa-privada",
    name: "Empresa Privada",
    href: "/empresa-privada",
    icon: Building2,
  },
  {
    id: "sector-publico",
    name: "Sector Público",
    href: "/sector-publico",
    icon: Landmark,
  },
  {
    id: "competencia-nuxa",
    name: "Competencia NUXA",
    href: "/competencia-nuxa",
    icon: Trophy,
  },
  {
    id: "control-shell",
    name: "Control Shell",
    href: "/control-shell",
    icon: Shield,
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
    href: "/blog",
    icon: BookOpen,
  },
  {
    id: "precios",
    name: "Plan y Suscripción",
    href: "/precios",
    icon: DollarSign,
  },
  {
    id: "programa-partners",
    name: "Gestión licencias",
    href: "/programa-partners",
    icon: Users,
  },
  {
    id: "app-movil",
    name: "Aplicación Móvil",
    href: "/app-movil",
    icon: Smartphone,
  },
  {
    id: "marco-legal",
    name: "Marco Legal",
    externalUrl: "https://jobda.org/investors",
    icon: Scale,
  },
  {
    id: "contacto-licitacion",
    name: "Contacto Licitación",
    href: "/programa-partners",
    icon: Phone,
  }
];

const itemClass = "w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200";

export default function SmoothScrollMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleOpenMenu = () => setIsOpen(true);
    window.addEventListener("openNuxaMenu", handleOpenMenu);
    return () => window.removeEventListener("openNuxaMenu", handleOpenMenu);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);

    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setTimeout(() => {
      if (location !== "/") {
        window.location.href = `/#${sectionId}`;
        return;
      }
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100;
        window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
      }
    }, 300);
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

              // Real internal page link — crawlable <a> via wouter Link
              if ((item as any).href) {
                return (
                  <Link
                    key={item.id}
                    href={(item as any).href}
                    onClick={() => setIsOpen(false)}
                    className={itemClass}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              }

              // External link — opens in new tab
              if ((item as any).externalUrl) {
                return (
                  <a
                    key={item.id}
                    href={(item as any).externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={itemClass}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                );
              }

              // Section scroll (Inicio, Opiniones)
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection((item as any).sectionId)}
                  className={itemClass}
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
              <a
                href="/prueba-gratis"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-500 transition-all duration-300 text-center"
              >
                Comenzar Ahora
              </a>
              <a
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full border border-gray-600 text-gray-300 px-4 py-3 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all duration-300 text-center"
              >
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
