import express from "express";
import axios from "axios";
import { cvToJSON, bufferCV, uintCV, principalCV } from "@stacks/transactions";
import { observe } from "../observation-engine.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || process.env.MOLBOT_SERVICE_PORT || "3001");
const KEEPER_ADDRESS = process.env.KEEPER_STX_ADDRESS!;
const STACKS_API = process.env.STACKS_API_URL || "https://api.testnet.hiro.so";
const DEPLOYER = process.env.DEPLOYER_ADDRESS!;
const PAYMENT_AMOUNT = 100; // 100 sats

async function callContractReadOnly(
  contractName: string,
  functionName: string,
  args: string[]
): Promise<any> {
  const url = `${STACKS_API}/v2/contracts/call-read/${DEPLOYER}/${contractName}/${functionName}`;
  const res = await axios.post(url, {
    sender: DEPLOYER,
    arguments: args,
  });
  return res.data;
}

function txIdToBuffer(txId: string): string {
  const clean = txId.startsWith("0x") ? txId.slice(2) : txId;
  const buf = bufferCV(Buffer.from(clean, "hex"));
  return Buffer.from(buf.serialize()).toString("hex");
}

export function startX402Server() {
  const app = express();
  app.use(express.json());

  app.get("/yield-data", async (req, res) => {
    const paymentProof = req.headers["x-payment-proof"] as string | undefined;

    if (!paymentProof) {
      res.status(402).json({
        error: "payment-required",
        message: "Payment required to access yield data",
      });
      res.setHeader(
        "X-Payment-Required",
        JSON.stringify({
          amount: PAYMENT_AMOUNT,
          currency: "sBTC",
          recipient: KEEPER_ADDRESS,
          description: "StackYield live APY and TVL data",
        })
      );
      return;
    }

    try {
      const txIdHex = txIdToBuffer(paymentProof);

      // Step 1: check if already used
      const usedData = await callContractReadOnly(
        "x402-verifier",
        "is-txid-used",
        [txIdHex]
      );
      const usedParsed = cvToJSON(usedData.result);
      if (usedParsed.value === true) {
        res.status(409).json({ error: "payment-already-used" });
        return;
      }

      // Step 2: verify payment
      const verifyData = await callContractReadOnly(
        "x402-verifier",
        "verify-payment",
        [
          txIdHex,
          Buffer.from(uintCV(PAYMENT_AMOUNT).serialize()).toString("hex"),
          Buffer.from(principalCV(KEEPER_ADDRESS).serialize()).toString("hex"),
        ]
      );
      const verifyParsed = cvToJSON(verifyData.result);

      if (verifyParsed.value?.type === "err" || verifyParsed.type === "err") {
        res.status(402).json({
          error: "payment-verification-failed",
        });
        res.setHeader(
          "X-Payment-Required",
          JSON.stringify({
            amount: PAYMENT_AMOUNT,
            currency: "sBTC",
            recipient: KEEPER_ADDRESS,
            description: "StackYield live APY and TVL data",
          })
        );
        return;
      }

      // Step 3: return yield data
      const context = await observe();
      res.status(200).json({
        blockHeight: context.blockHeight,
        apys: context.apys,
        tvl: context.tvl,
        btcPriceUsd: context.btcPriceUsd,
        triggers: context.triggers,
        timestamp: context.timestamp,
      });
    } catch (e: any) {
      console.error("[x402-server] Error processing payment proof:", e);
      res.status(500).json({ error: "internal-error" });
    }
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "stackyield-molbot" });
  });

  app.listen(PORT, () => {
    console.log(`[x402-server] StackYield molbot service listening on port ${PORT}`);
  });

  return app;
}
