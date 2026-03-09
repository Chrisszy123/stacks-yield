import { useQuery } from "@tanstack/react-query";
import { cvToJSON, hexToCV } from "@stacks/transactions";
import { callReadOnly } from "@/lib/stacks-api";
import { CONTRACTS, DEPLOYER_ADDRESS } from "@/constants/contracts";

export function useVaultStats() {
  return useQuery({
    queryKey: ["vault-stats"],
    queryFn: async () => {
      const [contractAddress, contractName] = CONTRACTS.aggregator.split(".");
      const data = await callReadOnly(
        contractAddress,
        contractName,
        "get-vault-stats",
        DEPLOYER_ADDRESS
      );

      if (!data?.okay || !data?.result) {
        throw new Error(data?.cause || "Failed to fetch vault stats");
      }

      const json = cvToJSON(hexToCV(data.result));
      const v = json.value?.value ?? json.value;

      return {
        totalSbtc: Number(v["total-sbtc"]?.value ?? 0) / 1e8,
        totalYsbtc: Number(v["total-ysbtc"]?.value ?? 0) / 1e8,
        paused: v["paused"]?.value === true,
        feeBps: Number(v["fee-bps"]?.value ?? 50),
      };
    },
    refetchInterval: 10_000,
    retry: 3,
  });
}
