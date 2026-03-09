import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uintCV, PostConditionMode } from "@stacks/transactions";
import { useWallet } from "@/components/providers/wallet-provider";
import { executeContractCall, openContractCall } from "@/lib/contract-utils";
import { CONTRACTS } from "@/constants/contracts";
import { toast } from "sonner";

export function useDeposit() {
  const { isDevnet, devnetWallet, isConnected } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      sbtcAmount,
      strategyId,
    }: {
      sbtcAmount: number;
      strategyId: number;
    }) => {
      if (!isConnected) throw new Error("Wallet not connected");

      const [contractAddress, contractName] = CONTRACTS.aggregator.split(".");
      const amountInSats = Math.floor(sbtcAmount * 1e8);

      const txOptions = {
        contractAddress,
        contractName,
        functionName: "deposit",
        functionArgs: [uintCV(amountInSats), uintCV(strategyId)],
        postConditionMode: PostConditionMode.Allow,
      };

      if (isDevnet && devnetWallet) {
        return await executeContractCall(txOptions, devnetWallet);
      } else {
        const result = await openContractCall(txOptions);
        return { txid: result.txid || "" };
      }
    },
    onSuccess: (data) => {
      toast.success("Deposit submitted!", {
        description: `TX: ${data.txid.slice(0, 12)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ["vault-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-position"] });
    },
    onError: (error: Error) => {
      toast.error("Deposit failed", { description: error.message });
    },
  });

  return {
    deposit: (sbtcAmount: number, strategyId: number) =>
      mutation.mutateAsync({ sbtcAmount, strategyId }),
    isLoading: mutation.isPending,
  };
}
