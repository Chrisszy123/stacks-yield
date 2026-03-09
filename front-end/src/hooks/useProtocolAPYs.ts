import { useQuery } from "@tanstack/react-query";
import { cvToJSON, hexToCV } from "@stacks/transactions";
import { callReadOnly } from "@/lib/stacks-api";
import { CONTRACTS, DEPLOYER_ADDRESS } from "@/constants/contracts";

async function fetchStrategyAPY(contractStr: string): Promise<number> {
  const [contractAddress, contractName] = contractStr.split(".");

  const data = await callReadOnly(
    contractAddress,
    contractName,
    "get-apy",
    DEPLOYER_ADDRESS
  );

  if (!data?.okay || !data?.result) return 0;

  const json = cvToJSON(hexToCV(data.result));
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
