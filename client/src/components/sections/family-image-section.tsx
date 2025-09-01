import { Button } from "@/components/ui/button";
import { Heart, Clock, Users, Shield } from "lucide-react";
import familyImage from "@assets/image_1752849322206.png";

export default function FamilyImageSection() {
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full">
        {/* Content Above Image */}
        <div className="max-w-4xl mx-auto text-center mb-8 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Apoyo emocional para toda la familia
          </h2>
          
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Cada persona merece apoyo emocional profesional. NFLOW conecta familias, 
            adolescentes, trabajadores y adultos con herramientas de bienestar mental 
            respaldadas por la ciencia y la experiencia clínica.
          </p>
        </div>
        
        {/* Image with Overlay */}
        <div className="relative w-full">
          <img 
            src={familyImage} 
            alt="Familia usando NFLOW para apoyo emocional" 
            className="w-full h-auto object-cover"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent">
            <div className="absolute top-1/2 left-8 md:left-16 transform -translate-y-1/2 text-white max-w-lg">
              <div className="space-y-4">
                
                {/* Professional Badge */}
                <div className="inline-flex items-center bg-orange-500 rounded-full px-4 py-2 mb-4">
                  <Heart className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">Profesional</span>
                </div>
                <p className="text-sm">Basado en 30+ años de experiencia</p>
                
                {/* 24/7 Badge */}
                <div className="inline-flex items-center bg-blue-500 rounded-full px-4 py-2 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">Disponible 24/7</span>
                </div>
                <p className="text-sm">Apoyo cuando lo necesites</p>
                
                {/* CTA Button */}
                <div className="pt-4">
                  <Button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
                  >
                    Comenzar Ahora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Below Image */}
        <div className="max-w-4xl mx-auto mt-8 px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700 font-medium text-lg">Para Toda la Familia</span>
            </div>
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700 font-medium text-lg">Apoyo integral desde los 12 años</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700 font-medium text-lg">100% Confidencial</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700 font-medium text-lg">Privacidad y anonimato garantizados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}