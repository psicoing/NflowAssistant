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
  Shield
} from "lucide-react";

export default function ChatUserMenu() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPlanInfoDialog, setShowPlanInfoDialog] = useState(false);

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
            onClick={() => setLocation("/")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
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