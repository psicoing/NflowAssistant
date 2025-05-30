import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Globe } from "lucide-react";
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
    { name: "Recursos", href: "/resources" },
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
            <div className="w-8 h-8 bg-nflow-orange rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NFLOW</span>
            <span className="text-xs bg-nflow-orange/20 text-nflow-orange px-2 py-1 rounded-full">
              β
            </span>
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

          {/* Language Selector & Sidebar Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
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
