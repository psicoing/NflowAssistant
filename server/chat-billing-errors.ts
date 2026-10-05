/** Only explicit direct-API billing rejections, never a generic 429/timeout. */
export function isConfirmedOpenAiBillingRejection(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { status?: number; code?: string; error?: { code?: string; type?: string } };
  const code = candidate.code ?? candidate.error?.code ?? candidate.error?.type;
  return [402, 429].includes(candidate.status ?? 0) &&
    ["insufficient_quota", "billing_not_active", "billing_hard_limit_reached"].includes(code ?? "");
}
