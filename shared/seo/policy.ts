/** Crawl/index policy is not access control; existing API/session checks remain. */
export function isNonIndexablePath(path: string): boolean {
  const clean = path.split(/[?#]/)[0];
  return /^\/(?:api|admin|account|private|chat|acceso)(?:\/|$)/.test(clean) ||
    /^\/partners\/(?:dashboard|login|register)(?:\/|$)/.test(clean) ||
    /^\/(?:login|registro|payment-redirect|stripe-return|activar-stripe|stripe-manual|activar|activar-cuenta|activacion-exitosa|download-csv|control-shell)(?:\/|$)/.test(clean);
}