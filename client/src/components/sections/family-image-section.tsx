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
        
        {/* Full Width Image */}
        <div className="w-full">
          <img 
            src={familyImage} 
            alt="Familia usando NFLOW para apoyo emocional" 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Features Below Image */}
        <div className="max-w-4xl mx-auto mt-8 px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 font-medium text-lg">Para Toda la Familia</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 font-medium text-lg">Apoyo integral desde los 12 años</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 font-medium text-lg">100% Confidencial</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 font-medium text-lg">Privacidad y anonimato garantizados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}