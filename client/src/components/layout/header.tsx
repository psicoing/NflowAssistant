import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Globe, LogIn, UserPlus, ChevronDown, Wifi, WifiOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SidebarMenu from "@/components/ui/sidebar-menu";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("ES");
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

  const languages = [
    { code: "ES", name: "Español", flag: "🇪🇸" },
    { code: "EN", name: "English", flag: "🇬🇧" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "DE", name: "Deutsch", flag: "🇩🇪" },
    { code: "IT", name: "Italiano", flag: "🇮🇹" },
    { code: "PT", name: "Português", flag: "🇵🇹" },
    { code: "CA", name: "Català", flag: "🔵" },
    { code: "EU", name: "Euskera", flag: "🔵" },
    { code: "GL", name: "Galego", flag: "🔵" },
  ];

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



          {/* Auth Buttons & Language Selector & Sidebar Menu */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            {location.startsWith('/chat') && (
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                  isOnline ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {isOnline ? (
                    <Wifi className="w-3 h-3" />
                  ) : (
                    <WifiOff className="w-3 h-3" />
                  )}
                  <span className="text-xs font-medium">
                    {isOnline ? 'Conectado' : 'Sin conexión'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-nflow-orange/30 text-nflow-orange hover:bg-nflow-orange/10">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="sm" className="bg-nflow-blue hover:bg-nflow-blue/90 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registro
                </Button>
              </Link>
            </div>

            {/* Language Selector */}
            <div className="hidden lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <Globe className="w-4 h-4 text-nflow-orange mr-1" />
                    <span className="text-sm">{selectedLanguage}</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-gray-900 border-gray-700">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`cursor-pointer hover:bg-gray-800 ${
                        selectedLanguage === lang.code ? "bg-nflow-orange/10 text-nflow-orange" : "text-gray-300"
                      }`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Sidebar Menu Button */}
            <SidebarMenu />
          </div>
        </div>
      </div>


    </header>
  );
}
