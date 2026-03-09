import { useQuery } from "@tanstack/react-query";
import { cvToJSON, hexToCV } from "@stacks/transactions";
import { getStacksUrl } from "@/lib/stacks-api";
import { CONTRACTS, DEPLOYER_ADDRESS } from "@/constants/contracts";

async function callReadOnly(
  contractAddress: string,
  contractName: string,
  functionName: string,
  args: string[] = []
) {
  const url = `${getStacksUrl()}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: DEPLOYER_ADDRESS, arguments: args }),
  });
  return response.json();
}

export function useVaultStats() {
  return useQuery({
    queryKey: ["vault-stats"],
    queryFn: async () => {
      const [contractAddress, contractName] = CONTRACTS.aggregator.split(".");
      const data = await callReadOnly(contractAddress, contractName, "get-vault-stats");

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
