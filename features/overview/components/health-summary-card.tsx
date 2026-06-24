"use client";

import { RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStartCrawl } from "@/features/home";
import type { ProjectDashboard } from "../types";
import { getHealthStatus } from "../services/health-status";
import { HealthScoreGauge } from "./health-score-gauge";

type HealthSummaryCardProps = {
  projectId: string;
  domain: string;
  dashboard: ProjectDashboard;
  onRescanSuccess?: () => void;
};

export function HealthSummaryCard({
  projectId,
  domain,
  dashboard,
  onRescanSuccess,
}: HealthSummaryCardProps) {
  const t = useTranslations("overview");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;

  const { mutate: startCrawl, isPending: isRescanning } = useStartCrawl();
  const healthStatus = getHealthStatus(dashboard.health_score);

  const lastScanRelative = dashboard.last_crawl_at
    ? formatDistanceToNow(new Date(dashboard.last_crawl_at), {
        addSuffix: true,
        locale: dateLocale,
      })
    : "—";

  const pagesCount = new Intl.NumberFormat(locale).format(dashboard.pages_crawled);

  function handleRescan() {
    startCrawl(projectId, {
      onSuccess: () => onRescanSuccess?.(),
    });
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-4 lg:max-w-xs">
        <Button
          type="button"
          className="h-10 gap-2 bg-primary-300 text-secondary-500 hover:bg-primary-400"
          onClick={handleRescan}
          disabled={isRescanning}
        >
          <RefreshCw
            className={isRescanning ? "size-4 animate-spin" : "size-4"}
            aria-hidden="true"
          />
          {t("rescan")}
        </Button>
        <p className="text-label-sm text-neutral-500">{t("nextCrawlUnknown")}</p>
      </div>

      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 text-start">
          <div className="space-y-1">
            <p className="text-label-md font-medium text-neutral-500">
              {t("healthIndicator")}
            </p>
            <h2 className="text-h3 font-semibold text-secondary-500">{domain}</h2>
          </div>

          <Badge className={healthStatus.badgeClassName}>
            {t(`healthStatus.${healthStatus.level}`)}
          </Badge>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label-sm text-neutral-500">
            <span>{t("pages", { count: pagesCount })}</span>
            <span>{t("lastScan", { time: lastScanRelative })}</span>
          </div>
        </div>

        <HealthScoreGauge score={dashboard.health_score} />
      </div>
    </div>
  );
}
