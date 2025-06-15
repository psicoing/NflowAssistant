import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Download, Smartphone, Zap, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.navigator && 'getInstalledRelatedApps' in window.navigator) {
      // @ts-ignore
      window.navigator.getInstalledRelatedApps().then((relatedApps: any[]) => {
        if (relatedApps.length > 0) {
          setIsInstalled(true);
        }
      });
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
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <Card className="bg-gradient-to-br from-nflow-dark via-gray-800 to-nflow-navy border-nflow-orange/30 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-nflow-orange to-nflow-orange-light p-4 rounded-t-lg">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Instala NFLOW</h3>
                  <p className="text-white/90 text-sm">Tu psicólogo en el bolsillo</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Accede instantáneamente a tu asistente de salud mental desde tu pantalla de inicio. 
                Sin descargas de tienda, sin esperas.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400">Acceso Instantáneo</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-gray-400">100% Segura</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-4 w-4 text-purple-400" />
                  </div>
                  <p className="text-xs text-gray-400">Siempre Disponible</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold shadow-lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Instalar App
                </Button>
                
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Ahora no
                </Button>
              </div>

              {/* Small Note */}
              <p className="text-xs text-gray-500 text-center pt-2">
                Se instalará directamente desde tu navegador
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}