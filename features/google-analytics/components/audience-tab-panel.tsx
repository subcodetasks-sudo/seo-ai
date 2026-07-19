"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";

import { googleAnalyticsAudienceQueryOptions } from "../queries/queries";
import type { GoogleAnalyticsPeriod } from "../types";
import { BreakdownCard } from "./breakdown-card";
import { CountryBreakdownRow } from "./breakdown-progress-row";
import { TrafficDistributionChart } from "./traffic-distribution-chart";

type AudienceTabPanelProps = {
  projectId: string;
  period: GoogleAnalyticsPeriod;
};

export function AudienceTabPanel({ projectId, period }: AudienceTabPanelProps) {
  const t = useTranslations("googleAnalytics.audience");
  const tCommon = useTranslations("common.state");
  const { data, isLoading, isError, refetch } = useQuery(
    googleAnalyticsAudienceQueryOptions(projectId, period),
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

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownCard title={t("countries")}>
        {data.countries.map((country) => (
          <CountryBreakdownRow key={country.label} item={country} />
        ))}
      </BreakdownCard>

      <TrafficDistributionChart segments={data.distribution} />
    </div>
  );
}
