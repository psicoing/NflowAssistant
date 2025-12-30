import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, MessageCircle, BookOpen, CreditCard, Users, Gift, Globe, LogIn, UserPlus, DollarSign, Phone, Info, Smartphone } from "lucide-react";
import { Link, useLocation } from "wouter";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const menuItems = [
  {
    id: "inicio",
    name: "Inicio",
    href: "/",
    icon: Home
  },
  {
    id: "ejemplos-chat",
    name: "Chatea con Nuxa",
    href: "/ejemplos-chat",
    icon: MessageCircle
  },
  {
    id: "blog",
    name: "Blog",
    href: "/blog",
    icon: BookOpen
  },
  {
    id: "precios",
    name: "Precios",
    href: "/precios",
    icon: DollarSign
  },
  {
    id: "partners",
    name: "Partners",
    href: "/partners",
    icon: Users
  },
  {
    id: "app-movil",
    name: "Aplicación Móvil",
    href: "/app-movil",
    icon: Smartphone
  },
  {
    id: "nosotros",
    name: "Nosotros",
    href: "/nosotros",
    icon: Info
  },
  {
    id: "contacto",
    name: "Contacto",
    href: "#",
    icon: Phone,
    isModal: true
  }
];

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const isActiveRoute = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };



  const handleContactClick = () => {
    setIsOpen(false);
    setIsContactModalOpen(true);
  };

  return (
    <>
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
                  




                  if (item.id === "contacto") {
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start h-14 text-left px-4 transition-all duration-200 text-white hover:bg-white/10 hover:text-nflow-blue"
                        onClick={handleContactClick}
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

      {/* Modal de Contacto */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="bg-nflow-navy border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              Información de Contacto
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              INS NEURONMEG - Información Profesional
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-gray-300">
            <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-4 rounded-lg border border-blue-700/30">
              <h3 className="text-lg font-semibold text-white mb-3">INS NEURONMEG</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span><strong>CIF:</strong> B02701100</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span><strong>Teléfono:</strong> 660 452 136</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 p-4 rounded-lg border border-purple-700/30">
              <h3 className="text-lg font-semibold text-white mb-3">Director Clínico</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span><strong>Dr. Ramón Molons de San Román</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span><strong>Colegiado:</strong> 7851</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span><strong>Colegio:</strong> Psicólogos de Catalunya - España</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 p-4 rounded-lg border border-green-700/30">
              <div className="text-center">
                <Button 
                  variant="outline" 
                  className="w-full text-green-400 border-green-400 hover:bg-green-400/10"
                  onClick={() => window.open(`tel:660452136`, '_self')}
                >
                  📞 Llamar ahora: 660 452 136
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center">
              Información corporativa registrada oficialmente
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}