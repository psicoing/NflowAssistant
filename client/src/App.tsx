import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import EjemplosChat from "@/pages/ejemplos-chat";
import Resources from "@/pages/resources";
import Consejos from "@/pages/consejos";
import Partners from "@/pages/partners";
import Recompensas from "@/pages/recompensas";
import Login from "@/pages/login";
import Registro from "@/pages/registro";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import PartnerLogin from "@/pages/partner-login";
import PartnerRegister from "@/pages/partner-register";
import PartnerDashboard from "@/pages/partner-dashboard-simple";
import PWAInstallPrompt from "@/components/ui/pwa-install-prompt";
import PaymentRedirect from "@/pages/payment-redirect";
import ActivarCuenta from "@/pages/activar-cuenta";
import PayPalReturn from "@/pages/paypal-return";

function AuthenticatedRouter() {
  const { user, isLoading, isAuthenticated, needsPayment } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // Always allow access to public routes
    const publicRoutes = ["/", "/ejemplos-chat", "/recursos", "/consejos", "/login", "/registro", "/activar-cuenta", "/paypal-return", "/admin/login", "/partners/login", "/partners/register", "/partners"];
    if (publicRoutes.includes(location)) {
      return;
    }

    // If authenticated user needs payment, redirect to activation
    if (isAuthenticated && needsPayment) {
      setLocation("/activar-cuenta");
      return;
    }

    // If not authenticated and trying to access protected routes, redirect to home
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }
  }, [isAuthenticated, needsPayment, location, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ejemplos-chat" component={EjemplosChat} />
      <Route path="/login" component={Login} />
      <Route path="/registro" component={Registro} />
      <Route path="/activar-cuenta" component={ActivarCuenta} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/recursos" component={Resources} />
      <Route path="/consejos" component={Consejos} />
      <Route path="/partners" component={Partners} />
      <Route path="/partners/login" component={PartnerLogin} />
      <Route path="/partners/register" component={PartnerRegister} />
      <Route path="/partners/dashboard" component={PartnerDashboard} />
      <Route path="/recompensas" component={Recompensas} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/payment-redirect" component={PaymentRedirect} />
      <Route path="/paypal-return" component={PayPalReturn} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-nflow-dark text-white">
          <Toaster />
          <AuthenticatedRouter />
          <PWAInstallPrompt />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
