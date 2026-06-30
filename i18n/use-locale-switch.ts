"use client";

import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function useLocaleSwitch() {
  const router = useRouter();
  const locale = useLocale() as Locale;

  return function switchLocale(next?: Locale) {
    const nextLocale = next ?? (locale === "ar" ? "en" : "ar");
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };
}
