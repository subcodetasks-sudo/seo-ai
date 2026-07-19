"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";

import { googleAnalyticsTrafficSourcesQueryOptions } from "../queries/queries";
import type { GoogleAnalyticsPeriod } from "../types";
import { BreakdownCard } from "./breakdown-card";
import { TrafficSourceBreakdownRow } from "./breakdown-progress-row";
import { TrafficDistributionChart } from "./traffic-distribution-chart";

type TrafficSourcesTabPanelProps = {
  projectId: string;
  period: GoogleAnalyticsPeriod;
};

export function TrafficSourcesTabPanel({ projectId, period }: TrafficSourcesTabPanelProps) {
  const t = useTranslations("googleAnalytics.trafficSources");
  const tCommon = useTranslations("common.state");
  const { data, isLoading, isError, refetch } = useQuery(
    googleAnalyticsTrafficSourcesQueryOptions(projectId, period),
  );

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !data) {
    return (
      <ErrorState
        title={tCommon("errorTitle")}
        retryLabel={tCommon("retry")}
        onRetry={() => refetch()}
        fullPage={false}
      />
    );
  }

  const maxVisitors = data.sources.reduce((max, source) => Math.max(max, source.visitors), 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownCard title={t("title")} subtitle={t("visitorsSuccess")}>
        {data.sources.map((source) => (
          <TrafficSourceBreakdownRow key={source.id} item={source} maxVisitors={maxVisitors} />
        ))}
      </BreakdownCard>

      <TrafficDistributionChart segments={data.distribution} />
    </div>
  );
}
