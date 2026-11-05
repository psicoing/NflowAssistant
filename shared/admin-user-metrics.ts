export interface UserMetricPeriod {
  days: 7 | 15 | 30;
  newUsers: number;
  customerLogins: number;
  adminLogins: number;
  chatActiveUsers: number;
  chatUserMessages: number;
}

export interface RegistrationMetricPeriod {
  days: 7 | 15 | 30;
  operations: number;
  successfulOperations: number;
  rejectedOperations: number;
  failedOperations: number;
  interruptedOperations: number;
  accountsCreated: number;
  sessionFailures: number;
}

export interface AdminUserMetrics {
  metricsVersion: 2;
  generatedAt: string;
  /** All stored accounts, including administrators. Kept for API compatibility. */
  totalUsers: number;
  registeredUsers: number;
  adminUsers: number;
  otherAccounts: number;
  trialUsers: number;
  pendingPayments: number;
  /** Non-administrative accounts with an active, not-expired database status. */
  activeSubscriptions: number;
  expiredActiveStatuses: number;
  verifiedTrialUsers: number;
  totalConversations: number;
  totalRevenue: null;
  revenueStatus: "not_reconciled";
  periods: UserMetricPeriod[];
  history: { month: string; newUsers: number; cumulativeUsers: number }[];
  registrationAudit: {
    available: boolean;
    coverageStartedAt: string | null;
    periods: RegistrationMetricPeriod[];
  };
}
