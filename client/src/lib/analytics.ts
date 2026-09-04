export type AnalyticsData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track(name: string, data?: AnalyticsData): void;
    };
  }
}

function hasAnalyticsConsent(): boolean {
  try {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) return false;
    return JSON.parse(consent)?.analytics === true;
  } catch {
    return false;
  }
}

export function trackEvent(name: string, data?: AnalyticsData): void {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics must never interrupt the user journey.
  }
}