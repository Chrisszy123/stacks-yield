import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uintCV, PostConditionMode } from "@stacks/transactions";
import { useWallet } from "@/components/providers/wallet-provider";
import { executeContractCall, openContractCall } from "@/lib/contract-utils";
import { CONTRACTS } from "@/constants/contracts";
import { toast } from "sonner";

export function useWithdraw() {
  const { isDevnet, devnetWallet, isConnected } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ ysBtcAmount }: { ysBtcAmount: number }) => {
      if (!isConnected) throw new Error("Wallet not connected");

      const [contractAddress, contractName] = CONTRACTS.aggregator.split(".");
      const sharesInUnits = Math.floor(ysBtcAmount * 1e8);

      const txOptions = {
        contractAddress,
        contractName,
        functionName: "withdraw",
        functionArgs: [uintCV(sharesInUnits)],
        postConditionMode: PostConditionMode.Allow,
      };

      if (isDevnet) {
        return await executeContractCall(txOptions, devnetWallet);
      } else {
        const result = await openContractCall(txOptions);
        return { txid: result.txid || "" };
      }
    },
    onSuccess: (data) => {
      toast.success("Withdrawal submitted!", {
        description: `TX: ${data.txid.slice(0, 12)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ["vault-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-position"] });
    },
    onError: (error: Error) => {
      toast.error("Withdrawal failed", { description: error.message });
    },
  });

  return {
    withdraw: (ysBtcAmount: number) => mutation.mutateAsync({ ysBtcAmount }),
    isLoading: mutation.isPending,
  };
}
