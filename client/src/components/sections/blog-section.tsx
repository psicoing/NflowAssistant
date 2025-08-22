import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, Calendar, User, ArrowRight, Brain, Heart, Lightbulb } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "5 Técnicas de Respiración para Controlar la Ansiedad",
    excerpt: "Descubre métodos efectivos respaldados por la ciencia para manejar la ansiedad a través de la respiración consciente.",
    date: "15 Enero 2025",
    author: "Dr. Sarah López",
    category: "Ansiedad",
    icon: Heart,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Salud Mental en el Trabajo: Guía Práctica",
    excerpt: "Estrategias para mantener el bienestar mental en entornos laborales desafiantes y prevenir el burnout.",
    date: "12 Enero 2025", 
    author: "Psic. María González",
    category: "Laboral",
    icon: Brain,
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Mindfulness para Principiantes: Primeros Pasos",
    excerpt: "Una introducción práctica al mindfulness y cómo incorporar la atención plena en tu vida diaria.",
    date: "8 Enero 2025",
    author: "Dr. Carlos Ruiz",
    category: "Mindfulness",
    icon: Lightbulb,
    color: "bg-purple-500"
  }
];

export default function BlogSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="blog" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BookOpen className="w-12 h-12 text-nflow-orange" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Blog de Salud Mental
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Artículos especializados, consejos prácticos y las últimas investigaciones 
            en psicología y bienestar mental escritos por nuestros expertos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => {
            const IconComponent = post.icon;
            return (
              <article key={post.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className={`${post.color} p-4`}>
                  <div className="flex items-center justify-between text-white">
                    <IconComponent className="w-8 h-8" />
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setLocation("/blog")}
                    className="w-full bg-nflow-orange hover:bg-orange-600 text-white"
                  >
                    Leer Artículo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => setLocation("/blog")}
            className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg"
          >
            Ver Todos los Artículos
            <BookOpen className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}