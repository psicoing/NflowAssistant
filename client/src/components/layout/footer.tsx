import { Link } from "wouter";
import { Brain, Twitter, Linkedin, Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-nflow-dark border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-nflow-orange rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NFLOW</span>
              <span className="text-xs bg-nflow-orange/20 text-nflow-orange px-2 py-1 rounded-full">
                β
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transformando el acceso a la salud mental a través de la tecnología, 
              proporcionando apoyo psicológico accesible y efectivo para todos.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-nflow-orange transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-nflow-orange transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-nflow-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li>
                <a href="#precios" className="text-gray-400 hover:text-white transition-colors">
                  Chat de Apoyo
                </a>
              </li>
              <li>
                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <a href="#servicios" className="text-gray-400 hover:text-white transition-colors">
                  Consejos
                </a>
              </li>
              <li>
                <a href="#precios" className="text-gray-400 hover:text-white transition-colors">
                  Planes Premium
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Términos
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* GRUPO JOBDA Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-white mb-2">GRUPO JOBDA</h3>
                <p className="text-gray-300 text-sm">
                  Soluciones empresariales innovadoras para el crecimiento de tu negocio
                </p>
              </div>
              <Button 
                onClick={() => window.open('https://jobda.biz', '_blank')}
                className="bg-nflow-orange hover:bg-nflow-orange/90 text-black font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visitar JOBDA
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Instituto NeuronMeg. Todos los derechos reservados.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Desarrollado con ❤️ para mejorar la salud mental
          </p>
        </div>
      </div>
    </footer>
  );
}
