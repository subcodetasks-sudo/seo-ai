"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import LoadingState from "@/components/loading-state";

import { searchConsolePagesQueryOptions } from "../queries/queries";
import type { SearchConsolePeriod } from "../types";
import { SearchConsoleItemsTable } from "./search-console-items-table";
import { SearchConsoleQueryError } from "./search-console-query-error";

type PagesTabPanelProps = {
  projectId: string;
  period: SearchConsolePeriod;
};

export function PagesTabPanel({ projectId, period }: PagesTabPanelProps) {
  const t = useTranslations("searchConsole.pagesDashboard");

  const { data, error, isLoading, isError, refetch } = useQuery(searchConsolePagesQueryOptions(projectId, period));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !data) {
    return <SearchConsoleQueryError error={error} onRetry={() => refetch()} />;
  }

  return (
    <SearchConsoleItemsTable
      title={t("title")}
      rows={data}
      labelHeader={t("table.page")}
      clicksHeader={t("table.clicks")}
      impressionsHeader={t("table.impressions")}
      ctrHeader={t("table.ctr")}
      avgPositionHeader={t("table.avgPosition")}
      sortByClicksLabel={t("sortByClicks")}
      sortByCtrLabel={t("sortByCtr")}
      searchPlaceholder={t("searchPlaceholder")}
      paginationLabel={(start, end, total) => t("pagination", { start, end, total })}
      previousPageLabel={t("previousPage")}
      nextPageLabel={t("nextPage")}
      pageNumberLabel={(page) => t("pageNumber", { page })}
      copyLabel={t("copyPath")}
      ltrLabel
    />
  );
}
