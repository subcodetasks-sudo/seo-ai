"use client";

import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";

import { searchConsoleCountriesQueryOptions } from "../queries/queries";
import type { SearchConsolePeriod } from "../types";
import { SearchConsoleBreakdownTable } from "./search-console-breakdown-table";

type CountriesTabPanelProps = {
  projectId: string;
  period: SearchConsolePeriod;
};

export function CountriesTabPanel({ projectId, period }: CountriesTabPanelProps) {
  const t = useTranslations("searchConsole.countriesDashboard");
  const tCommon = useTranslations("common.state");

  const { data, isLoading, isError, refetch } = useQuery(searchConsoleCountriesQueryOptions(projectId, period));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !data) {
    return (
      <ErrorState title={tCommon("errorTitle")} retryLabel={tCommon("retry")} onRetry={() => refetch()} fullPage={false} />
    );
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
