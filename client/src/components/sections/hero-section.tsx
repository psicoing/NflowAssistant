import { Button } from "@/components/ui/button";
import { MessageCircle, Info, Brain, User, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguageContext } from "@/components/LanguageProvider";
import nflowPackageImage from "@assets/image_1749802552043.png";
import nflowFamilyImage from "@assets/image_1749802597786.png";

export default function HeroSection() {
  const { t } = useLanguageContext();
  const [, setLocation] = useLocation();

  const handleStartRegistration = () => {
    setLocation("/registro");
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
        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
          <span className="text-white">NFLOW,</span><br />
          <span className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light bg-clip-text text-transparent">
            {t('hero.title')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>

        {/* CTA Button */}
        <div className="flex justify-center items-center mb-12">
          <Button 
            onClick={handleStartRegistration}
            className="bg-nflow-orange hover:bg-nflow-orange-light text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {t('hero.cta')}
          </Button>
        </div>

        {/* NFLOW Package Images */}
        <div className="relative max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Individual Package */}
            <div className="relative group">
              <div className="transform hover:scale-105 transition-transform duration-500 nflow-package-card">
                <img 
                  src={nflowPackageImage} 
                  alt="NFLOW Salud Mental Individual"
                  className="w-4/5 mx-auto h-auto rounded-3xl shadow-2xl border border-gray-700/50 select-none"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-nflow-orange to-nflow-orange-light rounded-full p-2 shadow-lg animate-bounce">
                <User className="w-5 h-5 text-white" />
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-nflow-orange/20 to-nflow-orange-light/20 rounded-3xl blur-xl -z-10 group-hover:animate-pulse"></div>
            </div>

            {/* Family Package */}
            <div className="relative group">
              <div className="transform hover:scale-105 transition-transform duration-500 nflow-package-card">
                <img 
                  src={nflowFamilyImage} 
                  alt="NFLOW Salud Mental Familiar"
                  className="w-4/5 mx-auto h-auto rounded-3xl shadow-2xl border border-gray-700/50 select-none"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-nflow-blue to-blue-600 rounded-full p-2 shadow-lg animate-bounce delay-500">
                <Heart className="w-5 h-5 text-white" />
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-nflow-blue/20 to-blue-500/20 rounded-3xl blur-xl -z-10 group-hover:animate-pulse"></div>
            </div>
          </div>
          
          {/* Central Brain Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-nflow-orange to-nflow-blue rounded-full p-4 shadow-lg animate-pulse hidden md:block">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
