import { useEffect, useState } from "react";
import { useLocation } from "wouter";

type GoogleConfig = { enabled: boolean };

export function GoogleEntryButton({ className = "" }: { className?: string }) {
  const [, setLocation] = useLocation();
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/google/config", {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Google access is not available");
        return response.json() as Promise<GoogleConfig>;
      })
      .then((config) => setEnabled(config.enabled === true))
      .catch(() => {
        if (!controller.signal.aborted) setEnabled(false);
      });
    return () => controller.abort();
  }, []);

  const available = enabled === true;
  const label = enabled === null
    ? "Comprobando acceso con Google…"
    : available
      ? "Continuar con Google"
      : "Acceso con Google en preparación";

  return (
    <div className={className}>
      <button
        type="button"
        disabled={!available}
        onClick={() => setLocation("/sign-in")}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-none"
      >
        <GoogleMark />
        <span>{label}</span>
      </button>
      {enabled === false && (
        <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">
          Puedes continuar con el método habitual mientras se activa esta opción.
        </p>
      )}
      {available && (
        <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">
          NUXA solo solicita tu identidad, no acceso al contenido de tu correo.
        </p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 5)" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.43 38.05 46.98 31.95 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.96 23.96 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 5)" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.88 2.3-8.18 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}
