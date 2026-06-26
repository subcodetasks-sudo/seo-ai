"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useDirection } from "@/components/ui/direction";
import { Spinner } from "@/components/ui/spinner";
import { GenerateReportDialog } from "@/features/changelog/components/generate-report-dialog";
import { useGenerateReport } from "@/features/changelog/queries/mutations";
import type { ChangelogPeriod, GenerateReportFormValues } from "@/features/changelog/types";
import { allProjectsQueryOptions, useSelectedProject } from "@/features/home";
import { reportsAnalyticsQueryOptions, scanLogQueryOptions } from "../queries/queries";
import type { ReportsPeriod } from "../types";
import { HealthScoreTrendChart } from "./health-score-trend-chart";
import { NotFoundTrendChart } from "./not-found-trend-chart";
import { ReportsHeader } from "./reports-header";
import { ScanLogTable } from "./scan-log-table";
import { SeoIssuesTrendChart } from "./seo-issues-trend-chart";
import { WeeklyChangesChart } from "./weekly-changes-chart";

export function ReportsContent() {
  const t = useTranslations("reports");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();

  const [period, setPeriod] = useState<ReportsPeriod>(30);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: projectsResponse } = useQuery(allProjectsQueryOptions());
  const projects = projectsResponse?.data?.items ?? [];
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const domain = selectedProject?.domain ?? selectedProject?.name ?? "—";

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery(
    reportsAnalyticsQueryOptions(selectedProjectId ?? "", period),
  );

  const { data: scanLog = [], isLoading: isScanLogLoading } = useQuery(
    scanLogQueryOptions(selectedProjectId ?? "", period),
  );

  const { mutate: generateReport, isPending: isGenerating } = useGenerateReport(
    selectedProjectId ?? "",
    period as ChangelogPeriod,
  );

  function handleReportSubmit(values: GenerateReportFormValues) {
    generateReport(values, {
      onSuccess: () => setDialogOpen(false),
    });
  }

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <p className="text-label-md text-neutral-500">{t("noProject")}</p>
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
          onCreateReport={() => setDialogOpen(true)}
        />

        {isLoading || !analytics ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Spinner className="size-8 text-neutral-400" />
          </div>
        ) : (
          <>
            <div className="grid min-w-0 gap-4 *:min-w-0 lg:grid-cols-2">
              <HealthScoreTrendChart data={analytics.healthScoreTrend} />
              <SeoIssuesTrendChart data={analytics.seoIssuesTrend} />
              <NotFoundTrendChart data={analytics.notFoundTrend} />
              <WeeklyChangesChart data={analytics.weeklyChanges} />
            </div>

            {scanLog.length === 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
                <p className="text-label-md text-neutral-500">{t("empty")}</p>
              </div>
            ) : (
              <ScanLogTable items={scanLog} />
            )}
          </>
        )}
      </div>

      <GenerateReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleReportSubmit}
        isPending={isGenerating}
      />
    </div>
  );
}
