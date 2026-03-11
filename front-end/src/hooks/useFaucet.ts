import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uintCV, PostConditionMode } from "@stacks/transactions";
import { useWallet } from "@/components/providers/wallet-provider";
import { executeContractCall, openContractCall } from "@/lib/contract-utils";
import { CONTRACTS } from "@/constants/contracts";
import { toast } from "sonner";

const DEFAULT_FAUCET_AMOUNT = 1; // 1 sBTC

export function useFaucet() {
  const { isDevnet, devnetWallet, isConnected, address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (sbtcAmount: number = DEFAULT_FAUCET_AMOUNT) => {
      if (!isConnected || !address) throw new Error("Wallet not connected");

      const [contractAddress, contractName] = CONTRACTS.mockSbtc.split(".");
      const amountInSats = Math.floor(sbtcAmount * 1e8);

      const txOptions = {
        contractAddress,
        contractName,
        functionName: "faucet",
        functionArgs: [uintCV(amountInSats)],
        postConditionMode: PostConditionMode.Allow,
      };

      if (isDevnet && devnetWallet) {
        return await executeContractCall(txOptions, devnetWallet);
      } else {
        const result = await openContractCall(txOptions);
        return { txid: result.txid || "" };
      }
    },
    onSuccess: (data, amount) => {
      toast.success(`Faucet: ${amount ?? DEFAULT_FAUCET_AMOUNT} mock sBTC minted`, {
        description: `TX: ${data.txid.slice(0, 12)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ["sbtcBalance"] });
    },
    onError: (error: Error) => {
      toast.error("Faucet failed", { description: error.message });
    },
  });

  return {
    drip: (amount?: number) => mutation.mutateAsync(amount ?? DEFAULT_FAUCET_AMOUNT),
    isLoading: mutation.isPending,
  };
}
