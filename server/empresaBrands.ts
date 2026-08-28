import fetch from "node-fetch";
import { getConfiguredSendGridFromEmail } from "./sendgridClient";

export type EmpresaBrand = "nuxa" | "jobda" | "empordajobs";

export interface EmpresaBrandProfile {
  id: EmpresaBrand;
  name: string;
  tagline: string;
  description: string;
  website?: string;
  contact: string;
  contactPhone: string;
  fromName: string;
  fromEmail: string | null;
  allowedDomains: string[];
  icon: string;
  gradient: string;
  softBackground: string;
  accent: string;
  legalFooter: string;
}

export interface EmpresaBrandStatus {
  id: EmpresaBrand;
  name: string;
  tagline: string;
  description: string;
  website?: string;
  contact: string;
  contactPhone: string;
  icon: string;
  gradient: string;
  softBackground: string;
  accent: string;
  from: string | null;
  configured: boolean;
  verified: boolean;
  available: boolean;
  message: string;
}

export const EMPRESA_SHARED_FROM_EMAIL = "rmportbou@gmail.com";
export const EMPRESA_SHARED_CONTACT_PHONE = "+34 660452136";
export const EMPRESA_LEGACY_NUXA_FROM_EMAIL = "hola@nuxa.life";

const profiles: Record<EmpresaBrand, EmpresaBrandProfile> = {
  nuxa: {
    id: "nuxa",
    name: "NUXA",
    tagline: "Apoyo emocional profesional · ISO 45003",
    description: "Bienestar emocional y apoyo psicológico digital para equipos.",
    website: "https://nuxa.life",
    contact: EMPRESA_SHARED_FROM_EMAIL,
    contactPhone: EMPRESA_SHARED_CONTACT_PHONE,
    fromName: "NUXA",
    fromEmail: EMPRESA_SHARED_FROM_EMAIL,
    allowedDomains: ["gmail.com"],
    icon: "🧠",
    gradient: "linear-gradient(135deg,#1e40af,#3b82f6)",
    softBackground: "#f0f4ff",
    accent: "#2563eb",
    legalFooter: "NUXA · Empordajobs SL · B02701100 · nuxa.life",
  },
  jobda: {
    id: "jobda",
    name: "JOBDA",
    tagline: "Desarrollo avanzado de software · IA para empresas",
    description: "Servicio de desarrollo personalizado de apps con IA para la transformación digital de tu empresa.",
    website: "https://jobda.org",
    contact: EMPRESA_SHARED_FROM_EMAIL,
    contactPhone: EMPRESA_SHARED_CONTACT_PHONE,
    fromName: "JOBDA",
    fromEmail: EMPRESA_SHARED_FROM_EMAIL,
    allowedDomains: ["gmail.com"],
    icon: "⚙️",
    gradient: "linear-gradient(135deg,#5b21b6,#9333ea)",
    softBackground: "#faf5ff",
    accent: "#7c3aed",
    legalFooter: "JOBDA · filial de EMPORDAJOBS SL · B02701100 · jobda.org",
  },
  empordajobs: {
    id: "empordajobs",
    name: "EMPORDAJOBS",
    tagline: "RR. HH. inteligente · Ingeniería y tecnología",
    description: "Plataforma de empleo y gestión de recursos humanos para empresas.",
    contact: EMPRESA_SHARED_FROM_EMAIL,
    contactPhone: EMPRESA_SHARED_CONTACT_PHONE,
    fromName: "EmpordaJobs",
    fromEmail: EMPRESA_SHARED_FROM_EMAIL,
    allowedDomains: ["gmail.com"],
    icon: "💼",
    gradient: "linear-gradient(135deg,#047857,#10b981)",
    softBackground: "#ecfdf5",
    accent: "#059669",
    legalFooter: "EMPORDAJOBS SL · B02701100 · Portbou, Girona, España",
  },
};

export const EMPRESA_BRAND_IDS = Object.keys(profiles) as EmpresaBrand[];

export function isEmpresaBrand(value: unknown): value is EmpresaBrand {
  return typeof value === "string" && EMPRESA_BRAND_IDS.includes(value as EmpresaBrand);
}

export function getEmpresaBrandProfile(brand: EmpresaBrand): EmpresaBrandProfile {
  return profiles[brand];
}

function domainFromEmail(email: string | null): string | null {
  if (!email) return null;
  const at = email.lastIndexOf("@");
  return at > 0 ? email.slice(at + 1).toLowerCase() : null;
}

function validateBrandSender(profile: EmpresaBrandProfile): { valid: boolean; domain: string | null; message?: string } {
  if (!profile.fromEmail) {
    return { valid: false, domain: null };
  }
  const emailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.fromEmail);
  const domain = domainFromEmail(profile.fromEmail);
  if (!emailFormatValid || !domain) {
    return { valid: false, domain, message: `La dirección configurada para ${profile.name} no es válida.` };
  }
  if (!profile.allowedDomains.includes(domain)) {
    return {
      valid: false,
      domain,
      message: `${profile.name} solo puede usar remitentes de: ${profile.allowedDomains.join(", ")}.`,
    };
  }
  return { valid: true, domain };
}

function statusForProfile(
  profile: EmpresaBrandProfile,
  verified: boolean,
  message: string,
): EmpresaBrandStatus {
  return {
    id: profile.id,
    name: profile.name,
    tagline: profile.tagline,
    description: profile.description,
    website: profile.website,
    contact: profile.contact,
    contactPhone: profile.contactPhone,
    icon: profile.icon,
    gradient: profile.gradient,
    softBackground: profile.softBackground,
    accent: profile.accent,
    from: profile.fromEmail,
    configured: Boolean(profile.fromEmail),
    verified,
    available: Boolean(profile.fromEmail) && verified,
    message,
  };
}

/**
 * The three campaign profiles intentionally share one operational sender.
 * Brand selection changes the letter identity, not the mailbox used to send it.
 */
export async function getEmpresaBrandStatuses(): Promise<EmpresaBrandStatus[]> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return EMPRESA_BRAND_IDS.map(id =>
      statusForProfile(profiles[id], false, "Falta configurar RESEND_API_KEY."),
    );
  }

  const sharedSender = EMPRESA_SHARED_FROM_EMAIL;
  if (EMPRESA_BRAND_IDS.every(id => profiles[id].fromEmail === sharedSender)) {
    try {
      const configuredSender = await getConfiguredSendGridFromEmail();
      const authorized = configuredSender.toLowerCase() === sharedSender.toLowerCase();
      return EMPRESA_BRAND_IDS.map(id =>
        statusForProfile(
          profiles[id],
          authorized,
          authorized
            ? `Todos los proyectos usan el remitente compartido ${sharedSender}.`
            : `${sharedSender} todavía no está autorizado como remitente en SendGrid.`,
        ),
      );
    } catch {
      return EMPRESA_BRAND_IDS.map(id =>
        statusForProfile(profiles[id], false, "No se pudo comprobar el remitente compartido en SendGrid."),
      );
    }
  }

  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await response.json() as any;
    const restricted = data?.statusCode === 401 || data?.name === "restricted_api_key";

    if (restricted) {
      return EMPRESA_BRAND_IDS.map(id => {
        const profile = profiles[id];
        const sender = validateBrandSender(profile);
        if (!sender.valid) {
          return statusForProfile(
            profile,
            false,
            sender.message || `Configura ${id === "jobda" ? "JOBDA_FROM_EMAIL" : id === "empordajobs" ? "EMPORDAJOBS_FROM_EMAIL" : "un remitente válido"}.`,
          );
        }
        if (id === "nuxa") {
          return statusForProfile(profile, true, "Remitente NUXA histórico y autorizado; la API key está limitada a envíos.");
        }
        return statusForProfile(
          profile,
          false,
          "Resend no permite comprobar este dominio con la API key actual.",
        );
      });
    }

    const domains: any[] = data?.data ?? [];
    return EMPRESA_BRAND_IDS.map(id => {
      const profile = profiles[id];
      const sender = validateBrandSender(profile);
      const domain = sender.domain;
      if (!sender.valid) {
        return statusForProfile(
          profile,
          false,
          sender.message || `Configura ${id === "jobda" ? "JOBDA_FROM_EMAIL" : id === "empordajobs" ? "EMPORDAJOBS_FROM_EMAIL" : "un remitente válido"}.`,
        );
      }
      const matchingDomain = domain
        ? domains.find(item => item.name?.toLowerCase() === domain)
        : null;
      if (!matchingDomain) {
        return statusForProfile(profile, false, `El dominio ${domain} todavía no está añadido a Resend.`);
      }
      if (matchingDomain.status !== "verified") {
        return statusForProfile(profile, false, `El dominio ${domain} figura como ${matchingDomain.status || "no verificado"}.`);
      }
      return statusForProfile(profile, true, "Remitente verificado y listo para enviar.");
    });
  } catch {
    return EMPRESA_BRAND_IDS.map(id =>
      statusForProfile(profiles[id], false, "No se pudo comprobar la verificación del remitente."),
    );
  }
}

export async function getEmpresaBrandStatus(brand: EmpresaBrand): Promise<EmpresaBrandStatus> {
  const statuses = await getEmpresaBrandStatuses();
  return statuses.find(status => status.id === brand)!;
}