import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Globe, LogIn, UserPlus, ChevronDown, Wifi, WifiOff, X } from "lucide-react";
import SmoothScrollMenu from "@/components/ui/smooth-scroll-menu";
import EsEnLanguageToggle from "@/components/ui/es-en-language-toggle";

interface HeaderProps {
  showBanner?: boolean;
}

const BANNER_KEY = "nuxa-top-banner-dismissed";

export default function Header({ showBanner = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location] = useLocation();
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_KEY);
    if (!dismissed) setBannerVisible(true);
  }, []);

  const dismissBanner = () => {
    setBannerVisible(false);
    localStorage.setItem(BANNER_KEY, "1");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const headerTop = bannerVisible ? "top-[auto]" : showBanner ? "top-16" : "top-0";

  return (
    <>
      {/* Top sticky awareness banner */}
      {bannerVisible && (
        <div className="fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-800/50 shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-start gap-3">
            {/* Icon */}
            <span className="text-lg flex-shrink-0 mt-0.5">🧠</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs sm:text-sm leading-snug">
                NUXA — Recupera el control de tu mente
              </p>
              <p className="text-indigo-200 text-[11px] sm:text-xs leading-relaxed mt-0.5 hidden sm:block">
                Desconecta de Facebook, Instagram y X. NUXA te guía hacia decisiones más claras, menos dependencia digital y un estilo de vida más equilibrado.{" "}
                <span className="text-indigo-100 font-medium">Vuelve a disfrutar de lo real.</span>
              </p>
              <p className="text-indigo-200 text-[11px] leading-relaxed mt-0.5 sm:hidden">
                Reduce la dependencia digital. Vuelve a disfrutar de lo real.
              </p>
            </div>

            {/* Close */}
            <button
              onClick={dismissBanner}
              aria-label="Cerrar banner"
              className="flex-shrink-0 text-indigo-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main header — offset by banner height when visible */}
      <header
        style={{ top: bannerVisible ? 52 : showBanner ? 64 : 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-nflow-dark/95 backdrop-blur-md" : "bg-nflow-dark/90"
        } border-b border-gray-800`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/favicon.png" alt="NUXA" className="w-8 h-8 rounded-lg" />
              </div>
              <span className="text-xl font-bold text-white">NUXA</span>
            </Link>

            {/* Desktop and Mobile Navigation */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Language Toggle - Always visible for UK market expansion */}
              <EsEnLanguageToggle />
              
              {/* Connection Status - Show only in chat */}
              {location.startsWith('/chat') && (
                <div className="hidden sm:flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                    isOnline ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {isOnline ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {isOnline ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Hamburger Menu - Always visible */}
              <SmoothScrollMenu />
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
