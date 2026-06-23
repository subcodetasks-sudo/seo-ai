import { useQuery } from "@tanstack/react-query";
import type { AnalysisLoadingProps, AnalysisStepId, AnalysisStepState } from "../components/project-analysis/AnalysisLoading";
import { crawlStatusQueryOptions } from "../queries/queries";
import type { CrawlJobResponse } from "../queries/api";

function mapCrawlStatusToSteps(crawlData: CrawlJobResponse["data"]): Record<AnalysisStepId, AnalysisStepState> {
  const baseSteps: Record<AnalysisStepId, AnalysisStepState> = {
    queued: { status: "pending" },
    crawling: { status: "pending" },
    analysis: { status: "pending" },
    aiSuggestions: { status: "pending" },
  };

  switch (crawlData.status) {
    case "queued":
      return {
        ...baseSteps,
        queued: { status: "active" },
      };

    case "in_progress":
      return {
        ...baseSteps,
        queued: { status: "completed" },
        crawling: {
          status: "active",
          pageCount: crawlData.pages_crawled,
        },
      };

    case "done":
      return {
        queued: { status: "completed" },
        crawling: { status: "completed", pageCount: crawlData.pages_crawled },
        analysis: { status: "completed" },
        aiSuggestions: { status: "completed" },
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
  loadingProps: AnalysisLoadingProps;
}

export function useCrawlProgress({
  projectId,
  crawlId,
  url,
}: UseCrawlProgressProps): UseCrawlProgressResult {
  const { data, isLoading, isError, error } = useQuery(
    crawlStatusQueryOptions(projectId, crawlId)
  );

  const crawlData = data?.data;
  const isDone = crawlData?.status === "done";

  return {
    isLoading,
    isError,
    isDone,
    error: error as Error | null,
    loadingProps: {
      url,
      steps: crawlData ? mapCrawlStatusToSteps(crawlData) : undefined,
    },
  };
}
