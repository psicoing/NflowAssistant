import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Book, 
  FileText, 
  Dumbbell, 
  Search, 
  Filter,
  Heart,
  Users,
  Briefcase,
  Brain,
  Clock,
  Gift
} from "lucide-react";
import type { Resource } from "@shared/schema";

const categoryIcons = {
  ansiedad: Brain,
  depresion: Heart,
  familia: Users,
  bienestar: Heart,
  laboral: Briefcase,
  autoestima: Heart,
};

const typeIcons = {
  article: FileText,
  guide: Book,
  exercise: Dumbbell,
};

const typeLabels = {
  article: "Artículo",
  guide: "Guía",
  exercise: "Ejercicio",
};

const categoryLabels = {
  ansiedad: "Ansiedad & Crisis",
  depresion: "Depresión",
  familia: "Familia", 
  bienestar: "Bienestar",
  laboral: "Laboral",
  autoestima: "Autoestima",
};

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Create mock resources for display purposes
  const mockResources: Resource[] = [
    {
      id: 1,
      title: "Técnicas de Respiración para la Ansiedad",
      content: "Ejercicios de respiración oficiales basados en las guías del Sistema Nacional de Salud para reducir los niveles de ansiedad de forma efectiva.",
      category: "ansiedad",
      type: "exercise",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: 7,
      title: "Gestión de Crisis Emocionales",
      content: "Estrategias inmediatas para manejar crisis de ansiedad y ataques de pánico según protocolos clínicos oficiales.",
      category: "ansiedad", 
      type: "guide",
      createdAt: new Date("2024-02-10"),
    },
    {
      id: 8,
      title: "Autoevaluación GAD-7 y Herramientas",
      content: "Recursos de autoevaluación validados por el Ministerio de Sanidad para monitorizar tu nivel de ansiedad.",
      category: "ansiedad",
      type: "article", 
      createdAt: new Date("2024-02-15"),
    },
    {
      id: 9,
      title: "Guía Oficial sobre Depresión",
      content: "Información completa sobre depresión basada en guías clínicas del Sistema Nacional de Salud y protocolos de atención primaria.",
      category: "depresion",
      type: "guide",
      createdAt: new Date("2024-02-20"),
    },
    {
      id: 10,
      title: "Detección Temprana de Síntomas Depresivos",
      content: "Recursos de autodetección y cuestionarios validados para identificar signos tempranos de depresión.",
      category: "depresion",
      type: "article",
      createdAt: new Date("2024-02-25"),
    },
    {
      id: 11,
      title: "Recursos de Apoyo Profesional",
      content: "Directorio de recursos profesionales y líneas de ayuda especializadas en salud mental y depresión.",
      category: "depresion",
      type: "guide",
      createdAt: new Date("2024-03-01"),
    },
    {
      id: 12,
      title: "Ejercicios de Mindfulness Profesionales",
      content: "Técnicas estructuradas de mindfulness basadas en protocolos MBSR, MBCT y estándares clínicos internacionales.",
      category: "bienestar",
      type: "guide",
      createdAt: new Date("2024-03-05"),
    },
    {
      id: 13,
      title: "Formato Técnico para Ejercicios de Atención Plena",
      content: "Guía profesional para la estructuración de ejercicios con fundamento neurobiológico y objetivos terapéuticos.",
      category: "bienestar",
      type: "article",
      createdAt: new Date("2024-03-10"),
    },
    {
      id: 2,
      title: "Comunicación Familiar Efectiva",
      content: "Estrategias para mejorar la comunicación entre padres e hijos adolescentes.",
      category: "familia",
      type: "guide",
      createdAt: new Date("2024-01-20"),
    },
    {
      id: 14,
      title: "Ventana de Escucha Activa",
      content: "Técnica psicoeducativa basada en Carl Rogers para fomentar la escucha real y comprensión empática entre padres e hijos adolescentes.",
      category: "familia",
      type: "exercise",
      createdAt: new Date("2024-07-08"),
    },
    {
      id: 15,
      title: "Agenda de Temas Neutrales",
      content: "Herramienta para reforzar la comunicación regular sobre temas no conflictivos y mantener la conexión familiar.",
      category: "familia",
      type: "exercise",
      createdAt: new Date("2024-07-08"),
    },
    {
      id: 16,
      title: "Tarjetas de Comunicación Positiva",
      content: "Sistema de refuerzo positivo para entrenar la expresión de emociones agradables entre padres e hijos.",
      category: "familia",
      type: "exercise",
      createdAt: new Date("2024-07-08"),
    },
    {
      id: 3,
      title: "Manejo del Estrés Laboral",
      content: "Herramientas prácticas para gestionar el estrés en el entorno profesional.",
      category: "laboral",
      type: "article",
      createdAt: new Date("2024-01-25"),
    },
    {
      id: 4,
      title: "Ejercicios de Mindfulness",
      content: "Práticas de atención plena para mejorar el bienestar mental y emocional.",
      category: "bienestar",
      type: "exercise",
      createdAt: new Date("2024-02-01"),
    },
    {
      id: 5,
      title: "Fortaleciendo la Autoestima",
      content: "Actividades y reflexiones para desarrollar una imagen positiva de uno mismo.",
      category: "autoestima",
      type: "guide",
      createdAt: new Date("2024-02-05"),
    }
  ];

  const filteredResources = mockResources.filter((resource: Resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    const matchesType = !selectedType || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = Array.from(new Set(mockResources.map((r: Resource) => r.category)));
  const types = Array.from(new Set(mockResources.map((r: Resource) => r.type)));

  return (
    <div className="min-h-screen bg-nflow-dark">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-nflow-navy via-nflow-dark to-nflow-dark">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Recursos de <span className="text-nflow-orange">Salud Mental</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Accede a una biblioteca completa de contenidos y herramientas psicológicas 
              cuidadosamente seleccionadas para apoyar tu bienestar emocional.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 px-4 bg-nflow-navy">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white rounded-xl"
                />
              </div>
              
              <div className="text-center space-y-4">
                <div className="flex gap-2 flex-wrap justify-center">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-nflow-orange hover:bg-nflow-orange-light text-black border-0 rounded-full" : "border-gray-500 text-black bg-white hover:bg-nflow-orange/90 hover:text-black hover:border-nflow-orange rounded-full"}
                    >
                      {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>


              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No se encontraron recursos
                </h3>
                <p className="text-gray-400">
                  Intenta ajustar tus filtros de búsqueda
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource: Resource) => {
                  const CategoryIcon = categoryIcons[resource.category as keyof typeof categoryIcons] || Book;
                  const TypeIcon = typeIcons[resource.type as keyof typeof typeIcons] || FileText;
                  
                  return (
                    <Card 
                      key={resource.id} 
                      className="bg-gray-800 border-gray-700 hover:border-nflow-orange transition-all duration-300 hover:shadow-lg hover:shadow-nflow-orange/20"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-nflow-orange/20 rounded-lg flex items-center justify-center">
                              <CategoryIcon className="w-5 h-5 text-nflow-orange" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">
                                {resource.title}
                              </CardTitle>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Badge 
                            variant="secondary" 
                            className="bg-nflow-blue/20 text-nflow-blue border-nflow-blue/30"
                          >
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeLabels[resource.type as keyof typeof typeLabels] || resource.type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="border-gray-600 text-gray-300"
                          >
                            {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          {resource.content}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(resource.createdAt).toLocaleDateString('es-ES')}
                          </span>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedResource(resource);
                              setIsModalOpen(true);
                            }}
                            className="bg-nflow-orange hover:bg-nflow-orange-light text-white"
                          >
                            Leer más
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Modal de Recursos */}
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedResource(null);
        }}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedResource?.title === "Manejo del Estrés Laboral" ? (
              // Modal específico para estrés laboral
              <div>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-nflow-orange/20 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-nflow-orange" />
                    </div>
                    Manejo del Estrés Laboral
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Estrategias respaldadas por la APA para manejar el estrés en el trabajo
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6 text-gray-300">
                  {/* Sección 1: Estrategias prácticas */}
                  <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-nflow-orange text-lg font-semibold mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      1. Estrategias prácticas para el estrés en el trabajo
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">La APA recomienda:</p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-orange rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Llevar un registro de las situaciones estresantes</strong> (journaling), para identificar desencadenantes y patrones.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-orange rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Definir qué puedes controlar</strong> y centrarte en ello; si hace falta, considera cambiar de entorno laboral.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-orange rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Tomar descansos bien planificados</strong> y fomentar una cultura que los respete.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-orange rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Priorizar conexiones humanas</strong>, con compañeros, familia y amigos como redes de soporte cruciales.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Sección 2: Herramientas */}
                  <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-nflow-blue text-lg font-semibold mb-4 flex items-center gap-2">
                      <Dumbbell className="w-5 h-5" />
                      2. Herramientas de manejo del estrés
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">La APA sugiere herramientas concretas:</p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Técnicas de respiración</strong>, relajación progresiva y estiramientos.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Ejercicio breve</strong> (incluso de 5–10 minutos) mejora estado de ánimo y concentración.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Recursos digitales y guías</strong> del estilo "manage stress tools", disponibles gratuitamente para el público.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Sección 3: Enfoque organizacional */}
                  <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-nflow-orange text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      3. Enfoque organizacional y cultural
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">Desde el Center for Workplace Mental Health (APA Foundation):</p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-orange rounded-full mt-2 flex-shrink-0"></div>
                        <span>El <strong>77% de los trabajadores</strong> sienten que no reciben suficiente apoyo emocional.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-orange rounded-full mt-2 flex-shrink-0"></div>
                        <span>Programas como <strong>Notice. Talk. Act.®</strong> ofrecen formación para managers, promover cultura positiva y acciones concretas.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nflow-orange rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Toolkit para combatir el burnout</strong>, incluyendo comunicación abierta, límites claros y designación de espacios de desconexión.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Sección 4: Datos */}
                  <div className="bg-red-900/20 p-6 rounded-lg border border-red-700/50">
                    <h3 className="text-red-400 text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      4. Datos que justifican tomar acción
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>El <strong>77% de los empleados</strong> reportan estrés laboral el último mes.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Un <strong>entorno tóxico triplica</strong> el riesgo de daño mental; un clima sano mejora bienestar organizacional.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>El estrés en el trabajo cuesta a las empresas <strong>más de 300,000 M USD al año</strong> en EE.UU., por absentismo, baja productividad y gasto sanitario.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Recomendaciones clave */}
                  <div className="bg-green-900/20 p-6 rounded-lg border border-green-700/50">
                    <h3 className="text-green-400 text-lg font-semibold mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Recomendaciones clave (APA)
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Monitorea</strong> tus niveles de estrés y patrones.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Actúa</strong> sobre lo controlable: descansos, pausas, reorganización.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Usa técnicas</strong> de relajación y ejercicio breve como mini-pausa mental.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Fomenta</strong> un entorno de apoyo emocional, principalmente desde liderazgo.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Formación y protocolos</strong> corporativos para prevenir entornos tóxicos y burnout.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : selectedResource?.category === "ansiedad" ? (
              // Modal específico para recursos de ansiedad
              <div>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-nflow-blue/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-nflow-blue" />
                    </div>
                    Recursos Fiables para la Ansiedad
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Basados en Guías Oficiales de Salud
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 text-gray-300">
                  {/* Introducción */}
                  <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-4 rounded-lg border border-blue-700/30">
                    <p className="text-sm leading-relaxed">
                      La ansiedad es un problema de salud frecuente. Aquí tienes información y recursos 
                      recomendados por el Sistema Nacional de Salud y las principales guías clínicas, 
                      organizados de forma clara y sencilla. <strong className="text-yellow-400">No sustituyen el diagnóstico profesional.</strong>
                    </p>
                  </div>

                  {/* ¿Qué es la ansiedad? */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">¿Qué es la ansiedad?</h3>
                    <p className="text-gray-300 mb-3">
                      La ansiedad es una respuesta normal del organismo ante situaciones de peligro o incertidumbre. 
                      Se vuelve un problema cuando es excesiva, constante o interfiere en la vida diaria.
                    </p>
                    <Button variant="outline" size="sm" className="text-nflow-blue border-nflow-blue hover:bg-nflow-blue/10">
                      📄 Más información – GuíaSalud (PDF)
                    </Button>
                  </div>

                  {/* Tipos de ansiedad */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Tipos de ansiedad más frecuentes:</h3>
                    <ul className="space-y-2">
                      {[
                        "Trastorno de Ansiedad Generalizada",
                        "Crisis de pánico", 
                        "Fobias (social, agorafobia, etc.)",
                        "Trastorno obsesivo-compulsivo",
                        "Estrés postraumático"
                      ].map((tipo, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-nflow-blue rounded-full"></div>
                          <span>{tipo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Síntomas comunes */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Síntomas comunes:</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        "Palpitaciones, temblores, sudoración",
                        "Miedo, inquietud, preocupación", 
                        "Problemas para dormir",
                        "Sensación de ahogo",
                        "Dificultad para concentrarse"
                      ].map((sintoma, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-sm">{sintoma}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ¿Cuándo pedir ayuda? */}
                  <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 p-4 rounded-lg border border-red-700/30">
                    <h3 className="text-xl font-semibold text-white mb-3">¿Cuándo pedir ayuda?</h3>
                    <ul className="space-y-2">
                      {[
                        "Si los síntomas son intensos o persisten",
                        "Si interfieren en el trabajo o la vida personal", 
                        "Si tienes pensamientos de autolesión"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" size="sm" className="mt-3 text-red-400 border-red-400 hover:bg-red-400/10">
                      📄 Consulta rápida – Ministerio de Sanidad (PDF)
                    </Button>
                  </div>

                  {/* ¿Qué puedes hacer en casa? */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">¿Qué puedes hacer en casa?</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <span className="font-medium">Practicar técnicas de respiración y relajación:</span>
                          <br />
                          <Button variant="outline" size="sm" className="mt-1 text-green-400 border-green-400 hover:bg-green-400/10">
                            🧘 Ejercicio guiado – Andalucía Salud (PDF)
                          </Button>
                        </div>
                      </li>
                      {[
                        "Mantener rutinas diarias (dormir, comer, ejercicio regular)",
                        "Evitar cafeína, alcohol y tabaco",
                        "Hablar con personas de confianza"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recursos profesionales */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Recursos profesionales y de autoayuda:</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-nflow-blue border-nflow-blue hover:bg-nflow-blue/10">
                        📋 Guía de Práctica Clínica para Trastornos de Ansiedad – Atención Primaria
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-purple-400 border-purple-400 hover:bg-purple-400/10">
                        📞 Teléfono de la Esperanza – 717 003 717
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-orange-400 border-orange-400 hover:bg-orange-400/10">
                        ✅ Escala GAD-7 online (autoevaluación)
                      </Button>
                    </div>
                  </div>

                  {/* Descargables */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Descargables y enlaces útiles:</h3>
                    <div className="grid gap-2">
                      {[
                        "Guía para pacientes y cuidadores (PDF)",
                        "Ejercicios prácticos y autoayuda (PDF)",
                        "Escala GAD-7 y otras herramientas (PDF)"
                      ].map((item, idx) => (
                        <Button key={idx} variant="outline" size="sm" className="justify-start text-gray-300 border-gray-600 hover:bg-gray-700/50">
                          📥 {item}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Aviso importante */}
                  <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 p-4 rounded-lg border border-yellow-700/30">
                    <h4 className="font-bold text-yellow-400 mb-2">⚠️ Aviso:</h4>
                    <p className="text-sm">
                      Si los síntomas empeoran o tienes pensamientos graves, acude a tu médico o a Urgencias.
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedResource?.category === "depresion" ? (
              // Modal específico para recursos de depresión
              <div>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-purple-400" />
                    </div>
                    Recursos Fiables para la Depresión
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Basados en Guías Clínicas Oficiales y Protocolos de Atención Primaria
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 text-gray-300">
                  {/* Introducción */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 p-4 rounded-lg border border-purple-700/30">
                    <p className="text-sm leading-relaxed">
                      La depresión es un trastorno de salud mental frecuente que requiere atención profesional. 
                      Esta información está basada en las guías clínicas del Sistema Nacional de Salud y 
                      protocolos de atención primaria. <strong className="text-yellow-400">No sustituye el diagnóstico ni tratamiento profesional.</strong>
                    </p>
                  </div>

                  {/* ¿Qué es la depresión? */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">¿Qué es la depresión?</h3>
                    <p className="text-gray-300 mb-3">
                      La depresión es más que sentirse triste. Es un trastorno del estado de ánimo que afecta 
                      cómo piensas, sientes y manejas las actividades diarias. Puede interferir significativamente 
                      con la vida cotidiana y requiere tratamiento profesional.
                    </p>
                    <Button variant="outline" size="sm" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
                      📄 Guía Clínica Depresión – SNS (PDF)
                    </Button>
                  </div>

                  {/* Síntomas principales */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Síntomas principales:</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Estado de ánimo deprimido la mayor parte del día",
                        "Pérdida de interés o placer en actividades", 
                        "Cambios significativos en el peso o apetito",
                        "Problemas de sueño (insomnio o hipersomnia)",
                        "Fatiga o pérdida de energía",
                        "Sentimientos de inutilidad o culpa excesiva",
                        "Dificultad para concentrarse o tomar decisiones",
                        "Pensamientos recurrentes de muerte"
                      ].map((sintoma, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-sm">{sintoma}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cuándo buscar ayuda URGENTE */}
                  <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 p-4 rounded-lg border border-red-700/50">
                    <h3 className="text-xl font-semibold text-white mb-3">⚠️ Busca ayuda INMEDIATA si:</h3>
                    <ul className="space-y-2">
                      {[
                        "Tienes pensamientos de autolesión o suicidio",
                        "Has hecho planes específicos para hacerte daño", 
                        "Sientes que no puedes garantizar tu seguridad",
                        "Experimentas síntomas psicóticos (alucinaciones, delirios)"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 space-y-2">
                      <Button variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-400/10 w-full">
                        🚨 Emergencias: 112
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-400/10 w-full">
                        📞 Teléfono de la Esperanza: 717 003 717
                      </Button>
                    </div>
                  </div>

                  {/* Herramientas de detección */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Herramientas de autoevaluación:</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-purple-400 border-purple-400 hover:bg-purple-400/10">
                        ✅ Cuestionario PHQ-9 (Patient Health Questionnaire)
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-blue-400 border-blue-400 hover:bg-blue-400/10">
                        📋 Escala de Hamilton para la Depresión (HAM-D)
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-green-400 border-green-400 hover:bg-green-400/10">
                        🔍 Test de Beck para la Depresión (BDI-II)
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      * Estas herramientas son orientativas. Un profesional debe realizar el diagnóstico.
                    </p>
                  </div>

                  {/* Recursos profesionales */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Recursos profesionales:</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-nflow-blue border-nflow-blue hover:bg-nflow-blue/10">
                        🏥 Atención Primaria - Tu centro de salud
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-purple-400 border-purple-400 hover:bg-purple-400/10">
                        🧠 Salud Mental - Derivación especializada
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-green-400 border-green-400 hover:bg-green-400/10">
                        📞 Líneas de ayuda especializadas
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-orange-400 border-orange-400 hover:bg-orange-400/10">
                        🌐 Plataforma de Salud Mental online
                      </Button>
                    </div>
                  </div>

                  {/* Descargables oficiales */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Descargables oficiales:</h3>
                    <div className="grid gap-2">
                      {[
                        "Guía para pacientes con depresión (SNS)",
                        "Manual de autoayuda basado en TCC",
                        "Cuestionarios de seguimiento (PHQ-9, BDI-II)",
                        "Recursos para familiares y cuidadores"
                      ].map((item, idx) => (
                        <Button key={idx} variant="outline" size="sm" className="justify-start text-gray-300 border-gray-600 hover:bg-gray-700/50">
                          📥 {item}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Aviso importante */}
                  <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 p-4 rounded-lg border border-yellow-700/30">
                    <h4 className="font-bold text-yellow-400 mb-2">⚠️ Importante:</h4>
                    <p className="text-sm">
                      La depresión es un trastorno médico que requiere tratamiento profesional. 
                      No dudes en contactar con tu médico de atención primaria o el servicio de urgencias 
                      si experimentas síntomas graves.
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedResource?.category === "bienestar" ? (
              // Modal específico para ejercicios de mindfulness
              <div>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-green-400" />
                    </div>
                    Ejercicios de Mindfulness Profesionales
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Basados en evidencia científica y estándares clínicos internacionales
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 text-gray-300">
                  {/* Introducción */}
                  <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 p-4 rounded-lg border border-green-700/30">
                    <p className="text-sm leading-relaxed">
                      Ejercicios de mindfulness estructurados siguiendo protocolos MBSR (Mindfulness-Based Stress Reduction), 
                      MBCT y estándares de la APA, NICE y OMS. <strong className="text-yellow-400">Diseñados con fundamento neurobiológico y objetivos terapéuticos específicos.</strong>
                    </p>
                  </div>

                  {/* Estructuración Técnica */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Formato Técnico de Ejercicios</h3>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div>
                            <strong className="text-green-400">Nombre del ejercicio</strong> - Identificación clara y profesional
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div>
                            <strong className="text-blue-400">Objetivo neuropsicológico</strong> - Meta específica basada en neurociencia
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <div>
                            <strong className="text-purple-400">Fundamento científico</strong> - Base neurobiológica con referencias
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div>
                            <strong className="text-yellow-400">Instrucciones detalladas</strong> - Paso a paso, lenguaje profesional
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prompt para IA */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Prompt para Generación Automática</h3>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600/30 font-mono text-xs">
                      <div className="text-green-400 mb-2">PROMPT: Estructuración Técnica de Ejercicios de Mindfulness</div>
                      <div className="text-gray-300 space-y-2">
                        <p><strong className="text-blue-400">INSTRUCCIONES PARA LA IA:</strong></p>
                        <p>Eres un experto en mindfulness, neurociencia y psicoeducación, con capacidad para crear ejercicios de mindfulness basados en evidencia científica y estándares clínicos internacionales (MBSR, MBCT, APA, NICE, OMS).</p>
                        
                        <p className="text-yellow-400 mt-3"><strong>FORMATO DE RESPUESTA:</strong></p>
                        <ul className="space-y-1 text-xs">
                          <li>• Nombre del ejercicio</li>
                          <li>• Objetivo neuropsicológico</li>
                          <li>• Fundamento científico/neurobiológico (2-4 líneas, referencias si es posible)</li>
                          <li>• Materiales necesarios (si aplica)</li>
                          <li>• Duración estimada</li>
                          <li>• Población diana (adultos, adolescentes, mayores, etc.)</li>
                          <li>• Instrucciones detalladas (paso a paso, lenguaje claro y profesional)</li>
                          <li>• Indicadores de progreso/registro (cómo medir avance)</li>
                          <li>• Contraindicaciones o advertencias</li>
                          <li>• Variante avanzada/opcional (si aplica)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Requisitos Adicionales */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Requisitos de Calidad</h3>
                    <div className="space-y-3">
                      {[
                        "Utiliza siempre un lenguaje técnico, respetuoso y basado en la evidencia",
                        "Evita simplificaciones excesivas o metáforas infantiles",
                        "Referencia guías reconocidas (MBSR de Jon Kabat-Zinn, NICE, UpToDate, OMS)",
                        "Si la evidencia es limitada, indícalo claramente",
                        "Adapta la propuesta a la modalidad: presencial, online, grupal o individual",
                        "Incluye adaptación para deterioro cognitivo, dolor crónico o ansiedad si se solicita"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ejemplo de uso */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Ejemplo de Petición</h3>
                    <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/30">
                      <div className="text-sm italic text-blue-300">
                        "Genera 3 ejercicios de mindfulness enfocados en mejorar la atención sostenida en adultos mayores, siguiendo el formato solicitado."
                      </div>
                    </div>
                  </div>

                  {/* Población diana específica */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Adaptaciones por población:</h3>
                    <div className="grid gap-2">
                      {[
                        "Adultos jóvenes - Enfoque en gestión del estrés laboral",
                        "Adultos mayores - Ejercicios adaptados con deterioro cognitivo",
                        "Adolescentes - Técnicas para ansiedad académica",
                        "Pacientes con dolor crónico - Mindfulness terapéutico especializado"
                      ].map((item, idx) => (
                        <Button key={idx} variant="outline" size="sm" className="justify-start text-gray-300 border-gray-600 hover:bg-gray-700/50">
                          🧠 {item}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Aviso profesional */}
                  <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 p-4 rounded-lg border border-yellow-700/30">
                    <h4 className="font-bold text-yellow-400 mb-2">⚠️ Uso Profesional:</h4>
                    <p className="text-sm">
                      Este formato está diseñado para profesionales de la salud mental. 
                      Los ejercicios generados deben ser supervisados por un terapeuta cualificado 
                      cuando se apliquen en contextos clínicos.
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedResource?.title === "Ventana de Escucha Activa" ? (
              // Modal específico para Ventana de Escucha Activa
              <div>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    Ventana de Escucha Activa
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Técnica psicoeducativa basada en Carl Rogers para fomentar la comunicación familiar
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6 text-gray-300">
                  {/* Objetivo */}
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30">
                    <h3 className="text-purple-300 text-lg font-semibold mb-3">Objetivo Psicoeducativo</h3>
                    <p className="text-sm">
                      Fomentar la escucha real y la comprensión empática entre padres e hijos adolescentes, 
                      reduciendo respuestas automáticas o juiciosas.
                    </p>
                  </div>

                  {/* Fundamento científico */}
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/30">
                    <h3 className="text-blue-300 text-lg font-semibold mb-3">Fundamento Científico</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Técnica basada en Active Listening (Carl Rogers, 1957)</li>
                      <li>• Comunicación No Violenta (Marshall Rosenberg, 1999)</li>
                      <li>• Guías APA y NICE (2021) incluyen escucha activa como base para resolución de conflictos</li>
                      <li>• Estudios recientes: Gordon et al., 2022; Zhang et al., 2023 (Journal of Family Psychology)</li>
                    </ul>
                  </div>

                  {/* Instrucciones */}
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
                    <h3 className="text-green-300 text-lg font-semibold mb-3">Instrucciones Detalladas</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">1</div>
                        <span>Elige un momento tranquilo sin distracciones</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">2</div>
                        <span>Un miembro habla durante 5 minutos sobre un tema importante, sin ser interrumpido</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">3</div>
                        <span>El oyente solo puede mirar, asentir y tomar notas breves. Nada de respuestas o gestos de desaprobación</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">4</div>
                        <span>Al terminar, el oyente repite con sus palabras lo entendido ("Te he escuchado decir que...")</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">5</div>
                        <span>Cambian los roles y repiten el proceso</span>
                      </div>
                    </div>
                  </div>

                  {/* Información técnica */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Materiales</h4>
                      <p className="text-sm">Cronómetro o temporizador</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Duración</h4>
                      <p className="text-sm">10 minutos por turno</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Población</h4>
                      <p className="text-sm">Padres y adolescentes</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Indicadores</h4>
                      <p className="text-sm">Menos interrupciones, menos discusiones</p>
                    </div>
                  </div>

                  {/* Advertencias */}
                  <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
                    <h3 className="text-red-300 text-lg font-semibold mb-2">⚠️ Contraindicaciones</h3>
                    <p className="text-sm">No usar si hay violencia activa o escalada grave del conflicto.</p>
                  </div>
                </div>
              </div>
            ) : selectedResource?.title === "Agenda de Temas Neutrales" ? (
              // Modal específico para Agenda de Temas Neutrales
              <div>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    Agenda de Temas Neutrales
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Herramienta para reforzar la comunicación familiar sobre temas no conflictivos
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6 text-gray-300">
                  {/* Objetivo */}
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/30">
                    <h3 className="text-blue-300 text-lg font-semibold mb-3">Objetivo Psicoeducativo</h3>
                    <p className="text-sm">
                      Reforzar la comunicación regular sobre temas no conflictivos para mantener la conexión familiar.
                    </p>
                  </div>

                  {/* Fundamento científico */}
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
                    <h3 className="text-green-300 text-lg font-semibold mb-3">Evidencia Científica</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Respaldada por estudios sobre family routines y cohesión familiar (APA, 2019; Fiese et al., 2021)</li>
                      <li>• Las conversaciones neutras fortalecen el vínculo y amortiguan conflictos (Journal of Child and Family Studies, 2023)</li>
                      <li>• Revisión: "Family communication patterns and adolescent adjustment" (Child Development Perspectives, 2022)</li>
                    </ul>
                  </div>

                  {/* Instrucciones */}
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30">
                    <h3 className="text-purple-300 text-lg font-semibold mb-3">Instrucciones Paso a Paso</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">1</div>
                        <span>Cada miembro propone un tema neutro (música, películas, hobbies, noticias curiosas)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">2</div>
                        <span>Se elige uno al azar para hablar en grupo, evitando temas conflictivos</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">3</div>
                        <span>Cada persona tiene un minuto para expresar su opinión o experiencia</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">4</div>
                        <span>Nadie juzga, ni opina sobre lo dicho por otro</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">5</div>
                        <span>Se agradece la participación de todos al final</span>
                      </div>
                    </div>
                  </div>

                  {/* Información técnica */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Materiales</h4>
                      <p className="text-sm">Hoja y bolígrafo, o app de notas compartida</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Duración</h4>
                      <p className="text-sm">15 minutos, una vez por semana</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Población</h4>
                      <p className="text-sm">Toda la familia, especialmente útil en familias con tendencia al conflicto</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Adaptación</h4>
                      <p className="text-sm">Para familias separadas: realizar por videollamada</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedResource?.title === "Tarjetas de Comunicación Positiva" ? (
              // Modal específico para Tarjetas de Comunicación Positiva
              <div>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-yellow-400" />
                    </div>
                    Tarjetas de Comunicación Positiva
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Sistema de refuerzo positivo para entrenar la expresión de emociones agradables
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6 text-gray-300">
                  {/* Objetivo */}
                  <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700/30">
                    <h3 className="text-yellow-300 text-lg font-semibold mb-3">Objetivo Psicoeducativo</h3>
                    <p className="text-sm">
                      Entrenar el refuerzo positivo y la expresión de emociones agradables entre padres e hijos.
                    </p>
                  </div>

                  {/* Fundamento científico */}
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
                    <h3 className="text-green-300 text-lg font-semibold mb-3">Base Científica</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Basado en Parenting Skills Training (OMS, 2016) y terapia sistémica</li>
                      <li>• El refuerzo positivo aumenta la autoeficacia familiar (UNICEF, 2022; McKee et al., 2023)</li>
                      <li>• Revisión sistemática: "Positive communication in families and adolescent mental health" (Family Process, 2023)</li>
                    </ul>
                  </div>

                  {/* Instrucciones */}
                  <div className="bg-pink-900/30 p-4 rounded-lg border border-pink-700/30">
                    <h3 className="text-pink-300 text-lg font-semibold mb-3">Método de Aplicación</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">1</div>
                        <span>Cada miembro escribe en una tarjeta algo positivo sobre otro ("Aprecio que hoy me ayudaste con...")</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">2</div>
                        <span>Se dejan en un lugar común o se entregan en mano, sin comentarios inmediatos</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">3</div>
                        <span>Al final de la semana, se leen juntos, reconociendo los gestos positivos</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">4</div>
                        <span>Se repite con nuevas frases, evitando repetir lo ya mencionado</span>
                      </div>
                    </div>
                  </div>

                  {/* Información técnica */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Materiales</h4>
                      <p className="text-sm">Tarjetas o papeles en blanco, bolígrafos</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Frecuencia</h4>
                      <p className="text-sm">5-10 minutos, al menos 3 veces por semana</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Participantes</h4>
                      <p className="text-sm">Padres, adolescentes y hermanos</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Resultados</h4>
                      <p className="text-sm">Más frases positivas, mejor clima emocional</p>
                    </div>
                  </div>

                  {/* Advertencias */}
                  <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
                    <h3 className="text-red-300 text-lg font-semibold mb-2">⚠️ Importante</h3>
                    <p className="text-sm">Evitar la ironía o los dobles sentidos negativos.</p>
                  </div>

                  {/* Adaptación */}
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/30">
                    <h3 className="text-blue-300 text-lg font-semibold mb-2">💡 Adaptación</h3>
                    <p className="text-sm">En familias con baja alfabetización: usar dibujos o mensajes de voz grabados.</p>
                  </div>
                </div>
              </div>
            ) : (
              // Modal genérico para otros recursos
              <div>
                <DialogHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-nflow-orange/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-nflow-orange" />
                    </div>
                  </div>
                  <DialogTitle className="text-white text-xl mb-4">
                    Recursos en Desarrollo
                  </DialogTitle>
                  <DialogDescription className="text-gray-300 space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <Gift className="w-16 h-16 text-nflow-blue" />
                    </div>
                    <div className="text-lg leading-relaxed">
                      Estamos trabajando en ello, pronto dispondrá de <span className="text-nflow-orange font-semibold">recursos especializados gratuitos</span> para apoyar su bienestar mental.
                    </div>
                    <div className="bg-nflow-navy/50 p-4 rounded-lg border border-nflow-blue/20">
                      <div className="text-sm text-nflow-blue">
                        Mientras tanto, puede acceder a nuestro chat psicológico profesional las 24 horas.
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
