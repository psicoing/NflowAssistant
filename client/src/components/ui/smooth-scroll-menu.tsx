import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, MessageCircle, BookOpen, CreditCard, Users, Phone, Info, Smartphone, DollarSign, Star, User, Building2, Landmark, Shield, Trophy, Scale, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";

const menuItems = [
  { id: "inicio",              name: "Inicio",              sectionId: "top",               icon: Home },
  { id: "ejemplos-chat",       name: "Chatea con Nuxa",     href: "/ejemplos-chat",          icon: MessageCircle },
  { id: "recursos-gratuitos",  name: "Recursos Gratis",     href: "/recursos-gratuitos",     icon: BookOpen },
  { id: "quienes-somos",       name: "Nuestro Software",    href: "/quienes-somos",          icon: User },
  { id: "empresa-privada",     name: "Empresa Privada",     href: "/empresa-privada",        icon: Building2 },
  { id: "sector-publico",      name: "Sector Público",      href: "/sector-publico",         icon: Landmark },
  { id: "competencia-nuxa",    name: "Competencia NUXA",    href: "/competencia-nuxa",       icon: Trophy },
  { id: "control-shell",       name: "Control Shell",       href: "/control-shell",          icon: Shield },
  { id: "testimonios",         name: "Opiniones",           sectionId: "testimonials",       icon: Star },
  { id: "blog",                name: "Blog",                href: "/blog",                   icon: BookOpen },
  { id: "precios",             name: "Plan y Suscripción",  href: "/precios",                icon: DollarSign },
  { id: "programa-partners",   name: "Gestión licencias",   href: "/programa-partners",      icon: Users },
  { id: "app-movil",           name: "Aplicación Móvil",   href: "/app-movil",              icon: Smartphone },
  { id: "marco-legal",         name: "Marco Legal",         externalUrl: "https://jobda.org/investors", icon: Scale },
  { id: "contacto-licitacion", name: "Contacto Licitación", href: "/programa-partners",      icon: Phone },
];

const itemClass =
  "w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors duration-150 text-sm";

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
        window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
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

      <SheetContent
        side="right"
        className="bg-nflow-dark border-gray-800 w-[300px] sm:w-80 p-0 flex flex-col"
        style={{ height: "100dvh" }}
      >
        {/* Header fijo */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-4 border-b border-gray-800 shrink-0">
          <img src="/favicon.png" alt="NUXA" className="w-7 h-7 rounded-lg" />
          <span className="text-lg font-bold text-white">NUXA</span>
        </div>

        {/* Zona scrollable — todos los ítems */}
        <nav
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-0.5"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            if ((item as any).href) {
              return (
                <Link
                  key={item.id}
                  href={(item as any).href}
                  onClick={() => setIsOpen(false)}
                  className={itemClass}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </Link>
              );
            }

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
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </a>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection((item as any).sectionId)}
                className={itemClass}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              </button>
            );
          })}
        </nav>

        {/* Footer fijo con CTAs */}
        <div className="shrink-0 px-4 py-4 border-t border-gray-800 space-y-2">
          <Link
            href="/prueba-gratis"
            onClick={() => setIsOpen(false)}
            className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-500 active:opacity-90 transition-all duration-200 text-center text-sm"
          >
            Comenzar Ahora
          </Link>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block w-full border border-gray-600 text-gray-300 px-4 py-2.5 rounded-xl font-medium hover:bg-white/10 hover:text-white active:bg-white/20 transition-all duration-200 text-center text-sm"
          >
            Iniciar Sesión
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
