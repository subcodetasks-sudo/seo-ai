"use client";

import { useQuery } from "@tanstack/react-query";

import LoadingState from "@/components/loading-state";

import { searchConsoleOverviewQueryOptions } from "../queries/queries";
import type { SearchConsolePeriod } from "../types";
import { SearchConsoleMetricsGrid } from "./search-console-metrics-grid";
import { SearchConsoleQueryError } from "./search-console-query-error";

type OverviewTabPanelProps = {
  projectId: string;
  period: SearchConsolePeriod;
};

export function OverviewTabPanel({ projectId, period }: OverviewTabPanelProps) {
  const {
    data: metrics,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery(searchConsoleOverviewQueryOptions(projectId, period));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !metrics) {
    return <SearchConsoleQueryError error={error} onRetry={() => refetch()} />;
  }

  return <SearchConsoleMetricsGrid metrics={metrics} />;
}
