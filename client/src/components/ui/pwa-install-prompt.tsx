import { useEffect, useMemo, useState } from "react";
import { Download, Share2, Smartphone, Store, Check, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguageContext } from "@/components/LanguageProvider";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const copy = {
  es: {
    title: "Instala NUXA en tu móvil",
    description: "Ten NUXA como una app, directamente desde tu navegador.",
    noStoreTitle: "No necesitas App Store ni Google Play",
    noStoreText:
      "NUXA es una PWA de alta calidad: se instala desde la web, sin pagar una descarga y sin depender de la aprobación de una tienda.",
    benefit: "Aparecerá en tu pantalla de inicio y se abrirá como una aplicación.",
    iphone: "iPhone o iPad",
    iphoneSteps: [
      "Abre NUXA en Safari.",
      "Pulsa Compartir (el cuadrado con la flecha hacia arriba).",
      "Elige “Añadir a pantalla de inicio” y confirma.",
    ],
    android: "Android",
    androidSteps: [
      "Abre NUXA en Chrome.",
      "Pulsa el menú de los tres puntos.",
      "Elige “Instalar aplicación” o “Añadir a pantalla de inicio”.",
    ],
    install: "Instalar NUXA ahora",
    installHint: "Tu navegador permite instalarla directamente.",
    safariHint: "En iPhone debes usar Safari para ver la opción de instalación.",
  },
  en: {
    title: "Install NUXA on your phone",
    description: "Use NUXA like an app, directly from your browser.",
    noStoreTitle: "No App Store or Google Play required",
    noStoreText:
      "NUXA is a high-quality PWA: install it from the web without paying for a download or depending on an app-store approval.",
    benefit: "It will appear on your home screen and open like an app.",
    iphone: "iPhone or iPad",
    iphoneSteps: [
      "Open NUXA in Safari.",
      "Tap Share (the square with the upward arrow).",
      "Choose “Add to Home Screen” and confirm.",
    ],
    android: "Android",
    androidSteps: [
      "Open NUXA in Chrome.",
      "Tap the three-dot menu.",
      "Choose “Install app” or “Add to Home screen”.",
    ],
    install: "Install NUXA now",
    installHint: "Your browser can install it directly.",
    safariHint: "On iPhone, use Safari to access the installation option.",
  },
  fr: {
    title: "Installez NUXA sur votre mobile",
    description: "Utilisez NUXA comme une app, directement depuis votre navigateur.",
    noStoreTitle: "Pas besoin de l’App Store ni de Google Play",
    noStoreText:
      "NUXA est une PWA de haute qualité : elle s’installe depuis le Web, sans téléchargement payant ni approbation d’une boutique.",
    benefit: "Elle apparaîtra sur votre écran d’accueil et s’ouvrira comme une application.",
    iphone: "iPhone ou iPad",
    iphoneSteps: [
      "Ouvrez NUXA dans Safari.",
      "Touchez Partager (le carré avec la flèche vers le haut).",
      "Choisissez « Sur l’écran d’accueil », puis confirmez.",
    ],
    android: "Android",
    androidSteps: [
      "Ouvrez NUXA dans Chrome.",
      "Touchez le menu à trois points.",
      "Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».",
    ],
    install: "Installer NUXA maintenant",
    installHint: "Votre navigateur permet l’installation directe.",
    safariHint: "Sur iPhone, utilisez Safari pour accéder à l’option d’installation.",
  },
};

export default function PWAInstallPrompt() {
  const { currentLanguage } = useLanguageContext();
  const installLanguage =
    currentLanguage === "en" || currentLanguage === "fr" ? currentLanguage : "es";
  const text = copy[installLanguage];
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const device = useMemo(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return {
      ios: /iphone|ipad|ipod/.test(userAgent),
      android: /android/.test(userAgent),
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const openInstallGuide = () => setIsOpen(true);
    const handleInstalled = () => {
      setIsOpen(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("nuxa-open-install-guide", openInstallGuide);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("nuxa-open-install-guide", openInstallGuide);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installDirectly = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") setIsOpen(false);
    setDeferredPrompt(null);
  };

  const Guide = ({
    title,
    steps,
    active,
    icon,
  }: {
    title: string;
    steps: string[];
    active: boolean;
    icon: React.ReactNode;
  }) => (
    <section
      className={`rounded-2xl border p-4 ${
        active
          ? "border-nflow-orange/60 bg-nflow-orange/10 shadow-lg shadow-orange-950/20"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className="mb-3 flex items-center gap-2 text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-gray-200">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nflow-orange text-xs font-bold text-white">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto border-white/10 bg-gradient-to-b from-slate-900 to-nflow-dark p-0 text-white sm:rounded-3xl">
        <div className="p-5 sm:p-7">
          <DialogHeader className="pr-7 text-left">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-nflow-orange to-orange-500 shadow-lg shadow-orange-950/30">
              <Download className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl leading-tight text-white">{text.title}</DialogTitle>
            <DialogDescription className="text-base text-gray-300">{text.description}</DialogDescription>
          </DialogHeader>

          <div className="my-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <div className="flex gap-3">
              <Store className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <div>
                <p className="font-semibold text-emerald-100">{text.noStoreTitle}</p>
                <p className="mt-1 text-sm leading-relaxed text-emerald-50/80">{text.noStoreText}</p>
                <p className="mt-2 flex items-start gap-2 text-sm text-white">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {text.benefit}
                </p>
              </div>
            </div>
          </div>

          {deferredPrompt && (
            <div className="mb-5 rounded-2xl border border-nflow-orange/30 bg-white/[0.04] p-4">
              <p className="mb-3 text-sm text-gray-300">{text.installHint}</p>
              <Button
                onClick={installDirectly}
                className="w-full rounded-xl bg-nflow-orange font-semibold text-white hover:bg-orange-500"
              >
                <Download className="mr-2 h-4 w-4" />
                {text.install}
              </Button>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Guide
              title={text.iphone}
              steps={text.iphoneSteps}
              active={device.ios}
              icon={<Share2 className="h-5 w-5 text-blue-300" />}
            />
            <Guide
              title={text.android}
              steps={text.androidSteps}
              active={device.android}
              icon={<Chrome className="h-5 w-5 text-green-300" />}
            />
          </div>

          {device.ios && !deferredPrompt && (
            <p className="mt-4 flex items-center gap-2 text-xs text-amber-200">
              <Smartphone className="h-4 w-4 shrink-0" />
              {text.safariHint}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}