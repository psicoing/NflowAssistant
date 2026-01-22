import { GraduationCap, BookOpen, Brain, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import studentsImage from "@assets/image_1768716364098.png";

export default function StudentsCardSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-6 px-4 bg-nflow-dark overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/90 via-teal-900/80 to-emerald-950/90 border border-emerald-800/40 shadow-2xl backdrop-blur-sm">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative px-4 py-8 md:px-12 md:py-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="relative order-2 md:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-emerald-700/30">
                  <img 
                    src={studentsImage} 
                    alt="NUXA para estudiantes de medicina y psicología" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center md:text-left space-y-5 order-1 md:order-2">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                      IDEAL PARA ESTUDIANTES
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <GraduationCap className="w-8 h-8 text-emerald-400" />
                    <span>NUXA para Estudiantes</span>
                  </h3>
                  <p className="text-emerald-200/90 text-base md:text-lg leading-relaxed max-w-xl">
                    Herramienta de apoyo para <span className="font-bold text-white">estudiantes de Medicina y Psicología</span>. 
                    Practica consultas, aprende terminología y mejora tus habilidades de comunicación con pacientes.
                  </p>
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                  <div className="flex items-center gap-2 bg-emerald-800/40 backdrop-blur-sm px-3 py-2 md:px-4 rounded-full border border-emerald-600/40 shadow-md">
                    <Stethoscope className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-emerald-100 whitespace-nowrap">Medicina</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-800/40 backdrop-blur-sm px-3 py-2 md:px-4 rounded-full border border-emerald-600/40 shadow-md">
                    <Brain className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-emerald-100 whitespace-nowrap">Psicología</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-800/40 backdrop-blur-sm px-3 py-2 md:px-4 rounded-full border border-emerald-600/40 shadow-md">
                    <BookOpen className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-emerald-100 whitespace-nowrap">Aprendizaje</span>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2 text-left">
                  <li className="flex items-start gap-2 text-emerald-100/90">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span className="text-sm md:text-base">Simula conversaciones con pacientes virtuales</span>
                  </li>
                  <li className="flex items-start gap-2 text-emerald-100/90">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span className="text-sm md:text-base">Consulta dudas de terminología clínica</span>
                  </li>
                  <li className="flex items-start gap-2 text-emerald-100/90">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span className="text-sm md:text-base">Practica técnicas de entrevista terapéutica</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <div className="pt-2 w-full">
                  <Button
                    onClick={() => setLocation("/login")}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 
                      hover:from-teal-500 hover:via-emerald-500 hover:to-teal-500 
                      text-white font-semibold px-6 py-4 md:px-8 md:py-5 rounded-xl shadow-xl
                      transition-all duration-300 hover:scale-105 hover:shadow-2xl
                      border border-emerald-400/30 w-full md:w-auto"
                  >
                    <GraduationCap className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-base md:text-lg">Empezar a Aprender</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
