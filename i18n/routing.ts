import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "never",
  // Cookie-based locale detection must stay on (and localeCookie must stay
  // truthy) so the middleware resolves the `[locale]` route param (used for
  // API locale headers, etc.) from the same NEXT_LOCALE cookie that
  // i18n/request.ts reads for messages — otherwise the two can disagree and
  // render a mixed-language page. proxy.ts guarantees a NEXT_LOCALE cookie
  // is always present before this runs, so the accept-language fallback is
  // never actually reached and the browser's language is never consulted.
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  return locale.toLowerCase().split("-")[0] === "en" ? "ltr" : "rtl";
}
