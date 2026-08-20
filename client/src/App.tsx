import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { lazy, Suspense, useEffect, useState } from "react";
import SplashScreen, { hasSplashBeenShown, markSplashShown } from "@/components/SplashScreen";
import PWAInstallPrompt from "@/components/ui/pwa-install-prompt";
import { CookieConsent } from "@/components/ui/cookie-consent";
import FloatingCTAButton from "@/components/FloatingCTAButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";

// Las páginas se descargan solo cuando se visita su ruta. Esto reduce mucho
// el primer paquete que debe cargar el navegador/WebView.
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
const Chat = lazy(() => import("@/pages/chat"));
const EjemplosChat = lazy(() => import("@/pages/ejemplos-chat"));
const Novedades = lazy(() => import("@/pages/novedades"));
const RecursosGratis = lazy(() => import("@/pages/recursos"));
const Partners = lazy(() => import("@/pages/partners"));
const PartnersComerciales = lazy(() => import("@/pages/partners-comerciales"));
const Recompensas = lazy(() => import("@/pages/recompensas"));
const Login = lazy(() => import("@/pages/login"));
const Registro = lazy(() => import("@/pages/registro"));
const RegistroSeleccion = lazy(() => import("@/pages/registro-seleccion"));
const PruebaGratis = lazy(() => import("@/pages/prueba-gratis"));
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const PartnerLogin = lazy(() => import("@/pages/partner-login"));
const PartnerRegister = lazy(() => import("@/pages/partner-register"));
const PartnerDashboard = lazy(() => import("@/pages/partner-dashboard-simple"));
const PaymentRedirect = lazy(() => import("@/pages/payment-redirect"));
const ActivarCuenta = lazy(() => import("@/pages/activar-cuenta"));
const StripeReturn = lazy(() => import("@/pages/stripe-return"));
const ActivarStripe = lazy(() => import("@/pages/activar-stripe"));
const StripeActivateManual = lazy(() => import("@/pages/stripe-activate-manual"));
const QuickActivate = lazy(() => import("@/pages/quick-activate"));
const ActivacionExitosa = lazy(() => import("@/pages/activacion-exitosa"));
const TerminosCondiciones = lazy(() => import("@/pages/legal/terminos"));
const PoliticaPrivacidad = lazy(() => import("@/pages/legal/privacidad"));
const PoliticaCookies = lazy(() => import("@/pages/legal/cookies"));
const AvisoLegal = lazy(() => import("@/pages/legal/aviso-legal"));
const NosotrosPage = lazy(() => import("@/pages/nosotros"));
const QuienesSomosPage = lazy(() => import("@/pages/quienes-somos"));
const AppMovil = lazy(() => import("@/pages/app-movil"));
const ControlParental = lazy(() => import("@/pages/control-parental"));
const PreciosPage = lazy(() => import("@/pages/precios"));
const BlogNew = lazy(() => import("@/pages/blog-new"));
const DownloadCSV = lazy(() => import("@/pages/download-csv"));
const AccesoMagico = lazy(() => import("@/pages/acceso-magico"));
const EmpresaPrivada = lazy(() => import("@/pages/empresa-privada"));
const SectorPublico = lazy(() => import("@/pages/sector-publico"));
const ControlShell = lazy(() => import("@/pages/control-shell"));
const CompetenciaNuxa = lazy(() => import("@/pages/competencia-nuxa"));
const TestBienestar = lazy(() => import("@/pages/test-bienestar"));
const CalculadoraBurnout = lazy(() => import("@/pages/calculadora-burnout"));
const RecursosIntro = lazy(() => import("@/pages/recursos-intro"));
const SorteoRecursos = lazy(() => import("@/pages/sorteo-recursos"));
const ProgramaPartners = lazy(() => import("@/pages/programa-partners"));
const Bienvenida = lazy(() => import("@/pages/bienvenida"));

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
    <Suspense
      fallback={
        <div className="min-h-screen bg-nflow-dark flex items-center justify-center" role="status">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
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
    </Suspense>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const standaloneTools = ["/test-bienestar", "/calculadora-burnout"];
  const isStandaloneTool = standaloneTools.includes(location);
  const [, setLocation] = useLocation();
  // Mostrar splash solo si no se ha visto ya en esta sesión/cuenta
  const [showSplash, setShowSplash] = useState(() => !hasSplashBeenShown() && !isStandaloneTool);

  // Si auth carga y el usuario ya vio el splash → saltarlo
  useEffect(() => {
    if (isLoading) return;
    if (hasSplashBeenShown()) setShowSplash(false);
  }, [isLoading, isAuthenticated]);

  // Only show floating CTA on public pages and for non-authenticated users
  const showFloatingCTA = !isAuthenticated && 
    (location === "/" || location === "/ejemplos-chat" || location === "/precios" || 
     location === "/app-movil" || location === "/nosotros" || location === "/control-parental" || location === "/blog");

  if (showSplash && !isStandaloneTool) {
    return <SplashScreen onFinish={() => {
      markSplashShown(isAuthenticated); // sessionStorage siempre; localStorage si tiene cuenta
      setShowSplash(false);
      setLocation("/bienvenida");
    }} />;
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
