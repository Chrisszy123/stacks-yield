import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/components/providers/wallet-provider";

export interface AgentConfig {
  agentEnabled: boolean;
  maxStrategyTier: number;
  minRebalanceInterval: number;
  maxFeePerRebalance: number;
  lastRebalanceBlock: number;
  keeperAddress: string;
}

export interface ActivityItem {
  id: string;
  status: "pending" | "confirmed" | "failed" | "abandoned";
  timestamp: string;
  userAddress: string;
  decision: {
    action: string;
    targetStrategy?: number;
    confidence: number;
    reason: string;
    urgency?: string;
    dataPoints?: string[];
  };
  blockHeight: number;
  txId?: string;
  error?: string;
  molbotCalls?: { service: string; cost: number; response: any }[];
}

export interface AgentStatus {
  enabled: boolean;
  config: AgentConfig | null;
  activity: ActivityItem[];
}

export function useAgentStatus() {
  const { address } = useWallet();

  return useQuery<AgentStatus>({
    queryKey: ["agent-status", address],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      const res = await fetch(`/api/agent/status?address=${address}`);
      if (!res.ok) throw new Error("Failed to fetch agent status");
      return res.json();
    },
    enabled: !!address,
    refetchInterval: 30_000,
    retry: 2,
  });
}
