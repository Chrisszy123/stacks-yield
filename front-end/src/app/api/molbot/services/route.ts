import { NextResponse } from "next/server";
import { callReadOnly } from "@/lib/stacks-api";
import { cvToJSON, hexToCV, uintCV } from "@stacks/transactions";
import { DEPLOYER_ADDRESS } from "@/constants/contracts";

import { serializeCV } from "@stacks/transactions";

function cvToHex(cv: Parameters<typeof serializeCV>[0]): string {
  return serializeCV(cv);
}

export async function GET() {
  try {
    const listData = await callReadOnly(
      DEPLOYER_ADDRESS,
      "molbot-registry",
      "list-all-active",
      DEPLOYER_ADDRESS
    );

    if (!listData?.okay || !listData?.result) {
      return NextResponse.json({ services: [] });
    }

    const parsed = cvToJSON(hexToCV(listData.result));
    const serviceIds: number[] =
      parsed.value?.value?.services?.value?.map((s: any) =>
        Number(s.value)
      ) || [];

    const services = [];

    for (const id of serviceIds) {
      if (id === 0) continue;
      try {
        const arg = cvToHex(uintCV(id));
        const svcData = await callReadOnly(
          DEPLOYER_ADDRESS,
          "molbot-registry",
          "get-service",
          DEPLOYER_ADDRESS,
          [arg]
        );

        if (svcData?.okay && svcData?.result) {
          const svcParsed = cvToJSON(hexToCV(svcData.result));
          if (svcParsed.value && svcParsed.value.type !== "none") {
            const v = svcParsed.value?.value ?? svcParsed.value;
            services.push({
              serviceId: id,
              name: v.name?.value || "",
              endpoint: v.endpoint?.value || "",
              skillType: v["skill-type"]?.value || "",
              priceUstx: Number(v["price-ustx"]?.value ?? 0),
              priceSbtc: Number(v["price-sbtc"]?.value ?? 0),
              owner: v.owner?.value || "",
              active: v.active?.value === true,
            });
          }
        }
      } catch {
        // skip failed service lookups
      }
    }

    return NextResponse.json({ services });
  } catch (e: any) {
    console.error("[api/molbot/services]", e);
    // Return demo services for hackathon fallback
    return NextResponse.json({
      services: [
        {
          serviceId: 1,
          name: "StackYield Yield Data",
          endpoint: process.env.MOLBOT_PUBLIC_URL || "https://your-keeper-url.com",
          skillType: "yield-data",
          priceUstx: 0,
          priceSbtc: 100,
          owner: DEPLOYER_ADDRESS,
          active: true,
        },
      ],
    });
  }
}
