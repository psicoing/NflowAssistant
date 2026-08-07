import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Download, Smartphone, Zap, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageContext } from "@/components/LanguageProvider";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const { t } = useLanguageContext();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed (only in top-level browsing context)
    if (window.navigator && 'getInstalledRelatedApps' in window.navigator && window.self === window.top) {
      try {
        // @ts-ignore
        window.navigator.getInstalledRelatedApps().then((relatedApps: any[]) => {
          if (relatedApps.length > 0) {
            setIsInstalled(true);
          }
        }).catch(() => {/* silently ignore */});
      } catch {
        // Not supported in this context
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not already installed
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('nflow-pwa-dismissed')) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('nflow-pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('nflow-pwa-dismissed', 'true');
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('nflow-pwa-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // Don't show if already installed or no install prompt available
  if (!showPrompt || !deferredPrompt || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80"
      >
        {/* Backdrop Blur */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
        
        <div className="relative bg-gradient-to-br from-gray-900/95 via-nflow-dark/95 to-gray-800/95 rounded-2xl border border-nflow-orange/30 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Floating Orbs Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-nflow-orange/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-nflow-blue/10 rounded-full blur-xl"></div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-6">
            {/* Header with Icon */}
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{t('pwa.title')}</h3>
              <p className="text-gray-300 text-sm">{t('pwa.subtitle')}</p>
            </div>

            {/* Elegant Feature Cards */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t('pwa.feature1')}</p>
                  <p className="text-gray-400 text-xs">{t('pwa.feature1.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t('pwa.feature2')}</p>
                  <p className="text-gray-400 text-xs">{t('pwa.feature2.desc')}</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-3">
              <Button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-nflow-orange via-orange-500 to-nflow-orange-light hover:shadow-lg hover:shadow-nflow-orange/30 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="h-5 w-5 mr-2" />
                {t('pwa.install')}
              </Button>
              
              <button
                onClick={handleDismiss}
                className="w-full text-gray-400 hover:text-white text-sm transition-colors py-2"
              >
                {t('pwa.dismiss')}
              </button>
            </div>

            {/* Small Badge */}
            <div className="text-center mt-4">
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300">Instalación directa desde navegador</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}