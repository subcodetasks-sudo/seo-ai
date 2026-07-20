"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";

import { searchConsoleOverviewQueryOptions } from "../queries/queries";
import type { SearchConsolePeriod } from "../types";
import { SearchConsoleMetricsGrid } from "./search-console-metrics-grid";

type OverviewTabPanelProps = {
  projectId: string;
  period: SearchConsolePeriod;
};

export function OverviewTabPanel({ projectId, period }: OverviewTabPanelProps) {
  const tCommon = useTranslations("common.state");
  const {
    data: metrics,
    isLoading,
    isError,
    refetch,
  } = useQuery(searchConsoleOverviewQueryOptions(projectId, period));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !metrics) {
    return (
      <ErrorState title={tCommon("errorTitle")} retryLabel={tCommon("retry")} onRetry={() => refetch()} fullPage={false} />
    );
  }

  return <SearchConsoleMetricsGrid metrics={metrics} />;
}
