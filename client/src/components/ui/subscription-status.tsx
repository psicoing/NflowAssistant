import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, CreditCard, AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionStatusProps {
  subscriptionData: {
    hasActiveSubscription: boolean;
    subscriptionStatus: string;
    subscriptionPlan: string;
    expiresAt?: string;
    subscriptionId?: string;
    daysRemaining?: number;
  };
  onRenew: () => void;
  onCancel: () => void;
  onManage: () => void;
}

export default function SubscriptionStatus({ 
  subscriptionData, 
  onRenew, 
  onCancel, 
  onManage 
}: SubscriptionStatusProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'expiring': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'expired': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'cancelled': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'expiring': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'expiring': return 'Por Vencer';
      case 'expired': return 'Expirada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const handleRenewSubscription = async () => {
    setIsLoading(true);
    try {
      await onRenew();
      toast({
        title: "Renovación iniciada",
        description: "Serás redirigido al proceso de pago.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error en renovación",
        description: "Hubo un problema. Intenta de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres cancelar tu suscripción? Perderás el acceso al finalizar el período actual."
    );
    
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await onCancel();
      toast({
        title: "Suscripción cancelada",
        description: "Tu suscripción se cancelará al final del período actual.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error en cancelación",
        description: "Hubo un problema. Contacta soporte.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-nflow-blue backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-nflow-blue/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-nflow-blue" />
            </div>
            <div>
              <CardTitle className="text-white">Estado de Suscripción</CardTitle>
              <CardDescription className="text-gray-400">
                Plan {subscriptionData.subscriptionPlan || 'Básico'}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(subscriptionData.subscriptionStatus)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(subscriptionData.subscriptionStatus)}
              <span>{getStatusText(subscriptionData.subscriptionStatus)}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {subscriptionData.hasActiveSubscription ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Vence el</span>
                </div>
                <p className="text-white font-medium">
                  {subscriptionData.expiresAt ? formatDate(subscriptionData.expiresAt) : 'No disponible'}
                </p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Días restantes</span>
                </div>
                <p className="text-white font-medium">
                  {subscriptionData.daysRemaining || 0} días
                </p>
              </div>
            </div>

            {subscriptionData.daysRemaining && subscriptionData.daysRemaining <= 7 && (
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <AlertDescription className="text-yellow-200">
                  Tu suscripción vence pronto. Renueva ahora para mantener el acceso sin interrupciones.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleRenewSubscription}
                disabled={isLoading}
                className="flex-1 bg-nflow-blue hover:bg-nflow-blue/90 text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Renovar Suscripción
              </Button>
              
              <Button
                onClick={onManage}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Gestionar
              </Button>
              
              <Button
                onClick={handleCancelSubscription}
                variant="outline"
                disabled={isLoading}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <AlertDescription className="text-red-200">
              Tu suscripción ha expirado. Renueva para continuar usando el chat de apoyo.
            </AlertDescription>
            <div className="mt-3">
              <Button
                onClick={handleRenewSubscription}
                disabled={isLoading}
                className="bg-nflow-blue hover:bg-nflow-blue/90 text-white"
              >
                Renovar Ahora
              </Button>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}