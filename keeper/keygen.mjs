/**
 * Derives the Stacks keeper private key and STX address from a BIP39 mnemonic.
 *
 * Usage:
 *   node keygen.mjs
 *
 * Then paste your 24-word mnemonic when prompted.
 *
 * Account index 0 = Leather "Account 1"
 * Account index 1 = Leather "Account 2"  ← recommended for keeper (separate from main funds)
 *
 * DELETE THIS FILE after you have your keys.
 */

import { generateWallet } from "@stacks/wallet-sdk";
import { getAddressFromPrivateKey } from "@stacks/transactions";
import { createInterface } from "readline";

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.question("Paste your 24-word mnemonic: ", async (mnemonic) => {
  rl.close();
  mnemonic = mnemonic.trim();

  if (mnemonic.split(" ").length < 12) {
    console.error("ERROR: That doesn't look like a valid mnemonic.");
    process.exit(1);
  }

  try {
    const wallet = await generateWallet({
      secretKey: mnemonic,
      password:  "password", // arbitrary — wallet-sdk needs this but it doesn't affect the derived key
    });

    // Derive multiple accounts so you can pick one to use as keeper
    for (let i = 0; i < 3; i++) {
      let account = wallet.accounts[i];

      // wallet-sdk only pre-generates account 0; derive additional ones
      if (!account) {
        const { generateNewAccount } = await import("@stacks/wallet-sdk");
        const extended = await generateNewAccount(wallet);
        account = extended.accounts[i];
      }

      const privKey = account.stxPrivateKey;
      // Strip trailing "01" compression suffix if present (keeper needs raw 64-char hex)
      const cleanKey = privKey.endsWith("01") ? privKey.slice(0, -2) : privKey;
      const addressTestnet = getAddressFromPrivateKey(privKey, "testnet");
      const addressMainnet = getAddressFromPrivateKey(privKey, "mainnet");

      console.log(`\n--- Account ${i + 1} (Leather "Account ${i + 1}") ---`);
      console.log(`KEEPER_PRIVATE_KEY=${cleanKey}`);
      console.log(`KEEPER_STX_ADDRESS=${addressTestnet}  (testnet)`);
      console.log(`                  =${addressMainnet}  (mainnet)`);
    }

    console.log("\n────────────────────────────────────────────────────");
    console.log("Recommended: use Account 2 or Account 3 as the keeper.");
    console.log("Fund it from the testnet faucet:");
    console.log("  https://explorer.hiro.so/sandbox/faucet?chain=testnet");
    console.log("\nThen paste KEEPER_PRIVATE_KEY and KEEPER_STX_ADDRESS into keeper/.env");
    console.log("DELETE this keygen.mjs file after you are done.");
    console.log("────────────────────────────────────────────────────\n");
  } catch (e) {
    console.error("Failed to derive keys:", e.message);
  }
});
