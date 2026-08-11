import { useQuery } from "@tanstack/react-query";

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  subscriptionStatus: string;
  subscriptionPlan: string;
  hasCompletedPayment: boolean;
  hasActiveSubscription: boolean;
  profileCompleted: boolean;
  ageRange?: string;
  gender?: string;
  createdAt: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    retryOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    needsPayment: user?.subscriptionStatus === 'pending_payment' && !user?.hasActiveSubscription,
    hasActiveSubscription: user?.hasActiveSubscription || false,
  };
}