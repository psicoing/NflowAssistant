import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Chrome, Smartphone } from "lucide-react";

interface GoogleTranslateDialogProps {
  trigger?: React.ReactNode;
  buttonText?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function GoogleTranslateDialog({ 
  trigger, 
  buttonText = "Idiomas", 
  size = "default" 
}: GoogleTranslateDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    console.log('Dialog state changing:', newOpen);
    setOpen(newOpen);
  };

  const handleTriggerClick = () => {
    console.log('Trigger clicked, opening dialog');
    setOpen(true);
  };

  const DefaultTrigger = (
    <Button 
      variant="ghost" 
      size={size}
      className="w-full justify-start h-10 text-left flex items-center gap-2 text-white hover:bg-white/10 hover:text-nflow-orange transition-all duration-200"
      onClick={handleTriggerClick}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm">Traducir página</span>
    </Button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={handleTriggerClick}>
          {trigger}
        </div>
      ) : (
        DefaultTrigger
      )}
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Traducir página con Google Translate
            </DialogTitle>
            <DialogDescription>
              Usa la traducción automática integrada de tu navegador para ver NFLOW en tu idioma preferido
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Chrome Instructions */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Chrome className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Google Chrome / Edge</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Haz clic derecho en cualquier parte de la página</li>
                <li>Selecciona <strong>"Traducir a [tu idioma]"</strong></li>
                <li>O usa el ícono de traducción en la barra de direcciones</li>
              </ol>
            </div>

            {/* Safari Instructions */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">Safari / Firefox</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Busca el ícono de traducción en la barra de direcciones</li>
                <li>Haz clic en él y selecciona tu idioma preferido</li>
                <li>En Firefox: usa extensiones como "Translate Web Pages"</li>
              </ol>
            </div>

            {/* Mobile Instructions */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Dispositivos Móviles</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                En la mayoría de navegadores móviles, aparecerá automáticamente una 
                notificación para traducir la página. También puedes:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Tocar el menú del navegador (⋮)</li>
                <li>Buscar la opción "Traducir"</li>
                <li>Seleccionar tu idioma preferido</li>
              </ol>
            </div>

            {/* Mobile Note */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📱 Nota para móviles
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Abre NFLOW en <strong>Google Chrome</strong> o <strong>Safari</strong> para acceder 
                a la traducción automática. La mayoría de navegadores móviles ofrecen esta función.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ Ventajas de Google Translate
              </h3>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Traducción instantánea de toda la página</li>
                <li>• Conserva el diseño y funcionalidad original</li>
                <li>• Incluye respuestas del chat automáticamente</li>
                <li>• Soporte para más de 100 idiomas</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setOpen(false)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}