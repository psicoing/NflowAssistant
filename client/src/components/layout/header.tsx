import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Globe, LogIn, UserPlus, ChevronDown, Wifi, WifiOff } from "lucide-react";
import SmoothScrollMenu from "@/components/ui/smooth-scroll-menu";
import EsEnLanguageToggle from "@/components/ui/es-en-language-toggle";

interface HeaderProps {
  showBanner?: boolean;
}

export default function Header({ showBanner = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location] = useLocation();

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

  return (
    <header 
      className={`fixed ${showBanner ? 'top-16' : 'top-0'} w-full z-50 transition-all duration-300 ${
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
  );
}
