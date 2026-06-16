"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { LanguageSelector } from "@/components/LanguageSelector";

export function Header() {
  const t = useTranslations("auth.header");

  return (
    <header className="flex items-center justify-between px-6 py-4 lg:px-10">
      <div className="flex items-center gap-2">
        <Image
          src="/imgs/logo.webp"
          alt={t("brand")}
          width={40}
          height={40}
          className="size-10 shrink-0"
          priority
        />
        <span className="text-lg font-semibold text-secondary-500">{t("brand")}</span>
      </div>

      <LanguageSelector />
    </header>
  );
}
