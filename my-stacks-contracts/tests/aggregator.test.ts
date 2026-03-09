import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("sbtc-yield-aggregator", () => {
  beforeEach(async () => {
    // Set aggregator on ysbtc-token so it can mint/burn
    simnet.callPublicFn(
      "ysbtc-token",
      "set-aggregator",
      [Cl.principal(`${deployer}.sbtc-yield-aggregator`)],
      deployer
    );
    // Mint mock sBTC to test wallets via faucet
    simnet.callPublicFn("mock-sbtc", "faucet", [Cl.uint(1_000_000_000)], wallet1);
    simnet.callPublicFn("mock-sbtc", "faucet", [Cl.uint(1_000_000_000)], wallet2);
  });

  it("allows deposit and mints ysBTC shares 1:1 on first deposit", () => {
    const depositAmount = 100_000_000; // 1 sBTC (8 decimals)
    const { result } = simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(depositAmount), Cl.uint(0)], // strategy: conservative
      wallet1
    );
    expect(result).toBeOk(Cl.uint(depositAmount)); // 1:1 on first deposit
  });

  it("correctly calculates shares for second depositor", () => {
    simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(100_000_000), Cl.uint(0)],
      wallet1
    );
    const { result } = simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(50_000_000), Cl.uint(1)],
      wallet2
    );
    expect(result).toBeOk(Cl.uint(50_000_000));
  });

  it("allows withdrawal and burns ysBTC shares", () => {
    simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(100_000_000), Cl.uint(0)],
      wallet1
    );
    const { result } = simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "withdraw",
      [Cl.uint(100_000_000)],
      wallet1
    );
    expect(result).toBeOk();
  });

  it("returns vault stats correctly", () => {
    simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(100_000_000), Cl.uint(0)],
      wallet1
    );
    const { result } = simnet.callReadOnlyFn(
      "sbtc-yield-aggregator",
      "get-vault-stats",
      [],
      deployer
    );
    expect(result).toBeOk();
  });

  it("rejects zero deposits", () => {
    const { result } = simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(0), Cl.uint(0)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(101));
  });

  it("rejects invalid strategy", () => {
    const { result } = simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(1000), Cl.uint(99)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(103));
  });

  it("tracks user position after deposit", () => {
    simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(100_000_000), Cl.uint(2)], // aggressive
      wallet1
    );
    const { result } = simnet.callReadOnlyFn(
      "sbtc-yield-aggregator",
      "get-user-position",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(result).toBeSome();
  });

  it("preview-deposit returns correct share estimate", () => {
    const { result } = simnet.callReadOnlyFn(
      "sbtc-yield-aggregator",
      "preview-deposit",
      [Cl.uint(100_000_000)],
      deployer
    );
    expect(result).toBeOk(Cl.uint(100_000_000));
  });

  it("admin can pause and unpause vault", () => {
    const pauseResult = simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "set-paused",
      [Cl.bool(true)],
      deployer
    );
    expect(pauseResult.result).toBeOk();

    // Deposit should fail while paused
    const { result } = simnet.callPublicFn(
      "sbtc-yield-aggregator",
      "deposit",
      [Cl.uint(100_000_000), Cl.uint(0)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(104));
  });
});

describe("mock-sbtc", () => {
  it("faucet mints tokens to caller", () => {
    simnet.callPublicFn("mock-sbtc", "faucet", [Cl.uint(1_000_000)], wallet1);
    const { result } = simnet.callReadOnlyFn(
      "mock-sbtc",
      "get-balance",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1_000_000));
  });
});

describe("strategy-apys", () => {
  it("zest returns 200 basis points APY", () => {
    const { result } = simnet.callReadOnlyFn("strategy-zest", "get-apy", [], deployer);
    expect(result).toBeOk(Cl.uint(200));
  });

  it("bitflow returns 1200 basis points APY", () => {
    const { result } = simnet.callReadOnlyFn("strategy-bitflow", "get-apy", [], deployer);
    expect(result).toBeOk(Cl.uint(1200));
  });

  it("alex returns 4500 basis points APY", () => {
    const { result } = simnet.callReadOnlyFn("strategy-alex", "get-apy", [], deployer);
    expect(result).toBeOk(Cl.uint(4500));
  });
});
