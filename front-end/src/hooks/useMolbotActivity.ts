import { useQuery } from "@tanstack/react-query";

export interface MolbotService {
  serviceId: number;
  name: string;
  endpoint: string;
  skillType: string;
  priceUstx: number;
  priceSbtc: number;
  owner: string;
  active: boolean;
}

export function useMolbotActivity() {
  return useQuery<MolbotService[]>({
    queryKey: ["molbot-services"],
    queryFn: async () => {
      const res = await fetch("/api/molbot/services");
      if (!res.ok) throw new Error("Failed to fetch molbot services");
      const data = await res.json();
      return data.services || [];
    },
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  });
}
