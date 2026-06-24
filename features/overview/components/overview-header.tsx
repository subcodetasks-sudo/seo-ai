"use client";

import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

type OverviewHeaderProps = {
  lastCrawlAt?: string | null;
};

export function OverviewHeader({ lastCrawlAt }: OverviewHeaderProps) {
  const t = useTranslations("overview");
  const locale = useLocale();

  const dateLocale = locale === "ar" ? arSA : enUS;
  const formattedDate = lastCrawlAt
    ? format(new Date(lastCrawlAt), "MMMM d, yyyy", { locale: dateLocale })
    : "—";

  return (
    <div className="flex flex-col gap-1 text-start">
      <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
      <p className="text-label-md text-neutral-500">
        {t("lastUpdate", { date: formattedDate })}
      </p>
    </div>
  );
}
