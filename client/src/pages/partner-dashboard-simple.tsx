import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, LogOut, Users, TrendingUp, DollarSign, Link2, BarChart3, ExternalLink, Calendar, CheckCircle, Clock, UserCheck, Shield, AlertTriangle, Upload, FileSpreadsheet, Loader2, Ban, Trash2, Play, Lock, UserPlus, Activity, History } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Partner {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  status: string;
  partnerType: string;
  referralCode?: string;
  totalReferrals: number;
  totalEarnings: string;
  createdAt: string;
  activeUsersCount: number;
  activeUsersLimit: number;
  monthlyQuota: string;
  licenseStatus: string;
  monthlyCost?: string;
  licenseRenewalDate?: string;
  companyLogo?: string;
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

interface PartnerUser {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string | null;
  loginCount: number;
  questionsUsedThisMonth: number;
  monthlyQuestionLimit: number;
  subscriptionStatus: string;
}

interface PartnerAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface ActivityLog {
  id: number;
  action: string;
  adminEmail: string | null;
  targetUserEmail: string | null;
  details: string | null;
  createdAt: string;
}

export default function PartnerDashboardSimple() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [uploadResult, setUploadResult] = useState<{success: number; errors: string[]; created: string[]} | null>(null);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', password: '' });
  const [showAdminForm, setShowAdminForm] = useState(false);

  const { data: partner, isLoading: partnerLoading, error } = useQuery<Partner>({
    queryKey: ["/api/partners/profile"],
    retry: false,
  });

  const { data: referrals = [], isLoading: referralsLoading } = useQuery<Referral[]>({
    queryKey: ["/api/partners/referrals"],
    retry: false,
  });

  const { data: partnerUsers = [], isLoading: usersLoading } = useQuery<PartnerUser[]>({
    queryKey: ["/api/partners/users"],
    retry: false,
  });

  const { data: admins = [] } = useQuery<PartnerAdmin[]>({
    queryKey: ["/api/partners/admins"],
    retry: false,
  });

  const { data: activityLog = [] } = useQuery<ActivityLog[]>({
    queryKey: ["/api/partners/activity-log"],
    retry: false,
  });

  useEffect(() => {
    if (!partnerLoading && (!partner || error)) {
      console.log("Partner auth failed:", error);
      setLocation("/partners/login");
    }
  }, [partner, partnerLoading, error, setLocation]);

  // Load partner's permanent referral code automatically
  useEffect(() => {
    if (partner?.referralCode) {
      setReferralCode(partner.referralCode);
    }
  }, [partner]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/partners/upload-users', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Error al subir archivo');
      }
      return result;
    },
    onSuccess: (result) => {
      setUploadResult(result);
      toast({
        title: "Importación completada",
        description: `${result.success} usuarios creados correctamente`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/referrals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al procesar el archivo",
        variant: "destructive",
      });
    },
  });

  // Mutation to update user status (activate/block)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: 'active' | 'inactive' }) => {
      const response = await fetch(`/api/partners/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.status === 'active' ? "Usuario activado" : "Usuario bloqueado",
        description: `El usuario ha sido ${variables.status === 'active' ? 'activado' : 'bloqueado'} correctamente`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/partners/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/partners/admins", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Administrador creado",
        description: "El nuevo administrador ha sido añadido correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/admins"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/activity-log"] });
      setNewAdminForm({ name: '', email: '', password: '' });
      setShowAdminForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (adminId: number) => {
      const response = await fetch(`/api/partners/admins/${adminId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Administrador eliminado",
        description: "El administrador ha sido eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/admins"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners/activity-log"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'create_user': 'Creó usuario',
      'delete_user': 'Eliminó usuario',
      'block_user': 'Bloqueó usuario',
      'activate_user': 'Activó usuario',
      'import_users': 'Importó usuarios',
      'create_admin': 'Creó administrador',
      'delete_admin': 'Eliminó administrador',
      'login': 'Inició sesión',
    };
    return labels[action] || action;
  };

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
        description: "Tu código de referencia permanente ha sido creado",
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

  const getBaseUrl = () => {
    // Use production URL if available, otherwise fallback to current origin
    return import.meta.env.VITE_APP_URL || window.location.origin.replace('.replit.dev', '.replit.app');
  };

  const copyPromotionalLink = (linkType: string) => {
    const baseUrl = getBaseUrl();
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.csv', '.xlsx', '.xls', '.ods'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      toast({
        title: "Error",
        description: "Formato no soportado. Use CSV, XLSX, XLS o ODS.",
        variant: "destructive",
      });
      return;
    }

    setUploadResult(null);
    uploadMutation.mutate(file);
    event.target.value = '';
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
              <Button variant="outline" onClick={handleLogout} className="border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600">
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
                    Licencia Aprobada
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Tu licencia ha sido aprobada. Si eres empresa privada, puedes seguir toda la progresión de tu equipo. Si eres entidad pública o sin ánimo de lucro, también puedes acceder a todas las funcionalidades.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section Navigator */}
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tu dashboard tiene dos secciones:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="#arrendamiento" className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-300 dark:border-blue-600 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-blue-900 dark:text-blue-100">Licencia de Arrendamiento</div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Gestión de usuarios y equipo</div>
                <div className="text-xs text-gray-500 mt-1">Para todas las organizaciones</div>
              </div>
            </a>
            <a href="#explotacion" className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-2 border-purple-300 dark:border-purple-600 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-purple-900 dark:text-purple-100">Licencia de Explotación</div>
                <div className="text-xs text-purple-700 dark:text-purple-300">Programa de afiliados y comisiones</div>
                <div className="text-xs text-gray-500 mt-1">Solo empresas privadas</div>
              </div>
            </a>
          </div>
        </div>

        {/* Licencia de Arrendamiento Header */}
        <div id="arrendamiento" className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Licencia de Arrendamiento
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestión de tu equipo - Todas las organizaciones
              </p>
            </div>
          </div>
        </div>

        {/* Contract Info Block - Datos del Contrato */}
        <Card className="mb-8 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Contrato de Licencia
              </CardTitle>
              <Badge className="bg-blue-600">
                <Calendar className="w-3 h-3 mr-1" />
                Arrendamiento Mensual
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  €{partner.monthlyCost || '0'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Coste Mensual
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {partner.activeUsersLimit || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Usuarios Contratados
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {partner.activeUsersCount || 0} / {partner.activeUsersLimit || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Usuarios Activos
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {partner.licenseRenewalDate 
                    ? new Date(partner.licenseRenewalDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'No definida'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Próxima Renovación
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Logo Section */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Logo de la Empresa
            </CardTitle>
            <CardDescription>
              Sube el logo de tu empresa (máx. 2MB, formatos: JPG, PNG, GIF, WebP)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Logo preview */}
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
                {partner.companyLogo ? (
                  <img src={partner.companyLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Upload className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs">Sin logo</span>
                  </div>
                )}
              </div>
              
              {/* Upload controls */}
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        if (file.size > 2 * 1024 * 1024) {
                          toast({
                            title: "Error",
                            description: "El archivo es demasiado grande. Máximo 2MB.",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        const formData = new FormData();
                        formData.append('logo', file);
                        
                        try {
                          const response = await fetch('/api/partners/logo', {
                            method: 'POST',
                            credentials: 'include',
                            body: formData,
                          });
                          
                          const result = await response.json();
                          if (response.ok) {
                            toast({
                              title: "Logo actualizado",
                              description: "El logo de tu empresa ha sido actualizado correctamente",
                            });
                            queryClient.invalidateQueries({ queryKey: ["/api/partners/profile"] });
                          } else {
                            throw new Error(result.message);
                          }
                        } catch (error: any) {
                          toast({
                            title: "Error",
                            description: error.message || "Error al subir el logo",
                            variant: "destructive",
                          });
                        }
                        
                        e.target.value = '';
                      }}
                    />
                    <Button variant="outline" className="w-full cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {partner.companyLogo ? 'Cambiar Logo' : 'Subir Logo'}
                      </span>
                    </Button>
                  </label>
                  {partner.companyLogo && (
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={async () => {
                        if (!confirm('¿Eliminar el logo de la empresa?')) return;
                        
                        try {
                          const response = await fetch('/api/partners/logo', {
                            method: 'DELETE',
                            credentials: 'include',
                          });
                          
                          if (response.ok) {
                            toast({
                              title: "Logo eliminado",
                              description: "El logo ha sido eliminado correctamente",
                            });
                            queryClient.invalidateQueries({ queryKey: ["/api/partners/profile"] });
                          } else {
                            const result = await response.json();
                            throw new Error(result.message);
                          }
                        } catch (error: any) {
                          toast({
                            title: "Error",
                            description: error.message || "Error al eliminar el logo",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Este logo aparecerá en las comunicaciones con tus usuarios
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Status Block */}
        <Card className={`mb-8 ${
          partner.licenseStatus === 'suspended' 
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
            : partner.licenseStatus === 'active'
            ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'
            : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Estado de Licencia
              </CardTitle>
              <Badge 
                variant={
                  partner.licenseStatus === 'active' ? 'default' : 
                  partner.licenseStatus === 'suspended' ? 'destructive' : 'secondary'
                }
                className={
                  partner.licenseStatus === 'active' ? 'bg-emerald-500' : ''
                }
              >
                {partner.licenseStatus === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                {partner.licenseStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                {partner.licenseStatus === 'suspended' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {partner.licenseStatus === 'active' ? 'Activa' : 
                 partner.licenseStatus === 'suspended' ? 'Suspendida' : 'Pendiente'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {partner.licenseStatus === 'suspended' && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Licencia suspendida. Contacta con el administrador para reactivar tu cuenta.
                </p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {partner.activeUsersCount || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Usuarios Activos
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.max(0, (partner.activeUsersLimit || 0) - (partner.activeUsersCount || 0))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Plazas Disponibles
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  10
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Preguntas/Usuario/Mes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Importar Usuarios
            </CardTitle>
            <CardDescription>
              Carga usuarios masivamente desde un archivo CSV, XLSX o ODS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.ods"
                  onChange={handleFileUpload}
                  disabled={uploadMutation.isPending || partner.licenseStatus === 'suspended'}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer ${uploadMutation.isPending || partner.licenseStatus === 'suspended' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    {uploadMutation.isPending ? (
                      <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-2" />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {uploadMutation.isPending ? 'Procesando archivo...' : 'Haz clic para seleccionar archivo'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      CSV, XLSX, XLS o ODS (máx. 5MB)
                    </span>
                  </div>
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Formato requerido:</p>
                <p className="text-blue-700 dark:text-blue-300">
                  El archivo debe tener columnas: <strong>email</strong> (o correo), <strong>nombre</strong> (o name/usuario), 
                  y opcionalmente <strong>password</strong> (o contraseña/clave).
                </p>
              </div>

              {uploadResult && (
                <div className={`p-4 rounded-lg ${uploadResult.errors.length > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    ✓ {uploadResult.success} usuarios creados correctamente
                  </p>
                  {uploadResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Errores:</p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                        {uploadResult.errors.slice(0, 5).map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                        {uploadResult.errors.length > 5 && (
                          <li>... y {uploadResult.errors.length - 5} errores más</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Partner Users Management Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Usuarios de tu Equipo
            </CardTitle>
            <CardDescription>
              Gestiona y visualiza los usuarios importados de tu organización
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Cargando usuarios...</span>
              </div>
            ) : partnerUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aún no has importado usuarios.</p>
                <p className="text-sm mt-1">Usa la sección "Importar Usuarios" para añadir miembros de tu equipo.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>{partnerUsers.length}</strong> usuarios en tu equipo
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Email</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Estado</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Uso Mensual</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Último Acceso</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Sesiones</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnerUsers.map((user) => (
                        <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-3">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{user.email}</div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                              {user.subscriptionStatus === 'active' ? 'Activo' : user.questionsUsedThisMonth >= user.monthlyQuestionLimit ? 'Bloqueado' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${user.questionsUsedThisMonth >= user.monthlyQuestionLimit ? 'bg-red-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.min((user.questionsUsedThisMonth / user.monthlyQuestionLimit) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs ${user.questionsUsedThisMonth >= user.monthlyQuestionLimit ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                                {user.questionsUsedThisMonth}/{user.monthlyQuestionLimit}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-600 dark:text-gray-400">
                            {user.lastLoginAt 
                              ? new Date(user.lastLoginAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                              : 'Nunca'
                            }
                          </td>
                          <td className="py-3 px-3 text-gray-600 dark:text-gray-400">
                            {user.loginCount || 0}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1">
                              {user.subscriptionStatus === 'active' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateStatusMutation.mutate({ userId: user.id, status: 'inactive' })}
                                  disabled={updateStatusMutation.isPending}
                                  className="h-8 px-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                  title="Bloquear usuario"
                                >
                                  <Lock className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateStatusMutation.mutate({ userId: user.id, status: 'active' })}
                                  disabled={updateStatusMutation.isPending}
                                  className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Activar usuario"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`¿Eliminar usuario ${user.email}? Esta acción no se puede deshacer.`)) {
                                    deleteUserMutation.mutate(user.id);
                                  }
                                }}
                                disabled={deleteUserMutation.isPending}
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admins and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Administradores Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Administradores
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdminForm(!showAdminForm)}
                >
                  {showAdminForm ? 'Cancelar' : 'Añadir'}
                </Button>
              </div>
              <CardDescription>
                Usuarios con acceso al dashboard de gestión
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showAdminForm && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <div className="grid gap-3">
                    <div>
                      <Label htmlFor="adminName">Nombre</Label>
                      <Input
                        id="adminName"
                        value={newAdminForm.name}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                        placeholder="Nombre del administrador"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminEmail">Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={newAdminForm.email}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                        placeholder="email@empresa.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminPassword">Contraseña</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={newAdminForm.password}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                        placeholder="Contraseña de acceso"
                      />
                    </div>
                    <Button
                      onClick={() => createAdminMutation.mutate(newAdminForm)}
                      disabled={createAdminMutation.isPending || !newAdminForm.name || !newAdminForm.email || !newAdminForm.password}
                      className="w-full"
                    >
                      {createAdminMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Crear Administrador
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {/* Primary admin (partner owner) */}
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{partner.contactName}</div>
                    <div className="text-sm text-gray-500">{partner.email}</div>
                  </div>
                  <Badge className="bg-blue-600">Propietario</Badge>
                </div>

                {/* Additional admins */}
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{admin.name}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{admin.role === 'admin' ? 'Admin' : 'Visor'}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`¿Eliminar administrador ${admin.name}?`)) {
                            deleteAdminMutation.mutate(admin.id);
                          }
                        }}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {admins.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No hay administradores adicionales
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Registro de Actividad
              </CardTitle>
              <CardDescription>
                Últimas acciones realizadas en el panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {activityLog.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay actividad registrada
                  </p>
                ) : (
                  activityLog.slice(0, 20).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getActionLabel(log.action)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.targetUserEmail && <span>Usuario: {log.targetUserEmail}</span>}
                          {log.adminEmail && <span className="ml-2">Por: {log.adminEmail}</span>}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleDateString('es-ES', { 
                            day: '2-digit', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Licencia de Explotación Header */}
        <div id="explotacion" className="mb-6 mt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Licencia de Explotación
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Programa de afiliados - Gana comisiones por cada suscripción referida
              </p>
            </div>
            <Badge className="ml-auto bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border border-purple-300">
              Solo empresas privadas
            </Badge>
          </div>
        </div>

        {/* Stats Grid - Affiliate Program */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referidos</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partner.totalReferrals}</div>
              <p className="text-xs text-muted-foreground">
                Usuarios que se suscribieron con tu código
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{partner.totalEarnings}€</div>
              <p className="text-xs text-muted-foreground">
                Total de comisiones generadas
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Comisión</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">75%</div>
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
                Tu código permanente para trackear tus referencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!referralCode ? (
                <Button onClick={generateReferralCode} className="w-full">
                  Generar Código de Referencia
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                      ✨ Este es tu código PERMANENTE. Úsalo siempre para tus referidos.
                    </p>
                  </div>

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
                        {getBaseUrl()}/registro?ref={referralCode}
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

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Código QR
                    </label>
                    <div className="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getBaseUrl() + '/registro?ref=' + referralCode)}`}
                        alt="QR Code para registro"
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                      Tus usuarios pueden escanear este QR para registrarse directamente con tu código
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💡 <strong>Usa el link directo o el QR</strong> para que el código se aplique automáticamente al registrarse.
                    El usuario solo tendrá que completar sus datos.
                  </p>
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
                      {getBaseUrl()}/registro?ref={referralCode}
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
                        const message = `¡Hola! Te recomiendo NFLOW para salud mental con IA. Usa mi código: ${referralCode} - ${getBaseUrl()}/registro?ref=${referralCode}`;
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
                        const body = `Hola,\n\nQuería recomendarte NFLOW, una innovadora herramienta de salud mental que utiliza IA para brindar apoyo 24/7.\n\nPuedes probarla usando mi código de referencia: ${referralCode}\n\nEnlace: ${getBaseUrl()}/registro?ref=${referralCode}\n\n¡Espero que te sea útil!\n\nSaludos`;
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
                        const message = `🧠 Descubre NFLOW: Revolucionaria herramienta de salud mental con IA disponible 24/7 💙\n\n✅ Apoyo profesional inmediato\n✅ Completamente confidencial\n✅ Basado en ISO 45003\n\nUsa mi código: ${referralCode}\n\n${getBaseUrl()}/registro?ref=${referralCode}\n\n#SaludMental #IA #NFLOW #Bienestar`;
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
            <CardTitle>Cómo Usar tu Dashboard</CardTitle>
            <CardDescription>
              Guía para empresas que gestionan NUXA para su equipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">1. Importa tu Equipo</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sube un archivo CSV o Excel con los datos de tu equipo. Cada usuario recibirá acceso automático a NUXA con 100 preguntas mensuales.
                </p>
                
                <h4 className="font-medium">2. Gestiona tu Licencia</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visualiza en tiempo real el estado de tu licencia: usuarios activos, límite contratado, espacios disponibles y cuota mensual. Todo desde el panel "Estado de Licencia".
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">3. Sigue la Progresión</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Como empresa privada o entidad pública sin ánimo de lucro, puedes seguir el uso y progresión de tu equipo en tiempo real.
                </p>
                
                <h4 className="font-medium">4. Amplía cuando lo Necesites</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Si necesitas más usuarios o cuota mensual, contacta con nosotros para ampliar tu licencia según las necesidades de tu organización.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}