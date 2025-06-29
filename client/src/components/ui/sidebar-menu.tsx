import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, MessageCircle, Book, Lightbulb, CreditCard, Users, Gift, Globe, LogIn, UserPlus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { GoogleTranslateDialog } from "@/components/ui/google-translate-dialog";

const menuItems = [
  {
    id: "inicio",
    name: "Inicio",
    href: "/",
    icon: Home
  },
  {
    id: "ejemplos-chat",
    name: "Ejemplos del chat",
    href: "/ejemplos-chat",
    icon: MessageCircle
  },
  {
    id: "recursos",
    name: "Recursos",
    href: "/recursos",
    icon: Book
  },
  {
    id: "consejos",
    name: "Consejos",
    href: "/consejos",
    icon: Lightbulb
  },
  {
    id: "suscripcion",
    name: "Suscripción",
    href: "/#precios",
    icon: CreditCard
  },
  {
    id: "partners",
    name: "Partners",
    href: "/partners",
    icon: Users
  }
];

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const isActiveRoute = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const handleSubscriptionClick = () => {
    setIsOpen(false);
    if (location !== "/") {
      setLocation("/");
      setTimeout(() => {
        const pricingSection = document.getElementById("precios");
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const pricingSection = document.getElementById("precios");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-80 bg-nflow-navy border-gray-700 p-0 z-[9999]"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-nflow-blue">MENÚ PRINCIPAL</h2>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.href);
                
                if (item.id === "suscripcion") {
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-start h-14 text-left px-4 transition-all duration-200 ${
                        isActive 
                          ? "bg-nflow-blue/20 text-nflow-blue border-l-4 border-nflow-blue" 
                          : "text-white hover:bg-white/10 hover:text-nflow-blue"
                      }`}
                      onClick={handleSubscriptionClick}
                    >
                      <IconComponent className="mr-3 h-5 w-5" />
                      <span className="text-base">{item.name}</span>
                    </Button>
                  );
                }
                
                return (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start h-14 text-left px-4 transition-all duration-200 ${
                        isActive 
                          ? "bg-nflow-blue/20 text-nflow-blue border-l-4 border-nflow-blue" 
                          : "text-white hover:bg-white/10 hover:text-nflow-blue"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent className="mr-3 h-5 w-5" />
                      <span className="text-base">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}

              {/* Mobile-only Auth Section */}
              <div className="md:hidden mt-6 pt-4 border-t border-gray-700">
                <div className="space-y-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-left px-4 text-white hover:bg-white/10 hover:text-nflow-blue"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="mr-3 h-5 w-5" />
                      <span className="text-base">Acceso</span>
                    </Button>
                  </Link>
                  <Link href="/registro">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-left px-4 text-white hover:bg-white/10 hover:text-nflow-blue"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserPlus className="mr-3 h-5 w-5" />
                      <span className="text-base">Registro</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mobile-only Google Translate Section */}
              <div className="lg:hidden mt-4 pt-4 border-t border-gray-700">
                <div className="mb-3 px-4">
                  <GoogleTranslateDialog 
                    trigger={
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-left px-0 text-white hover:bg-white/10 hover:text-nflow-orange transition-all duration-200"
                      >
                        <Globe className="mr-3 h-4 w-4" />
                        <span className="text-sm">Traducir página</span>
                      </Button>
                    }
                  />
                </div>
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-white tracking-wider">
                NF<span className="text-nflow-blue">L</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}