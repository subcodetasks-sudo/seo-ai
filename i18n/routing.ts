import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  localePrefix: "as-needed"
});

export type Locale = (typeof routing.locales)[number];

export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  return locale.toLowerCase().split("-")[0] === "ar" ? "rtl" : "ltr";
}
