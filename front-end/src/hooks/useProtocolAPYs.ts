import { useQuery } from "@tanstack/react-query";
import { cvToJSON, hexToCV } from "@stacks/transactions";
import { getStacksUrl } from "@/lib/stacks-api";
import { CONTRACTS, DEPLOYER_ADDRESS } from "@/constants/contracts";

async function fetchStrategyAPY(contractStr: string): Promise<number> {
  const [contractAddress, contractName] = contractStr.split(".");
  const url = `${getStacksUrl()}/v2/contracts/call-read/${contractAddress}/${contractName}/get-apy`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: DEPLOYER_ADDRESS, arguments: [] }),
  });
  const data = await response.json();

  if (!data?.okay || !data?.result) return 0;

  const json = cvToJSON(hexToCV(data.result));
  // get-apy returns (ok uint) — value is { success: true, value: { type: "uint", value: "200" } }
  const basisPoints = Number(json.value?.value ?? json.value ?? 0);
  return basisPoints / 100;
}

export function useProtocolAPYs() {
  return useQuery({
    queryKey: ["protocol-apys"],
    queryFn: async () => {
      const [zestAPY, bitflowAPY, alexAPY] = await Promise.all([
        fetchStrategyAPY(CONTRACTS.strategyZest),
        fetchStrategyAPY(CONTRACTS.strategyBitflow),
        fetchStrategyAPY(CONTRACTS.strategyAlex),
      ]);
      return { zest: zestAPY, bitflow: bitflowAPY, alex: alexAPY };
    },
    refetchInterval: 30_000,
    retry: 3,
  });
}
