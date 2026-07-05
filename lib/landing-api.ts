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
    cache: "no-store",
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
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .trim();
}
