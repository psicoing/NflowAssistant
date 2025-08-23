import familyImage from "@assets/image_1752849322206.png";

export default function FamilyImageSection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <img 
                src={familyImage} 
                alt="Familia usando NFLOW para apoyo emocional" 
                className="w-full h-auto rounded-2xl"
              />
            </div>
            
            {/* Content */}
            <div className="order-1 md:order-2 p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Apoyo emocional para toda la familia
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Cada persona merece apoyo emocional profesional. NFLOW conecta familias, 
                adolescentes, trabajadores y adultos con herramientas de bienestar mental 
                respaldadas por la ciencia y la experiencia clínica.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Para Toda la Familia</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Apoyo integral desde los 12 años</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">100% Confidencial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Privacidad y anonimato garantizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}