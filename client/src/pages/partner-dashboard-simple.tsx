import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, LogOut, Users, TrendingUp, DollarSign, Link2 } from "lucide-react";
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

export default function PartnerDashboardSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");

  // Partner data - in production this would come from authentication
  const partner: Partner = {
    id: 1,
    companyName: "Clínica Test",
    contactName: "Dr. Juan Pérez",
    email: "test@clinica.com",
    status: "approved",
    partnerType: "healthcare",
    totalReferrals: 0,
    totalEarnings: "0",
    createdAt: "2025-06-13"
  };



  const handleLogout = () => {
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    setLocation("/partners/login");
  };

  const generateReferralCode = () => {
    const code = `CLINICA_${partner.id}_${Date.now().toString().slice(-4)}`;
    setReferralCode(code);
    toast({
      title: "Código generado",
      description: "Tu código de referencia ha sido creado",
    });
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
        {partner.status === 'approved' && (
          <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Partner Aprobado
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Tu cuenta de partner ha sido aprobada. Ya puedes generar códigos de referencia y comenzar a ganar comisiones.
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

        {/* How to Use Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Cómo Usar tu Dashboard de Partners</CardTitle>
            <CardDescription>
              Guía rápida para comenzar a generar referencias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">1. Genera tu Código</h4>
                <p className="text-sm text-gray-600">
                  Haz clic en "Generar Código de Referencia" para crear un código único que identifique tus referencias.
                </p>
                
                <h4 className="font-medium">2. Comparte con Contactos</h4>
                <p className="text-sm text-gray-600">
                  Envía tu código a clínicas, profesionales de salud mental, o cualquier contacto que pueda beneficiarse de NFLOW.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">3. Trackea tus Ganancias</h4>
                <p className="text-sm text-gray-600">
                  Cuando alguien se suscriba usando tu código, verás la referencia y tu comisión del 10% aquí.
                </p>
                
                <h4 className="font-medium">4. Recibe Pagos</h4>
                <p className="text-sm text-gray-600">
                  Las comisiones se procesan mensualmente y se envían a tu cuenta bancaria registrada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}