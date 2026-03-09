import { connect, disconnect, isConnected, getLocalStorage, request } from '@stacks/connect';
import type { ClarityValue } from '@stacks/transactions';

export async function walletConnect() {
  return await connect();
}

export function walletDisconnect(): void {
  disconnect();
}

export function walletIsConnected(): boolean {
  return isConnected();
}

export function getStxAddress(): string | null {
  const data = getLocalStorage();
  const addresses = data?.addresses?.stx;
  return Array.isArray(addresses) && addresses.length > 0 ? addresses[0].address : null;
}

export function getBtcAddress(): string | null {
  const data = getLocalStorage();
  const addresses = data?.addresses?.btc;
  return Array.isArray(addresses) && addresses.length > 0 ? addresses[0].address : null;
}

export interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions?: unknown[];
  postConditionMode?: 'allow' | 'deny';
}

export async function callContract(params: ContractCallParams) {
  const network = process.env.NEXT_PUBLIC_STACKS_NETWORK;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await request({} as any, 'stx_callContract', {
    contract: `${params.contractAddress}.${params.contractName}`,
    functionName: params.functionName,
    functionArgs: params.functionArgs,
    postConditions: params.postConditions,
    postConditionMode: params.postConditionMode,
    network,
  });
  return result;
}
