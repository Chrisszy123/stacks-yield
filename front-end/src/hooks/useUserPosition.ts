import { useQuery } from "@tanstack/react-query";
import { cvToJSON, hexToCV, serializeCV, standardPrincipalCV } from "@stacks/transactions";
import { callReadOnly } from "@/lib/stacks-api";
import { CONTRACTS } from "@/constants/contracts";

export function useUserPosition(userAddress: string | null) {
  return useQuery({
    queryKey: ["user-position", userAddress],
    enabled: !!userAddress,
    queryFn: async () => {
      const [contractAddress, contractName] = CONTRACTS.aggregator.split(".");
      const principalArg = Buffer.from(
        serializeCV(standardPrincipalCV(userAddress!))
      ).toString("hex");

      const data = await callReadOnly(
        contractAddress,
        contractName,
        "get-user-position",
        userAddress!,
        [principalArg]
      );

      if (!data?.okay || !data?.result) return null;

      const json = cvToJSON(hexToCV(data.result));
      if (!json.value || json.type === "none") return null;

      const d = json.value?.value ?? json.value;
      return {
        ysBtcShares: Number(d["ysbtc-shares"]?.value ?? 0) / 1e8,
        sbtcDeposited: Number(d["sbtc-deposited"]?.value ?? 0) / 1e8,
        strategy: Number(d["strategy"]?.value ?? 0),
        depositBlock: Number(d["deposit-block"]?.value ?? 0),
        lastClaimBlock: Number(d["last-claim-block"]?.value ?? 0),
      };
    },
    refetchInterval: 10_000,
    retry: 3,
  });
}
