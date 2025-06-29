import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Chrome, Smartphone, X } from "lucide-react";

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

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Trigger clicked, opening dialog');
    setOpen(true);
  };

  const handleClose = () => {
    console.log('Dialog closing');
    setOpen(false);
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

  if (!open) {
    return trigger ? (
      <div onClick={handleTriggerClick}>
        {trigger}
      </div>
    ) : (
      DefaultTrigger
    );
  }

  return (
    <>
      {trigger ? (
        <div onClick={handleTriggerClick}>
          {trigger}
        </div>
      ) : (
        DefaultTrigger
      )}
      
      {/* Custom Modal Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Traducir página con Google Translate</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Usa la traducción automática integrada de tu navegador para ver NFLOW en tu idioma preferido
            </p>

            {/* Chrome Instructions */}
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Chrome className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-sm">Google Chrome / Edge</h3>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                <li>Haz clic derecho en cualquier parte de la página</li>
                <li>Selecciona <strong>"Traducir a [tu idioma]"</strong></li>
                <li>O usa el ícono de traducción en la barra de direcciones</li>
              </ol>
            </div>

            {/* Mobile Instructions */}
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-green-600" />
                <h3 className="font-medium text-sm">Dispositivos Móviles</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                En la mayoría de navegadores móviles, aparecerá automáticamente una 
                notificación para traducir la página. También puedes:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                <li>Tocar el menú del navegador (⋮)</li>
                <li>Buscar la opción "Traducir"</li>
                <li>Seleccionar tu idioma preferido</li>
              </ol>
            </div>

            {/* Mobile Note */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1 text-sm">
                📱 Nota para móviles
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Abre NFLOW en <strong>Google Chrome</strong> o <strong>Safari</strong> para acceder 
                a la traducción automática.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-1 text-sm">
                ✅ Ventajas de Google Translate
              </h3>
              <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                <li>• Traducción instantánea de toda la página</li>
                <li>• Conserva el diseño y funcionalidad original</li>
                <li>• Incluye respuestas del chat automáticamente</li>
                <li>• Soporte para más de 100 idiomas</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t">
            <Button onClick={handleClose} size="sm">
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}