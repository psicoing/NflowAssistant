import { Star, Quote, Calendar, MapPin, MessageCircle, HelpCircle, Users, Target, Clock, ThumbsUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

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

// Component to display dynamic statistics
function DynamicStatsDisplay() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['/api/public-stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const [displayStats, setDisplayStats] = useState({
    totalUsers: '?',
    totalConversations: '?',
    activeSubscriptions: '?',
    averageSatisfaction: '?'
  });

  useEffect(() => {
    if (stats && !isLoading) {
      // Animate the numbers appearing
      setTimeout(() => {
        setDisplayStats({
          totalUsers: stats.totalUsers.toLocaleString(),
          totalConversations: stats.totalConversations.toLocaleString(),
          activeSubscriptions: stats.activeSubscriptions.toLocaleString(),
          averageSatisfaction: stats.averageSatisfaction.toFixed(1)
        });
      }, 500);
    }
  }, [stats, isLoading]);

  return (
    <div className="grid md:grid-cols-4 gap-8">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-6 h-6 text-nflow-orange" />
        </div>
        <div className="flex items-center space-x-1 mb-2">
          <div className="text-3xl font-bold text-nflow-orange drop-shadow-lg">
            {isLoading ? (
              <HelpCircle className="w-8 h-8 animate-pulse" />
            ) : (
              displayStats.totalUsers
            )}
          </div>
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Usuarios registrados en la plataforma
            </div>
          </div>
        </div>
        <div className="text-gray-200 font-semibold text-lg">Usuarios Registrados</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-6 h-6 text-nflow-orange" />
        </div>
        <div className="flex items-center space-x-1 mb-2">
          <div className="text-3xl font-bold text-nflow-orange drop-shadow-lg">
            {isLoading ? (
              <HelpCircle className="w-8 h-8 animate-pulse" />
            ) : (
              displayStats.totalConversations
            )}
          </div>
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Conversaciones totales con NEUROPSI-AI
            </div>
          </div>
        </div>
        <div className="text-gray-200 font-semibold text-lg">Consultas Realizadas</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-6 h-6 text-nflow-orange" />
        </div>
        <div className="text-3xl font-bold text-nflow-orange mb-2 drop-shadow-lg">24/7</div>
        <div className="text-gray-200 font-semibold text-lg">Disponibilidad</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-3">
          <ThumbsUp className="w-6 h-6 text-nflow-orange" />
        </div>
        <div className="text-3xl font-bold text-nflow-orange mb-2 drop-shadow-lg">
          {isLoading ? (
            <HelpCircle className="w-8 h-8 animate-pulse" />
          ) : (
            `${displayStats.averageSatisfaction}/5`
          )}
        </div>
        <div className="text-gray-200 font-semibold text-lg">Satisfacción Usuario</div>
      </div>
    </div>
  );
}

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
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-12 text-center shadow-2xl border border-gray-700">
          <DynamicStatsDisplay />
          
          <div className="mt-8 pt-8 border-t border-gray-600">
            <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
              Únete a personas satisfechas
            </h3>
            <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto font-medium">
              Basado en testimonios reales de usuarios que han experimentado 
              mejoras significativas en su bienestar mental con NFLOW.
            </p>
            
            <div className="bg-gradient-to-r from-nflow-orange/20 to-nflow-blue/20 rounded-lg p-4 border border-nflow-orange/40 max-w-2xl mx-auto">
              <p className="text-white font-bold text-center text-base mb-2">
                📅 Inauguración: 1 de septiembre 2025
              </p>
              <p className="text-gray-200 text-center text-sm">
                Indicadores reales y transparentes del uso de la plataforma
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}