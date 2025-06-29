import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Languages, Globe, Chrome, Monitor, Smartphone } from 'lucide-react';

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

  const DefaultTrigger = (
    <Button 
      variant="ghost" 
      size={size}
      className="flex items-center gap-2"
    >
      <Languages className="h-4 w-4" />
      {buttonText}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || DefaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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

          {/* Firefox Instructions */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold">Mozilla Firefox</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Instala la extensión <strong>"Firefox Translations"</strong></li>
              <li>Haz clic en el ícono de traducción en la barra</li>
              <li>Selecciona tu idioma preferido</li>
            </ol>
          </div>

          {/* Safari Instructions */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Safari (macOS/iOS)</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Haz clic en el ícono <strong>aA</strong> en la barra de direcciones</li>
              <li>Selecciona <strong>"Traducir a [tu idioma]"</strong></li>
              <li>En iOS: toca el ícono de compartir y "Traducir"</li>
            </ol>
          </div>

          {/* Mobile Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📱 En dispositivos móviles
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
  );
}