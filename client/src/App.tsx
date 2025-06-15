import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/registro" component={Registro} />
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
          <Router />
          <PWAInstallPrompt />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
