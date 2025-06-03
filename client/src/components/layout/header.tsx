import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Globe, LogIn, UserPlus } from "lucide-react";
import SidebarMenu from "@/components/ui/sidebar-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Chat", href: "/chat" },
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  location === item.href
                    ? "text-nflow-orange"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons & Language Selector & Sidebar Menu */}
          <div className="flex items-center space-x-4">
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

            <div className="hidden lg:flex items-center space-x-2 text-sm">
              <Globe className="w-4 h-4 text-nflow-orange" />
              <span className="text-gray-400">ES</span>
            </div>

            {/* Sidebar Menu Button */}
            <SidebarMenu />
          </div>
        </div>
      </div>


    </header>
  );
}
