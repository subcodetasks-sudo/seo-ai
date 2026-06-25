"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usageQueryOptions } from "../queries/queries";

function UsageRow({
  label,
  used,
  limit,
  unlimited,
}: {
  label: string;
  used: number;
  limit: number;
  unlimited: string;
}) {
  const isUnlimited = limit === -1;
  const percent = isUnlimited ? 0 : Math.min(Math.round((used / limit) * 100), 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-label-sm text-neutral-500">{label}</p>
        <p className="text-label-sm font-medium text-secondary-500">
          {isUnlimited
            ? `${used.toLocaleString()} / ${unlimited}`
            : `${used.toLocaleString()} / ${limit.toLocaleString()}`}
        </p>
      </div>
      {!isUnlimited && <Progress value={percent} className="h-2 bg-neutral-100" />}
    </div>
  );
}

export function UsageLimitsCard() {
  const t = useTranslations("settings.billing");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;

  const { data } = useQuery(usageQueryOptions());
  const usage = data?.data;

  const monthLabel = usage
    ? format(new Date(usage.month), "MMMM yyyy", { locale: dateLocale })
    : null;

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardContent className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-label-lg font-semibold text-secondary-500">{t("usageLimits")}</p>
          {monthLabel && (
            <p className="text-label-sm text-neutral-400">
              {t("billingMonth", { month: monthLabel })}
            </p>
          )}
        </div>

        {usage && (
          <div className="flex flex-col gap-5">
            <UsageRow
              label={t("pagesCrawled")}
              used={usage.pages_crawled}
              limit={usage.pages_crawled_limit}
              unlimited={t("unlimited")}
            />
            <UsageRow
              label={t("aiPages")}
              used={usage.ai_pages_used}
              limit={usage.ai_pages_limit}
              unlimited={t("unlimited")}
            />
            <UsageRow
              label={t("crawlsRun")}
              used={usage.crawls_run}
              limit={usage.crawls_limit}
              unlimited={t("unlimited")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
