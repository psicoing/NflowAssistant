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
    color: "bg-[#426f69]",
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
    color: "bg-[#557d65]",
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
    color: "bg-[#6a7760]",
    image: aiTherapyImage,
    readTime: "7 min",
    tags: ["Terapia", "IA", "Psicólogos", "Innovación"]
  }
];

export default function BlogSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="blog" className="bg-[#f3f6ef] px-4 py-14 dark:bg-[#102f33] sm:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="relative text-[#557d65] dark:text-[#c9dd83]">
              <BookOpen className="h-11 w-11" />
              <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-[#91aa72]" />
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#173e3d] dark:text-[#f2f4e8] sm:text-5xl">
              Blog NUXA
            </h2>
          </div>
          <p className="mx-auto max-w-4xl text-base leading-7 text-[#526b68] dark:text-[#c3d8d1] sm:text-lg">
            Artículos especializados sobre IA y salud mental, investigaciones innovadoras 
            y las últimas tendencias en bienestar digital escritos por nuestros expertos.
          </p>
          <div className="mx-auto mt-6 h-px w-20 bg-[#a9c1b4] dark:bg-[#6d9d8c]"></div>
        </div>

        <div className="mb-12 grid gap-5 lg:grid-cols-3 sm:gap-7">
          {blogPosts.map((post) => {
            const IconComponent = post.icon;
            return (
              <article key={post.id} className="group overflow-hidden rounded-[1.5rem] border border-[#d6e3dc] bg-[#f8f9f4] shadow-[0_20px_50px_-42px_rgba(19,61,59,0.5)] transition-colors hover:bg-white dark:border-[#315d5b] dark:bg-[#173e3d] dark:hover:bg-[#20494a]">
                {/* Imagen estilo periódico */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${post.color}`}>
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
                      <h3 className="text-lg font-semibold leading-tight text-[#234844] dark:text-[#f2f4e8] sm:text-xl">
                      {post.title}
                    </h3>
                  </div>
                  
                  <p className="mb-4 line-clamp-3 leading-relaxed text-[#647b75] dark:text-[#c3d8d1]">
                    {post.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="rounded-full border border-[#d6e3dc] bg-[#eaf1eb] px-2 py-1 text-xs text-[#526b68] dark:border-[#456c68] dark:bg-[#20494a] dark:text-[#c3d8d1]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mb-4 flex items-center justify-between gap-2 text-xs text-[#74857c] dark:text-[#b7d7c4] sm:text-sm">
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
                    className="w-full rounded-full bg-[#174f50] py-3 font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#173e3d] motion-reduce:transition-none"
                  >
                    Leer Artículo Completo
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="rounded-[1.5rem] border border-[#d6e3dc] bg-[#eaf1eb] p-6 text-center dark:border-[#315d5b] dark:bg-[#173e3d] sm:p-8">
          <h3 className="mb-4 text-xl font-semibold text-[#234844] dark:text-[#f2f4e8] sm:text-2xl">¿Te interesan más artículos?</h3>
          <p className="mx-auto mb-6 max-w-2xl text-[#526b68] dark:text-[#c3d8d1]">
            Descubre nuestra biblioteca completa de artículos sobre inteligencia artificial, 
            salud mental y las últimas innovaciones en bienestar digital.
          </p>
          <Button 
            onClick={() => setLocation("/blog")}
            className="rounded-full bg-[#174f50] px-7 py-3 font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#173e3d] motion-reduce:transition-none sm:text-base"
          >
            Explorar Todo el Blog
            <TrendingUp className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}