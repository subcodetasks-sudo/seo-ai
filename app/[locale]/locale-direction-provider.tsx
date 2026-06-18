"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

import { DirectionProvider } from "@/components/ui/direction";

const RTL_LOCALES = new Set(["ar", "fa", "he", "ur"]);

function getDirection(locale: string) {
  const baseLocale = locale.toLowerCase().split("-")[0];
  return RTL_LOCALES.has(baseLocale) ? "rtl" : "ltr";
}

type LocaleDirectionProviderProps = {
  children: React.ReactNode;
};

export function LocaleDirectionProvider({
  children,
}: LocaleDirectionProviderProps) {
  const locale = useLocale();
  const direction = getDirection(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return <DirectionProvider dir={direction}>{children}</DirectionProvider>;
}
