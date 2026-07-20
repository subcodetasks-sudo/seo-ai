"use client";

import { useQuery } from "@tanstack/react-query";
import { Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";

import { searchConsoleDevicesQueryOptions } from "../queries/queries";
import type { SearchConsolePeriod } from "../types";
import { SearchConsoleBreakdownTable } from "./search-console-breakdown-table";

type DevicesTabPanelProps = {
  projectId: string;
  period: SearchConsolePeriod;
};

export function DevicesTabPanel({ projectId, period }: DevicesTabPanelProps) {
  const t = useTranslations("searchConsole.devicesDashboard");
  const tCommon = useTranslations("common.state");

  const { data, isLoading, isError, refetch } = useQuery(searchConsoleDevicesQueryOptions(projectId, period));

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
      labelHeader={t("table.device")}
      clicksHeader={t("table.clicks")}
      impressionsHeader={t("table.impressions")}
      ctrHeader={t("table.ctr")}
      avgPositionHeader={t("table.avgPosition")}
      emptyLabel={t("empty")}
      emptyIcon={Smartphone}
    />
  );
}
