import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uintCV, PostConditionMode } from "@stacks/transactions";
import { useWallet } from "@/components/providers/wallet-provider";
import { executeContractCall, openContractCall } from "@/lib/contract-utils";
import { CONTRACTS } from "@/constants/contracts";
import { toast } from "sonner";

interface UserPosition {
  ysBtcShares: number;
  sbtcDeposited: number;
  strategy: number;
  depositBlock: number;
  lastClaimBlock: number;
}

export function useWithdraw() {
  const { isDevnet, devnetWallet, isConnected, address } = useWallet();
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

      if (isDevnet && devnetWallet) {
        return await executeContractCall(txOptions, devnetWallet);
      } else {
        const result = await openContractCall(txOptions);
        return { txid: result.txid || "" };
      }
    },
    onMutate: async ({ ysBtcAmount }) => {
      // Cancel any in-flight refetches so they don't clobber the optimistic update
      await queryClient.cancelQueries({ queryKey: ["user-position", address] });

      // Snapshot existing data so we can roll back on error
      const previousPosition = queryClient.getQueryData<UserPosition>(["user-position", address]);

      // Optimistically subtract the withdrawn shares from the cached position
      queryClient.setQueryData<UserPosition | null>(["user-position", address], (old) => {
        if (!old) return old;
        const newShares = Math.max(0, old.ysBtcShares - ysBtcAmount);
        const ratio = old.ysBtcShares > 0 ? newShares / old.ysBtcShares : 0;
        return {
          ...old,
          ysBtcShares: newShares,
          sbtcDeposited: old.sbtcDeposited * ratio,
        };
      });

      return { previousPosition };
    },
    onSuccess: (data) => {
      toast.success("Withdrawal submitted!", {
        description: `TX: ${data.txid.slice(0, 12)}...`,
      });
    },
    onError: (error: Error, _vars, context) => {
      // Roll back to the snapshot if the tx was rejected
      if (context?.previousPosition !== undefined) {
        queryClient.setQueryData(["user-position", address], context.previousPosition);
      }
      toast.error("Withdrawal failed", { description: error.message });
    },
    onSettled: () => {
      // Sync with the real on-chain state once the tx lands
      queryClient.invalidateQueries({ queryKey: ["vault-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-position"] });
    },
  });

  return {
    withdraw: (ysBtcAmount: number) => mutation.mutateAsync({ ysBtcAmount }),
    isLoading: mutation.isPending,
  };
}
