import { Button } from "@/components/ui/button";
import { MessageCircle, Info, Brain, User, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  const handleStartChat = () => {
    setLocation("/chat");
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-16 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-nflow-navy via-nflow-dark to-nflow-dark"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-nflow-orange rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-nflow-blue rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white">NFLOW,</span><br />
          <span className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light bg-clip-text text-transparent">
            un psicólogo en tu bolsillo
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
          Chatbot de psicología para todos los públicos
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={handleStartChat}
            className="bg-nflow-orange hover:bg-nflow-orange-light text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Comenzar ahora
          </Button>
          <Button 
            variant="outline"
            onClick={() => scrollToSection("servicios")}
            className="border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
          >
            <Info className="w-5 h-5 mr-2" />
            Más información
          </Button>
        </div>

        {/* App Preview */}
        <div className="relative max-w-md mx-auto">
          <div className="bg-gradient-to-br from-nflow-navy to-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-nflow-orange rounded-2xl p-4 text-center">
              <Brain className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-white font-bold text-lg">NFLOW</div>
              <div className="text-orange-100 text-sm mb-3">Salud Mental</div>
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
