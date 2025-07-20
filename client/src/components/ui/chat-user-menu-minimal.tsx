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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Crown, CreditCard, XCircle } from "lucide-react";

export default function ChatUserMenu() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          
          <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer">
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
            <DropdownMenuItem className="text-blue-400 hover:bg-gray-700 cursor-pointer">
              <Crown className="mr-2 h-4 w-4" />
              <span>Mejorar Plan</span>
            </DropdownMenuItem>
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