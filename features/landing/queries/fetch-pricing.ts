import { env } from "@/config/env";
import type { Pricing } from "@/features/landing/types/landing-api";

const LANDING_API_BASE =
  env.LANDING_API_URL ?? "https://api-landing-seo.subcodeco.com";

/** Works on both server and client (lang is passed explicitly). */
export async function fetchLandingPricing(
  lang: string,
): Promise<Pricing | Pricing[]> {
  const res = await fetch(`${LANDING_API_BASE}/api/v1/pricing?lang=${lang}`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": lang || "ar",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: /api/v1/pricing`);
  }

  const json = (await res.json()) as { data: Pricing | Pricing[] };
  return json.data;
}
