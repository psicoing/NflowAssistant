import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, Heart, Eye, Bot, Building2, Sparkles, TrendingUp } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const blogPosts = [
  {
    id: 1,
    title: "Cómo la IA puede ayudar a la salud mental de los adolescentes",
    excerpt: "Descubre cómo la inteligencia artificial está revolucionando el apoyo psicológico para jóvenes, ofreciendo herramientas accesibles, anónimas y disponibles 24/7 para combatir la ansiedad, depresión y otros desafíos emocionales.",
    fullContent: `
      <div class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">La Revolución de la IA en la Salud Mental Juvenil</h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">Los adolescentes de hoy enfrentan desafíos únicos en salud mental. Según la OMS, 1 de cada 7 adolescentes entre 10-19 años experimenta trastornos mentales. La IA emerge como una solución innovadora y accesible.</p>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h3 class="text-xl font-semibold mb-4 text-blue-800">📊 Datos Clave</h3>
          <ul class="list-disc list-inside space-y-2 text-blue-700">
            <li>14% de adolescentes experimenta problemas de salud mental</li>
            <li>Suicidio es la 4ta causa de muerte en jóvenes de 15-19 años</li>
            <li>Solo 1 de cada 5 adolescentes recibe ayuda profesional</li>
          </ul>
        </div>
        
        <h3 class="text-2xl font-bold mb-4 text-gray-900">🚀 Beneficios Clave de la IA para Adolescentes:</h3>
        
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <h4 class="font-bold text-lg mb-3 text-green-800">🕐 Accesibilidad 24/7</h4>
            <p class="text-green-700">Los jóvenes pueden acceder al apoyo cuando más lo necesitan, sin esperas ni citas. Especialmente crítico durante crisis nocturnas o fin de semana.</p>
          </div>
          
          <div class="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
            <h4 class="font-bold text-lg mb-3 text-purple-800">🎭 Anonimato</h4>
            <p class="text-purple-700">Reduce el estigma y permite expresión honesta sin juicios. El 78% de adolescentes prefiere buscar ayuda inicial de forma anónima.</p>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl text-center">
          <h4 class="text-xl font-bold mb-4">¿Quieres experimentar el futuro de la salud mental?</h4>
          <p class="mb-6">Únete a miles de jóvenes que ya están transformando su bienestar con NFLOW.</p>
        </div>
      </div>
    `,
    date: "23 Agosto 2025",
    author: "Dr. Ana Martínez",
    category: "IA & Juventud",
    icon: Bot,
    color: "bg-gradient-to-r from-blue-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    readTime: "8 min",
    tags: ["IA", "Adolescentes", "Salud Mental", "Innovación"],
    views: "2,847",
    likes: 156
  },
  {
    id: 2,
    title: "5 beneficios de usar chatbots para la salud emocional en empresas",
    excerpt: "Las organizaciones líderes están implementando chatbots especializados en salud mental para mejorar el bienestar de sus empleados, reducir el ausentismo y crear culturas empresariales más saludables y productivas.",
    fullContent: `
      <div class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">Transformando el Bienestar Corporativo con IA</h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">El 76% de las empresas Fortune 500 ya han implementado algún tipo de tecnología de salud mental. Los chatbots especializados están liderando esta revolución.</p>
        
        <h3 class="text-2xl font-bold mb-6 text-gray-900">🏆 Los 5 Beneficios Principales:</h3>
        
        <div class="space-y-8">
          <div class="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h4 class="text-xl font-bold mb-4 text-blue-600">1. ⚡ Disponibilidad Inmediata</h4>
            <p class="text-gray-700 mb-4">Los empleados pueden acceder al apoyo en cualquier momento, reduciendo el tiempo de espera de semanas a segundos.</p>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-800 font-semibold">Impacto: Reducción del 85% en tiempo de respuesta inicial</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-2xl text-center">
          <h4 class="text-xl font-bold mb-4">¿Lista tu empresa para el futuro del bienestar?</h4>
          <p class="mb-6">Únete a las organizaciones líderes que ya están transformando la salud mental corporativa.</p>
        </div>
      </div>
    `,
    date: "22 Agosto 2025",
    author: "Lic. Roberto Silva",
    category: "Empresas & Bienestar",
    icon: Building2,
    color: "bg-gradient-to-r from-green-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dfd3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min",
    tags: ["Empresas", "Chatbots", "ROI", "Bienestar Laboral"],
    views: "1,923",
    likes: 89
  },
  {
    id: 3,
    title: "El futuro de la terapia: IA como complemento del psicólogo",
    excerpt: "La inteligencia artificial no reemplaza a los terapeutas humanos, sino que los potencia. Descubre cómo esta sinergia está creando nuevos paradigmas en el tratamiento de la salud mental.",
    fullContent: `
      <div class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">La Sinergia Perfecta: Humano + IA</h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">El futuro de la salud mental no es elegir entre IA o terapeutas humanos, sino combinar lo mejor de ambos mundos para crear experiencias de tratamiento más efectivas y accesibles.</p>
        
        <h3 class="text-2xl font-bold mb-6 text-gray-900">🤝 Cómo la IA Potencia la Terapia Tradicional:</h3>
        
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-2xl text-center">
          <h4 class="text-xl font-bold mb-4">¿Eres un profesional de la salud mental?</h4>
          <p class="mb-6">Descubre cómo NFLOW puede potenciar tu práctica terapéutica y mejorar los resultados de tus pacientes.</p>
        </div>
      </div>
    `,
    date: "21 Agosto 2025",
    author: "Dr. Miguel Herrera",
    category: "Innovación Terapéutica",
    icon: Sparkles,
    color: "bg-gradient-to-r from-purple-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    readTime: "7 min",
    tags: ["Terapia", "IA", "Psicólogos", "Innovación"],
    views: "3,156",
    likes: 203
  }
];

export default function BlogPage() {
  const params = useParams();
  const postId = params.id ? parseInt(params.id) : null;
  
  // Si hay un ID, mostrar artículo individual
  if (postId) {
    const post = blogPosts.find(p => p.id === postId);
    
    if (!post) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
            <Link href="/blog">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Blog
              </Button>
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBanner={false} />
        <main className="pt-20">
          {/* Header del artículo */}
          <div className="bg-white py-12">
            <div className="max-w-4xl mx-auto px-4">
              <Link href="/blog">
                <Button variant="ghost" className="mb-6 text-orange-600 hover:text-orange-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Blog
                </Button>
              </Link>
              
              <div className="mb-6">
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {post.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              </div>
              
              {/* Meta información */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8 pb-8 border-b">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readTime} de lectura</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>{post.views} vistas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>{post.likes} likes</span>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Imagen del artículo */}
          <div className="bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <img 
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover rounded-2xl shadow-xl mb-12"
              />
            </div>
          </div>
          
          {/* Contenido del artículo */}
          <div className="bg-white pb-16">
            <div className="max-w-4xl mx-auto px-4">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.fullContent }}
              />
              
              {/* CTA final */}
              <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl text-center">
                <h3 className="text-2xl font-bold mb-4">¿Te interesó este artículo?</h3>
                <p className="text-lg mb-6">Únete a NFLOW y experimenta el futuro de la salud mental digital.</p>
                <Button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-xl"
                >
                  Comenzar Ahora
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Lista de todos los artículos
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBanner={false} />
      <main className="pt-20">
        {/* Header del blog */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <BookOpen className="w-14 h-14" />
                <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Blog NFLOW
              </h1>
            </div>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Artículos especializados sobre IA y salud mental, innovación en bienestar digital 
              y las últimas tendencias en psicología moderna.
            </p>
            <div className="w-24 h-1 bg-white/30 mx-auto mt-6 rounded-full"></div>
          </div>
        </div>
        
        {/* Lista de artículos */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => {
                const IconComponent = post.icon;
                return (
                  <article key={post.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                    {/* Imagen del artículo */}
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
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                          {post.title}
                        </h2>
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
                      
                      <Link href={`/blog/${post.id}`}>
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                          Leer Artículo Completo
                          <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">¿Te interesan más artículos?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Descubre nuestra biblioteca completa de artículos sobre inteligencia artificial, 
              salud mental y las últimas innovaciones en bienestar digital.
            </p>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Únete a NFLOW
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}