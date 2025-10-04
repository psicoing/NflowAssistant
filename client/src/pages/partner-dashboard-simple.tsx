import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, LogOut, Users, TrendingUp, DollarSign, Link2, BarChart3, ExternalLink, Calendar, CheckCircle, Clock, UserCheck } from "lucide-react";
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

export default function PartnerDashboardSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");

  const { data: partner, isLoading: partnerLoading, error } = useQuery<Partner>({
    queryKey: ["/api/partners/profile"],
    retry: false,
  });

  const { data: referrals = [], isLoading: referralsLoading } = useQuery<Referral[]>({
    queryKey: ["/api/partners/referrals"],
    retry: false,
  });

  useEffect(() => {
    if (!partnerLoading && (!partner || error)) {
      console.log("Partner auth failed:", error);
      setLocation("/partners/login");
    }
  }, [partner, partnerLoading, error, setLocation]);

  if (partnerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return null; // useEffect will redirect to login
  }

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
      toast({
        title: "Código generado",
        description: "Tu código de referencia ha sido creado",
      });
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

  const copyPromotionalLink = (linkType: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/registro?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Enlace copiado",
      description: `Enlace de ${linkType} copiado al portapapeles`,
    });
  };

  const getConversionRate = () => {
    if (!partner.totalReferrals || referrals.length === 0) return 0;
    return Math.round((referrals.filter(r => r.status === 'completed').length / partner.totalReferrals) * 100);
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
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Código de Referencia
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
                        {referralCode}
                      </div>
                      <Button variant="outline" size="sm" onClick={copyReferralCode} data-testid="button-copy-code">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Link Referenciado
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-xs font-mono break-all text-blue-700 dark:text-blue-300">
                        {window.location.origin}/registro?ref={referralCode}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyPromotionalLink('directo')}
                        data-testid="button-copy-link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💡 <strong>Usa el link directo</strong> para que el código se aplique automáticamente al registrarse.
                    El usuario solo tendrá que completar sus datos.
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

        {/* Analytics Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics y Conversión
            </CardTitle>
            <CardDescription>
              Estadísticas detalladas de rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{getConversionRate()}%</div>
                <div className="text-xs text-blue-600">Tasa de Conversión</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{referrals.filter(r => r.status === 'completed').length}</div>
                <div className="text-xs text-green-600">Pagos Exitosos</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{referrals.filter(r => r.status === 'pending').length}</div>
                <div className="text-xs text-yellow-600">Pendientes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">€{(parseFloat(partner.totalEarnings) / Math.max(partner.totalReferrals, 1)).toFixed(2)}</div>
                <div className="text-xs text-purple-600">Promedio por Referido</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kit de Enlaces Promocionales */}
        {referralCode && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Kit de Enlaces Promocionales
              </CardTitle>
              <CardDescription>
                Enlaces listos para compartir en diferentes plataformas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enlace General</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono break-all">
                      {window.location.origin}/registro?ref={referralCode}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyPromotionalLink('general')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Para WhatsApp</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs break-all">
                      ¡Hola! Te recomiendo NFLOW para salud mental con IA. Usa mi código: {referralCode}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const message = `¡Hola! Te recomiendo NFLOW para salud mental con IA. Usa mi código: ${referralCode} - ${window.location.origin}/registro?ref=${referralCode}`;
                        navigator.clipboard.writeText(message);
                        toast({ title: "Mensaje de WhatsApp copiado" });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Para Email</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs break-all">
                      Asunto: Herramienta de Salud Mental con IA - NFLOW
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const subject = "Herramienta de Salud Mental con IA - NFLOW";
                        const body = `Hola,\n\nQuería recomendarte NFLOW, una innovadora herramienta de salud mental que utiliza IA para brindar apoyo 24/7.\n\nPuedes probarla usando mi código de referencia: ${referralCode}\n\nEnlace: ${window.location.origin}/registro?ref=${referralCode}\n\n¡Espero que te sea útil!\n\nSaludos`;
                        navigator.clipboard.writeText(`${subject}\n\n${body}`);
                        toast({ title: "Plantilla de email copiada" });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Para Redes Sociales</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs break-all">
                      🧠 NFLOW: IA para salud mental 24/7. Código: {referralCode}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const message = `🧠 Descubre NFLOW: Revolucionaria herramienta de salud mental con IA disponible 24/7 💙\n\n✅ Apoyo profesional inmediato\n✅ Completamente confidencial\n✅ Basado en ISO 45003\n\nUsa mi código: ${referralCode}\n\n${window.location.origin}/registro?ref=${referralCode}\n\n#SaludMental #IA #NFLOW #Bienestar`;
                        navigator.clipboard.writeText(message);
                        toast({ title: "Post para redes sociales copiado" });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Referidos */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              Lista de Referidos
            </CardTitle>
            <CardDescription>
              Historial completo de usuarios referidos y sus estados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referralsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando referidos...</p>
              </div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aún no tienes referidos</p>
                <p className="text-sm">Cuando alguien use tu código, aparecerá aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {referral.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{referral.referralCode}</p>
                          <p className="text-sm text-gray-600">
                            Plan: {referral.subscriptionPlan} - €{referral.amount}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          +€{referral.commission}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(referral.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                        {referral.status === 'completed' ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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