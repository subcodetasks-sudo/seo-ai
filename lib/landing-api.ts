import { env } from "@/config/env";

export { stripHtml } from "@/lib/strip-html";

export const LANDING_API_BASE_URL =
  env.LANDING_API_URL ?? "https://api-landing-seo.subcodeco.com";

/** Locale is passed explicitly (not read via next-intl/server) so this stays
 * safe to call from a "use cache" scope and from client-side refetches. */
export async function apiFetch<T>(path: string, locale: string): Promise<T> {
  const res = await fetch(`${LANDING_API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale || "ar",
    },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  const json = await res.json();
  return json.data as T;
}
