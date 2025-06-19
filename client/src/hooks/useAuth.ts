import { useQuery } from "@tanstack/react-query";

export interface User {
  id: number;
  username: string;
  email: string;
  subscriptionStatus: string;
  subscriptionPlan: string;
  hasCompletedPayment: boolean;
  hasActiveSubscription: boolean;
  createdAt: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    needsPayment: user?.subscriptionStatus === 'pending_payment' || !user?.hasCompletedPayment,
    hasActiveSubscription: user?.hasActiveSubscription || false,
  };
}