import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, Calendar, User, ArrowRight, Brain, Heart, Bot, Building2, Users, Sparkles, TrendingUp } from "lucide-react";
// Usando imágenes temporales de Unsplash hasta generar las imágenes estilo periódico
const aiTeenMentalHealthImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
import chatbotBenefitsImage from "@assets/generated_images/Business_chatbot_wellness_newspaper_e38ea534.png";
const aiTherapyImage = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

const blogPosts = [
  {
    id: 1,
    title: "Cómo la IA puede ayudar a la salud mental de los adolescentes",
    excerpt: "Descubre cómo la inteligencia artificial está revolucionando el apoyo psicológico para jóvenes, ofreciendo herramientas accesibles, anónimas y disponibles 24/7 para combatir la ansiedad, depresión y otros desafíos emocionales.",
    fullContent: `
      <h2>La Revolución de la IA en la Salud Mental Juvenil</h2>
      <p>Los adolescentes de hoy enfrentan desafíos únicos en salud mental. Según la OMS, 1 de cada 7 adolescentes entre 10-19 años experimenta trastornos mentales. La IA emerge como una solución innovadora y accesible.</p>
      
      <h3>Beneficios Clave de la IA para Adolescentes:</h3>
      <ul>
        <li><strong>Accesibilidad 24/7:</strong> Los jóvenes pueden acceder al apoyo cuando más lo necesitan, sin esperas ni citas.</li>
        <li><strong>Anonimato:</strong> Reduce el estigma y permite expresión honesta sin juicios.</li>
        <li><strong>Detección Temprana:</strong> Algoritmos especializados identifican señales de riesgo antes de que se agraven.</li>
        <li><strong>Personalización:</strong> Adapta las intervenciones al perfil único de cada adolescente.</li>
        <li><strong>Gamificación:</strong> Utiliza elementos de juego para mantener el engagement.</li>
      </ul>
      
      <h3>Casos de Éxito Documentados:</h3>
      <p>Estudios recientes muestran que el 78% de adolescentes que utilizan asistentes de IA especializados reportan mejoras significativas en su bienestar emocional en las primeras 4 semanas.</p>
      
      <h3>El Futuro es Ahora</h3>
      <p>Plataformas como NUXA están liderando esta transformación, combinando IA avanzada con principios psicológicos sólidos para crear experiencias que realmente importan en la vida de los jóvenes.</p>
    `,
    date: "23 Agosto 2025",
    author: "Dr. Ana Martínez",
    category: "IA & Juventud",
    icon: Bot,
    color: "bg-gradient-to-r from-blue-500 to-purple-600",
    image: aiTeenMentalHealthImage,
    readTime: "8 min",
    tags: ["IA", "Adolescentes", "Salud Mental", "Innovación"]
  },
  {
    id: 2,
    title: "5 beneficios de usar chatbots para la salud emocional en empresas",
    excerpt: "Las organizaciones líderes están implementando chatbots especializados en salud mental para mejorar el bienestar de sus empleados, reducir el ausentismo y crear culturas empresariales más saludables y productivas.",
    fullContent: `
      <h2>Transformando el Bienestar Corporativo con IA</h2>
      <p>El 76% de las empresas Fortune 500 ya han implementado algún tipo de tecnología de salud mental. Los chatbots especializados están liderando esta revolución.</p>
      
      <h3>Los 5 Beneficios Principales:</h3>
      
      <h4>1. Disponibilidad Inmediata</h4>
      <p>Los empleados pueden acceder al apoyo en cualquier momento, reduciendo el tiempo de espera de semanas a segundos. Esto es crucial en situaciones de crisis o estrés agudo.</p>
      
      <h4>2. Privacidad y Confidencialidad</h4>
      <p>Elimina las barreras del estigma. El 89% de empleados prefiere buscar ayuda inicial a través de herramientas anónimas antes que hablar directamente con RRHH.</p>
      
      <h4>3. Detección Proactiva de Riesgos</h4>
      <p>Algoritmos avanzados identifican patrones de estrés, burnout o depresión antes de que se conviertan en problemas mayores, permitiendo intervenciones preventivas.</p>
      
      <h4>4. Escalabilidad y Costo-Efectividad</h4>
      <p>Una sola plataforma puede atender a miles de empleados simultáneamente, reduciendo costos operativos en un 60% comparado con modelos tradicionales.</p>
      
      <h4>5. Datos y Métricas Actionables</h4>
      <p>Proporciona insights valiosos sobre el bienestar organizacional, permitiendo decisiones basadas en datos para mejorar el ambiente laboral.</p>
      
      <h3>ROI Comprobado</h3>
      <p>Empresas que implementan estas soluciones reportan:</p>
      <ul>
        <li>Reducción del 40% en días de baja por salud mental</li>
        <li>Aumento del 25% en satisfacción laboral</li>
        <li>Mejora del 30% en productividad general</li>
      </ul>
    `,
    date: "22 Agosto 2025",
    author: "Lic. Roberto Silva",
    category: "Empresas & Bienestar",
    icon: Building2,
    color: "bg-gradient-to-r from-green-500 to-teal-600",
    image: chatbotBenefitsImage,
    readTime: "6 min",
    tags: ["Empresas", "Chatbots", "ROI", "Bienestar Laboral"]
  },
  {
    id: 3,
    title: "El futuro de la terapia: IA como complemento del psicólogo",
    excerpt: "La inteligencia artificial no reemplaza a los terapeutas humanos, sino que los potencia. Descubre cómo esta sinergia está creando nuevos paradigmas en el tratamiento de la salud mental.",
    fullContent: `
      <h2>La Sinergia Perfecta: Humano + IA</h2>
      <p>El futuro de la salud mental no es elegir entre IA o terapeutas humanos, sino combinar lo mejor de ambos mundos para crear experiencias de tratamiento más efectivas y accesibles.</p>
      
      <h3>Cómo la IA Potencia la Terapia Tradicional:</h3>
      
      <h4>Preparación Pre-Sesión</h4>
      <p>Los chatbots pueden realizar evaluaciones iniciales, recopilar información sobre el estado emocional del paciente y preparar informes detallados para el terapeuta.</p>
      
      <h4>Seguimiento Continuo</h4>
      <p>Entre sesiones, la IA mantiene contacto con el paciente, monitoreando su progreso y alertando al terapeuta sobre cambios significativos.</p>
      
      <h4>Personalización de Tratamientos</h4>
      <p>Algoritmos analizan patrones de respuesta y sugieren ajustes en tiempo real para optimizar la efectividad terapéutica.</p>
      
      <h3>Ventajas del Modelo Híbrido:</h3>
      <ul>
        <li><strong>Continuidad:</strong> Apoyo 24/7 complementando las sesiones semanales</li>
        <li><strong>Objetividad:</strong> Análisis de datos libre de sesgos cognitivos</li>
        <li><strong>Escalabilidad:</strong> Permite a un terapeuta atender más pacientes efectivamente</li>
        <li><strong>Prevención:</strong> Detección temprana de recaídas o crisis</li>
      </ul>
      
      <h3>Testimonios de Profesionales</h3>
      <p>"La IA me permite enfocarme en lo que hago mejor: la conexión humana y la terapia profunda, mientras la tecnología maneja el monitoreo y seguimiento rutinario." - Dra. Carmen López, Psicóloga Clínica</p>
    `,
    date: "21 Agosto 2025",
    author: "Dr. Miguel Herrera",
    category: "Innovación Terapéutica",
    icon: Sparkles,
    color: "bg-gradient-to-r from-purple-500 to-pink-600",
    image: aiTherapyImage,
    readTime: "7 min",
    tags: ["Terapia", "IA", "Psicólogos", "Innovación"]
  }
];

export default function BlogSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="blog" className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <BookOpen className="w-14 h-14 text-orange-500" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Blog NUXA
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Artículos especializados sobre IA y salud mental, investigaciones innovadoras 
            y las últimas tendencias en bienestar digital escritos por nuestros expertos.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => {
            const IconComponent = post.icon;
            return (
              <article key={post.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                {/* Imagen estilo periódico */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${post.color}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <IconComponent className="w-5 h-5 text-orange-500" />
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {post.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setLocation(`/blog/${post.id}`)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                  >
                    Leer Artículo Completo
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Te interesan más artículos?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Descubre nuestra biblioteca completa de artículos sobre inteligencia artificial, 
            salud mental y las últimas innovaciones en bienestar digital.
          </p>
          <Button 
            onClick={() => setLocation("/blog")}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Explorar Todo el Blog
            <TrendingUp className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}