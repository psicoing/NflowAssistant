import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, LogOut, Users, TrendingUp, DollarSign, Link2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Partner {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  status: string;
  partnerType: string;
  totalReferrals: number;
  totalEarnings: string;
  createdAt: string;
}

interface Referral {
  id: number;
  referralCode: string;
  subscriptionPlan: string;
  amount: string;
  commission: string;
  status: string;
  createdAt: string;
}

export default function PartnerDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");

  const { data: partner, isLoading: partnerLoading } = useQuery({
    queryKey: ["/api/partners/profile"],
    retry: false,
  });

  const { data: referrals = [], isLoading: referralsLoading } = useQuery({
    queryKey: ["/api/partners/referrals"],
    retry: false,
  });

  useEffect(() => {
    if (!partnerLoading && !partner) {
      setLocation("/partners/login");
    }
  }, [partner, partnerLoading, setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/partners/logout", {});
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      setLocation("/partners/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const generateReferralCode = async () => {
    try {
      const response = await apiRequest("POST", "/api/partners/generate-code", {});
      const data = await response.json();
      setReferralCode(data.referralCode);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el código de referencia",
        variant: "destructive",
      });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copiado",
      description: "Código de referencia copiado al portapapeles",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      approved: { label: "Aprobado", variant: "default" as const },
      active: { label: "Activo", variant: "default" as const },
      rejected: { label: "Rechazado", variant: "destructive" as const },
      suspended: { label: "Suspendido", variant: "destructive" as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (partnerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!partner) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard de Partners
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Bienvenido, {partner.contactName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(partner.status)}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Alert */}
        {partner.status === 'pending' && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">!</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Solicitud en Revisión
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Tu solicitud de partner está siendo revisada. Te contactaremos pronto con más información.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partner.totalReferrals}</div>
              <p className="text-xs text-muted-foreground">
                Usuarios que se suscribieron con tu código
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partner.totalEarnings}€</div>
              <p className="text-xs text-muted-foreground">
                Total de comisiones generadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Comisión</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10%</div>
              <p className="text-xs text-muted-foreground">
                Por cada suscripción referida
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Code Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link2 className="w-5 h-5 mr-2" />
                Código de Referencia
              </CardTitle>
              <CardDescription>
                Genera códigos únicos para trackear tus referencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!referralCode ? (
                <Button onClick={generateReferralCode} className="w-full">
                  Generar Código de Referencia
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
                      {referralCode}
                    </div>
                    <Button variant="outline" size="sm" onClick={copyReferralCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comparte este código con tus contactos. Cuando se suscriban usando este código,
                    recibirás una comisión del 10%.
                  </p>
                  <Button variant="outline" onClick={generateReferralCode} className="w-full">
                    Generar Nuevo Código
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Empresa
                </label>
                <p className="text-sm">{partner.companyName}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tipo de Partner
                </label>
                <p className="text-sm capitalize">{partner.partnerType}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <p className="text-sm">{partner.email}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fecha de Registro
                </label>
                <p className="text-sm">
                  {new Date(partner.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Referrals */}
        {partner.status === 'approved' && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Referencias Recientes</CardTitle>
              <CardDescription>
                Historial de tus referencias y comisiones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : referrals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aún no tienes referencias</p>
                  <p className="text-sm mt-1">
                    Comparte tu código de referencia para comenzar a generar comisiones
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral: Referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{referral.referralCode}</p>
                        <p className="text-sm text-gray-500">
                          Plan: {referral.subscriptionPlan} • {referral.amount}€
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(referral.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">+{referral.commission}€</p>
                        <Badge variant={referral.status === 'paid' ? 'default' : 'secondary'}>
                          {referral.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}