import { getApi, getStacksUrl, getNodeRpcUrl } from "@/lib/stacks-api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const isDevnet = () => process.env.NEXT_PUBLIC_STACKS_NETWORK === "devnet";

export const useCurrentBtcBlock = (): UseQueryResult<number> => {
  const client = getApi(getStacksUrl());

  return useQuery<number>({
    queryKey: ["currentBlock"],
    queryFn: async () => {
      if (isDevnet()) {
        const res = await fetch(`${getNodeRpcUrl()}/v2/info`);
        if (!res.ok) throw new Error("Failed to fetch node info");
        const info = await res.json();
        return info.burn_block_height as number;
      }

      const { data, error } = await client.GET("/extended/v2/blocks/", {
        params: { query: { limit: 1 } },
      });

      if (error) throw new Error("Error fetching blocks from API");

      const latestBlockHeight = data?.results?.[0]?.burn_block_height;
      if (latestBlockHeight) return latestBlockHeight;
      throw new Error("Error fetching current block height from on-chain");
    },
    refetchInterval: 10000,
  });
};
