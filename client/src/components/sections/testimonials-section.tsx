import { Star, Quote, Calendar, MapPin, MessageCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Safa",
    initial: "S",
    comment: "No me arrepiento de haber usado NFLOW. Un muy buen servicio profesional. Todo dicho, mucha motivación.",
    service: "Diagnóstico y tratamiento para trastornos de ansiedad",
    method: "Chat con IA NEUROPSI",
    date: "9 de enero de 2024",
    rating: 5
  },
  {
    id: 2,
    name: "M.Angel",
    initial: "M",
    comment: "NFLOW ha sido un lujo conectar con este nivel profesional. El asistente IA tiene todos los puntos para recomendarlo.",
    service: "Consulta especializada",
    method: "Sesión completa NEUROPSI-AI",
    date: "8 de enero de 2024",
    rating: 5
  },
  {
    id: 3,
    name: "Jimmy Kendal Gomez Millan",
    initial: "J",
    comment: "Las sesiones han sido muy buenas, muy buen servicio, muy interactivo y coges confianza a la primera. La terapia con IA es buenísima e interesante, muy realista. Recomendable 100%.",
    service: "Consulta online",
    method: "Terapia virtual NFLOW",
    date: "7 de enero de 2024",
    rating: 5
  },
  {
    id: 4,
    name: "Ana",
    initial: "A", 
    comment: "A pesar de que llevo pocas sesiones todas han sido muy reconfortantes, creo que con NFLOW conseguiré estar bien y superar mi ansiedad para poder tener una vida normal y tranquila.",
    service: "Diagnóstico y tratamiento para trastornos de ansiedad",
    method: "Chat NEUROPSI-AI",
    date: "7 de enero de 2024",
    rating: 5
  },
  {
    id: 5,
    name: "M P",
    initial: "M",
    comment: "Molt bon servei professional, amable i empàtic. Recomano 100%.",
    service: "Primera experiencia con IA psicológica",
    method: "Asistente NFLOW",
    date: "7 de enero de 2024",
    rating: 5
  },
  {
    id: 6,
    name: "Xavi",
    initial: "X",
    comment: "Molt bon servei professional. Content d'haver fet el tractament amb NFLOW.",
    service: "Diagnóstico y tratamiento para trastornos de ansiedad",
    method: "Programa completo NEUROPSI",
    date: "3 de junio de 2023",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miles de personas ya han mejorado su bienestar mental con NFLOW. 
            Estos son algunos testimonios reales de usuarios satisfechos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-nflow-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-nflow-orange/30" />
              </div>

              {/* Comment */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.comment}"
              </blockquote>

              {/* Service Info */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-nflow-orange" />
                  <span className="font-medium">{testimonial.service}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-nflow-orange" />
                  <span>{testimonial.method}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-nflow-orange" />
                  <span>{testimonial.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-nflow-orange to-orange-600 rounded-3xl p-12 text-center">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-white/90">Usuarios Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-white/90">Consultas Realizadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-white/90">Satisfacción Promedio</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/90">Disponibilidad</div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Únete a miles de usuarios satisfechos
            </h3>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              Basado en testimonios reales de usuarios que han experimentado 
              mejoras significativas en su bienestar mental con NFLOW.
            </p>
            <div className="text-white/80 text-sm">
              ⭐ Promedio de 4.9/5 estrellas • ✅ Verificado por usuarios reales
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}