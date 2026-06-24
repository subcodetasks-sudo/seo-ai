"use client";

import { AlertTriangle, Link2Off, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { ProjectDashboard } from "../types";
import { getSeoErrorsTotal } from "../services/overview-metrics";
import { OverviewStatCard } from "./overview-stat-card";

type OverviewStatCardsProps = {
  dashboard: ProjectDashboard;
  brokenPagesCount: number;
};

export function OverviewStatCards({
  dashboard,
  brokenPagesCount,
}: OverviewStatCardsProps) {
  const t = useTranslations("overview.stats");
  const locale = useLocale();

  const seoErrorsTotal = getSeoErrorsTotal(dashboard);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <OverviewStatCard
        href="/dashboard/ai-suggestions"
        icon={Sparkles}
        count={dashboard.pending_suggestions}
        label={t("suggestions")}
        iconClassName="text-primary-500"
        locale={locale}
      />
      <OverviewStatCard
        href="/dashboard/problems"
        icon={AlertTriangle}
        count={seoErrorsTotal}
        label={t("seoErrors")}
        iconClassName="text-warning-500"
        locale={locale}
      />
      <OverviewStatCard
        href="/dashboard/404-problems"
        icon={Link2Off}
        count={brokenPagesCount}
        label={t("notFoundErrors")}
        iconClassName="text-warning-400"
        locale={locale}
      />
    </div>
  );
}
