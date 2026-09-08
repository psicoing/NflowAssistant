import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  ChevronUp,
  Compass,
  Home,
  MessageCircle,
  MoreHorizontal,
  Newspaper,
  Sparkles,
  Tag,
  UsersRound,
  X,
} from "lucide-react";

const primaryItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/recursos", label: "Recursos", icon: BookOpen },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/precios", label: "Planes", icon: Tag },
];

const moreItems = [
  { href: "/novedades", label: "Novedades", icon: Newspaper },
  { href: "/blog", label: "Historias", icon: Compass },
  { href: "/nosotros", label: "Sobre NUXA", icon: UsersRound },
  { href: "/app-movil", label: "La app", icon: Sparkles },
];

function isActive(location: string, href: string) {
  if (href === "/") return location === "/";
  return location === href || location.startsWith(`${href}/`);
}

export default function MobileBottomNav() {
  const [location] = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isMoreActive = moreItems.some((item) => isActive(location, item.href));
  const isUtilityRoute = [
    "/login",
    "/registro",
    "/prueba-gratis",
    "/activar",
    "/admin",
    "/partners",
    "/legal",
    "/stripe",
    "/payment",
    "/acceso",
  ].some((route) => location === route || location.startsWith(`${route}/`));

  if (isUtilityRoute) return null;

  return (
    <nav className="nuxa-mobile-nav" aria-label="Navegación principal">
      {isMoreOpen && (
        <div id="nuxa-more-menu" className="nuxa-mobile-more-panel" role="menu">
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              También puedes ver
            </span>
            <button
              type="button"
              onClick={() => setIsMoreOpen(false)}
              className="nuxa-nav-icon-button"
              aria-label="Cerrar más opciones"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {moreItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(location, href);
              return (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setIsMoreOpen(false)}
                  className={`nuxa-more-link ${active ? "is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="nuxa-mobile-nav-inner">
        {primaryItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(location, href);
          return (
            <Link
              key={href}
              href={href}
              className={`nuxa-mobile-nav-item ${active ? "is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="nuxa-nav-icon-wrap">
                <Icon className="h-[21px] w-[21px]" strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          className={`nuxa-mobile-nav-item ${isMoreActive || isMoreOpen ? "is-active" : ""}`}
          onClick={() => setIsMoreOpen((open) => !open)}
          aria-expanded={isMoreOpen}
          aria-controls="nuxa-more-menu"
          aria-label={isMoreOpen ? "Cerrar más opciones" : "Abrir más opciones"}
        >
          <span className="nuxa-nav-icon-wrap">
            {isMoreOpen ? (
              <ChevronUp className="h-[21px] w-[21px]" strokeWidth={2} />
            ) : (
              <MoreHorizontal className="h-[21px] w-[21px]" strokeWidth={2} />
            )}
          </span>
          <span>Más</span>
        </button>
      </div>
    </nav>
  );
}