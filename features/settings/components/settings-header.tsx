"use client";

import { useTranslations } from "next-intl";

export function SettingsHeader() {
  const t = useTranslations("settings");

  return (
    <div className="flex flex-col gap-1 text-start">
      <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
      <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
    </div>
  );
}
