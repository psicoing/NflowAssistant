import { ClerkProvider, SignIn, SignUp } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { esES } from "@clerk/localizations";
import { Link, Route, Switch, useLocation } from "wouter";
import GoogleAccountBridge from "@/pages/acceso-google";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/favicon.png`,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#5b63b8",
    colorForeground: "#263247",
    colorMutedForeground: "#667085",
    colorDanger: "#b42318",
    colorBackground: "#fbfaf7",
    colorInput: "#ffffff",
    colorInputForeground: "#263247",
    colorNeutral: "#263247",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    borderRadius: "0.8rem",
  },
  elements: {
    rootBox: { width: "100%", display: "flex", justifyContent: "center" },
    cardBox: {
      width: "440px",
      maxWidth: "100%",
      overflow: "hidden",
      borderRadius: "1.25rem",
      background: "#fbfaf7",
      boxShadow: "0 24px 70px rgba(26, 33, 58, 0.18)",
    },
    card: { background: "transparent", boxShadow: "none", border: "0" },
    footer: { background: "transparent", boxShadow: "none", border: "0" },
    headerTitle: { color: "#263247", fontWeight: "700" },
    headerSubtitle: { color: "#667085" },
    socialButtonsBlockButtonText: { color: "#263247", fontWeight: "600" },
    formFieldLabel: { color: "#344054", fontWeight: "600" },
    formFieldInput: {
      color: "#263247",
      background: "#ffffff",
      borderColor: "#d0d5dd",
    },
    footerActionLink: { color: "#5159aa", fontWeight: "600" },
    footerActionText: { color: "#667085" },
    dividerText: { color: "#667085" },
    identityPreviewEditButton: { color: "#5159aa" },
    formFieldSuccessText: { color: "#067647" },
    alertText: { color: "#b42318" },
    logoBox: { marginBottom: "0.5rem" },
    logoImage: { width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem" },
    socialButtonsBlockButton: {
      background: "#ffffff",
      border: "1px solid #d0d5dd",
      borderRadius: "0.8rem",
    },
    formButtonPrimary: {
      background: "#555eae",
      color: "#ffffff",
      borderRadius: "0.8rem",
      boxShadow: "none",
    },
    dividerLine: { background: "#e4e7ec" },
    alert: { background: "#fef3f2", borderRadius: "0.75rem" },
    otpCodeFieldInput: { color: "#263247" },
    formFieldRow: { gap: "0.4rem" },
    main: { gap: "1rem" },
    // This is Google-only identity verification, not a second email/password registry.
    form: { display: "none" },
    dividerRow: { display: "none" },
    footerAction: { display: "none" },
  },
};

function ClerkSignInPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#e8edf5] px-4 py-10">
      <div className="w-full max-w-xl">
        <p className="mb-6 text-center text-sm font-medium tracking-wide text-slate-600">
          NUXA <span className="mx-2 text-slate-400">/</span> Tu bienestar, a tu ritmo
        </p>
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
          forceRedirectUrl={`${basePath}/acceso-google`}
        />
        <p className="mt-5 text-center text-sm text-slate-600">
          ¿Utilizas tu usuario y contraseña de NUXA?{" "}
          <Link href="/login" className="font-semibold text-indigo-700 underline">Acceso habitual</Link>
        </p>
      </div>
    </main>
  );
}

function ClerkSignUpPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#e8edf5] px-4 py-10">
      <div className="w-full max-w-xl">
        <p className="mb-6 text-center text-sm font-medium tracking-wide text-slate-600">
          NUXA <span className="mx-2 text-slate-400">/</span> Un espacio para empezar
        </p>
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
          forceRedirectUrl={`${basePath}/acceso-google`}
        />
        <p className="mt-5 text-center text-sm text-slate-600">
          <Link href="/login" className="font-semibold text-indigo-700 underline">Volver al acceso habitual de NUXA</Link>
        </p>
      </div>
    </main>
  );
}

export default function ClerkScopedRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        ...esES,
        signIn: {
          ...esES.signIn,
          start: {
            ...esES.signIn?.start,
            title: "Entra en NUXA",
            subtitle: "Continúa con tu cuenta para seguir cuidando de ti.",
          },
        },
        signUp: {
          ...esES.signUp,
          start: {
            ...esES.signUp?.start,
            title: "Empieza en NUXA",
            subtitle: "Tu espacio de bienestar emocional comienza aquí.",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <Switch>
        <Route path="/sign-in/*?" component={ClerkSignInPage} />
        <Route path="/sign-up/*?" component={ClerkSignUpPage} />
        <Route path="/acceso-google" component={GoogleAccountBridge} />
      </Switch>
    </ClerkProvider>
  );
}
