import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SoporteActivacionBanner from "@/components/SoporteActivacionBanner";

export default function ActivacionExitosa() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Activando tu cuenta automáticamente...');
  const { toast } = useToast();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Get email from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        
        console.log('🚀 ACTIVACIÓN AUTOMÁTICA INICIADA');
        console.log('Email detectado:', email);

        if (!email) {
          // Fallback: Try to get email from localStorage or session
          const storedEmail = localStorage.getItem('user_email');
          if (storedEmail) {
            console.log('Email desde localStorage:', storedEmail);
            await processActivation(storedEmail);
          } else {
            throw new Error('No se pudo determinar el email del usuario');
          }
        } else {
          await processActivation(email);
        }

      } catch (error) {
        console.error('❌ Error en activación automática:', error);
        setStatus('error');
        setMessage('Hubo un problema activando tu cuenta. Contacta soporte para activación manual.');
        
        toast({
          title: "Error en la activación",
          description: "Contacta soporte con tu comprobante de pago.",
          variant: "destructive",
          duration: 10000,
        });
      }
    };

    const processActivation = async (email: string) => {
      console.log('Procesando activación para:', email);
      
      // Try auto-activation by email
      const response = await fetch('/api/auto-activate-by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Activación exitosa:', result);
        
        setStatus('success');
        setMessage('¡Tu cuenta NUXA ha sido activada exitosamente! Ya puedes acceder al chat de apoyo psicológico.');
        
        toast({
          title: "¡Cuenta Activada!",
          description: "Tu suscripción está activa. Redirigiendo al login...",
          duration: 5000,
        });

        // Redirect to chat after showing success
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error('❌ Error en activación:', errorData);
        throw new Error(errorData.message || 'Error en activación');
      }
    };

    activateAccount();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-md mx-auto pt-8">
        <SoporteActivacionBanner />
        
        <div className="flex items-center justify-center">
          <Card className="w-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-sm">
            <CardHeader className="text-center">
          {status === 'processing' && (
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          )}
          
          <CardTitle className="text-2xl font-bold text-white">
            {status === 'processing' && '¡Pago Exitoso!'}
            {status === 'success' && '¡Cuenta Activada!'}
            {status === 'error' && 'Activación Pendiente'}
          </CardTitle>
          
          <CardDescription className="text-gray-300">
            {status === 'processing' && 'Activando tu cuenta automáticamente...'}
            {status === 'success' && 'Tu suscripción está lista'}
            {status === 'error' && 'Necesitamos activar tu cuenta manualmente'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-200 text-center">
            {message}
          </p>
          
          {status === 'success' && (
            <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">
                  Redirigiendo al chat en 3 segundos...
                </span>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-orange-300">
                    Tu pago fue exitoso. Contacta soporte: support@nuxa.life
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={() => setLocation("/chat")}
                className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Continuar al Chat
              </Button>
            </div>
          )}
          
          {status === 'success' && (
            <Button 
              onClick={() => setLocation("/chat")}
              className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Ir al Chat Ahora
            </Button>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}