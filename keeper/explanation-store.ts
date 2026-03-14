import { existsSync, mkdirSync, appendFileSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type { AgentDecision } from "./claude-client.js";
import type { ObservationContext } from "./observation-engine.js";

const LOGS_DIR = join(import.meta.dirname || __dirname, "logs");
const LOG_FILE = join(LOGS_DIR, "activity.jsonl");

export type RecordStatus = "pending" | "confirmed" | "failed" | "abandoned";

export interface ActivityRecord {
  id: string;
  status: RecordStatus;
  timestamp: string;
  userAddress: string;
  decision: AgentDecision;
  blockHeight: number;
  txId?: string;
  error?: string;
  molbotCalls?: { service: string; cost: number; response: any }[];
}

function ensureLogDir() {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
  }
}

function appendRecord(record: ActivityRecord) {
  ensureLogDir();
  appendFileSync(LOG_FILE, JSON.stringify(record) + "\n", "utf-8");
}

function readAllRecords(): ActivityRecord[] {
  ensureLogDir();
  if (!existsSync(LOG_FILE)) return [];
  const lines = readFileSync(LOG_FILE, "utf-8")
    .split("\n")
    .filter((l) => l.trim());
  return lines.map((l) => JSON.parse(l));
}

function rewriteRecords(records: ActivityRecord[]) {
  ensureLogDir();
  writeFileSync(
    LOG_FILE,
    records.map((r) => JSON.stringify(r)).join("\n") + (records.length ? "\n" : ""),
    "utf-8"
  );
}

export function storePending(
  decision: AgentDecision,
  context: ObservationContext,
  userAddress: string,
  molbotCalls?: { service: string; cost: number; response: any }[]
): string {
  const id = randomUUID();
  const record: ActivityRecord = {
    id,
    status: "pending",
    timestamp: new Date().toISOString(),
    userAddress,
    decision,
    blockHeight: context.blockHeight,
    molbotCalls,
  };
  appendRecord(record);
  return id;
}

export function confirm(recordId: string, txId: string) {
  const records = readAllRecords();
  const updated = records.map((r) =>
    r.id === recordId ? { ...r, status: "confirmed" as const, txId } : r
  );
  rewriteRecords(updated);
}

export function fail(recordId: string, error: string) {
  const records = readAllRecords();
  const updated = records.map((r) =>
    r.id === recordId ? { ...r, status: "failed" as const, error } : r
  );
  rewriteRecords(updated);
}

export function abandon(recordId: string) {
  const records = readAllRecords();
  const updated = records.map((r) =>
    r.id === recordId ? { ...r, status: "abandoned" as const } : r
  );
  rewriteRecords(updated);
}

export function recoverOnStartup(): number {
  const records = readAllRecords();
  let recovered = 0;
  const updated = records.map((r) => {
    if (r.status === "pending") {
      console.warn(
        `[explanation-store] Abandoning pending record ${r.id} from previous run: ${r.decision.action} for ${r.userAddress}`
      );
      recovered++;
      return { ...r, status: "abandoned" as const };
    }
    return r;
  });
  if (recovered > 0) {
    rewriteRecords(updated);
  }
  return recovered;
}

export function getByUser(address: string, limit: number = 10): ActivityRecord[] {
  return readAllRecords()
    .filter((r) => r.userAddress === address)
    .slice(-limit);
}

export function getByTxId(txId: string): ActivityRecord | undefined {
  return readAllRecords().find((r) => r.txId === txId);
}

export function getAll(limit: number = 50): ActivityRecord[] {
  return readAllRecords().slice(-limit);
}

export function getExpiredTxIds(currentBlockHeight: number, expiryWindow: number = 100): string[] {
  return readAllRecords()
    .filter(
      (r) =>
        r.txId &&
        r.status === "confirmed" &&
        currentBlockHeight - r.blockHeight > expiryWindow
    )
    .map((r) => r.txId!);
}
