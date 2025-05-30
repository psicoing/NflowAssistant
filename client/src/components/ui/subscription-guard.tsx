import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CreditCard } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  userId?: number;
}

export default function SubscriptionGuard({ children, userId = 1 }: SubscriptionGuardProps) {
  const { data: subscriptionStatus, isLoading } = useQuery({
    queryKey: ["/api/subscription-status", userId],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nflow-dark">
        <div className="text-white">Verificando suscripción...</div>
      </div>
    );
  }

  if (!subscriptionStatus?.hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-nflow-dark flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-nflow-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-nflow-orange" />
            </div>
            <CardTitle className="text-white text-xl">Suscripción Requerida</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6">
              Para acceder al chat de apoyo psicológico necesitas una suscripción activa.
            </p>
            <Button 
              onClick={() => window.location.href = "/#precios"}
              className="bg-nflow-orange hover:bg-nflow-orange-light text-white w-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Ver Planes de Suscripción
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}