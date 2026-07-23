import { env } from "@/config/env";

import type { PublicPlan, PublicPlansData } from "../types/types";

type ApiEnvelope<T> = {
  status: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, unknown>;
};

function plansUrl(path = ""): string {
  if (!env.API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL");
  }
  const base = `${env.API_URL.replace(/\/$/, "")}${env.API_PREFIX}plans`;
  return path ? `${base}/${path}` : base;
}

type FetchPlansOptions = {
  /** ISR revalidate (server only). Pass `false` for client / React Query fetches. */
  revalidate?: number | false;
};

function buildInit(options?: FetchPlansOptions): RequestInit {
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      Accept: "application/json",
    },
  };

  if (typeof window === "undefined" && options?.revalidate !== false) {
    init.next = { revalidate: options?.revalidate ?? 300 };
  }

  return init;
}

export async function getPublicPlans(
  options?: FetchPlansOptions,
): Promise<PublicPlan[]> {
  const res = await fetch(plansUrl(), buildInit(options));
  const json = (await res.json()) as ApiEnvelope<PublicPlansData>;

  if (!json.status || !json.data) {
    throw new Error(json.message || "Failed to load plans");
  }

  return json.data.plans ?? [];
}

export async function getPublicPlan(
  planId: string,
  options?: FetchPlansOptions,
): Promise<PublicPlan | null> {
  const res = await fetch(plansUrl(encodeURIComponent(planId)), buildInit(options));
  const json = (await res.json()) as ApiEnvelope<PublicPlan>;

  if (!json.status || !json.data) {
    return null;
  }

  return json.data;
}
