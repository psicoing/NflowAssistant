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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, LogOut, Crown, CreditCard, XCircle, AlertTriangle } from "lucide-react";

export default function ChatUserMenu() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => 
      apiRequest("POST", "/api/auth/change-password", data),
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente.",
      });
      setShowPasswordDialog(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar la contraseña",
        variant: "destructive",
      });
    },
  });

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
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
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
            onSelect={() => {
              setDropdownOpen(false);
              setShowProfileDialog(true);
            }}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="text-red-400 hover:bg-gray-700 cursor-pointer"
            onSelect={() => {
              setDropdownOpen(false);
              setShowEmergencyDialog(true);
            }}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Urgencias</span>
          </DropdownMenuItem>
          
          {user.subscriptionStatus === 'pending_payment' && (
            <DropdownMenuItem 
              className="text-yellow-400 hover:bg-gray-700 cursor-pointer"
              onSelect={() => {
                setDropdownOpen(false);
                setLocation("/#precios");
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Activar Suscripción</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator className="bg-gray-700" />
          
          <DropdownMenuItem 
            className="text-red-400 hover:bg-gray-700 cursor-pointer"
            onSelect={() => {
              setDropdownOpen(false);
              handleLogout();
            }}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{logoutMutation.isPending ? "Cerrando..." : "Cerrar Sesión"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <User className="mr-2 h-5 w-5 text-nflow-orange" />
              Perfil de Usuario
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Información de tu cuenta en NUXA
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
          <div className="flex justify-between mt-6">
            <Button 
              onClick={() => {
                setShowProfileDialog(false);
                setShowPasswordDialog(true);
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cambiar Contraseña
            </Button>
            <Button 
              onClick={() => setShowProfileDialog(false)}
              className="bg-nflow-orange hover:bg-nflow-orange/90 text-black"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Cambiar Contraseña</DialogTitle>
            <DialogDescription className="text-gray-400">
              Introduce tu contraseña actual y la nueva contraseña
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="current-password" className="text-gray-300">Contraseña Actual</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder="Introduce tu contraseña actual"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="text-gray-300">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder="Introduce tu nueva contraseña"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-gray-300">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordDialog(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={changePasswordMutation.isPending}
              className="bg-nflow-orange hover:bg-nflow-orange/90 text-black"
            >
              {changePasswordMutation.isPending ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-400" />
              Números de Emergencia
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Contactos de emergencia para España
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                <span className="text-gray-300">Emergencias Generales</span>
                <span className="text-white font-medium">112</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                <span className="text-gray-300">Línea de Atención al Suicidio</span>
                <span className="text-white font-medium">024</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                <span className="text-gray-300">Teléfono de la Esperanza</span>
                <span className="text-white font-medium">717 003 717</span>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <h4 className="text-yellow-300 font-medium mb-2">⚠️ Importante</h4>
              <p className="text-yellow-200 text-sm">
                Si tienes una emergencia médica real, no uses este chat. Llama inmediatamente a los números de emergencia.
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
    </div>
  );
}