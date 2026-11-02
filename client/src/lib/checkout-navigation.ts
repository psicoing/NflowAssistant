const KEY = "nuxa_checkout_return";
const allowed = (value: string) => value === "/activar-cuenta" ||
  /^\/registro\/planes\?plan=(basico|pro|anual)$/.test(value);

/** Persist only an allowlisted choice, never an email, payment token or external URL. */
export function requireCheckoutLogin(returnTo: string) {
  if (allowed(returnTo)) sessionStorage.setItem(KEY, returnTo);
  window.location.href = "/login";
}
export function requireCheckoutRegistration(returnTo: string) {
  if (allowed(returnTo)) sessionStorage.setItem(KEY, returnTo);
  window.location.href = "/prueba-gratis";
}
export function takeCheckoutReturn() {
  const value = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  return value && allowed(value) ? value : null;
}
export function hasCheckoutReturn() {
  const value = sessionStorage.getItem(KEY);
  return !!value && allowed(value);
}
