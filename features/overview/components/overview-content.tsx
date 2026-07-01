"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useDirection } from "@/components/ui/direction";
import { useRouter } from "@/i18n/navigation";
import { allProjectsQueryOptions, useSelectedProject } from "@/features/home";
import ProjectAnalysis from "@/features/home/components/project-analysis/ProjectAnalysis";
import { overviewKeys } from "../queries/query-keys";
import { overviewDashboardQueryOptions } from "../queries/queries";
import { HealthSummaryCard } from "./health-summary-card";
import { HealthScoreTrendChart } from "./health-score-trend-chart";
import { OverviewHeader } from "./overview-header";
import { OverviewStatCards } from "./overview-stat-cards";
import { RecentChangesList } from "./recent-changes-list";
import { SeoIssuesTrendChart } from "./seo-issues-trend-chart";

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}

export function OverviewContent() {
  const t = useTranslations("overview");
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedProjectId } = useSelectedProject();
  const [activeCrawlId, setActiveCrawlId] = useState<string | null>(null);

  const { data: projectsResponse } = useQuery(allProjectsQueryOptions());
  const projects = projectsResponse?.data?.items ?? [];
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useQuery(overviewDashboardQueryOptions(selectedProjectId ?? ""));

  function handleRescanSuccess(crawlJobId: string) {
    setActiveCrawlId(crawlJobId);
  }

  function handleCrawlDone() {
    setActiveCrawlId(null);
    if (selectedProjectId) {
      void queryClient.invalidateQueries({
        queryKey: overviewKeys.dashboard(selectedProjectId),
      });
    }
  }

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <p className="text-label-md text-neutral-500">{t("noProject")}</p>
      </div>
    );
  }

  if (activeCrawlId) {
    return (
      <div dir={dir} className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <ProjectAnalysis
          projectId={selectedProjectId}
          crawlJobId={activeCrawlId}
          url={selectedProject?.domain ?? ""}
          onViewIssues={() => {
            handleCrawlDone();
            router.push("/dashboard/problems");
          }}
          onViewProject={handleCrawlDone}
        />
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6">
        {isDashboardLoading ? (
          <OverviewSkeleton />
        ) : isDashboardError || !dashboard ? (
          <div className="flex flex-col gap-6">
            <OverviewHeader />
            <ErrorState
              title={t("error")}
              retryLabel={tCommon("retry")}
              onRetry={() => refetchDashboard()}
            />
          </div>
        ) : (
          <>
            <OverviewHeader lastCrawlAt={dashboard.last_crawl_at} />

            <HealthSummaryCard
              projectId={selectedProjectId}
              domain={selectedProject?.domain ?? selectedProject?.name ?? "—"}
              dashboard={dashboard}
              onRescanSuccess={handleRescanSuccess}
            />

            <OverviewStatCards
              dashboard={dashboard}
              brokenPagesCount={dashboard.total_404_pages}
            />

            <div className="grid min-w-0 gap-4 *:min-w-0 lg:grid-cols-2">
              <HealthScoreTrendChart />
              <SeoIssuesTrendChart />
            </div>

            {dashboard.last_changes.length > 0 ? (
              <RecentChangesList items={dashboard.last_changes} />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
