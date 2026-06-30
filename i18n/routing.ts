import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "never",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  return locale.toLowerCase().split("-")[0] === "en" ? "ltr" : "rtl";
}
