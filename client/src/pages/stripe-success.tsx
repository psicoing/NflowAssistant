import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StripeSuccess() {
  const [isActivating, setIsActivating] = useState(true);
  const [activationComplete, setActivationComplete] = useState(false);

  useEffect(() => {
    // Simular activación automática
    const timer = setTimeout(() => {
      setIsActivating(false);
      setActivationComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gray-800/90 backdrop-blur-sm border-green-500/50">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {isActivating ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : (
              <CheckCircle className="w-10 h-10 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl text-white">
            {isActivating ? "Activando tu cuenta..." : "¡Pago exitoso!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {isActivating ? (
            <div>
              <p className="text-gray-300 mb-4">
                Procesando tu pago con Stripe y activando tu acceso al chat...
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 mb-6">
                Tu cuenta NFLOW ha sido activada exitosamente. Ya puedes acceder al chat con nuestro asistente de salud mental.
              </p>
              
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-6">
                <h3 className="text-green-400 font-semibold mb-2">Plan Básico Activo</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Chat ilimitado con IA</li>
                  <li>✓ Soporte 24/7</li>
                  <li>✓ Recursos de salud mental</li>
                </ul>
              </div>

              <Link href="/chat">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Comenzar a chatear
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}