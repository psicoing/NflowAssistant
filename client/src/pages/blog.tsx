import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Search, 
  Filter,
  Heart,
  Users,
  Briefcase,
  Brain,
  Clock,
  Target,
  Lightbulb,
  BookOpen,
  Dumbbell,
  FileText,
  Utensils,
  Puzzle,
  ChevronRight,
  Calendar,
  User,
  Tag
} from "lucide-react";

// Blog posts que combinan recursos y consejos
const blogPosts = [
  {
    id: 1,
    title: "Técnicas de Respiración para Controlar la Ansiedad",
    excerpt: "Aprende métodos probados para reducir la ansiedad en minutos usando técnicas de respiración controlada.",
    category: "ansiedad",
    type: "consejo",
    readTime: "5 min",
    date: "2025-01-15",
    author: "Dr. Ramón Molons",
    content: `
# Técnica de respiración 4-7-8

Esta técnica, desarrollada por el Dr. Andrew Weil, es especialmente efectiva para reducir la ansiedad y promover la calma.

## Cómo practicarla:
1. **Inhala** durante 4 segundos por la nariz
2. **Mantén** la respiración durante 7 segundos  
3. **Exhala** durante 8 segundos por la boca
4. **Repite** el ciclo 3-4 veces

## Grounding 5-4-3-2-1

Cuando sientes que la ansiedad te abruma, usa esta técnica de grounding:

- **5** cosas que puedes ver
- **4** cosas que puedes tocar
- **3** cosas que puedes oír
- **2** cosas que puedes oler
- **1** cosa que puedes saborear

Esta técnica te ayuda a volver al presente y reduce la intensidad de los pensamientos ansiosos.
    `
  },
  {
    id: 2,
    title: "Construyendo Autoestima: El Diario de Logros Diarios",
    excerpt: "Una herramienta simple pero poderosa para reconocer tus éxitos y fortalecer tu autoconfianza día a día.",
    category: "autoestima",
    type: "ejercicio",
    readTime: "10 min",
    date: "2025-01-14",
    author: "Dr. Ramón Molons",
    content: `
# Diario de Logros Diarios

La autoestima se construye reconociendo nuestros éxitos, por pequeños que sean.

## Cómo empezar:
Cada noche, antes de dormir, escribe en tu diario:

### 3 cosas que hiciste bien hoy
- No importa lo pequeñas que sean
- Pueden ser desde "me levanté temprano" hasta "ayudé a un compañero"
- Sé específico en las descripciones

### Ejemplo de entrada:
**Fecha: 15 de enero, 2025**
1. Completé todas mis tareas del trabajo a tiempo
2. Llamé a mi madre para saber cómo estaba
3. Cociné una cena saludable en casa

## Afirmaciones Positivas Complementarias
Combina el diario con estas afirmaciones:
- "Soy capaz de superar cualquier desafío"
- "Merezco amor y respeto"
- "Estoy creciendo cada día"

**Repite estas frases cada mañana frente al espejo durante 5 minutos.**
    `
  },
  {
    id: 3,
    title: "Comunicación Asertiva: Mejora tus Relaciones",
    excerpt: "Aprende a expresar tus sentimientos de manera efectiva sin generar conflictos innecesarios.",
    category: "familia",
    type: "guia",
    readTime: "8 min",
    date: "2025-01-13",
    author: "Dr. Ramón Molons",
    content: `
# Comunicación Asertiva en las Relaciones

Una comunicación efectiva es la base de relaciones saludables.

## Principios Fundamentales

### 1. Usa "Yo siento..." en lugar de "Tú siempre..."
- ❌ "Tú siempre llegas tarde y me haces enojar"
- ✅ "Yo me siento preocupado cuando llegas tarde sin avisar"

### 2. Escucha Activa
- Mantén contacto visual
- Haz preguntas de seguimiento: "¿Podrías contarme más sobre eso?"
- Parafrasea lo que escuchas: "Si entiendo bien, te sientes..."

### 3. Valida las Emociones
Reconoce los sentimientos de la otra persona:
- "Entiendo que te sientes frustrado"
- "Puedo ver que esto es importante para ti"

## Ventana de Escucha Activa

**Ejercicio práctico:**
Durante 10 minutos, practica escuchar sin juzgar ni dar consejos. Solo escucha y haz preguntas que ayuden a la otra persona a expresarse mejor.

Este ejercicio fortalece la conexión emocional y mejora la comprensión mutua.
    `
  },
  {
    id: 4,
    title: "Productividad Mental: La Técnica Pomodoro",
    excerpt: "Maximiza tu enfoque y reduce el estrés laboral con esta técnica de gestión del tiempo probada científicamente.",
    category: "laboral",
    type: "consejo",
    readTime: "6 min",
    date: "2025-01-12",
    author: "Dr. Ramón Molons",
    content: `
# La Técnica Pomodoro para la Salud Mental

Esta técnica no solo mejora la productividad, sino que reduce significativamente el estrés y la ansiedad laboral.

## Cómo Funciona:
1. **Trabaja** durante 25 minutos sin interrupciones
2. **Descansa** 5 minutos
3. **Repite** el ciclo
4. Después de 4 ciclos, toma un **descanso largo** de 15-30 minutos

## Beneficios para la Salud Mental:
- Reduce la sensación de abrumamiento
- Proporciona sensación de logro frecuente
- Previene el agotamiento mental
- Mejora la concentración y reduce la ansiedad

## Regla de los 2 Minutos
Complementa la técnica Pomodoro con esta regla:
**Si una tarea toma menos de 2 minutos, hazla inmediatamente.**

Esto evita la acumulación de tareas pequeñas que pueden generar estrés.

## Adaptación para Trabajo Remoto:
- Usa cada descanso de 5 minutos para moverte físicamente
- Durante el descanso largo, sal al aire libre si es posible
- Mantén hidratación constante
    `
  },
  {
    id: 5,
    title: "Apoyo Familiar: Herramientas de Comunicación Positiva",
    excerpt: "Estrategias prácticas para crear un ambiente familiar más armonioso y comprensivo.",
    category: "familia",
    type: "ejercicio",
    readTime: "12 min",
    date: "2025-01-11",
    author: "Dr. Ramón Molons",
    content: `
# Herramientas de Comunicación Familiar

## 1. Ventana de Escucha Activa (Carl Rogers)

**Objetivo:** Fomentar la escucha real y comprensión empática en la familia.

### Instrucciones:
- Cada miembro de la familia tiene 10 minutos para hablar sin interrupciones
- Los demás solo escuchan, sin juzgar ni dar consejos
- Al final, cada oyente parafrasea lo que escuchó

### Materiales necesarios:
- Cronómetro
- Espacio tranquilo
- Compromiso de todos los participantes

## 2. Agenda de Temas Neutrales

**Objetivo:** Crear rutinas de comunicación positiva antes de abordar conflictos.

### Temas sugeridos:
- Planificación de actividades familiares
- Compartir algo positivo del día
- Planes para el fin de semana
- Logros individuales de cada miembro

## 3. Tarjetas de Comunicación Positiva

**Objetivo:** Implementar refuerzo positivo sistemático.

### Instrucciones:
1. Cada familia crea tarjetas con mensajes positivos
2. Se intercambian al menos una vez al día
3. Ejemplos: "Aprecio que...", "Me siento orgulloso cuando..."

### Contraindicaciones:
- No usar durante crisis familiares agudas
- Suspender si genera más tensión que armonía
- Adaptar según las edades de los miembros
    `
  },
  {
    id: 6,
    title: "Mindfulness y Bienestar: Ejercicios para el Día a Día",
    excerpt: "Técnicas de atención plena basadas en MBSR para reducir el estrés y mejorar tu calidad de vida.",
    category: "bienestar",
    type: "ejercicio",
    readTime: "15 min",
    date: "2025-01-10",
    author: "Dr. Ramón Molons",
    content: `
# Ejercicios de Mindfulness para el Bienestar

Basados en el programa MBSR (Mindfulness-Based Stress Reduction) y protocolos MBCT.

## Ejercicio 1: Respiración Consciente

### Fundamento científico:
La respiración consciente activa el sistema nervioso parasimpático, reduciendo cortisol y activando la respuesta de relajación.

### Instrucciones:
1. Siéntate cómodamente con la espalda recta
2. Cierra los ojos suavemente
3. Respira naturalmente, sin forzar
4. Cuenta cada exhalación del 1 al 10
5. Si pierdes la cuenta, vuelve al 1 sin juzgarte

**Duración:** 10-20 minutos diarios
**Población diana:** Adultos con estrés leve a moderado

## Ejercicio 2: Escaneo Corporal

### Objetivo neuropsicológico:
Desarrollar conciencia interoceptiva y reducir la tensión muscular acumulada.

### Pasos:
1. Acuéstate en posición cómoda
2. Comienza por los dedos de los pies
3. Dirige tu atención a cada parte del cuerpo progresivamente
4. Observa sensaciones sin intentar cambiarlas
5. Termina en la cabeza después de 20 minutos

### Indicadores de mejora:
- Reducción de tensión muscular
- Mejor calidad del sueño
- Mayor conciencia corporal

### Contraindicaciones:
- Trauma reciente no procesado
- Episodios disociativos activos
- Dolor crónico severo (consultar especialista)
    `
  }
];

const categories = [
  { id: "all", name: "Todos", icon: BookOpen, color: "bg-gray-500" },
  { id: "ansiedad", name: "Ansiedad", icon: Brain, color: "bg-blue-500" },
  { id: "autoestima", name: "Autoestima", icon: Heart, color: "bg-green-500" },
  { id: "familia", name: "Familia", icon: Users, color: "bg-purple-500" },
  { id: "laboral", name: "Laboral", icon: Briefcase, color: "bg-orange-500" },
  { id: "bienestar", name: "Bienestar", icon: Target, color: "bg-pink-500" }
];

const contentTypes = [
  { id: "all", name: "Todos", icon: FileText },
  { id: "consejo", name: "Consejos", icon: Lightbulb },
  { id: "ejercicio", name: "Ejercicios", icon: Dumbbell },
  { id: "guia", name: "Guías", icon: BookOpen }
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesType = selectedType === "all" || post.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handlePostClick = (post: typeof blogPosts[0]) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getTypeInfo = (typeId: string) => {
    return contentTypes.find(type => type.id === typeId) || contentTypes[0];
  };

  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-nflow-navy via-nflow-dark to-nflow-navy">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-nflow-blue/20 px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-nflow-blue" />
              <span className="text-nflow-blue font-medium">Blog NFLOW</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Recursos y Consejos
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Descubre herramientas prácticas, ejercicios profesionales y consejos basados en evidencia 
              para mejorar tu bienestar mental y emocional.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar artículos, ejercicios o consejos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white/10 border-gray-600 text-white placeholder:text-gray-400 rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 bg-nflow-dark/50 sticky top-20 z-10 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-6xl mx-auto">
            {/* Category Filters */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-nflow-blue" />
                <span className="text-sm font-medium text-gray-300">Categorías</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`${
                        selectedCategory === category.id 
                          ? `${category.color} text-white hover:opacity-90` 
                          : "border-gray-600 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Type Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-nflow-blue" />
                <span className="text-sm font-medium text-gray-300">Tipo de contenido</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.id)}
                      className={`${
                        selectedType === type.id 
                          ? "bg-nflow-blue text-white hover:bg-nflow-blue/90" 
                          : "border-gray-600 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {type.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-400">
                  Intenta con otros términos de búsqueda o filtros diferentes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => {
                  const categoryInfo = getCategoryInfo(post.category);
                  const typeInfo = getTypeInfo(post.type);
                  const CategoryIcon = categoryInfo.icon;
                  const TypeIcon = typeInfo.icon;
                  
                  return (
                    <Card 
                      key={post.id} 
                      className="bg-nflow-navy border-gray-700 hover:border-nflow-blue/50 transition-all duration-300 hover:shadow-lg hover:shadow-nflow-blue/20 cursor-pointer group"
                      onClick={() => handlePostClick(post)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg ${categoryInfo.color} flex items-center justify-center`}>
                              <CategoryIcon className="w-4 h-4 text-white" />
                            </div>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {typeInfo.name.slice(0, -1)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-nflow-blue transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-nflow-blue text-sm font-medium group-hover:gap-2 transition-all">
                          Leer más
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Results Summary */}
        <section className="py-8 px-4 bg-nflow-navy/30">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400">
              Mostrando <span className="text-nflow-blue font-medium">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'resultado' : 'resultados'}
              {(selectedCategory !== "all" || selectedType !== "all" || searchTerm) && (
                <span> de <span className="text-nflow-blue font-medium">{blogPosts.length}</span> artículos disponibles</span>
              )}
            </p>
          </div>
        </section>
      </main>

      <Footer />

      {/* Article Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-nflow-navy border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader className="border-b border-gray-700 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  {(() => {
                    const categoryInfo = getCategoryInfo(selectedPost.category);
                    const CategoryIcon = categoryInfo.icon;
                    return (
                      <div className={`w-10 h-10 rounded-lg ${categoryInfo.color} flex items-center justify-center`}>
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <Badge variant="outline" className="border-gray-600 text-gray-300 mb-1">
                      {(() => {
                        const typeInfo = getTypeInfo(selectedPost.type);
                        const TypeIcon = typeInfo.icon;
                        return (
                          <>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeInfo.name.slice(0, -1)}
                          </>
                        );
                      })()}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-400 gap-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {selectedPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(selectedPost.date).toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedPost.readTime}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogTitle className="text-2xl text-white leading-tight">
                  {selectedPost.title}
                </DialogTitle>
                <DialogDescription className="text-gray-300 text-lg">
                  {selectedPost.excerpt}
                </DialogDescription>
              </DialogHeader>
              <div className="pt-6">
                <div 
                  className="prose prose-lg prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedPost.content
                      .replace(/\n/g, '<br />')
                      .replace(/# (.*?)<br \/>/g, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>')
                      .replace(/## (.*?)<br \/>/g, '<h2 class="text-xl font-semibold text-gray-200 mb-3 mt-5">$2</h2>')
                      .replace(/### (.*?)<br \/>/g, '<h3 class="text-lg font-medium text-gray-300 mb-2 mt-4">$3</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                      .replace(/- (.*?)<br \/>/g, '<li class="text-gray-300 mb-1">$1</li>')
                      .replace(/(\d+\.) (.*?)<br \/>/g, '<li class="text-gray-300 mb-2 list-decimal">$2</li>')
                      .replace(/❌ (.*?)<br \/>/g, '<div class="bg-red-900/30 p-3 rounded-lg mb-2 border-l-4 border-red-500"><span class="text-red-200">❌ $1</span></div>')
                      .replace(/✅ (.*?)<br \/>/g, '<div class="bg-green-900/30 p-3 rounded-lg mb-2 border-l-4 border-green-500"><span class="text-green-200">✅ $1</span></div>')
                  }}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}