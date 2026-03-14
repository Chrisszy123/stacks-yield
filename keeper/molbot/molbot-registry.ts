import axios from "axios";
import { cvToJSON, stringAsciiCV, uintCV } from "@stacks/transactions";
import dotenv from "dotenv";

dotenv.config();

const STACKS_API = process.env.STACKS_API_URL || "https://api.testnet.hiro.so";
const DEPLOYER = process.env.DEPLOYER_ADDRESS!;

export interface MolbotService {
  serviceId: number;
  name: string;
  endpoint: string;
  skillType: string;
  priceUstx: number;
  priceSbtc: number;
  owner: string;
  active: boolean;
}

async function callReadOnly(
  functionName: string,
  args: string[]
): Promise<any> {
  const url = `${STACKS_API}/v2/contracts/call-read/${DEPLOYER}/molbot-registry/${functionName}`;
  const res = await axios.post(url, {
    sender: DEPLOYER,
    arguments: args,
  });
  return res.data;
}

function parseService(id: number, data: any): MolbotService | null {
  if (!data || !data.value) return null;
  const v = data.value;
  return {
    serviceId: id,
    name: v.name?.value || "",
    endpoint: v.endpoint?.value || "",
    skillType: v["skill-type"]?.value || "",
    priceUstx: Number(v["price-ustx"]?.value ?? 0),
    priceSbtc: Number(v["price-sbtc"]?.value ?? 0),
    owner: v.owner?.value || "",
    active: v.active?.value === true,
  };
}

export async function getServicesBySkill(
  skill: string
): Promise<MolbotService[]> {
  try {
    const arg = Buffer.from(stringAsciiCV(skill).serialize()).toString("hex");
    const data = await callReadOnly("get-services-by-skill", [arg]);
    const parsed = cvToJSON(data.result);
    const serviceIds: number[] =
      parsed.value?.value?.services?.value?.map((s: any) =>
        Number(s.value)
      ) || [];

    const services: MolbotService[] = [];
    for (const id of serviceIds) {
      if (id === 0) continue;
      const svcData = await callReadOnly("get-service", [
        Buffer.from(uintCV(id).serialize()).toString("hex"),
      ]);
      const svcParsed = cvToJSON(svcData.result);
      const svc = parseService(id, svcParsed);
      if (svc && svc.active) services.push(svc);
    }
    return services;
  } catch (e) {
    console.error(`[molbot-registry] Failed to get services for skill ${skill}:`, e);
    return [];
  }
}

export async function getBestService(
  skill: string
): Promise<MolbotService | null> {
  const services = await getServicesBySkill(skill);
  if (services.length === 0) return null;
  return services.reduce((best, svc) =>
    svc.priceSbtc < best.priceSbtc || (svc.priceSbtc === 0 && svc.priceUstx < best.priceUstx)
      ? svc
      : best
  );
}

export async function isServiceActive(serviceId: number): Promise<boolean> {
  try {
    const arg = Buffer.from(uintCV(serviceId).serialize()).toString("hex");
    const data = await callReadOnly("get-service", [arg]);
    const parsed = cvToJSON(data.result);
    return parsed.value?.value?.active?.value === true;
  } catch {
    return false;
  }
}

export async function listAllActive(): Promise<MolbotService[]> {
  try {
    const data = await callReadOnly("list-all-active", []);
    const parsed = cvToJSON(data.result);
    const serviceIds: number[] =
      parsed.value?.value?.services?.value?.map((s: any) =>
        Number(s.value)
      ) || [];

    const services: MolbotService[] = [];
    for (const id of serviceIds) {
      if (id === 0) continue;
      const svcData = await callReadOnly("get-service", [
        Buffer.from(uintCV(id).serialize()).toString("hex"),
      ]);
      const svcParsed = cvToJSON(svcData.result);
      const svc = parseService(id, svcParsed);
      if (svc && svc.active) services.push(svc);
    }
    return services;
  } catch (e) {
    console.error("[molbot-registry] Failed to list active services:", e);
    return [];
  }
}
