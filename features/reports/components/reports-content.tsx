"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import SelectProjectState from "@/components/select-project-state";
import { useDirection } from "@/components/ui/direction";
import { allProjectsQueryOptions, useSelectedProject } from "@/features/home";
import { useExportReportPdf } from "../queries/mutations";
import { reportsAnalyticsQueryOptions, scanLogQueryOptions } from "../queries/queries";
import type { ExportReportPdfPayload, ReportsPeriod } from "../types";
import { ExportReportDialog } from "./export-report-dialog";
import { HealthScoreTrendChart } from "./health-score-trend-chart";
import { NotFoundTrendChart } from "./not-found-trend-chart";
import { ReportsHeader } from "./reports-header";
import { ScanLogTable } from "./scan-log-table";
import { SeoIssuesTrendChart } from "./seo-issues-trend-chart";
import { WeeklyChangesChart } from "./weekly-changes-chart";

export function ReportsContent() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();

  const [period, setPeriod] = useState<ReportsPeriod>(30);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastReportUrl, setLastReportUrl] = useState<string | null>(null);

  const { data: projectsResponse } = useQuery(allProjectsQueryOptions());
  const projects = projectsResponse?.data?.items ?? [];
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const domain = selectedProject?.domain ?? selectedProject?.name ?? "—";

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useQuery(reportsAnalyticsQueryOptions(selectedProjectId ?? "", period));

  const { data: scanLog = [], isLoading: isScanLogLoading } = useQuery(
    scanLogQueryOptions(selectedProjectId ?? "", period),
  );

  const { mutate: exportReportPdf, isPending: isExportingPdf } = useExportReportPdf(
    selectedProjectId ?? "",
  );

  function handleExportSubmit(values: ExportReportPdfPayload) {
    exportReportPdf(values, {
      onSuccess: (response) => {
        setDialogOpen(false);
        if (response.data?.url) {
          setLastReportUrl(response.data.url);
        }
        toast.success(t("exportSuccess"));
      },
    });
  }

  function handleDownload() {
    if (!lastReportUrl) return;
    window.open(lastReportUrl, "_blank", "noopener,noreferrer");
  }

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <SelectProjectState />
      </div>
    );
  }

  const isLoading = isAnalyticsLoading || isScanLogLoading;

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col gap-6">
        <ReportsHeader
          domain={domain}
          period={period}
          onPeriodChange={setPeriod}
          onOpenExportDialog={() => setDialogOpen(true)}
          onDownload={handleDownload}
          canDownload={Boolean(lastReportUrl)}
        />

        {isLoading ? (
          <LoadingState />
        ) : isAnalyticsError || !analytics ? (
          <ErrorState
            title={t("error")}
            retryLabel={tCommon("retry")}
            onRetry={() => refetchAnalytics()}
          />
        ) : (
          <>
            {(analytics.healthScoreTrend.length > 0 ||
              analytics.seoIssuesTrend.length > 0 ||
              analytics.notFoundTrend.length > 0 ||
              analytics.weeklyChanges.length > 0) && (
              <div className="grid min-w-0 gap-4 *:min-w-0 lg:grid-cols-2">
                {analytics.healthScoreTrend.length > 0 && (
                  <HealthScoreTrendChart data={analytics.healthScoreTrend} />
                )}
                {analytics.seoIssuesTrend.length > 0 && (
                  <SeoIssuesTrendChart data={analytics.seoIssuesTrend} />
                )}
                {analytics.notFoundTrend.length > 0 && (
                  <NotFoundTrendChart data={analytics.notFoundTrend} />
                )}
                {analytics.weeklyChanges.length > 0 && (
                  <WeeklyChangesChart data={analytics.weeklyChanges} />
                )}
              </div>
            )}

            <ScanLogTable items={scanLog} emptyMessage={t("empty")} />
          </>
        )}
      </div>

      <ExportReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleExportSubmit}
        isPending={isExportingPdf}
      />
    </div>
  );
}
