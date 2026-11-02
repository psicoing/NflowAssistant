type Account = {
  subscriptionStatus: string | null; subscriptionExpiresAt?: Date | string | null;
  monthlyQuestionLimit: number | null; questionsUsedThisMonth: number | null; prepaidQuestions: number | null;
};
export function hasMonthlyEntitlement(user: Account, now = new Date()) {
  return user.subscriptionStatus === "active" &&
    (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt).getTime() > now.getTime());
}
export function paidQuestionBalance(user: Account, now = new Date()) {
  const limit = hasMonthlyEntitlement(user, now) ? (user.monthlyQuestionLimit ?? 10) : 0;
  const used = user.questionsUsedThisMonth || 0;
  const prepaid = user.prepaidQuestions || 0;
  const subscriptionRemaining = Math.max(0, limit - used);
  return { limit, used, prepaid, subscriptionRemaining, totalRemaining: prepaid + subscriptionRemaining };
}
