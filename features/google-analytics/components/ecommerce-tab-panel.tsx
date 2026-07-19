"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";

import { googleAnalyticsEcommerceQueryOptions } from "../queries/queries";
import type { GoogleAnalyticsPeriod } from "../types";
import { GoogleAnalyticsMetricCard } from "./google-analytics-metric-card";

type EcommerceTabPanelProps = {
  projectId: string;
  period: GoogleAnalyticsPeriod;
};

export function EcommerceTabPanel({ projectId, period }: EcommerceTabPanelProps) {
  const t = useTranslations("googleAnalytics.ecommerceDashboard");
  const tCommon = useTranslations("common.state");
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useQuery(googleAnalyticsEcommerceQueryOptions(projectId, period));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !summary) {
    return (
      <ErrorState
        title={tCommon("errorTitle")}
        retryLabel={tCommon("retry")}
        onRetry={() => refetch()}
        fullPage={false}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((metric) => (
        <GoogleAnalyticsMetricCard
          key={metric.id}
          metric={metric}
          valueSuffix={metric.id === "revenue" || metric.id === "avgOrderValue" ? t("currency") : undefined}
        />
      ))}
    </div>
  );
}
