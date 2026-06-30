import { env } from "@/config/env";
import { getLocale } from "next-intl/server";

export const LANDING_API_BASE_URL =
  env.LANDING_API_URL ?? "https://api-landing-seo.subcodeco.com";

  export async function apiFetch<T>(path: string): Promise<T> {
  const locale = await getLocale();
  const res = await fetch(`${LANDING_API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale || "ar",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  const json = await res.json();
  return json.data as T;
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, "")
    .trim();
}
