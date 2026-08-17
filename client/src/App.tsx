import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import SplashScreen, { hasSplashBeenShown } from "@/components/SplashScreen";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import EjemplosChat from "@/pages/ejemplos-chat";
import Novedades from "@/pages/novedades";
import Resources from "@/pages/resources";
import RecursosGratis from "@/pages/recursos";
import Consejos from "@/pages/consejos";
import Partners from "@/pages/partners";
import PartnersComerciales from "@/pages/partners-comerciales";
import Recompensas from "@/pages/recompensas";
import Login from "@/pages/login";
import Registro from "@/pages/registro";
import RegistroSeleccion from "@/pages/registro-seleccion";
import PruebaGratis from "@/pages/prueba-gratis";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import PartnerLogin from "@/pages/partner-login";
import PartnerRegister from "@/pages/partner-register";
import PartnerDashboard from "@/pages/partner-dashboard-simple";
import PWAInstallPrompt from "@/components/ui/pwa-install-prompt";
import { CookieConsent } from "@/components/ui/cookie-consent";
import PaymentRedirect from "@/pages/payment-redirect";
import ActivarCuenta from "@/pages/activar-cuenta";
import StripeReturn from "@/pages/stripe-return";
import ActivarStripe from "@/pages/activar-stripe";
import StripeActivateManual from "@/pages/stripe-activate-manual";
import QuickActivate from "@/pages/quick-activate";
import ActivacionExitosa from "@/pages/activacion-exitosa";
import TerminosCondiciones from "@/pages/legal/terminos";
import PoliticaPrivacidad from "@/pages/legal/privacidad";
import PoliticaCookies from "@/pages/legal/cookies";
import AvisoLegal from "@/pages/legal/aviso-legal";
import NosotrosPage from "@/pages/nosotros";
import QuienesSomosPage from "@/pages/quienes-somos";
import AppMovil from "@/pages/app-movil";
import ControlParental from "@/pages/control-parental";
import PreciosPage from "@/pages/precios";
import BlogNew from "@/pages/blog-new";
import FloatingCTAButton from "@/components/FloatingCTAButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import DownloadCSV from "@/pages/download-csv";
import AccesoMagico from "@/pages/acceso-magico";
import EmpresaPrivada from "@/pages/empresa-privada";
import SectorPublico from "@/pages/sector-publico";
import ControlShell from "@/pages/control-shell";
import CompetenciaNuxa from "@/pages/competencia-nuxa";
import TestBienestar from "@/pages/test-bienestar";
import CalculadoraBurnout from "@/pages/calculadora-burnout";
import RecursosIntro from "@/pages/recursos-intro";
import SorteoRecursos from "@/pages/sorteo-recursos";
import ProgramaPartners from "@/pages/programa-partners";
import Bienvenida from "@/pages/bienvenida";

function AuthenticatedRouter() {
  const { user, isLoading, isAuthenticated, needsPayment } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // Always allow access to public routes
    const publicRoutes = ["/", "/bienvenida", "/ejemplos-chat", "/novedades", "/recursos", "/blog", "/precios", "/app-movil", "/login", "/registro", "/registro/planes", "/prueba-gratis", "/activar-cuenta", "/activacion-exitosa", "/admin/login", "/admin/dashboard", "/partners/login", "/partners/register", "/partners", "/partners-comerciales", "/partners/dashboard", "/nosotros", "/quienes-somos", "/control-parental", "/legal/terminos", "/legal/privacidad", "/legal/cookies", "/legal/aviso-legal", "/download-csv", "/empresa-privada", "/sector-publico", "/control-shell", "/recursos-gratuitos", "/competencia-nuxa", "/sorteo-recursos", "/test-bienestar", "/calculadora-burnout", "/programa-partners", "/recompensas"];
    // Allow magic link access routes
    if (location.startsWith("/acceso/")) {
      return;
    }
    // Allow blog article routes
    if (location.startsWith("/blog/")) {
      return;
    }
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
      <Route path="/bienvenida" component={Bienvenida} />
      <Route path="/ejemplos-chat" component={EjemplosChat} />
      <Route path="/novedades" component={Novedades} />
      <Route path="/recursos" component={RecursosGratis} />
      <Route path="/login" component={Login} />
      <Route path="/registro" component={RegistroSeleccion} />
      <Route path="/registro/planes" component={Registro} />
      <Route path="/prueba-gratis" component={PruebaGratis} />
      <Route path="/activar-cuenta" component={ActivarCuenta} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/blog" component={BlogNew} />
      <Route path="/blog/:id" component={BlogNew} />
      <Route path="/precios" component={PreciosPage} />
      <Route path="/partners" component={Partners} />
      <Route path="/partners-comerciales" component={PartnersComerciales} />
      <Route path="/partners/login" component={PartnerLogin} />
      <Route path="/partners/register" component={PartnerRegister} />
      <Route path="/partners/dashboard" component={PartnerDashboard} />
      <Route path="/recompensas" component={Recompensas} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/payment-redirect" component={PaymentRedirect} />
      <Route path="/stripe-return" component={StripeReturn} />
      <Route path="/activacion-exitosa" component={ActivacionExitosa} />
      <Route path="/activar-stripe" component={ActivarStripe} />
      <Route path="/stripe-manual" component={StripeActivateManual} />
      <Route path="/activar" component={QuickActivate} />
      <Route path="/legal/terminos" component={TerminosCondiciones} />
      <Route path="/legal/privacidad" component={PoliticaPrivacidad} />
      <Route path="/legal/cookies" component={PoliticaCookies} />
      <Route path="/legal/aviso-legal" component={AvisoLegal} />
      <Route path="/nosotros" component={NosotrosPage} />
      <Route path="/quienes-somos" component={QuienesSomosPage} />
      <Route path="/app-movil" component={AppMovil} />
      <Route path="/control-parental" component={ControlParental} />
      <Route path="/download-csv" component={DownloadCSV} />
      <Route path="/empresa-privada" component={EmpresaPrivada} />
      <Route path="/sector-publico" component={SectorPublico} />
      <Route path="/control-shell" component={ControlShell} />
      <Route path="/recursos-gratuitos" component={RecursosIntro} />
      <Route path="/test-bienestar" component={TestBienestar} />
      <Route path="/calculadora-burnout" component={CalculadoraBurnout} />
      <Route path="/competencia-nuxa" component={CompetenciaNuxa} />
      <Route path="/sorteo-recursos" component={SorteoRecursos} />
      <Route path="/programa-partners" component={ProgramaPartners} />
      <Route path="/acceso/:token" component={AccesoMagico} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const standaloneTools = ["/test-bienestar", "/calculadora-burnout"];
  const isStandaloneTool = standaloneTools.includes(location);
  const [, setLocation] = useLocation();
  const [showSplash, setShowSplash] = useState(() => !hasSplashBeenShown() && !isStandaloneTool);

  // Only show floating CTA on public pages and for non-authenticated users
  const showFloatingCTA = !isAuthenticated && 
    (location === "/" || location === "/ejemplos-chat" || location === "/precios" || 
     location === "/app-movil" || location === "/nosotros" || location === "/control-parental" || location === "/blog");

  if (showSplash && !isStandaloneTool) {
    return <SplashScreen onFinish={() => { setShowSplash(false); setLocation("/bienvenida"); }} />;
  }

  return (
    <div className="min-h-screen bg-nflow-dark text-white">
      <Toaster />
      <AuthenticatedRouter />
      <PWAInstallPrompt />
      <CookieConsent />
      {showFloatingCTA && <FloatingCTAButton />}
      {showFloatingCTA && <ExitIntentPopup />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
