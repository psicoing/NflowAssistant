import { useQuery } from "@tanstack/react-query";

interface Partner {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  status: string;
  partnerType: string;
  totalReferrals: number;
  totalEarnings: string;
  createdAt: string;
}

export function usePartnerAuth() {
  const { data: partner, isLoading, error } = useQuery<Partner>({
    queryKey: ["/api/partners/profile"],
    retry: false,
  });

  return {
    partner,
    isLoading,
    error,
    isAuthenticated: !!partner,
  };
}