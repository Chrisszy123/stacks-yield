import { getApi, getStacksUrl } from "@/lib/stacks-api";
import { ustxToStx, satsToSbtc } from "@/lib/currency-utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { DEVNET_NODE_RPC_URL } from "@/constants/devnet";
import { CONTRACTS } from "@/constants/contracts";
import { Cl, ClarityType, cvToHex, hexToCV } from "@stacks/transactions";

const isDevnet = () => process.env.NEXT_PUBLIC_STACKS_NETWORK === "devnet";

// ------------------------------------------------------------------
// STX balance
// On devnet: hit the node RPC directly — the stacks-api indexer lags
// behind the node and returns 0 until it catches up.
// ------------------------------------------------------------------
export const useStxBalance = (
  address: string | null
): UseQueryResult<number> => {
  const client = getApi(getStacksUrl());

  return useQuery<number>({
    queryKey: ["stxBalance", address],
    queryFn: async () => {
      if (isDevnet()) {
        const res = await fetch(
          `${DEVNET_NODE_RPC_URL}/v2/accounts/${address}?proof=0`
        );
        if (!res.ok) return 0;
        const data = await res.json();
        // balance is a hex string, e.g. "0x5AF3107A4000"
        return ustxToStx(Number(data.balance)) as number;
      }

      const { data, error } = await client.GET(
        "/extended/v2/addresses/{principal}/balances/stx",
        { params: { path: { principal: address! } } }
      );
      if (error) throw new Error("Error fetching STX balance");
      return ustxToStx(data.balance) as number;
    },
    enabled: !!address,
    refetchInterval: 10000,
  });
};

// ------------------------------------------------------------------
// sBTC (mock-sbtc on devnet) balance
// On devnet: call the contract's read-only get-balance via the node RPC.
// On testnet/mainnet: query the stacks-api FT endpoint.
// ------------------------------------------------------------------
export const useSbtcBalance = (
  address: string | null
): UseQueryResult<number> => {
  const client = getApi(getStacksUrl());

  return useQuery<number>({
    queryKey: ["sbtcBalance", address],
    queryFn: async () => {
      if (isDevnet()) {
        const [contractAddress, contractName] = CONTRACTS.mockSbtc.split(".");
        const principalArg = cvToHex(Cl.principal(address!));

        const res = await fetch(
          `${DEVNET_NODE_RPC_URL}/v2/contracts/call-read/${contractAddress}/${contractName}/get-balance`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: address, arguments: [principalArg] }),
          }
        );
        if (!res.ok) return 0;

        const data = await res.json();
        if (!data.okay) return 0;

        // Result is (ok uint) — unwrap the ResponseOK then read the UInt
        const cv = hexToCV(data.result);
        if (cv.type !== ClarityType.ResponseOk) return 0;
        const inner = (cv as { value: { value: bigint } }).value;
        return satsToSbtc(Number(inner.value));
      }

      const { data, error } = await client.GET(
        "/extended/v2/addresses/{principal}/balances/ft",
        { params: { path: { principal: address! } } }
      );
      if (error) throw new Error("Error fetching sBTC balance");

      const sbtcEntry = data.results?.find((ft) =>
        ft.token.includes(CONTRACTS.mockSbtc)
      );
      if (!sbtcEntry) return 0;
      return satsToSbtc(Number(sbtcEntry.balance));
    },
    enabled: !!address,
    refetchInterval: 10000,
  });
};
