import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Bell,
  Edit,
  Pause,
  Play,
  Search,
  Trash2,
  Book,
  RefreshCw,
  Eye
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: string;
  totalConversations: number;
  todayRegistrations: number;
  todayPayments: number;
}

interface LicenseFormData {
  activeUsersLimit: string;
  monthlyCost: string;
  licenseRenewalDate: string;
  commissionRate: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<any[]>([]);
  const [pendingPartners, setPendingPartners] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseForm, setLicenseForm] = useState<LicenseFormData>({
    activeUsersLimit: "10",
    monthlyCost: "0",
    licenseRenewalDate: "",
    commissionRate: "10"
  });
  const [isApproving, setIsApproving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [editUserForm, setEditUserForm] = useState({ subscriptionStatus: "", subscriptionPlan: "", monthlyQuestionLimit: "", role: "" });
  const [resources, setResources] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<"idle"|"loading"|"confirm"|"sending"|"done"|"error">("idle");
  const [campaignResult, setCampaignResult] = useState<{sent:number; failed:number; skipped:number} | null>(null);
  const [trialCount, setTrialCount] = useState<number | null>(null);

  // Instituciones
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [instLoading, setInstLoading] = useState(false);
  const [resendDomain, setResendDomain] = useState<{verified:boolean;status:string;name?:string}|null>(null);
  const checkResendDomain = async () => {
    const r = await fetch("/api/admin/resend-domain-status");
    if (r.ok) setResendDomain(await r.json());
  };

  const [instNewEmail, setInstNewEmail] = useState("");
  const [instNewName, setInstNewName] = useState("");
  const [instNewRegion, setInstNewRegion] = useState("");
  const [instAddError, setInstAddError] = useState<string | null>(null);
  const [instAdding, setInstAdding] = useState(false);

  // Filters
  const [instSearch, setInstSearch] = useState("");
  const [instRegionFilter, setInstRegionFilter] = useState("all");
  const [instStatusFilter, setInstStatusFilter] = useState<"all"|"active"|"baja">("all");

  // Delete confirmation
  const [instDeleteConfirmId, setInstDeleteConfirmId] = useState<number | null>(null);

  // CSV import
  const [instCsvImporting, setInstCsvImporting] = useState(false);
  const [instCsvResult, setInstCsvResult] = useState<{imported:number; skipped:number}|null>(null);

  // Campaign history
  const [instCampaignHistory, setInstCampaignHistory] = useState<any[]>([]);
  const [instHistoryLoading, setInstHistoryLoading] = useState(false);

  // Preview modal
  const [instPreviewOpen, setInstPreviewOpen] = useState(false);

  const [instSubject, setInstSubject] = useState("NUXA — Apoyo emocional profesional para sus equipos de salud");
  const [instBody, setInstBody] = useState(`Estimados/as,\n\nNos ponemos en contacto para presentarles NUXA (nuxa.life), una plataforma de apoyo emocional profesional diseñada específicamente para entornos de alta exigencia como el sanitario.\n\nNUXA ofrece:\n• Acompañamiento emocional disponible 24/7\n• Cumplimiento con ISO 45003 (gestión del riesgo psicosocial)\n• Sin listas de espera ni burocracia\n• Informes agregados y anónimos para los equipos de RRHH\n\nActualmente colaboramos con instituciones de salud pública en varias comunidades autónomas y nos gustaría explorar cómo podemos ayudar a su organización.\n\n¿Podríamos concertar una llamada de 20 minutos para conocer sus necesidades?\n\nQuedamos a su disposición.\n\nUn saludo,\nEquipo NUXA\nhttps://nuxa.life`);
  const [instStatus, setInstStatus] = useState<"idle"|"confirm"|"sending"|"done"|"error">("idle");
  const [instResult, setInstResult] = useState<{sent?:number; failed?:number; scheduled?:boolean; scheduledAt?:string; recipients?:number} | null>(null);

  // Templates
  const [instTemplates, setInstTemplates] = useState<any[]>([]);
  const [instShowTemplates, setInstShowTemplates] = useState(false);
  const [instSaveTemplateName, setInstSaveTemplateName] = useState("");
  const [instSavingTemplate, setInstSavingTemplate] = useState(false);

  // Campaign region filter
  const [instCampaignRegions, setInstCampaignRegions] = useState<string[]>([]);

  // Schedule
  const [instScheduledAt, setInstScheduledAt] = useState("");

  // A/B test
  const [instAbTest, setInstAbTest] = useState(false);
  const [instSubjectB, setInstSubjectB] = useState("");

  // Contact detail modal
  const [instSelectedContact, setInstSelectedContact] = useState<any | null>(null);
  const [instContactHistory, setInstContactHistory] = useState<any[]>([]);
  const [instContactHistoryLoading, setInstContactHistoryLoading] = useState(false);

  // Type filter
  const [instTypeFilter, setInstTypeFilter] = useState("all");

  const fetchInstitutions = async () => {
    setInstLoading(true);
    try {
      const r = await fetch("/api/admin/institutions");
      const d = await r.json();
      setInstitutions(Array.isArray(d) ? d : []);
    } catch {}
    setInstLoading(false);
  };

  const fetchInstCampaignHistory = async () => {
    setInstHistoryLoading(true);
    try {
      const r = await fetch("/api/admin/institution-campaign-history");
      if (r.ok) setInstCampaignHistory(await r.json());
    } catch {}
    setInstHistoryLoading(false);
  };

  const fetchInstTemplates = async () => {
    try {
      const r = await fetch("/api/admin/institution-templates");
      if (r.ok) setInstTemplates(await r.json());
    } catch {}
  };

  const fetchInstContactHistory = async (id: number) => {
    setInstContactHistoryLoading(true);
    try {
      const r = await fetch(`/api/admin/institutions/${id}/history`);
      if (r.ok) setInstContactHistory(await r.json());
      else setInstContactHistory([]);
    } catch { setInstContactHistory([]); }
    setInstContactHistoryLoading(false);
  };

  const exportInstCSV = () => window.open("/api/admin/institutions/export-csv", "_blank");

  useEffect(() => {
    checkAuthAndFetchStats();
  }, []);

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (activeTab === "users" || activeTab === "subscriptions" || activeTab === "revenue") {
      if (adminUsers.length === 0) fetchAdminUsers();
    }
    if (activeTab === "content") {
      if (resources.length === 0 && books.length === 0) fetchContent();
    }
  }, [activeTab]);

  const fetchAdminUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchContent = async () => {
    setContentLoading(true);
    try {
      const [resResponse, booksResponse] = await Promise.all([
        fetch("/api/resources"),
        fetch("/api/books")
      ]);
      if (resResponse.ok) setResources(await resResponse.json());
      if (booksResponse.ok) setBooks(await booksResponse.json());
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditUserForm({
      subscriptionStatus: user.subscriptionStatus || "inactive",
      subscriptionPlan: user.subscriptionPlan || "",
      monthlyQuestionLimit: (user.monthlyQuestionLimit || 10).toString(),
      role: user.role || "user"
    });
    setShowEditUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionStatus: editUserForm.subscriptionStatus,
          subscriptionPlan: editUserForm.subscriptionPlan || null,
          monthlyQuestionLimit: parseInt(editUserForm.monthlyQuestionLimit) || 10,
          role: editUserForm.role
        })
      });
      if (response.ok) {
        setShowEditUserModal(false);
        setEditingUser(null);
        fetchAdminUsers();
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (response.ok) {
        setShowDeleteConfirm(null);
        fetchAdminUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleSubscription = async (user: any) => {
    const newStatus = user.subscriptionStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionStatus: newStatus })
      });
      if (response.ok) fetchAdminUsers();
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

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

  const openApprovalModal = (partner: any) => {
    setEditingPartner(partner);
    setIsApproving(true);
    setLicenseForm({
      activeUsersLimit: partner.activeUsersLimit?.toString() || "10",
      monthlyCost: partner.monthlyCost || "0",
      licenseRenewalDate: partner.licenseRenewalDate ? new Date(partner.licenseRenewalDate).toISOString().split('T')[0] : "",
      commissionRate: partner.commissionRate || "10"
    });
    setShowLicenseModal(true);
  };

  const openEditModal = (partner: any) => {
    setEditingPartner(partner);
    setIsApproving(false);
    setLicenseForm({
      activeUsersLimit: partner.activeUsersLimit?.toString() || "10",
      monthlyCost: partner.monthlyCost || "0",
      licenseRenewalDate: partner.licenseRenewalDate ? new Date(partner.licenseRenewalDate).toISOString().split('T')[0] : "",
      commissionRate: partner.commissionRate || "10"
    });
    setShowLicenseModal(true);
  };

  const handleSaveLicense = async () => {
    if (!editingPartner) return;
    
    try {
      const endpoint = isApproving 
        ? `/api/admin/partners/${editingPartner.id}/approve`
        : `/api/admin/partners/${editingPartner.id}/license`;
      
      const response = await fetch(endpoint, {
        method: isApproving ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeUsersLimit: licenseForm.activeUsersLimit,
          monthlyCost: licenseForm.monthlyCost,
          licenseRenewalDate: licenseForm.licenseRenewalDate || null,
          commissionRate: licenseForm.commissionRate
        })
      });
      
      if (response.ok) {
        setShowLicenseModal(false);
        setEditingPartner(null);
        fetchPartners();
      }
    } catch (error) {
      console.error("Error saving license:", error);
    }
  };

  const handlePartnerAction = async (partnerId: number, action: 'reject' | 'suspend' | 'activate') => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/${action}`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchPartners();
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
              <h1 className="text-xl font-bold text-white">Panel de Administración NUXA</h1>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Scrollable tab bar for mobile */}
          <div className="overflow-x-auto pb-1 -mx-4 px-4" style={{ WebkitOverflowScrolling: "touch" }}>
            <TabsList className="bg-gray-800/50 border-gray-700 inline-flex w-max min-w-full gap-0.5">
              <TabsTrigger value="overview"      className="data-[state=active]:bg-orange-600 shrink-0 text-xs sm:text-sm px-3">Resumen</TabsTrigger>
              <TabsTrigger value="users"         className="data-[state=active]:bg-orange-600 shrink-0 text-xs sm:text-sm px-3">Usuarios</TabsTrigger>
              <TabsTrigger value="partners"      className="data-[state=active]:bg-orange-600 shrink-0 text-xs sm:text-sm px-3">Partners</TabsTrigger>
              <TabsTrigger value="subscriptions" className="data-[state=active]:bg-orange-600 shrink-0 text-xs sm:text-sm px-3">Suscripciones</TabsTrigger>
              <TabsTrigger value="revenue"       className="data-[state=active]:bg-orange-600 shrink-0 text-xs sm:text-sm px-3">Ingresos</TabsTrigger>
              <TabsTrigger value="content"       className="data-[state=active]:bg-orange-600 shrink-0 text-xs sm:text-sm px-3">Contenido</TabsTrigger>
              <TabsTrigger value="campana"       className="data-[state=active]:bg-orange-600 shrink-0 text-xs sm:text-sm px-3" onClick={checkResendDomain}>📧 Campaña</TabsTrigger>
              <TabsTrigger value="instituciones" className="data-[state=active]:bg-orange-600 shrink-0 text-xs sm:text-sm px-3" onClick={() => { fetchInstitutions(); checkResendDomain(); fetchInstCampaignHistory(); }}>🏛️ Instituciones</TabsTrigger>
            </TabsList>
          </div>

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
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gestionar Usuarios
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab("subscriptions")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gestionar Suscripciones
                  </Button>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setActiveTab("content")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Gestionar Contenido
                  </Button>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 relative"
                    onClick={() => setActiveTab("partners")}
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
                                  partner.status === 'approved' || partner.status === 'active' ? 'default' :
                                  partner.status === 'pending' ? 'secondary' : 'destructive'
                                }
                                className={
                                  partner.status === 'approved' || partner.status === 'active' ? 'bg-green-600' :
                                  partner.status === 'pending' ? 'bg-yellow-600' :
                                  partner.status === 'suspended' ? 'bg-amber-600' : 'bg-red-600'
                                }
                              >
                                {partner.status === 'approved' || partner.status === 'active' ? 'Activo' :
                                 partner.status === 'pending' ? 'Pendiente' :
                                 partner.status === 'suspended' ? 'Suspendido' : 'Rechazado'}
                              </Badge>
                              <Badge variant="outline" className="border-gray-600 text-gray-300">
                                {partner.partnerType}
                              </Badge>
                            </div>
                            <div className="mt-2 text-sm text-gray-400">
                              Solicitud: {new Date(partner.createdAt).toLocaleDateString('es-ES')}
                              {(partner.status === 'approved' || partner.status === 'active') && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span className="text-blue-400">Usuarios: {partner.activeUsersCount || 0}/{partner.activeUsersLimit || 10}</span>
                                  <span className="mx-2">•</span>
                                  <span className="text-green-400">€{partner.monthlyCost || 0}/mes</span>
                                  {partner.licenseRenewalDate && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <span className="text-amber-400">Renovación: {new Date(partner.licenseRenewalDate).toLocaleDateString('es-ES')}</span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            {partner.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => openApprovalModal(partner)}
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
                            
                            {(partner.status === 'approved' || partner.status === 'active') && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                                  onClick={() => openEditModal(partner)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-amber-500 text-amber-400 hover:bg-amber-500/20"
                                  onClick={() => handlePartnerAction(partner.id, 'suspend')}
                                >
                                  <Pause className="h-4 w-4 mr-1" />
                                  Suspender
                                </Button>
                              </div>
                            )}
                            
                            {partner.status === 'suspended' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handlePartnerAction(partner.id, 'activate')}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Reactivar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-lg">Total: {adminUsers.length} usuarios</h3>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={fetchAdminUsers}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar por nombre o email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="bg-gray-700 border-gray-600 text-white pl-9" />
                  </div>
                  <div className="flex gap-2">
                    {["all", "active", "inactive"].map((status) => (
                      <Button key={status} size="sm" variant={userStatusFilter === status ? "default" : "outline"} className={userStatusFilter === status ? "bg-orange-600" : "border-gray-600 text-gray-300 hover:bg-gray-700"} onClick={() => setUserStatusFilter(status)}>
                        {status === "all" ? "Todos" : status === "active" ? "Activos" : "Inactivos"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-0">
                  {usersLoading ? (
                    <div className="text-center py-12 text-gray-400">Cargando usuarios...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-4 text-gray-400 text-sm font-medium">Usuario</th>
                            <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                            <th className="text-left p-4 text-gray-400 text-sm font-medium">Plan</th>
                            <th className="text-left p-4 text-gray-400 text-sm font-medium">Estado</th>
                            <th className="text-left p-4 text-gray-400 text-sm font-medium">Preguntas</th>
                            <th className="text-left p-4 text-gray-400 text-sm font-medium">Último Login</th>
                            <th className="text-left p-4 text-gray-400 text-sm font-medium">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminUsers
                            .filter((u) => {
                              const matchesSearch = !userSearch || u.username?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
                              const matchesStatus = userStatusFilter === "all" || u.subscriptionStatus === userStatusFilter;
                              return matchesSearch && matchesStatus;
                            })
                            .map((user) => (
                              <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                                <td className="p-4 text-white font-medium">{user.username}</td>
                                <td className="p-4 text-gray-300 text-sm">{user.email || "—"}</td>
                                <td className="p-4">
                                  <Badge variant="outline" className="border-gray-600 text-gray-300">{user.subscriptionPlan || "Sin plan"}</Badge>
                                </td>
                                <td className="p-4">
                                  <Badge className={user.subscriptionStatus === "active" ? "bg-green-600" : user.subscriptionStatus === "cancelled" ? "bg-red-600" : "bg-gray-600"}>
                                    {user.subscriptionStatus || "inactive"}
                                  </Badge>
                                </td>
                                <td className="p-4 text-gray-300 text-sm">{user.questionsUsedThisMonth || 0}/{user.monthlyQuestionLimit || 10}</td>
                                <td className="p-4 text-gray-400 text-sm">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("es-ES") : "Nunca"}</td>
                                <td className="p-4">
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/20" onClick={() => handleEditUser(user)}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20" onClick={() => setShowDeleteConfirm(user.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {adminUsers.filter((u) => {
                        const matchesSearch = !userSearch || u.username?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
                        const matchesStatus = userStatusFilter === "all" || u.subscriptionStatus === userStatusFilter;
                        return matchesSearch && matchesStatus;
                      }).length === 0 && (
                        <div className="text-center py-8 text-gray-400">No se encontraron usuarios</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="space-y-6">
              {(() => {
                const subscribers = adminUsers.filter((u) => u.subscriptionPlan || u.subscriptionStatus === "active");
                const planCounts = { basic: 0, individual: 0, premium: 0, partner: 0 };
                subscribers.forEach((u) => {
                  const plan = u.subscriptionPlan as keyof typeof planCounts;
                  if (plan && plan in planCounts) planCounts[plan]++;
                });
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {(["basic", "individual", "premium", "partner"] as const).map((plan) => (
                        <Card key={plan} className="bg-gray-800/50 border-gray-700">
                          <CardContent className="p-6">
                            <p className="text-sm font-medium text-gray-400 capitalize">{plan}</p>
                            <p className="text-3xl font-bold text-white mt-1">{planCounts[plan]}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {plan === "basic" ? "€2.99/mes" : plan === "individual" ? "€5.99/mes" : plan === "premium" ? "€32/año" : "Personalizado"}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Suscripciones ({subscribers.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {usersLoading ? (
                          <div className="text-center py-12 text-gray-400">Cargando...</div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Usuario</th>
                                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Plan</th>
                                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Estado</th>
                                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Límite Mensual</th>
                                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Créditos Prepago</th>
                                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Expiración</th>
                                  <th className="text-left p-4 text-gray-400 text-sm font-medium">Acción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {subscribers.map((user) => (
                                  <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                                    <td className="p-4 text-white font-medium">{user.username}</td>
                                    <td className="p-4 text-gray-300 text-sm">{user.email || "—"}</td>
                                    <td className="p-4">
                                      <Badge variant="outline" className="border-gray-600 text-gray-300 capitalize">{user.subscriptionPlan || "—"}</Badge>
                                    </td>
                                    <td className="p-4">
                                      <Badge className={user.subscriptionStatus === "active" ? "bg-green-600" : user.subscriptionStatus === "cancelled" ? "bg-red-600" : "bg-gray-600"}>
                                        {user.subscriptionStatus || "inactive"}
                                      </Badge>
                                    </td>
                                    <td className="p-4 text-gray-300 text-sm">{user.monthlyQuestionLimit || 10}</td>
                                    <td className="p-4 text-gray-300 text-sm">{user.prepaidQuestions || 0}</td>
                                    <td className="p-4 text-gray-400 text-sm">{user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString("es-ES") : "—"}</td>
                                    <td className="p-4">
                                      <Button size="sm" variant="outline" className={user.subscriptionStatus === "active" ? "border-red-500 text-red-400 hover:bg-red-500/20" : "border-green-500 text-green-400 hover:bg-green-500/20"} onClick={() => handleToggleSubscription(user)}>
                                        {user.subscriptionStatus === "active" ? <><Pause className="h-3 w-3 mr-1" /> Desactivar</> : <><Play className="h-3 w-3 mr-1" /> Activar</>}
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {subscribers.length === 0 && <div className="text-center py-8 text-gray-400">No hay suscripciones registradas</div>}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="space-y-6">
              {(() => {
                const planPrices = { basic: 2.99, individual: 5.99, premium: 32 / 12, partner: 0 };
                const planLabels = { basic: "€2.99/mes", individual: "€5.99/mes", premium: "€32/año", partner: "Personalizado" };
                const planCounts = { basic: 0, individual: 0, premium: 0, partner: 0 };
                let totalPrepaid = 0;
                const activeSubscribers = adminUsers.filter((u) => u.subscriptionStatus === "active");
                activeSubscribers.forEach((u) => {
                  const plan = u.subscriptionPlan as keyof typeof planCounts;
                  if (plan && plan in planCounts) planCounts[plan]++;
                });
                adminUsers.forEach((u) => { totalPrepaid += u.prepaidQuestions || 0; });
                const monthlyRevenue = planCounts.basic * 2.99 + planCounts.individual * 5.99 + (planCounts.premium * 32) / 12;
                const avgPerUser = activeSubscribers.length > 0 ? monthlyRevenue / activeSubscribers.length : 0;
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-green-500" />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-400">Ingresos Mensuales Est.</p>
                              <p className="text-2xl font-bold text-white">€{monthlyRevenue.toFixed(2)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <Users className="h-8 w-8 text-blue-500" />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-400">Suscriptores Activos</p>
                              <p className="text-2xl font-bold text-white">{activeSubscribers.length}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <TrendingUp className="h-8 w-8 text-yellow-500" />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-400">Promedio por Usuario</p>
                              <p className="text-2xl font-bold text-white">€{avgPerUser.toFixed(2)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">Desglose por Plan</CardTitle>
                          <CardDescription className="text-gray-400">Ingresos estimados por tipo de plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {(["basic", "individual", "premium", "partner"] as const).map((plan) => (
                              <div key={plan} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                <div>
                                  <p className="text-white font-medium capitalize">{plan}</p>
                                  <p className="text-gray-400 text-sm">{planLabels[plan]}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-bold">{planCounts[plan]} usuarios</p>
                                  <p className="text-green-400 text-sm">
                                    {plan === "partner" ? "—" : `€${(planCounts[plan] * (plan === "premium" ? 32 : planPrices[plan])).toFixed(2)}${plan === "premium" ? "/año" : "/mes"}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">Créditos Prepago</CardTitle>
                          <CardDescription className="text-gray-400">Resumen de créditos vendidos</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                              <span className="text-gray-300">Total créditos prepago activos</span>
                              <span className="text-white font-bold">{totalPrepaid}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                              <span className="text-gray-300">Usuarios con créditos prepago</span>
                              <span className="text-white font-bold">{adminUsers.filter((u) => (u.prepaidQuestions || 0) > 0).length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                              <span className="text-gray-300">Ingresos totales reportados</span>
                              <span className="text-white font-bold">€{stats?.totalRevenue || "0"}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                );
              })()}
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Total Recursos</p>
                        <p className="text-2xl font-bold text-white">{resources.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Book className="h-8 w-8 text-orange-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Total Libros</p>
                        <p className="text-2xl font-bold text-white">{books.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {contentLoading ? (
                <div className="text-center py-12 text-gray-400">Cargando contenido...</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Recursos ({resources.length})
                      </CardTitle>
                      <CardDescription className="text-gray-400">Artículos, guías y ejercicios</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {resources.length === 0 ? (
                          <p className="text-gray-400 text-center py-4">No hay recursos</p>
                        ) : (
                          resources.map((resource) => (
                            <div key={resource.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium truncate">{resource.title}</p>
                                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{resource.content?.substring(0, 100)}...</p>
                                </div>
                                <div className="flex gap-2 ml-2 flex-shrink-0">
                                  <Badge variant="outline" className="border-purple-500/50 text-purple-300">{resource.category}</Badge>
                                  <Badge variant="outline" className="border-gray-600 text-gray-400">{resource.type}</Badge>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Book className="h-5 w-5 mr-2" />
                        Libros ({books.length})
                      </CardTitle>
                      <CardDescription className="text-gray-400">Libros recomendados con enlaces de afiliado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {books.length === 0 ? (
                          <p className="text-gray-400 text-center py-4">No hay libros</p>
                        ) : (
                          books.map((book) => (
                            <div key={book.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium truncate">{book.title}</p>
                                  <p className="text-gray-400 text-sm">{book.author}</p>
                                </div>
                                <div className="flex gap-2 ml-2 flex-shrink-0">
                                  {book.category && <Badge variant="outline" className="border-orange-500/50 text-orange-300">{book.category}</Badge>}
                                  {book.affiliateLink && (
                                    <a href={book.affiliateLink} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── INSTITUCIONES ── */}
          <TabsContent value="instituciones">
            <div className="space-y-6">

              {/* ── MODAL: Eliminar contacto ── */}
              {instDeleteConfirmId !== null && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
                    <p className="text-white font-semibold text-center">¿Eliminar este contacto?</p>
                    <p className="text-gray-400 text-sm text-center">Esta acción no se puede deshacer.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setInstDeleteConfirmId(null)} className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 py-2.5 rounded-xl font-medium transition-all text-sm">Cancelar</button>
                      <button onClick={async () => { await fetch(`/api/admin/institutions/${instDeleteConfirmId}`, { method: "DELETE" }); setInstDeleteConfirmId(null); fetchInstitutions(); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all text-sm">Eliminar</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MODAL: Vista previa email ── */}
              {instPreviewOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold">Vista previa del email</p>
                      <button onClick={() => setInstPreviewOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Asunto A</p>
                      <p className="text-white text-sm font-medium">{instSubject}</p>
                      {instAbTest && instSubjectB && <><p className="text-gray-400 text-xs mt-2 mb-1">Asunto B</p><p className="text-white text-sm font-medium">{instSubjectB}</p></>}
                    </div>
                    <div className="bg-white rounded-xl overflow-hidden">
                      <div style={{background:"linear-gradient(135deg,#1e40af,#3b82f6)",padding:"24px",textAlign:"center"}}>
                        <p style={{margin:"0 0 4px",fontSize:"24px"}}>🧠</p>
                        <p style={{margin:0,fontSize:"18px",fontWeight:700,color:"#fff"}}>NUXA</p>
                        <p style={{margin:"4px 0 0",color:"#bfdbfe",fontSize:"12px"}}>Apoyo emocional profesional · ISO 45003</p>
                      </div>
                      <div style={{padding:"24px",fontFamily:"'Segoe UI',Arial,sans-serif"}}>
                        {instBody.split("\n").filter(l => l.trim()).map((line, i) => (
                          <p key={i} style={{margin:"0 0 12px",color:"#374151",fontSize:"14px",lineHeight:1.6}}>{line}</p>
                        ))}
                      </div>
                      <div style={{padding:"16px 24px",background:"#f9fafb",borderTop:"1px solid #e5e7eb",textAlign:"center"}}>
                        <p style={{margin:0,fontSize:"11px",color:"#9ca3af"}}>NUXA · Empordajobs SL · B02701100 · nuxa.life</p>
                      </div>
                    </div>
                    <button onClick={() => setInstPreviewOpen(false)} className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 py-2.5 rounded-xl font-medium transition-all text-sm">Cerrar</button>
                  </div>
                </div>
              )}

              {/* ── MODAL: Ficha de contacto ── */}
              {instSelectedContact && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-bold text-base">{instSelectedContact.name || instSelectedContact.email}</p>
                        {instSelectedContact.name && <p className="text-gray-400 text-sm">{instSelectedContact.email}</p>}
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {instSelectedContact.region && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">{instSelectedContact.region}</span>}
                          {instSelectedContact.contact_type && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{instSelectedContact.contact_type}</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${instSelectedContact.opted_out ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>{instSelectedContact.opted_out ? "Baja" : "Activo"}</span>
                        </div>
                      </div>
                      <button onClick={() => { setInstSelectedContact(null); setInstContactHistory([]); }} className="text-gray-400 hover:text-white text-xl ml-4">✕</button>
                    </div>
                    {/* Edit type */}
                    <div className="bg-gray-700/50 rounded-xl p-3 space-y-2">
                      <p className="text-gray-300 text-xs font-semibold uppercase tracking-wide">Editar tipo</p>
                      <select
                        defaultValue={instSelectedContact.contact_type || ""}
                        onChange={async e => {
                          await fetch(`/api/admin/institutions/${instSelectedContact.id}`, {
                            method: "PATCH", headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ contact_type: e.target.value || null }),
                          });
                          fetchInstitutions();
                        }}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="">Sin tipo</option>
                        <option value="Ministerio">Ministerio</option>
                        <option value="Servicio de salud CCAA">Servicio de salud CCAA</option>
                        <option value="Hospital">Hospital</option>
                        <option value="Agencia / OTRI">Agencia / OTRI</option>
                        <option value="Universidad">Universidad</option>
                        <option value="Asociación">Asociación</option>
                        <option value="Cluster">Cluster</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    {/* Send history */}
                    <div>
                      <p className="text-gray-300 text-xs font-semibold uppercase tracking-wide mb-2">Historial de envíos</p>
                      {instContactHistoryLoading ? (
                        <p className="text-gray-400 text-sm text-center py-3">Cargando...</p>
                      ) : instContactHistory.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-3">Aún no ha recibido ninguna campaña</p>
                      ) : (
                        <div className="space-y-2">
                          {instContactHistory.map((h: any, i: number) => (
                            <div key={i} className="bg-gray-700/50 rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between">
                                <p className="text-white text-xs font-medium truncate max-w-[280px]" title={h.subject}>{h.subject}</p>
                                {h.subject_variant === "b" && <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded ml-2">Variante B</span>}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-gray-500 text-xs">{new Date(h.sent_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                {h.opened_at
                                  ? <span className="text-emerald-400 text-xs">✅ Abierto {new Date(h.opened_at).toLocaleDateString("es-ES")}</span>
                                  : <span className="text-gray-500 text-xs">Sin apertura registrada</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── PANEL IZQUIERDO: lista de contactos ── */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">🏛️ Contactos institucionales</CardTitle>
                        <CardDescription className="text-gray-400">
                          {institutions.filter(i => !i.opted_out).length} activos · {institutions.filter(i => i.opted_out).length} bajas · {institutions.length} total
                        </CardDescription>
                      </div>
                      <button onClick={exportInstCSV} title="Exportar CSV" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 border border-emerald-500/30 px-2.5 py-1 rounded-lg hover:bg-emerald-500/10 transition-all">
                        ⬇ CSV
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Añadir nuevo */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input type="email" placeholder="email@institucion.es" value={instNewEmail} onChange={e => setInstNewEmail(e.target.value)}
                          className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                        <input type="text" placeholder="Nombre" value={instNewName} onChange={e => setInstNewName(e.target.value)}
                          className="w-28 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Región" value={instNewRegion} onChange={e => setInstNewRegion(e.target.value)}
                          className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                        <button disabled={instAdding} onClick={async () => {
                          setInstAddError(null);
                          if (!instNewEmail.includes("@")) { setInstAddError("Email inválido"); return; }
                          setInstAdding(true);
                          try {
                            const r = await fetch("/api/admin/institutions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: instNewEmail, name: instNewName, region: instNewRegion }) });
                            if (r.ok) { setInstNewEmail(""); setInstNewName(""); setInstNewRegion(""); fetchInstitutions(); }
                            else { const d = await r.json().catch(() => ({})); setInstAddError(d.message || `Error ${r.status}`); }
                          } catch { setInstAddError("Sin conexión"); } finally { setInstAdding(false); }
                        }} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap">
                          {instAdding ? "…" : "+ Añadir"}
                        </button>
                      </div>
                    </div>
                    {instAddError && <p className="text-red-400 text-xs px-1">{instAddError}</p>}

                    {/* CSV import */}
                    <label className="block cursor-pointer bg-gray-700/50 hover:bg-gray-700 border border-dashed border-gray-600 hover:border-blue-500 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-all text-center">
                      {instCsvImporting ? "Importando…" : "📥 Importar CSV (email, nombre, región)"}
                      <input type="file" accept=".csv,.txt" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0]; if (!file) return;
                        setInstCsvImporting(true); setInstCsvResult(null);
                        try {
                          const text = await file.text();
                          const rows = text.split("\n").filter(l => l.trim()).map(line => {
                            const p = line.split(/[,;]/).map(p => p.trim().replace(/^["']|["']$/g, ""));
                            return { email: p[0] || "", name: p[1] || "", region: p[2] || "" };
                          }).filter(r => r.email.includes("@"));
                          const r = await fetch("/api/admin/institutions/import-csv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rows }) });
                          if (r.ok) { setInstCsvResult(await r.json()); fetchInstitutions(); }
                        } catch { setInstCsvResult({ imported: 0, skipped: -1 }); }
                        finally { setInstCsvImporting(false); e.target.value = ""; }
                      }} />
                    </label>
                    {instCsvResult && (
                      <p className="text-xs px-1">{instCsvResult.skipped === -1 ? <span className="text-red-400">❌ Error al importar</span> : <span className="text-emerald-400">✅ {instCsvResult.imported} importados · {instCsvResult.skipped} omitidos</span>}</p>
                    )}

                    {/* Search & filters */}
                    <div className="flex gap-2 flex-wrap">
                      <input type="text" placeholder="🔍 Buscar..." value={instSearch} onChange={e => setInstSearch(e.target.value)}
                        className="flex-1 min-w-[120px] bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1.5 text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      <select value={instStatusFilter} onChange={e => setInstStatusFilter(e.target.value as any)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="baja">Bajas</option>
                      </select>
                      <select value={instRegionFilter} onChange={e => setInstRegionFilter(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                        <option value="all">Todas las regiones</option>
                        {Array.from(new Set(institutions.map(i => i.region).filter(Boolean))).sort().map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <select value={instTypeFilter} onChange={e => setInstTypeFilter(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                        <option value="all">Todos los tipos</option>
                        {Array.from(new Set(institutions.map(i => i.contact_type).filter(Boolean))).sort().map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    {/* Lista */}
                    <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1">
                      {instLoading ? (
                        <p className="text-gray-400 text-sm text-center py-4">Cargando...</p>
                      ) : (() => {
                        const filtered = institutions.filter(inst => {
                          const matchSearch = !instSearch || inst.email.toLowerCase().includes(instSearch.toLowerCase()) || (inst.name || "").toLowerCase().includes(instSearch.toLowerCase());
                          const matchStatus = instStatusFilter === "all" || (instStatusFilter === "active" && !inst.opted_out) || (instStatusFilter === "baja" && inst.opted_out);
                          const matchRegion = instRegionFilter === "all" || inst.region === instRegionFilter;
                          const matchType = instTypeFilter === "all" || inst.contact_type === instTypeFilter;
                          return matchSearch && matchStatus && matchRegion && matchType;
                        });
                        if (filtered.length === 0) return <p className="text-gray-400 text-sm text-center py-4">Sin resultados</p>;
                        return filtered.map(inst => (
                          <div key={inst.id}
                            onClick={() => { setInstSelectedContact(inst); setInstContactHistory([]); fetchInstContactHistory(inst.id); }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${inst.opted_out ? "opacity-50 bg-gray-700/20 hover:bg-gray-700/30" : "bg-gray-700/50 hover:bg-gray-700"}`}>
                            <div className="min-w-0 flex-1">
                              {inst.name && <p className="text-white text-xs font-semibold truncate">{inst.name}</p>}
                              <p className="text-gray-300 text-xs truncate">{inst.email}</p>
                              <div className="flex gap-1.5 mt-0.5 flex-wrap">
                                {inst.region && <span className="text-gray-500 text-xs">{inst.region}</span>}
                                {inst.contact_type && <span className="text-xs bg-purple-500/15 text-purple-400 px-1.5 py-0 rounded">{inst.contact_type}</span>}
                                {inst.campaigns_sent > 0 && <span className="text-blue-400 text-xs bg-blue-500/10 px-1.5 rounded">📧 {inst.campaigns_sent}</span>}
                                {inst.opted_out && <span className="text-red-400 text-xs">baja</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2 shrink-0" onClick={e => e.stopPropagation()}>
                              <button onClick={() => setInstDeleteConfirmId(inst.id)}
                                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-500/20 transition-all">✕</button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* ── PANEL DERECHO: composer + envío ── */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">✉️ Redactar campaña</CardTitle>
                    <CardDescription className="text-gray-400">
                      {instCampaignRegions.length > 0
                        ? `Regiones: ${instCampaignRegions.join(", ")} · ${institutions.filter(i => !i.opted_out && instCampaignRegions.includes(i.region)).length} destinatarios`
                        : `Todos los activos · ${institutions.filter(i => !i.opted_out).length} destinatarios`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">

                    {/* Templates */}
                    <div className="flex gap-2">
                      <button onClick={async () => { await fetchInstTemplates(); setInstShowTemplates(!instShowTemplates); }}
                        className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 py-1.5 rounded-lg text-xs font-medium transition-all">
                        📋 {instShowTemplates ? "Ocultar plantillas" : `Mis plantillas (${instTemplates.length})`}
                      </button>
                      <button onClick={async () => {
                        const name = instSaveTemplateName || prompt("Nombre de la plantilla:") || "";
                        if (!name || !instSubject || !instBody) return;
                        setInstSavingTemplate(true);
                        await fetch("/api/admin/institution-templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, subject: instSubject, body: instBody }) });
                        setInstSavingTemplate(false); setInstSaveTemplateName(""); fetchInstTemplates();
                      }} disabled={instSavingTemplate || !instSubject.trim() || !instBody.trim()}
                        className="border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 disabled:opacity-40 py-1.5 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap">
                        {instSavingTemplate ? "…" : "💾 Guardar"}
                      </button>
                    </div>
                    {instShowTemplates && instTemplates.length > 0 && (
                      <div className="bg-gray-700/50 rounded-xl p-2 space-y-1 max-h-36 overflow-y-auto">
                        {instTemplates.map(t => (
                          <div key={t.id} className="flex items-center gap-2">
                            <button onClick={() => { setInstSubject(t.subject); setInstBody(t.body); setInstShowTemplates(false); }}
                              className="flex-1 text-left text-xs text-gray-200 hover:text-white bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-all truncate">{t.name}</button>
                            <button onClick={async () => { await fetch(`/api/admin/institution-templates/${t.id}`, { method: "DELETE" }); fetchInstTemplates(); }}
                              className="text-red-400 hover:text-red-300 text-xs px-1.5 py-1 rounded hover:bg-red-500/20">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {instShowTemplates && instTemplates.length === 0 && (
                      <p className="text-gray-500 text-xs text-center py-2">Aún no hay plantillas guardadas</p>
                    )}

                    {/* Asunto A */}
                    <div>
                      <label className="text-gray-300 text-xs font-medium block mb-1">{instAbTest ? "Asunto A (50% destinatarios)" : "Asunto"}</label>
                      <input type="text" value={instSubject} onChange={e => setInstSubject(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>

                    {/* A/B toggle + Asunto B */}
                    <div>
                      <button onClick={() => setInstAbTest(!instAbTest)}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all ${instAbTest ? "border-purple-500/50 text-purple-300 bg-purple-500/10" : "border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-700"}`}>
                        🔀 {instAbTest ? "A/B activo — click para desactivar" : "Activar A/B testing (2 asuntos)"}
                      </button>
                      {instAbTest && (
                        <div className="mt-2">
                          <label className="text-gray-300 text-xs font-medium block mb-1">Asunto B (50% restante)</label>
                          <input type="text" value={instSubjectB} onChange={e => setInstSubjectB(e.target.value)}
                            placeholder="Asunto alternativo..."
                            className="w-full bg-gray-700 border border-purple-500/40 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500" />
                        </div>
                      )}
                    </div>

                    {/* Cuerpo */}
                    <div>
                      <label className="text-gray-300 text-xs font-medium block mb-1">Cuerpo del mensaje</label>
                      <textarea rows={8} value={instBody} onChange={e => setInstBody(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-y font-mono" />
                    </div>

                    {/* Filtro por región */}
                    <div>
                      <label className="text-gray-300 text-xs font-medium block mb-1">Enviar solo a estas regiones <span className="text-gray-500">(vacío = todas)</span></label>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(new Set(institutions.filter(i => !i.opted_out).map(i => i.region).filter(Boolean))).sort().map(region => (
                          <button key={region} onClick={() => setInstCampaignRegions(prev => prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region])}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${instCampaignRegions.includes(region) ? "bg-blue-600 border-blue-500 text-white" : "border-gray-600 text-gray-400 hover:text-white hover:border-gray-400"}`}>
                            {region}
                          </button>
                        ))}
                        {instCampaignRegions.length > 0 && (
                          <button onClick={() => setInstCampaignRegions([])} className="text-xs px-2.5 py-1 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all">✕ Limpiar</button>
                        )}
                      </div>
                    </div>

                    {/* Programar envío */}
                    <div>
                      <label className="text-gray-300 text-xs font-medium block mb-1">Programar envío <span className="text-gray-500">(opcional)</span></label>
                      <input type="datetime-local" value={instScheduledAt} onChange={e => setInstScheduledAt(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                      {instScheduledAt && <p className="text-gray-500 text-xs mt-1">Se enviará el {new Date(instScheduledAt).toLocaleString("es-ES")}</p>}
                    </div>

                    {/* Preview */}
                    <button onClick={() => setInstPreviewOpen(true)} disabled={!instSubject.trim() || !instBody.trim()}
                      className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40 py-2 rounded-xl font-medium transition-all text-sm">
                      👁️ Vista previa del email
                    </button>

                    {instResult && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                        {instResult.scheduled
                          ? <p className="text-emerald-300 text-sm">🕐 Programado para {instResult.scheduledAt ? new Date(instResult.scheduledAt).toLocaleString("es-ES") : ""} · {instResult.recipients} destinatarios</p>
                          : <p className="text-emerald-300 text-sm">✅ Enviado a <strong>{instResult.recipients}</strong> destinatarios (resultados en historial)</p>}
                      </div>
                    )}
                    {instStatus === "error" && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                        <p className="text-red-300 text-sm">❌ Error al enviar. Revisa los logs.</p>
                      </div>
                    )}

                    {resendDomain?.verified && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2">
                        <p className="text-emerald-300 text-xs">✅ Dominio <strong>nuxa.life</strong> verificado</p>
                      </div>
                    )}

                    {instStatus === "idle" && (
                      <button onClick={() => setInstStatus("confirm")} disabled={!instSubject.trim() || !instBody.trim()}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all">
                        {instScheduledAt ? "🕐 Programar envío" : "Preparar envío"} →
                        ({instCampaignRegions.length > 0
                          ? institutions.filter(i => !i.opted_out && instCampaignRegions.includes(i.region)).length
                          : institutions.filter(i => !i.opted_out).length} destinatarios)
                      </button>
                    )}

                    {instStatus === "confirm" && (
                      <div className="space-y-3">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
                          <p className="text-amber-300 text-sm font-semibold">¿Confirmas {instScheduledAt ? "la programación" : "el envío"}?</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {instCampaignRegions.length > 0
                              ? `Regiones: ${instCampaignRegions.join(", ")} · `
                              : "Todos los activos · "}
                            <strong className="text-white">
                              {instCampaignRegions.length > 0
                                ? institutions.filter(i => !i.opted_out && instCampaignRegions.includes(i.region)).length
                                : institutions.filter(i => !i.opted_out).length} destinatarios
                            </strong>
                            {instAbTest && instSubjectB && " · A/B testing activo"}
                            {instScheduledAt && ` · ${new Date(instScheduledAt).toLocaleString("es-ES")}`}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setInstStatus("idle")} className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 py-2.5 rounded-xl font-medium transition-all text-sm">Cancelar</button>
                          <button onClick={async () => {
                            setInstStatus("sending");
                            try {
                              const r = await fetch("/api/admin/send-institution-campaign", {
                                method: "POST", headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  subject: instSubject, body: instBody,
                                  regions: instCampaignRegions.length > 0 ? instCampaignRegions : undefined,
                                  scheduledAt: instScheduledAt || undefined,
                                  subjectB: instAbTest && instSubjectB ? instSubjectB : undefined,
                                }),
                              });
                              const d = await r.json();
                              setInstResult(d);
                              setInstStatus("done");
                              fetchInstCampaignHistory();
                            } catch { setInstStatus("error"); }
                          }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all text-sm">
                            {instScheduledAt ? "🕐 Programar" : "✉️ Enviar ahora"}
                          </button>
                        </div>
                      </div>
                    )}

                    {instStatus === "sending" && (
                      <div className="text-center py-3">
                        <div className="animate-spin w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-gray-300 text-sm">Preparando envío...</p>
                      </div>
                    )}

                    {instStatus === "done" && (
                      <button onClick={() => { setInstStatus("idle"); setInstResult(null); setInstCampaignRegions([]); setInstScheduledAt(""); setInstAbTest(false); setInstSubjectB(""); }}
                        className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 py-2.5 rounded-xl font-medium transition-all text-sm">
                        Nueva campaña
                      </button>
                    )}
                  </CardContent>
                </Card>

              </div>

              {/* ── HISTORIAL DE CAMPAÑAS ── */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">📊 Historial de campañas</CardTitle>
                      <CardDescription className="text-gray-400">Las aperturas se registran vía webhook de Resend en tiempo real.</CardDescription>
                    </div>
                    <button onClick={fetchInstCampaignHistory} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Actualizar
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {instHistoryLoading ? (
                    <p className="text-gray-400 text-sm text-center py-4">Cargando...</p>
                  ) : instCampaignHistory.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">Aún no se ha enviado ninguna campaña</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 text-xs border-b border-gray-700">
                            <th className="text-left pb-2 pr-3">Fecha</th>
                            <th className="text-left pb-2 pr-3">Asunto</th>
                            <th className="text-left pb-2 pr-3">Regiones</th>
                            <th className="text-center pb-2 pr-3">Enviados</th>
                            <th className="text-center pb-2 pr-3">Fallidos</th>
                            <th className="text-center pb-2 pr-3">Aperturas</th>
                            <th className="text-center pb-2">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                          {instCampaignHistory.map((c: any) => (
                            <tr key={c.id} className="text-gray-300 hover:bg-gray-700/20 transition-all">
                              <td className="py-2 pr-3 text-xs text-gray-400 whitespace-nowrap">
                                {new Date(c.sent_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </td>
                              <td className="py-2 pr-3 max-w-[160px] text-xs">
                                <p className="truncate" title={c.subject}>{c.subject}</p>
                                {c.subject_b && <p className="truncate text-purple-400" title={c.subject_b}>B: {c.subject_b}</p>}
                              </td>
                              <td className="py-2 pr-3 text-xs text-gray-500">{c.regions_filter || "Todas"}</td>
                              <td className="py-2 pr-3 text-center"><span className="text-emerald-400 font-semibold">{c.sent_count}</span></td>
                              <td className="py-2 pr-3 text-center"><span className={c.failed_count > 0 ? "text-red-400 font-semibold" : "text-gray-500"}>{c.failed_count}</span></td>
                              <td className="py-2 pr-3 text-center">
                                <span className="text-blue-400 font-semibold">{c.opens}</span>
                                {c.sent_count > 0 && <span className="text-gray-500 text-xs ml-1">({Math.round((c.opens / c.sent_count) * 100)}%)</span>}
                              </td>
                              <td className="py-2 text-center">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "scheduled" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                                  {c.status === "scheduled" ? "⏰ Programado" : "✓ Enviado"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* ── CAMPAÑA DE REACTIVACIÓN ── */}
          <TabsContent value="campana">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    📧 Campaña de reactivación
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Email único y no invasivo para usuarios que probaron NUXA pero no convirtieron.
                    Incluye enlace de baja con un clic.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preview del email */}
                  <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 space-y-3 text-sm">
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Vista previa del email</p>
                    <p className="text-white font-semibold">Asunto: ¿Cómo estás? Tu espacio en NUXA te espera 🧠</p>
                    <div className="border-t border-gray-700 pt-3 text-gray-300 leading-relaxed space-y-2">
                      <p>Hola <span className="text-emerald-400">[nombre]</span>,</p>
                      <p>Hace un tiempo probaste NUXA. Si alguna vez necesitas un espacio donde hablar <strong>sin juicios y sin prisas</strong>, aquí seguimos.</p>
                      <p>Además, ahora tienes <strong className="text-emerald-400">5 consultas gratuitas</strong> esperándote.</p>
                      <p className="text-center mt-2">
                        <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">Volver a NUXA →</span>
                      </p>
                    </div>
                    <p className="text-gray-600 text-xs border-t border-gray-700 pt-2">
                      Pie: enlace de baja con un clic · Solo se envía una vez
                    </p>
                  </div>

                  {/* Destinatarios */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-300 font-semibold text-sm mb-1">¿A quién se envía?</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>✅ Usuarios con estado <strong>trial</strong> que tienen email</li>
                      <li>✅ Que NO hayan marcado baja de comunicaciones</li>
                      <li>❌ No se envía a usuarios premium, admin ni sin email</li>
                    </ul>
                  </div>

                  {/* Estado dominio Resend */}
                  {resendDomain && !resendDomain.verified && (
                    <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <p className="text-red-300 text-sm font-semibold">Dominio no verificado en Resend</p>
                        <p className="text-gray-400 text-xs mt-0.5">Estado: <strong className="text-white">{resendDomain.status === "not_added" ? "no añadido" : resendDomain.status}</strong>. Los emails fallarán hasta que Resend verifique <code className="text-orange-300">nuxa.life</code>.</p>
                        <button onClick={checkResendDomain} className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline">🔄 Comprobar de nuevo</button>
                      </div>
                    </div>
                  )}
                  {resendDomain?.verified && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                      <p className="text-emerald-300 text-sm">✅ Dominio <strong>nuxa.life</strong> verificado — emails listos</p>
                    </div>
                  )}

                  {/* Resultado */}
                  {campaignResult && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <p className="text-emerald-300 font-semibold text-sm mb-1">✅ Campaña enviada</p>
                      <p className="text-gray-300 text-sm">Enviados: <strong>{campaignResult.sent}</strong> · Fallidos: <strong>{campaignResult.failed}</strong> · Omitidos (sin email/baja): <strong>{campaignResult.skipped}</strong></p>
                    </div>
                  )}

                  {campaignStatus === "error" && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-300 text-sm">❌ Error al enviar la campaña. Revisa los logs.</p>
                    </div>
                  )}

                  {/* Botones */}
                  {campaignStatus === "idle" || campaignStatus === "loading" ? (
                    <button
                      disabled={campaignStatus === "loading"}
                      onClick={async () => {
                        setCampaignStatus("loading");
                        try {
                          const r = await fetch("/api/admin/reactivation-preview");
                          const d = await r.json();
                          setTrialCount(d.count);
                          setCampaignStatus("confirm");
                        } catch { setCampaignStatus("idle"); }
                      }}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
                    >
                      {campaignStatus === "loading" ? "Calculando destinatarios..." : "Preparar campaña →"}
                    </button>
                  ) : campaignStatus === "confirm" ? (
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                        <p className="text-white font-bold text-lg">{trialCount} usuarios</p>
                        <p className="text-gray-400 text-sm">recibirán el email de reactivación</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setCampaignStatus("idle")}
                          className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 py-2.5 rounded-xl font-medium transition-all"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={async () => {
                            setCampaignStatus("sending");
                            try {
                              const r = await fetch("/api/admin/send-reactivation", { method: "POST" });
                              const d = await r.json();
                              setCampaignResult(d);
                              setCampaignStatus("done");
                            } catch { setCampaignStatus("error"); }
                          }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all"
                        >
                          ✉️ Enviar ahora a {trialCount} usuarios
                        </button>
                      </div>
                    </div>
                  ) : campaignStatus === "sending" ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
                      <p className="text-gray-300">Enviando emails... no cierres esta ventana</p>
                    </div>
                  ) : campaignStatus === "done" ? (
                    <button
                      onClick={() => { setCampaignStatus("idle"); setCampaignResult(null); }}
                      className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 py-2.5 rounded-xl font-medium transition-all"
                    >
                      Nueva campaña
                    </button>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* Edit User Modal */}
      <Dialog open={showEditUserModal} onOpenChange={setShowEditUserModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Usuario</DialogTitle>
            <DialogDescription className="text-gray-400">{editingUser?.username} - {editingUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Estado de Suscripción</Label>
              <select value={editUserForm.subscriptionStatus} onChange={(e) => setEditUserForm((prev) => ({ ...prev, subscriptionStatus: e.target.value }))} className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="cancelled">Cancelado</option>
                <option value="pending_payment">Pago pendiente</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Plan de Suscripción</Label>
              <select value={editUserForm.subscriptionPlan} onChange={(e) => setEditUserForm((prev) => ({ ...prev, subscriptionPlan: e.target.value }))} className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2">
                <option value="">Sin plan</option>
                <option value="basic">Basic (€2.99/mes)</option>
                <option value="individual">Individual (€5.99/mes)</option>
                <option value="premium">Premium (€32/año)</option>
                <option value="partner">Partner</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Límite mensual de preguntas</Label>
              <Input type="number" value={editUserForm.monthlyQuestionLimit} onChange={(e) => setEditUserForm((prev) => ({ ...prev, monthlyQuestionLimit: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Rol</Label>
              <select value={editUserForm.role} onChange={(e) => setEditUserForm((prev) => ({ ...prev, role: e.target.value }))} className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2">
                <option value="user">Usuario</option>
                <option value="admin">Admin</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUserModal(false)} className="border-gray-600 text-gray-300">Cancelar</Button>
            <Button onClick={handleSaveUser} className="bg-green-600 hover:bg-green-700">Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <Dialog open={showDeleteConfirm !== null} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-gray-400">¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="border-gray-600 text-gray-300">Cancelar</Button>
            <Button variant="destructive" onClick={() => showDeleteConfirm && handleDeleteUser(showDeleteConfirm)}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* License Edit Modal */}
      <Dialog open={showLicenseModal} onOpenChange={setShowLicenseModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isApproving ? '✅ Aprobar Partner' : '✏️ Editar Licencia'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingPartner?.companyName} - {editingPartner?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Límite de usuarios</Label>
              <Input
                type="number"
                value={licenseForm.activeUsersLimit}
                onChange={(e) => setLicenseForm(prev => ({ ...prev, activeUsersLimit: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="10"
              />
              <p className="text-xs text-gray-400">Máximo de usuarios que puede crear este partner</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-200">Coste mensual (€)</Label>
              <Input
                type="text"
                value={licenseForm.monthlyCost}
                onChange={(e) => setLicenseForm(prev => ({ ...prev, monthlyCost: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0"
              />
              <p className="text-xs text-gray-400">Cuota mensual de arrendamiento</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-200">Fecha de renovación</Label>
              <Input
                type="date"
                value={licenseForm.licenseRenewalDate}
                onChange={(e) => setLicenseForm(prev => ({ ...prev, licenseRenewalDate: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-200">Comisión (%)</Label>
              <Input
                type="text"
                value={licenseForm.commissionRate}
                onChange={(e) => setLicenseForm(prev => ({ ...prev, commissionRate: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="10"
              />
              <p className="text-xs text-gray-400">Porcentaje de comisión por referidos</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLicenseModal(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveLicense}
              className="bg-green-600 hover:bg-green-700"
            >
              {isApproving ? 'Aprobar y Guardar' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}