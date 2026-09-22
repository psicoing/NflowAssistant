import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronRight,
  DollarSign,
  HeartHandshake,
  Home,
  Landmark,
  Menu,
  MessageCircle,
  Phone,
  Scale,
  Shield,
  Smartphone,
  Star,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MenuIcon = typeof Home;

type NavigationItem =
  | {
      id: string;
      name: string;
      description: string;
      icon: MenuIcon;
      href: string;
      sectionId?: never;
    }
  | {
      id: string;
      name: string;
      description: string;
      icon: MenuIcon;
      sectionId: string;
      href?: never;
    };

type NavigationGroup = {
  label: string;
  eyebrow: string;
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    label: "Para ti",
    eyebrow: "Acompañamiento personal",
    items: [
      {
        id: "inicio",
        name: "Inicio",
        description: "Conoce NUXA",
        href: "/",
        icon: Home,
      },
      {
        id: "ejemplos-chat",
        name: "Chatea con NUXA",
        description: "Prueba una conversación",
        href: "/ejemplos-chat",
        icon: MessageCircle,
      },
      {
        id: "recursos-gratuitos",
        name: "Recursos gratuitos",
        description: "Ideas para sentirte mejor",
        href: "/recursos-gratuitos",
        icon: BookOpen,
      },
      {
        id: "app-movil",
        name: "Aplicación móvil",
        description: "NUXA contigo, donde estés",
        href: "/app-movil",
        icon: Smartphone,
      },
    ],
  },
  {
    label: "Para organizaciones",
    eyebrow: "Bienestar que escala",
    items: [
      {
        id: "empresa-privada",
        name: "Empresa privada",
        description: "Cuida a tus equipos",
        href: "/empresa-privada",
        icon: Building2,
      },
      {
        id: "sector-publico",
        name: "Sector público",
        description: "Impacto en tu comunidad",
        href: "/sector-publico",
        icon: Landmark,
      },
      {
        id: "programa-partners",
        name: "Gestión de licencias",
        description: "Administra tu programa",
        href: "/programa-partners",
        icon: Users,
      },
      {
        id: "contacto-licitacion",
        name: "Contacto licitación",
        description: "Hablemos de tu proyecto",
        href: "/programa-partners",
        icon: Phone,
      },
    ],
  },
  {
    label: "Explora NUXA",
    eyebrow: "Transparencia y confianza",
    items: [
      {
        id: "quienes-somos",
        name: "Nuestro software",
        description: "La tecnología detrás",
        href: "/quienes-somos",
        icon: User,
      },
      {
        id: "competencia-nuxa",
        name: "Competencia NUXA",
        description: "Una mirada comparativa",
        href: "/competencia-nuxa",
        icon: Trophy,
      },
      {
        id: "control-shell",
        name: "Control Shell",
        description: "Seguridad y supervisión",
        href: "/control-shell",
        icon: Shield,
      },
      {
        id: "precios",
        name: "Plan y suscripción",
        description: "Encuentra tu plan",
        href: "/precios",
        icon: DollarSign,
      },
      {
        id: "blog",
        name: "Blog",
        description: "Conversaciones que importan",
        href: "/blog",
        icon: BookOpen,
      },
      {
        id: "testimonios",
        name: "Opiniones",
        description: "Lo que dicen de NUXA",
        sectionId: "testimonials",
        icon: Star,
      },
      {
        id: "marco-legal",
        name: "Marco legal",
        description: "Información y garantías",
        href: "/legal/aviso-legal",
        icon: Scale,
      },
    ],
  },
];

const isItemActive = (item: NavigationItem, location: string) => {
  if (!item.href) return false;
  return item.href === "/" ? location === "/" : location.startsWith(item.href);
};

export default function SmoothScrollMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleOpenMenu = () => setIsOpen(true);
    window.addEventListener("openNuxaMenu", handleOpenMenu);
    return () => window.removeEventListener("openNuxaMenu", handleOpenMenu);
  }, []);

  const activeGroup = useMemo(
    () =>
      navigationGroups.find((group) =>
        group.items.some((item) => isItemActive(item, location)),
      ),
    [location],
  );

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

  const renderItem = (item: NavigationItem) => {
    const Icon = item.icon;
    const active = isItemActive(item, location);
    const itemClass = `group flex min-h-[60px] w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8de0c1] ${
      active
        ? "bg-[#d9f2e7] text-[#123e3d] shadow-[inset_3px_0_0_#f5a385]"
        : "text-[#d7e8e4] hover:bg-white/[0.08] hover:text-white active:scale-[0.985]"
    }`;
    const iconClass = `grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
      active
        ? "bg-[#b9e8d2] text-[#145c4c]"
        : "bg-white/[0.07] text-[#9ad8c3] group-hover:bg-[#8de0c1]/15"
    }`;

    const content = (
      <>
        <span className={iconClass}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold leading-5">
            {item.name}
          </span>
          <span
            className={`block truncate text-[11px] leading-4 ${
              active ? "text-[#397466]" : "text-[#9ab5ae]"
            }`}
          >
            {item.description}
          </span>
        </span>
        <ChevronRight
          className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
            active ? "text-[#397466]" : "text-[#66817b]"
          }`}
        />
      </>
    );

    if (item.href) {
      return (
        <Link
          key={item.id}
          href={item.href}
          onClick={() => setIsOpen(false)}
          className={itemClass}
          aria-current={active ? "page" : undefined}
        >
          {content}
        </Link>
      );
    }

    if (!item.sectionId) return null;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => scrollToSection(item.sectionId)}
        className={itemClass}
        aria-current={active ? "location" : undefined}
      >
        {content}
      </button>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 focus-visible:ring-[#8de0c1]"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[min(92vw,440px)] flex-col overflow-hidden border-[#31535a] bg-[#10232d] p-0 text-white shadow-[-20px_0_70px_rgba(4,15,22,0.35)] sm:max-w-[440px]"
        style={{ height: "100dvh" }}
      >
        <SheetTitle className="sr-only">Menú de navegación de NUXA</SheetTitle>
        <SheetDescription className="sr-only">
          Explora NUXA para uso personal, organizaciones y recursos de confianza.
        </SheetDescription>

        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.1] px-5 pb-4 pt-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#d9f2e7]">
              <img src="/favicon.png" alt="" className="h-7 w-7 rounded-lg" />
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#10232d] bg-[#f5a385]" />
            </div>
            <div>
              <p className="text-[17px] font-bold tracking-[-0.02em]">NUXA</p>
              <p className="text-[11px] text-[#9ab5ae]">Bienestar que te acompaña</p>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-5 pb-2 pt-5 sm:px-7">
            <div className="rounded-2xl border border-[#8de0c1]/20 bg-[#173640] px-4 py-3.5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[#f5a385]">
                  <HeartHandshake className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#eef8f3]">
                    Un espacio para estar mejor
                  </p>
                  <p className="mt-0.5 text-[11px] leading-4 text-[#a9c8bf]">
                    Elige cómo quieres conocer NUXA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label="Navegación principal"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-2 sm:px-7"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {navigationGroups.map((group) => (
              <section key={group.label} className="mt-5 first:mt-2">
                <div className="mb-2 flex items-end justify-between px-1">
                  <div>
                    <p className="text-[13px] font-bold text-[#eef8f3]">{group.label}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#76958d]">
                      {group.eyebrow}
                    </p>
                  </div>
                  {activeGroup?.label === group.label && (
                    <span className="mb-0.5 h-1.5 w-1.5 rounded-full bg-[#f5a385]" />
                  )}
                </div>
                <div className="space-y-1">{group.items.map(renderItem)}</div>
              </section>
            ))}
          </nav>

          <div className="shrink-0 border-t border-white/[0.1] bg-[#10232d] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 sm:px-7">
            <Link
              href="/prueba-gratis"
              onClick={() => setIsOpen(false)}
              className="group flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#f5a385] px-4 text-sm font-bold text-[#233b3e] shadow-[0_8px_24px_rgba(245,163,133,0.18)] transition-all hover:bg-[#ffc0a5] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a385]"
            >
              Comenzar ahora
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex min-h-[46px] w-full items-center justify-center rounded-2xl border border-[#8de0c1]/25 px-4 text-sm font-semibold text-[#c5e3da] transition-colors hover:border-[#8de0c1]/50 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8de0c1]"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}