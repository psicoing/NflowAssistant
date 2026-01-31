import { Link } from "wouter";
import { Brain, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-nflow-dark border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NUXA</span>
              <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full">
                versión beta 1-04
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transformando el acceso a la salud mental a través de la tecnología, 
              proporcionando apoyo psicológico accesible y efectivo para todos.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/empordajobs/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openNuxaMenu'))}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Chat de Apoyo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openNuxaMenu'))}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Recursos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openNuxaMenu'))}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Consejos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openNuxaMenu'))}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Planes Premium
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://jobda.org/legal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Aviso legal
                </a>
              </li>
              <li>
                <a 
                  href="https://jobda.org/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Política de privacidad
                </a>
              </li>
              <li>
                <a 
                  href="https://jobda.org/cookies" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Política de cookies
                </a>
              </li>
              <li>
                <button 
                  onClick={() => {
                    // Abrir preferencias de cookies
                    const event = new CustomEvent('openCookiePreferences');
                    window.dispatchEvent(event);
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Preferencias de cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Compacted */}
        <div className="border-t border-gray-800 mt-6 pt-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white font-semibold text-sm">GRUPO JOBDA</span>
            <span className="text-gray-500 text-xs">Empordajobs SL • B02701100 • Portbou, España</span>
          </div>
          <div className="text-gray-500 text-xs">
            <p>© 2025 JOBDA. Todos los derechos reservados. • empordajobs@gmail.com • +34 660 45 21 36</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
