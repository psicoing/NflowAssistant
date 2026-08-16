import { Link } from "wouter";
import { Brain, Linkedin } from "lucide-react";
import { useLanguageContext } from "@/components/LanguageProvider";

export default function Footer() {
  const { t } = useLanguageContext();
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
            <p className="text-gray-400 mb-6 max-w-md text-xs">{t('footer.tagline')}</p>
            <div className="flex space-x-3">
              <a 
                href="https://www.linkedin.com/in/empordajobs/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a 
                href="https://jobda.org/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="Jobda"
              >
                <span className="text-gray-400 hover:text-white text-xs font-semibold">JB</span>
              </a>
              <a 
                href="https://appia.jobda.es/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="Appia"
              >
                <span className="text-gray-400 hover:text-white text-xs font-semibold">AP</span>
              </a>
              <a 
                href="https://neuronmeg.net/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="Neuronmeg"
              >
                <span className="text-gray-400 hover:text-white text-xs font-semibold">IN</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">{t('footer.services')}</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/ejemplos-chat" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.chat')}
                </Link>
              </li>
              <li>
                <Link href="/recursos-gratuitos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.resources')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.blog')}
                </Link>
              </li>
              <li>
                <Link href="/precios" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">{t('footer.legal')}</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/legal/aviso-legal" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.legal.notice')}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.legal.cookies')}
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const event = new CustomEvent('openCookiePreferences');
                    window.dispatchEvent(event);
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-left text-sm"
                >
                  {t('footer.legal.cookiePrefs')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Compacted */}
        <div className="border-t border-gray-800 mt-6 pt-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-white font-semibold text-sm">GRUPO JOBDA</span>
            <span className="text-gray-500">Empordajobs SL • B02701100 • Portbou, España • © 2025 {t('footer.rights')} • empordajobs@gmail.com • +34 660 45 21 36</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
