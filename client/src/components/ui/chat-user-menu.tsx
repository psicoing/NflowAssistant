import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  LogOut, 
  Crown, 
  CreditCard, 
  XCircle, 
  Settings,
  Calendar,
  Shield,
  AlertTriangle,
  Phone,
  Receipt,
  MapPin,
  Mail,
  Clock
} from "lucide-react";

export default function ChatUserMenu() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPlanInfoDialog, setShowPlanInfoDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [showBillingDialog, setShowBillingDialog] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      localStorage.clear();
      queryClient.clear();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/subscription/cancel"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
      toast({
        title: "Suscripción cancelada",
        description: "Tu suscripción se cancelará al final del período de facturación actual",
      });
      setShowCancelDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error al cancelar",
        description: "No se pudo cancelar la suscripción. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCancelSubscription = () => {
    cancelSubscriptionMutation.mutate();
  };

  const getSubscriptionStatusText = () => {
    if (!user) return "Sin suscripción";
    
    switch (user.subscriptionStatus) {
      case 'active':
        return 'Plan Activo';
      case 'cancelled':
        return 'Cancelada';
      case 'pending_payment':
        return 'Pago Pendiente';
      default:
        return 'Sin suscripción';
    }
  };

  const getSubscriptionStatusColor = () => {
    if (!user) return "text-gray-400";
    
    switch (user.subscriptionStatus) {
      case 'active':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      case 'pending_payment':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      {/* Subscription Status Indicator */}
      <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/50">
        <Crown className={`w-4 h-4 ${getSubscriptionStatusColor()}`} />
        <span className={`text-sm font-medium ${getSubscriptionStatusColor()}`}>
          {getSubscriptionStatusText()}
        </span>
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-800/50">
            <Avatar className="h-10 w-10 border border-gray-600">
              <AvatarFallback className="bg-nflow-orange text-black font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64 bg-gray-800 border-gray-700" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">
                {user.username}
              </p>
              <p className="text-xs leading-none text-gray-400">
                {user.email}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Crown className={`w-3 h-3 ${getSubscriptionStatusColor()}`} />
                <span className={`text-xs ${getSubscriptionStatusColor()}`}>
                  {getSubscriptionStatusText()}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-gray-700" />
          
          <DropdownMenuItem 
            className="text-white hover:bg-gray-700 cursor-pointer"
            onClick={() => setShowProfileDialog(true)}
            onSelect={(e) => e.preventDefault()}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="text-red-400 hover:bg-gray-700 cursor-pointer"
            onClick={() => setShowEmergencyDialog(true)}
            onSelect={(e) => e.preventDefault()}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Urgencias</span>
          </DropdownMenuItem>
          
          {user.subscriptionStatus === 'pending_payment' && (
            <DropdownMenuItem 
              className="text-yellow-400 hover:bg-gray-700 cursor-pointer"
              onClick={() => setLocation("/#precios")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Activar Suscripción</span>
            </DropdownMenuItem>
          )}
          
          {user.subscriptionStatus === 'active' && (
            <>
              <DropdownMenuItem 
                className="text-blue-400 hover:bg-gray-700 cursor-pointer"
                onClick={() => setShowPlanInfoDialog(true)}
                onSelect={(e) => e.preventDefault()}
              >
                <Crown className="mr-2 h-4 w-4" />
                <span>Mejorar Plan</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="text-green-400 hover:bg-gray-700 cursor-pointer"
                onClick={() => setShowBillingDialog(true)}
                onSelect={(e) => e.preventDefault()}
              >
                <Receipt className="mr-2 h-4 w-4" />
                <span>Facturación</span>
              </DropdownMenuItem>
              
              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-gray-700 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    <span>Cancelar Suscripción</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Cancelar Suscripción</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      ¿Estás seguro de que quieres cancelar tu suscripción? Mantendrás acceso hasta el final de tu período de facturación actual.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCancelDialog(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelSubscription}
                      disabled={cancelSubscriptionMutation.isPending}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {cancelSubscriptionMutation.isPending ? "Cancelando..." : "Confirmar Cancelación"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showPlanInfoDialog} onOpenChange={setShowPlanInfoDialog}>
                <DialogTrigger asChild>
                  <div style={{ display: 'none' }} />
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white flex items-center">
                      <Crown className="mr-2 h-5 w-5 text-nflow-orange" />
                      Planes Disponibles
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Información sobre los planes de suscripción de NFLOW
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center mb-3">
                      <Crown className="w-6 h-6 text-nflow-orange mr-3" />
                      <div>
                        <h3 className="text-white font-semibold">Plan Básico</h3>
                        <p className="text-sm text-gray-400">€2.99/mes</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">
                      Actualmente solo está disponible el Plan Básico, que incluye acceso completo al chat de apoyo con IA.
                    </p>
                    <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        <Shield className="w-4 h-4 inline mr-1" />
                        Próximamente: Nuevos planes con características adicionales
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={() => setShowPlanInfoDialog(false)}
                      className="bg-nflow-orange hover:bg-nflow-orange/90 text-black"
                    >
                      Entendido
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          
          <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
            <DialogTrigger asChild>
              <div style={{ display: 'none' }} />
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5 text-nflow-orange" />
                  Perfil de Usuario
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Información de tu cuenta en NFLOW
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <Avatar className="h-12 w-12 border border-gray-600">
                    <AvatarFallback className="bg-nflow-orange text-black font-semibold text-lg">
                      {user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{user?.username}</h3>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Estado de Suscripción</span>
                      <span className={`text-sm font-medium ${getSubscriptionStatusColor()}`}>
                        {getSubscriptionStatusText()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Plan Actual</span>
                      <span className="text-gray-200 text-sm">
                        {user?.subscriptionPlan || 'Básico'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Miembro desde</span>
                      <span className="text-gray-200 text-sm">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => setShowProfileDialog(false)}
                  className="bg-nflow-orange hover:bg-nflow-orange/90 text-black"
                >
                  Cerrar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Dialog de Facturación */}
          <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
            <DialogTrigger asChild>
              <div style={{ display: 'none' }} />
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center">
                  <Receipt className="mr-2 h-5 w-5 text-green-400" />
                  Facturación
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Información de contacto para facturación
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6 space-y-6">
                {/* Header con icono de empresa */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">EMPORDAJOBS SL</h3>
                  <p className="text-gray-400 text-sm">CIF: B02701100</p>
                </div>
                
                {/* Información de contacto */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Ubicación</h4>
                      <p className="text-gray-300 text-sm">Portbou, Girona, España</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Teléfono</h4>
                      <p className="text-gray-300 text-sm">+34 660 45 21 36</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Email</h4>
                      <p className="text-blue-400 text-sm">empordajobs@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Horario</h4>
                      <p className="text-gray-300 text-sm">Lunes a Viernes: 9:00 - 18:00</p>
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => window.open('tel:+34660452136', '_self')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.open('mailto:empordajobs@gmail.com', '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar email
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => setShowBillingDialog(false)}
                  className="bg-nflow-orange hover:bg-nflow-orange/90 text-black"
                >
                  Cerrar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
            <DialogTrigger asChild>
              <div style={{ display: 'none' }} />
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-400" />
                  Números de Urgencias
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Información importante de contactos de emergencia
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                {/* España */}
                <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-red-400" />
                    España
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <h4 className="text-red-300 font-medium">Número General</h4>
                      <p className="text-white text-xl font-bold">112</p>
                      <p className="text-gray-300 text-sm">Todas las emergencias</p>
                    </div>
                    
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <h4 className="text-red-300 font-medium">Urgencias Médicas</h4>
                      <p className="text-white text-xl font-bold">061</p>
                      <p className="text-gray-300 text-sm">Cataluña, País Vasco, Galicia</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Recomendación: Marca 112 si no estás seguro. Es gratuito y multilingüe.
                    </p>
                  </div>
                </div>
                
                {/* Unión Europea */}
                <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-blue-400" />
                    Unión Europea
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Francia</span>
                      <span className="text-white font-medium">15 / 112</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Alemania</span>
                      <span className="text-white font-medium">112</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Italia</span>
                      <span className="text-white font-medium">118 / 112</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Portugal</span>
                      <span className="text-white font-medium">112</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Polonia</span>
                      <span className="text-white font-medium">999 / 112</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Austria</span>
                      <span className="text-white font-medium">144 / 112</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                    <p className="text-green-300 text-sm">
                      <Shield className="w-4 h-4 inline mr-1" />
                      En toda la UE: 112 funciona incluso sin cobertura (roaming de emergencia)
                    </p>
                  </div>
                </div>
                
                {/* Advertencia importante */}
                <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                  <h4 className="text-yellow-300 font-medium mb-2">⚠️ Importante</h4>
                  <p className="text-yellow-200 text-sm">
                    Si tienes una emergencia médica real, no uses este chat. Llama inmediatamente a los números de emergencia.
                    Este chat es solo para apoyo psicológico no urgente.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => setShowEmergencyDialog(false)}
                  className="bg-nflow-orange hover:bg-nflow-orange/90 text-black"
                >
                  Entendido
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <DropdownMenuSeparator className="bg-gray-700" />
          
          <DropdownMenuItem 
            className="text-red-400 hover:bg-gray-700 cursor-pointer"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{logoutMutation.isPending ? "Cerrando..." : "Cerrar Sesión"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}