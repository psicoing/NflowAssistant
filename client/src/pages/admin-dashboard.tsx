import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  MessageSquare, 
  FileText, 
  Settings,
  LogOut,
  TrendingUp,
  UserPlus,
  CreditCard,
  HandHeart,
  CheckCircle,
  XCircle,
  Clock,
  Bell
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: string;
  totalConversations: number;
  todayRegistrations: number;
  todayPayments: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<any[]>([]);
  const [pendingPartners, setPendingPartners] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  useEffect(() => {
    checkAuthAndFetchStats();
  }, []);

  useEffect(() => {
    fetchPartners();
  }, []);

  const checkAuthAndFetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.status === 401) {
        setLocation("/admin/login");
        return;
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLocation("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/admin/partners");
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
        setPendingPartners(data.filter((p: any) => p.status === 'pending'));
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const handlePartnerAction = async (partnerId: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/${action}`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchPartners(); // Refresh the list
      }
    } catch (error) {
      console.error(`Error ${action}ing partner:`, error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white">Cargando panel de administración...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Administración NFLOW</h1>
              <p className="text-gray-400 text-sm">Gestión integral de la plataforma</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Usuarios</p>
                  <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Suscripciones Activas</p>
                  <p className="text-2xl font-bold text-white">{stats?.activeSubscriptions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-white">€{stats?.totalRevenue || "0"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Conversaciones</p>
                  <p className="text-2xl font-bold text-white">{stats?.totalConversations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Registros Hoy</p>
                  <p className="text-2xl font-bold text-white">{stats?.todayRegistrations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-cyan-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pagos Hoy</p>
                  <p className="text-2xl font-bold text-white">{stats?.todayPayments || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-600">Resumen</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-600">Usuarios</TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-orange-600">Partners</TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-orange-600">Suscripciones</TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-orange-600">Ingresos</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-orange-600">Contenido</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Actividad Reciente</CardTitle>
                  <CardDescription className="text-gray-400">
                    Últimas acciones en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Nuevos registros hoy</span>
                      <Badge variant="secondary">{stats?.todayRegistrations || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Pagos completados hoy</span>
                      <Badge variant="secondary">{stats?.todayPayments || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Conversaciones activas</span>
                      <Badge variant="secondary">{stats?.totalConversations || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Acciones Rápidas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Herramientas de gestión
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setLocation("/admin/users")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gestionar Usuarios
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setLocation("/admin/subscriptions")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gestionar Suscripciones
                  </Button>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setLocation("/admin/content")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Gestionar Contenido
                  </Button>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 relative"
                    onClick={() => {
                      const partnersTab = document.querySelector('[data-state="inactive"][value="partners"]') as HTMLButtonElement;
                      partnersTab?.click();
                    }}
                  >
                    <HandHeart className="h-4 w-4 mr-2" />
                    Gestionar Partners
                    {pendingPartners.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                        {pendingPartners.length}
                      </Badge>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="partners">
            <div className="space-y-6">
              {/* Partners Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Solicitudes Pendientes</p>
                        <p className="text-2xl font-bold text-white">{pendingPartners.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Partners Activos</p>
                        <p className="text-2xl font-bold text-white">
                          {partners.filter(p => p.status === 'approved').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <HandHeart className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Total Partners</p>
                        <p className="text-2xl font-bold text-white">{partners.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Applications Alert */}
              {pendingPartners.length > 0 && (
                <Card className="bg-yellow-900/20 border-yellow-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-yellow-400 mr-3" />
                      <div>
                        <p className="text-yellow-200 font-medium">
                          Tienes {pendingPartners.length} solicitud{pendingPartners.length !== 1 ? 'es' : ''} de partner{pendingPartners.length !== 1 ? 's' : ''} pendiente{pendingPartners.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-yellow-300/80 text-sm">
                          Revisa y aprueba las solicitudes para activar nuevos partners
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Partners Management Table */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <HandHeart className="h-5 w-5 mr-2" />
                    Gestión de Partners
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Administrar solicitudes y partners activos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {partners.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No hay solicitudes de partners</p>
                    ) : (
                      partners.map((partner) => (
                        <div
                          key={partner.id}
                          className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h4 className="text-white font-medium">{partner.companyName}</h4>
                                <p className="text-gray-400 text-sm">{partner.contactName}</p>
                                <p className="text-gray-400 text-sm">{partner.email}</p>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                              <Badge 
                                variant={
                                  partner.status === 'approved' ? 'default' :
                                  partner.status === 'pending' ? 'secondary' : 'destructive'
                                }
                                className={
                                  partner.status === 'approved' ? 'bg-green-600' :
                                  partner.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                                }
                              >
                                {partner.status === 'approved' ? 'Aprobado' :
                                 partner.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                              </Badge>
                              <Badge variant="outline" className="border-gray-600 text-gray-300">
                                {partner.partnerType}
                              </Badge>
                            </div>
                            <div className="mt-2 text-sm text-gray-400">
                              Solicitud: {new Date(partner.createdAt).toLocaleDateString('es-ES')}
                              {partner.status === 'approved' && (
                                <>
                                  <span className="mx-2">•</span>
                                  Referidos: {partner.totalReferrals} • Ganancias: €{partner.totalEarnings}
                                </>
                              )}
                            </div>
                          </div>
                          
                          {partner.status === 'pending' && (
                            <div className="flex space-x-2 ml-4">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handlePartnerAction(partner.id, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handlePartnerAction(partner.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gestión de Usuarios</CardTitle>
                <CardDescription className="text-gray-400">
                  Administrar cuentas de usuario y permisos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Módulo de gestión de usuarios - En desarrollo</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gestión de Suscripciones</CardTitle>
                <CardDescription className="text-gray-400">
                  Administrar planes y suscripciones gratuitas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Módulo de suscripciones - En desarrollo</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Análisis de Ingresos</CardTitle>
                <CardDescription className="text-gray-400">
                  Reportes financieros y estadísticas de pago
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Módulo de ingresos - En desarrollo</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gestión de Contenido</CardTitle>
                <CardDescription className="text-gray-400">
                  Administrar recursos y materiales de apoyo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Módulo de contenido - En desarrollo</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}