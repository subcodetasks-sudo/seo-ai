"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";

import { googleAnalyticsOverviewQueryOptions } from "../queries/queries";
import type { GoogleAnalyticsPeriod } from "../types";
import { GoogleAnalyticsMetricsGrid } from "./google-analytics-metrics-grid";

type OverviewTabPanelProps = {
  projectId: string;
  period: GoogleAnalyticsPeriod;
};

export function OverviewTabPanel({ projectId, period }: OverviewTabPanelProps) {
  const tCommon = useTranslations("common.state");
  const {
    data: metrics,
    isLoading,
    isError,
    refetch,
  } = useQuery(googleAnalyticsOverviewQueryOptions(projectId, period));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !metrics) {
    return (
      <ErrorState
        title={tCommon("errorTitle")}
        retryLabel={tCommon("retry")}
        onRetry={() => refetch()}
        fullPage={false}
      />
    );
  }

  return <GoogleAnalyticsMetricsGrid metrics={metrics} />;
}
