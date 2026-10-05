/** Static limits/errors must not consume a customer's paid question allowance. */
export async function countDeliveredChatQuestion(
  response: { countsTowardQuestionQuota: boolean },
  check: { remaining: number },
  increment: () => Promise<unknown>,
): Promise<number> {
  if (response.countsTowardQuestionQuota) {
    await increment();
    return check.remaining;
  }
  // Existing checkQuestionLimit returns the balance AFTER a hypothetical reply.
  // Do not clamp to subscription size: this balance can include prepaid credits.
  return check.remaining + 1;
}
