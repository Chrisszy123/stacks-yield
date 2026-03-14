import { useQuery } from "@tanstack/react-query";

export function useBlockHeight() {
  return useQuery<{ blockHeight: number }>({
    queryKey: ["block-height-testnet"],
    queryFn:  async () => {
      const res = await fetch("https://api.testnet.hiro.so/v2/info");
      if (!res.ok) throw new Error("Failed to fetch block height");
      const data = await res.json();
      return { blockHeight: data.burn_block_height as number };
    },
    refetchInterval: 10_000,
    retry: 2,
  });
}
