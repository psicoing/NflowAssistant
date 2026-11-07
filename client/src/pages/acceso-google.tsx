import { useClerk } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { takeCheckoutReturn } from "@/lib/checkout-navigation";

type GoogleStatus = {
  csrfToken: string;
  state: "linked" | "onboarding";
  email: string;
  enabled: true;
};

type BridgeMode = "new" | "link";

function getErrorDetails(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const match = message.match(/^\s*(\d{3})\s*:\s*([\s\S]*)$/);
  const status = Number(match?.[1] || 0);
  let code = "";
  if (match?.[2]) {
    try {
      const payload = JSON.parse(match[2]);
      code = String(payload?.code || "").toUpperCase();
    } catch {
      // Only use a stable code; never show raw server responses.
    }
  }
  return { status, code };
}

function ageFromBirthDate(value: string) {
  if (!value) return null;
  const birthDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export default function GoogleAccountBridge() {
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<GoogleStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [mode, setMode] = useState<BridgeMode>("new");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [noticeAccepted, setNoticeAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    setChecking(true);
    setStatusError("");
    try {
      const response = await fetch("/api/auth/google/status", {
        credentials: "include",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("Google todavía no está activado en NUXA. Puedes entrar con tu método habitual.");
        }
        throw new Error("No se ha podido verificar el acceso con Google. Inténtalo de nuevo o usa tu acceso habitual.");
      }
      if (!data?.csrfToken || !["linked", "onboarding"].includes(data?.state) || data?.enabled !== true) {
        throw new Error("No se ha podido iniciar el acceso de forma segura. Usa tu acceso habitual.");
      }
      setStatus(data as GoogleStatus);
      setMode("new");
    } catch (requestError) {
      setStatusError(
        requestError instanceof Error
          ? requestError.message
          : "No se ha podido verificar el acceso con Google. Usa tu acceso habitual.",
      );
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  const complete = async (action: "login" | "link" | "register", formData?: Record<string, unknown>) => {
    if (!status || busy) return;
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/google/complete", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-NUXA-CSRF": status.csrfToken,
        },
        body: JSON.stringify({ action, ...formData }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 409 && String(data?.code || "").toUpperCase() === "ACCOUNT_EXISTS") {
          setMode("link");
          setPassword("");
          setError("Ya existe una cuenta NUXA con estos datos. Para protegerla, confirma tu usuario y contraseña.");
          return;
        }
        throw new Error("No se ha podido completar el acceso. Revisa los datos e inténtalo otra vez.");
      }
      if (data?.success !== true || data?.userId == null) {
        throw new Error("La respuesta de acceso no es válida. Inténtalo de nuevo.");
      }

      localStorage.setItem("userId", String(data.userId));
      const meResponse = await fetch("/api/auth/me", { credentials: "include" });
      if (!meResponse.ok) throw new Error("La cuenta está vinculada, pero no se pudo cargar tu sesión. Intenta acceder de nuevo.");
      const me = await meResponse.json();
      queryClient.clear();
      queryClient.setQueryData(["/api/auth/me"], me);
      const destination = takeCheckoutReturn() || (me.hasActiveSubscription === true ? "/chat" : "/prueba-gratis");
      setLocation(destination);
    } catch (requestError) {
      const details = getErrorDetails(requestError);
      if (details.status === 409 && details.code === "ACCOUNT_EXISTS") {
        setMode("link");
        setPassword("");
        setError("Ya existe una cuenta NUXA con estos datos. Para protegerla, confirma tu usuario y contraseña.");
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se ha podido completar el acceso. Inténtalo de nuevo.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!status) return;

    if (status.state === "linked") {
      await complete("login");
      return;
    }

    if (mode === "link") {
      if (!username.trim() || !password) {
        setError("Introduce tu nombre de usuario y contraseña de NUXA.");
        return;
      }
      await complete("link", { username: username.trim(), password });
      return;
    }

    const age = ageFromBirthDate(birthDate);
    if (age === null || age < 18 || age > 95) {
      setError("Para crear una cuenta debes tener entre 18 y 95 años.");
      return;
    }
    if (!noticeAccepted) {
      setError("Lee y acepta el aviso legal de NUXA para continuar.");
      return;
    }
    await complete("register", {
      birthDate,
      acceptedNuxaNotice: true,
      noticeVersion: "google-onboarding-v1",
    });
  };

  const handleGoogleLogout = async () => {
    try {
      await signOut();
    } catch {
      // Still leave the bridge if the identity provider session is unavailable.
    } finally {
      setLocation("/login");
    }
  };

  const linked = status?.state === "linked";
  const submitLabel = busy
    ? "Conectando con NUXA…"
    : linked
      ? "Continuar con NUXA"
      : mode === "link"
        ? "Vincular mi cuenta"
        : "Crear mi acceso NUXA";

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#e8edf5] px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-[#fbfaf7] p-6 shadow-[0_24px_70px_rgba(26,33,58,0.16)] sm:p-9">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al acceso habitual
        </Link>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Acceso seguro · NUXA</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Un paso más para entrar
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Google confirma tu identidad. NUXA no solicita acceso al contenido de tu correo.
        </p>

        {checking ? (
          <div className="mt-7 space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-5" role="status" aria-live="polite">
            <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
            <span className="sr-only">Comprobando el estado de tu cuenta NUXA…</span>
          </div>
        ) : statusError ? (
          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5" role="alert">
            <p className="text-sm leading-relaxed text-amber-950">{statusError}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => void loadStatus()} className="border-amber-300 bg-white text-amber-950 hover:bg-amber-100">
                Volver a intentar
              </Button>
              <Button type="button" onClick={() => setLocation("/login")} className="bg-indigo-700 text-white hover:bg-indigo-800">
                Ir al acceso habitual
              </Button>
            </div>
          </div>
        ) : status ? (
          <>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">Identidad confirmada</p>
                <p className="truncate text-sm font-semibold text-slate-800">{status.email}</p>
              </div>
            </div>

            {linked ? (
              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                Esta identidad ya está vinculada a NUXA. Continúa para iniciar tu sesión local.
              </p>
            ) : mode === "new" ? (
              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                Puedes crear una cuenta nueva o vincular una cuenta NUXA existente. Nunca vincularemos cuentas automáticamente por correo.
              </p>
            ) : null}

            {error && (
              <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-800" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={submit} className="mt-5 space-y-4">
              {!linked && mode === "new" && (
                <>
                  <div>
                    <Label htmlFor="google-birth-date" className="mb-2 block text-sm font-medium text-slate-700">Fecha de nacimiento</Label>
                    <Input
                      id="google-birth-date"
                      type="date"
                      value={birthDate}
                      onChange={(event) => setBirthDate(event.target.value)}
                      required
                      autoComplete="bday"
                      className="h-12 border-slate-300 bg-white text-slate-800"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Necesitas tener entre 18 y 95 años para crear la cuenta.</p>
                  </div>
                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/70 p-3.5">
                    <input
                      type="checkbox"
                      checked={noticeAccepted}
                      onChange={(event) => setNoticeAccepted(event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-indigo-700"
                    />
                    <span className="text-xs leading-relaxed text-slate-600">
                      He leído y acepto el{" "}
                      <Link href="/legal/aviso-legal" className="font-medium text-indigo-700 underline underline-offset-2">aviso legal</Link>
                      {" "}y la{" "}
                      <Link href="/legal/privacidad" className="font-medium text-indigo-700 underline underline-offset-2">política de privacidad</Link>
                      {" "}de NUXA.
                    </span>
                  </label>
                </>
              )}

              {!linked && mode === "link" && (
                <>
                  <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-sm leading-relaxed text-indigo-950">
                    <KeyRound className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <p>Por seguridad, confirma una vez las credenciales de tu cuenta NUXA. Las cuentas de administración solo pueden usar el acceso habitual.</p>
                  </div>
                  <div>
                    <Label htmlFor="nuxa-username" className="mb-2 block text-sm font-medium text-slate-700">Nombre de usuario NUXA</Label>
                    <Input
                      id="nuxa-username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      autoComplete="username"
                      required
                      className="h-12 border-slate-300 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nuxa-password" className="mb-2 block text-sm font-medium text-slate-700">Contraseña NUXA</Label>
                    <Input
                      id="nuxa-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                      className="h-12 border-slate-300 bg-white text-slate-800"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Al vincular, se aplican las{" "}
                    <Link href="/legal/terminos" className="font-medium text-indigo-700 underline underline-offset-2">condiciones de uso</Link>
                    {" "}y la{" "}
                    <Link href="/legal/privacidad" className="font-medium text-indigo-700 underline underline-offset-2">política de privacidad</Link>.
                  </p>
                </>
              )}

              <Button type="submit" disabled={busy} className="h-12 w-full bg-indigo-700 text-white hover:bg-indigo-800 disabled:opacity-60">
                {submitLabel}
                {!busy && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
              </Button>
            </form>

            {!linked && mode === "new" && (
              <button
                type="button"
                onClick={() => { setMode("link"); setError(""); }}
                className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900"
              >
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Ya tengo una cuenta NUXA
              </button>
            )}
            {!linked && mode === "link" && (
              <button
                type="button"
                onClick={() => { setMode("new"); setError(""); }}
                className="mt-5 flex w-full items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Volver a crear una cuenta nueva
              </button>
            )}
          </>
        ) : null}
        <div className="mt-7 border-t border-slate-200 pt-5 text-center">
          <button type="button" onClick={() => void handleGoogleLogout()} className="text-sm text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-800">
            Cerrar sesión de Google y volver al acceso habitual
          </button>
        </div>
      </section>
    </main>
  );
}
