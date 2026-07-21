"use client";

import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

import LoadingState from "@/components/loading-state";

import { searchConsoleCountriesQueryOptions } from "../queries/queries";
import type { SearchConsolePeriod } from "../types";
import { SearchConsoleBreakdownTable } from "./search-console-breakdown-table";
import { SearchConsoleQueryError } from "./search-console-query-error";

type CountriesTabPanelProps = {
  projectId: string;
  period: SearchConsolePeriod;
};

export function CountriesTabPanel({ projectId, period }: CountriesTabPanelProps) {
  const t = useTranslations("searchConsole.countriesDashboard");

  const { data, error, isLoading, isError, refetch } = useQuery(searchConsoleCountriesQueryOptions(projectId, period));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !data) {
    return <SearchConsoleQueryError error={error} onRetry={() => refetch()} />;
  }

  return (
    <SearchConsoleBreakdownTable
      title={t("title")}
      rows={data}
      labelHeader={t("table.country")}
      clicksHeader={t("table.clicks")}
      impressionsHeader={t("table.impressions")}
      ctrHeader={t("table.ctr")}
      avgPositionHeader={t("table.avgPosition")}
      emptyLabel={t("empty")}
      emptyIcon={Globe}
    />
  );
}
