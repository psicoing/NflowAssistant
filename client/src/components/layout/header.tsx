import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Globe, LogIn, UserPlus, ChevronDown, Wifi, WifiOff } from "lucide-react";
import SidebarMenu from "@/components/ui/sidebar-menu";
import { GoogleTranslateSimple } from "@/components/ui/google-translate-simple";


export default function Header() {
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-nflow-dark/95 backdrop-blur-md" : "bg-nflow-dark/90"
      } border-b border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/faro.png" alt="NFLOW" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold text-white">NFLOW</span>
          </Link>



          {/* Desktop and Mobile Navigation */}
          <div className="flex items-center space-x-4">
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
            
            {/* Google Translate Widget - Always visible */}
            <div className="flex">
              <GoogleTranslateSimple className="text-white" />
            </div>

            {/* Desktop Auth Buttons - Hidden on tablets and mobile */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-nflow-orange/30 text-nflow-orange hover:bg-nflow-orange/10">
                  <LogIn className="w-4 h-4 mr-2" />
                  Acceso
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="sm" className="bg-nflow-blue hover:bg-nflow-blue/90 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registro
                </Button>
              </Link>
            </div>

            {/* Hamburger Menu - Always visible */}
            <SidebarMenu />
          </div>
        </div>
      </div>


    </header>
  );
}
