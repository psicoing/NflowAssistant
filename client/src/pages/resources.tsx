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
      content: "Aprende ejercicios de respiración efectivos para reducir los niveles de ansiedad y promover la relajación.",
      category: "ansiedad",
      type: "exercise",
      createdAt: new Date("2024-01-15"),
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
    },
    {
      id: 6,
      title: "Gestión de Crisis Emocionales",
      content: "Protocolo de actuación para momentos de alta intensidad emocional.",
      category: "ansiedad",
      type: "article",
      createdAt: new Date("2024-02-10"),
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
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2 justify-center">
                  {types.filter(type => type !== 'article').map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className={selectedType === type ? "bg-nflow-blue hover:bg-nflow-blue-dark text-black border-0 rounded-full" : "border-gray-500 text-black bg-white hover:bg-nflow-blue/90 hover:text-black hover:border-nflow-blue rounded-full"}
                    >
                      {typeLabels[type as keyof typeof typeLabels] || type}
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
