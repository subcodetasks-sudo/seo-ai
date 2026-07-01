"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnalysisLoadingProps, AnalysisStepId, AnalysisStepState } from "../components/project-analysis/AnalysisLoading";
import { crawlPagesQueryOptions, crawlStatusQueryOptions } from "../queries/queries";
import { homeKeys } from "../queries/query-keys";
import type { CrawlJobResponse } from "../queries/api";
import {
  subscribeToCrawlStatus,
  type CrawlRealtimeStatus,
} from "../services/crawl-realtime";

function mapCrawlStatusToSteps(crawlData: CrawlJobResponse["data"]): Record<AnalysisStepId, AnalysisStepState> {
  const baseSteps: Record<AnalysisStepId, AnalysisStepState> = {
    queued: { status: "pending" },
    crawling: { status: "pending" },
    analysis: { status: "pending" },
  };

  switch (crawlData.status) {
    case "queued":
      return {
        ...baseSteps,
        queued: { status: "active" },
      };

    case "running":
    case "in_progress":
      return {
        ...baseSteps,
        queued: { status: "completed" },
        crawling: {
          status: "active",
          pageCount: crawlData.pages_crawled,
          pagesTotalEst: crawlData.pages_total_est ?? undefined,
          progressPct: crawlData.progress_pct ?? undefined,
        },
      };

    case "done":
      return {
        queued: { status: "completed" },
        crawling: { status: "completed", pageCount: crawlData.pages_crawled },
        analysis: { status: "completed" },
      };

    case "failed":
      return {
        ...baseSteps,
        queued: { status: "completed" },
        crawling: { status: "active" },
      };

    default:
      return baseSteps;
  }
}

interface UseCrawlProgressProps {
  projectId: string;
  crawlId: string;
  url: string;
}

interface UseCrawlProgressResult {
  isLoading: boolean;
  isError: boolean;
  isDone: boolean;
  error: Error | null;
  crawlData: CrawlJobResponse["data"] | undefined;
  loadingProps: AnalysisLoadingProps;
  totalPages: number;
  totalIssues: number;
  isMetricsLoading: boolean;
}

export function useCrawlProgress({
  projectId,
  crawlId,
  url,
}: UseCrawlProgressProps): UseCrawlProgressResult {
  const queryClient = useQueryClient();
  const [realtimeStatus, setRealtimeStatus] =
    useState<CrawlRealtimeStatus | null>(null);

  const { data, isLoading, isError, error } = useQuery(
    crawlStatusQueryOptions(projectId, crawlId)
  );

  // Live status from Firebase Realtime DB. Each push triggers an immediate
  // REST refetch so the detailed step data (page counts) stays in sync without
  // waiting for the 2s polling tick. Non-fatal: no-ops when RTDB is unavailable.
  useEffect(() => {
    if (!crawlId) return;

    return subscribeToCrawlStatus(crawlId, (payload) => {
      if (!payload) return;
      setRealtimeStatus(payload.status);
      queryClient.invalidateQueries({
        queryKey: homeKeys.crawl(projectId, crawlId),
      });
    });
  }, [projectId, crawlId, queryClient]);

  const crawlData = data?.data;
  const isDone = crawlData?.status === "done" || realtimeStatus === "done";
  const failed = crawlData?.status === "failed" || realtimeStatus === "failed";

  const { data: pagesData, isPending: isPagesPending } = useQuery(
    crawlPagesQueryOptions(projectId, crawlId, isDone)
  );

  return {
    isLoading,
    isError: isError || failed,
    isDone,
    error: error as Error | null,
    crawlData,
    loadingProps: {
      url,
      steps: crawlData ? mapCrawlStatusToSteps(crawlData) : undefined,
      errorMessage: crawlData?.error_message ?? null,
    },
    totalPages: pagesData?.data.total_pages ?? 0,
    totalIssues: pagesData?.data.total_issues ?? 0,
    isMetricsLoading: isDone && isPagesPending,
  };
}
