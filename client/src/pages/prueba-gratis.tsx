import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/SEOHead";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  LockKeyhole,
  Mail,
  MessageCircle,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

type TrialStatus = {
  cupoLleno: boolean;
  used: number;
  cap: number;
  existingTrialUser?: { username: string; email: string };
  verificationRequired?: boolean;
};

type FlowResponse = {
  flowId: string;
  step: "email";
  expiresAt: string;
  resendAfterSeconds: number;
};

type Stage = "details" | "email" | "sms";

const fieldClass =
  "h-12 bg-white/[0.07] border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-indigo-300 focus-visible:border-indigo-300";

function safeErrorMessage(error: unknown, stage: Stage): string {
  const raw = error instanceof Error ? error.message : "";
  const status = Number(raw.match(/^\s*(\d{3})/)?.[1] || 0);
  const jsonStart = raw.indexOf("{");
  let code = "";
  let serverMessage = "";
  if (jsonStart >= 0) {
    try {
      const payload = JSON.parse(raw.slice(jsonStart));
      code = String(payload?.code || "").toLowerCase();
      serverMessage = String(payload?.message || "").toLowerCase();
    } catch {
      // Never display unparsed server or transport text.
    }
  }
  const hint = `${code} ${serverMessage}`;

  if (code === "sms_budget_exhausted") {
    return "No podemos enviar más SMS de verificación este mes. Vuelve a intentarlo el próximo mes.";
  }
  if (code === "flow_expired") {
    return "La verificación ha caducado. Usa «Empezar de nuevo» para recibir nuevos códigos.";
  }
  if (code === "code_attempts") {
    return "Se han agotado los intentos para este código. Solicita uno nuevo.";
  }
  if (code === "trial_unavailable") {
    return "No podemos activar otra prueba con estos datos. Hay una sola prueba por móvil; si ya tienes cuenta, inicia sesión o elige un plan.";
  }
  if (["already_used", "trial_used", "phone_used"].some((term) => hint.includes(term)) ||
      (hint.includes("móvil") && (hint.includes("utilizado") || hint.includes("registrado")))) {
    return "Este móvil ya se ha utilizado para una prueba gratuita. La prueba está limitada a una por número.";
  }
  if (hint.includes("sms") && ["unavailable", "disabled", "failed", "not available"].some((term) => hint.includes(term))) {
    return "No ha sido posible enviar el SMS ahora. Comprueba el número o inténtalo más tarde.";
  }
  if (["expired", "invalid_code", "wrong_code", "incorrect code", "código incorrecto", "código no válido", "caducado"].some((term) => hint.includes(term))) {
    return stage === "email"
      ? "El código no es válido o ha caducado. Revisa el correo y vuelve a intentarlo."
      : "El código no es válido o ha caducado. Solicita uno nuevo e inténtalo otra vez.";
  }
  if (["duplicate", "username_taken", "already exists", "ya existe"].some((term) => hint.includes(term)) || status === 409) {
    return "No se ha podido usar ese nombre o correo. Comprueba los datos o inicia sesión si ya tienes una cuenta.";
  }
  if (["capacity", "trial_full", "cupo", "pruebas no disponibles"].some((term) => hint.includes(term))) {
    return "Ahora mismo no hay pruebas disponibles. Puedes volver a intentarlo más adelante.";
  }
  if (status === 429) {
    return "Has realizado demasiados intentos seguidos. Espera un momento antes de volver a intentarlo.";
  }
  if (stage === "email") return "No se ha podido verificar el correo. Comprueba el código e inténtalo de nuevo.";
  if (stage === "sms") return "No se ha podido completar la verificación del móvil. Inténtalo de nuevo.";
  return "No se ha podido iniciar la prueba. Revisa los datos e inténtalo de nuevo.";
}

function isCapacityError(error: unknown): boolean {
  const raw = error instanceof Error ? error.message : "";
  const jsonStart = raw.indexOf("{");
  if (jsonStart < 0) return false;
  try {
    const payload = JSON.parse(raw.slice(jsonStart));
    const hint = `${payload?.code || ""} ${payload?.message || ""}`.toLowerCase();
    return ["capacity", "trial_full", "cupo", "pruebas no disponibles"].some((term) => hint.includes(term));
  } catch {
    return false;
  }
}

function cleanCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

export default function PruebaGratis() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<TrialStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [form, setForm] = useState({ username: "", email: "", password: "", phone: "" });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [stage, setStage] = useState<Stage>("details");
  const [flowId, setFlowId] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const existing = status?.existingTrialUser;
  const isLegacyUnverified = Boolean(existing && status?.verificationRequired);
  const isVerifiedExisting = Boolean(existing && status?.verificationRequired === false);

  const loadStatus = async () => {
    setChecking(true);
    setStatusError("");
    try {
      const response = await apiRequest("GET", "/api/prueba-gratis/estado");
      setStatus(await response.json());
    } catch {
      setStatusError("No hemos podido comprobar la disponibilidad. Comprueba tu conexión e inténtalo otra vez.");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const startOver = () => {
    setStage("details");
    setFlowId("");
    setEmailCode("");
    setSmsCode("");
    setSmsSent(false);
    setCooldown(0);
    setError("");
    setNotice("");
    setBusy(false);
  };

  const validateDetails = () => {
    const username = isLegacyUnverified ? existing?.username || "" : form.username;
    const email = isLegacyUnverified ? existing?.email || "" : form.email;
    if (!username.trim() || !email.trim() || !form.phone.trim()) {
      return "Completa todos los campos para continuar.";
    }
    if (!isLegacyUnverified && (username.trim().length < 3 || username.trim().length > 60)) {
      return "El nombre de usuario debe tener entre 3 y 60 caracteres.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Introduce un correo electrónico válido.";
    }
    if (!isLegacyUnverified && form.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/^\+[1-9]\d{7,14}$/.test(form.phone.replace(/[\s()-]/g, ""))) {
      return "Introduce el móvil en formato internacional, por ejemplo +34612345678.";
    }
    if (!privacyAccepted) {
      return "Debes aceptar la política de privacidad para verificar tu móvil.";
    }
    return "";
  };

  const handleStart = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const validation = validateDetails();
    setError(validation);
    setNotice("");
    if (validation) return;

    setBusy(true);
    try {
      const data: Record<string, unknown> = {
        username: isLegacyUnverified ? existing!.username : form.username.trim(),
        email: isLegacyUnverified ? existing!.email : form.email.trim(),
        phone: form.phone.replace(/[\s()-]/g, ""),
        privacyAccepted: true,
      };
      if (!isLegacyUnverified) data.password = form.password;
      const response = await apiRequest("POST", "/api/prueba-gratis/iniciar", data);
      const result: FlowResponse = await response.json();
      setFlowId(result.flowId);
      setStage("email");
      setEmailCode("");
      setCooldown(Math.max(0, Number(result.resendAfterSeconds) || 0));
      setNotice("Te hemos enviado un código de seis cifras a tu correo.");
      setError("");
    } catch (requestError) {
      if (isCapacityError(requestError)) {
        setStatus((current) => current ? { ...current, cupoLleno: true } : current);
      }
      setError(safeErrorMessage(requestError, "details"));
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyEmail = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !flowId) return;
    if (emailCode.length !== 6) {
      setError("Introduce el código de seis cifras que hemos enviado a tu correo.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("POST", "/api/prueba-gratis/verificar-correo", { flowId, code: emailCode });
      setStage("sms");
      setSmsSent(false);
      setSmsCode("");
      setCooldown(0);
      setNotice("Correo verificado. Envía ahora el código al móvil para continuar.");
    } catch (requestError) {
      setError(safeErrorMessage(requestError, "email"));
    } finally {
      setBusy(false);
    }
  };

  const sendCode = async (channel: "email" | "sms") => {
    if (busy || !flowId || cooldown > 0) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await apiRequest("POST", "/api/prueba-gratis/enviar-codigo", { flowId, channel });
      const result = await response.json();
      setCooldown(Math.max(0, Number(result.resendAfterSeconds) || 0));
      if (channel === "sms") {
        setSmsSent(true);
        setSmsCode("");
        setNotice("Código enviado. Puede tardar un momento en llegar.");
      } else {
        setEmailCode("");
        setNotice("Hemos enviado un nuevo código a tu correo.");
      }
    } catch (requestError) {
      setError(safeErrorMessage(requestError, channel === "sms" ? "sms" : "email"));
    } finally {
      setBusy(false);
    }
  };

  const finishTrial = async (isNewTrial: boolean) => {
    if (isNewTrial) {
      trackEvent("registration_succeeded", {
        registration_type: "free_trial",
        destination: "chat",
      });
    }
    try {
      const response = await apiRequest("POST", "/api/conversations", { title: "Mi primera consulta" });
      const conversation = await response.json();
      window.location.href = `/chat/${conversation.id}`;
    } catch {
      window.location.href = "/chat";
    }
  };

  const handleVerifyPhone = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !flowId || !smsSent) return;
    if (smsCode.length !== 6) {
      setError("Introduce el código de seis cifras que hemos enviado a tu móvil.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("POST", "/api/prueba-gratis/verificar-movil", { flowId, code: smsCode });
      await finishTrial(true);
    } catch (requestError) {
      setError(safeErrorMessage(requestError, "sms"));
      setBusy(false);
    }
  };

  const continueToChat = async () => {
    if (busy) return;
    setBusy(true);
    await finishTrial(false);
  };

  const atCapacity = Boolean(status?.cupoLleno) && !existing;
  const stepNumber = stage === "details" ? 1 : stage === "email" ? 2 : 3;

  return (
    <>
      <SEOHead
        title="Prueba NUXA gratis – 5 consultas sin coste"
        description="Prueba NUXA con cinco preguntas de bienestar emocional. Verificación de correo y móvil; sin renovación mensual."
        canonicalUrl="/prueba-gratis"
      />
      <main className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-1.5 text-sm font-medium text-indigo-200 mb-5">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Un espacio para empezar
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              Prueba NUXA gratis
            </h1>
            <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
              Cinco preguntas para explorar cómo te sientes, con calma y a tu ritmo.
            </p>
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:p-6 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: MessageSquareText, title: "5 preguntas", detail: "Una prueba por número móvil" },
                { icon: LockKeyhole, title: "Sin renovación", detail: "No se inicia ningún cobro mensual" },
                { icon: ShieldCheck, title: "Privado", detail: "Verificamos correo y móvil" },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 rounded-xl bg-white/[0.035] px-3 py-3">
                  <Icon className="h-5 w-5 shrink-0 text-indigo-300" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{title}</p>
                    <p className="text-xs leading-relaxed text-slate-400">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">
              NUXA es una herramienta de bienestar emocional y no sustituye la atención ni el consejo de profesionales clínicos.
            </div>
          </section>

          {checking ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-8" role="status" aria-live="polite">
              <div className="h-2 w-28 rounded-full bg-indigo-300/20 animate-pulse mx-auto mb-4" />
              <div className="h-4 w-48 rounded bg-white/10 animate-pulse mx-auto mb-2" />
              <div className="h-3 w-36 rounded bg-white/10 animate-pulse mx-auto" />
              <span className="sr-only">Comprobando disponibilidad…</span>
            </div>
          ) : statusError ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 text-center" role="alert">
              <p className="text-sm text-slate-300 mb-4">{statusError}</p>
              <Button onClick={() => void loadStatus()} variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                Volver a intentar
              </Button>
            </div>
          ) : isVerifiedExisting ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 sm:p-7 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                <Check className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Tu cuenta ya está verificada</h2>
              <p className="text-sm text-slate-400 mb-6">Continúa a tu espacio de conversación.</p>
              <Button onClick={() => void continueToChat()} disabled={busy} className="w-full h-12 bg-indigo-500 hover:bg-indigo-400 text-white">
                {busy ? "Abriendo tu espacio…" : "Continuar al chat"}
                {!busy && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
              </Button>
            </div>
          ) : atCapacity ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-6 sm:p-7 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Pruebas no disponibles ahora</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                En este momento no podemos ofrecer nuevas pruebas. No se realizará ningún cargo ni renovación mensual.
              </p>
              <Button onClick={() => setLocation("/")} variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                Volver al inicio
              </Button>
            </div>
          ) : (
            <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:p-7">
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Verificación segura</span>
                  <span>Paso {stepNumber} de 3</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10" aria-label={`Paso ${stepNumber} de 3`}>
                  <div className="h-full rounded-full bg-indigo-300 transition-all duration-300" style={{ width: `${(stepNumber / 3) * 100}%` }} />
                </div>
              </div>

              {stage === "details" && (
                <form onSubmit={handleStart} className="space-y-4" noValidate>
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold text-white">{isLegacyUnverified ? "Confirma tus datos" : "Crea tu acceso"}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {isLegacyUnverified
                        ? "Tu cuenta ya existe. Verifica el correo y el móvil para continuar."
                        : "Verificaremos ambos contactos antes de abrir la prueba."}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="username" className="mb-1.5 block text-sm text-slate-300">Nombre de usuario</Label>
                    <Input
                      id="username"
                      value={isLegacyUnverified ? existing?.username || "" : form.username}
                      readOnly={isLegacyUnverified}
                      onChange={(event) => setForm({ ...form, username: event.target.value })}
                      autoComplete="username"
                      className={fieldClass}
                      placeholder="mi_usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-1.5 block text-sm text-slate-300">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isLegacyUnverified ? existing?.email || "" : form.email}
                      readOnly={isLegacyUnverified}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      autoComplete="email"
                      className={fieldClass}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {!isLegacyUnverified && (
                    <div>
                      <Label htmlFor="password" className="mb-1.5 block text-sm text-slate-300">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(event) => setForm({ ...form, password: event.target.value })}
                        autoComplete="new-password"
                        minLength={8}
                        className={fieldClass}
                        placeholder="Al menos 8 caracteres"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="phone" className="mb-1.5 block text-sm text-slate-300">Móvil con prefijo internacional</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        autoComplete="tel"
                        inputMode="tel"
                        className={`${fieldClass} pl-10`}
                        placeholder="+34612345678"
                        aria-describedby="phone-help"
                      />
                    </div>
                    <p id="phone-help" className="mt-1.5 text-xs text-slate-500">Incluye + y el código de país. Ejemplo: +34 612 345 678.</p>
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(event) => setPrivacyAccepted(event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-indigo-400"
                    />
                    <span className="text-xs leading-relaxed text-slate-300">
                      Acepto la{" "}
                      <a href="/legal/privacidad" target="_blank" rel="noreferrer" className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
                        política de privacidad
                      </a>
                      . Usaremos mi móvil solo para verificar mi identidad y prevenir abusos; no haremos llamadas comerciales.
                    </span>
                  </label>

                  {error && <p className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200" role="alert">{error}</p>}
                  <Button type="submit" disabled={busy} className="h-12 w-full bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-60">
                    {busy ? "Preparando verificación…" : "Continuar"}
                    {!busy && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
                  </Button>
                  <p className="text-center text-xs leading-relaxed text-slate-500">
                    Sin tarjeta, sin renovación mensual y una prueba por número de móvil.
                  </p>
                </form>
              )}

              {stage === "email" && (
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div className="mb-5">
                    <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-indigo-300/10 text-indigo-200">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Confirma tu correo</h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      Introduce el código de seis cifras que enviamos a <span className="text-slate-200">{isLegacyUnverified ? existing?.email : form.email}</span>.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="email-code" className="mb-1.5 block text-sm text-slate-300">Código de verificación</Label>
                    <Input
                      id="email-code"
                      value={emailCode}
                      onChange={(event) => setEmailCode(cleanCode(event.target.value))}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      aria-label="Código de seis cifras enviado por correo"
                      className={`${fieldClass} text-center text-xl tracking-[0.45em] font-semibold`}
                      placeholder="••••••"
                    />
                  </div>
                  {error && <p className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200" role="alert">{error}</p>}
                  {notice && <p className="text-sm text-emerald-200" role="status">{notice}</p>}
                  <Button type="submit" disabled={busy || emailCode.length !== 6} className="h-12 w-full bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-60">
                    {busy ? "Verificando…" : "Verificar correo"}
                    {!busy && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => void sendCode("email")} disabled={busy || cooldown > 0} className="w-full text-slate-300 hover:bg-white/5 hover:text-white">
                    {cooldown > 0 ? `Reenviar código en ${cooldown}s` : "Reenviar código"}
                  </Button>
                  <button type="button" onClick={startOver} className="flex w-full items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Corregir mis datos
                  </button>
                </form>
              )}

              {stage === "sms" && (
                <form onSubmit={handleVerifyPhone} className="space-y-4">
                  <div className="mb-5">
                    <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-indigo-300/10 text-indigo-200">
                      <Smartphone className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Verifica tu móvil</h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      Enviaremos un único código a <span className="text-slate-200">{form.phone}</span>. No realizamos llamadas comerciales.
                    </p>
                  </div>
                  {!smsSent ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="mb-4 text-sm text-slate-300">El SMS solo se envía cuando lo solicitas.</p>
                      <Button type="button" onClick={() => void sendCode("sms")} disabled={busy} className="h-12 w-full bg-indigo-500 text-white hover:bg-indigo-400">
                        {busy ? "Enviando código…" : "Enviar código por SMS"}
                        {!busy && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="sms-code" className="mb-1.5 block text-sm text-slate-300">Código de verificación</Label>
                        <Input
                          id="sms-code"
                          value={smsCode}
                          onChange={(event) => setSmsCode(cleanCode(event.target.value))}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          aria-label="Código de seis cifras enviado por SMS"
                          className={`${fieldClass} text-center text-xl tracking-[0.45em] font-semibold`}
                          placeholder="••••••"
                        />
                      </div>
                      <Button type="submit" disabled={busy || smsCode.length !== 6} className="h-12 w-full bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-60">
                        {busy ? "Verificando…" : "Completar verificación"}
                        {!busy && <CheckCircle className="ml-2 h-4 w-4" aria-hidden="true" />}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => void sendCode("sms")} disabled={busy || cooldown > 0} className="w-full text-slate-300 hover:bg-white/5 hover:text-white">
                        {cooldown > 0 ? `Reenviar SMS en ${cooldown}s` : "Reenviar SMS"}
                      </Button>
                    </>
                  )}
                  {error && <p className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200" role="alert">{error}</p>}
                  {notice && <p className="text-sm text-emerald-200" role="status">{notice}</p>}
                  <button type="button" onClick={startOver} className="flex w-full items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Corregir mis datos
                  </button>
                </form>
              )}
            </section>
          )}

          <p className="mt-5 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <button type="button" onClick={() => setLocation("/login")} className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
              Inicia sesión
            </button>
          </p>
          <p className="mt-3 text-center text-xs leading-relaxed text-slate-600">
            Tu prueba incluye hasta cinco preguntas. No hay renovación ni cargos automáticos.
          </p>
        </div>
      </main>
    </>
  );
}
