/** Format validation only; it does not prove delivery or marketing permission. */
export function isEmpresaEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/.test(value.trim());
}

export interface EmpresaCampaignContact {
  company?: string | null;
  company_size?: string | null;
  email_campaign_eligible?: boolean;
}

/** Unknown server policy is not permission to send. */
export function selectEmpresaRecipients<T extends EmpresaCampaignContact>(
  contacts: T[], companies: string[] = [], sizes: string[] = [],
): T[] {
  return contacts.filter(contact => contact.email_campaign_eligible === true
    && (!companies.length || companies.includes(contact.company || ""))
    && (!sizes.length || sizes.includes(contact.company_size || "unclassified")));
}
