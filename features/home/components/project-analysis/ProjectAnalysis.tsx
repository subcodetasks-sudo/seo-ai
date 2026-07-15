"use client";

import { useCrawlProgress } from "../../hooks/useCrawlProgress";
import ProjectCrawlControls from "../project-crawl-controls";
import AnalysisLoading from "./AnalysisLoading";
import AnalysisSuccess from "./AnalysisSuccess";
import { isActiveCrawlStatus } from "../../services/crawl-guard";
import type { ProjectCrawlStatus } from "../../types";

type ProjectAnalysisProps = {
  projectId: string;
  crawlJobId: string;
  url: string;
  onViewProject: () => void;
};

export default function ProjectAnalysis({
  projectId,
  crawlJobId,
  url,
  onViewProject,
}: ProjectAnalysisProps) {
  const {
    isDone,
    loadingProps,
    crawlData,
    totalPages,
    totalIssues,
    totalBasic,
    totalInternal,
    isMetricsLoading,
  } = useCrawlProgress({
    projectId,
    crawlId: crawlJobId,
    url,
  });

  const rawStatus = crawlData?.status ?? "queued";
  const crawlStatus: ProjectCrawlStatus =
    rawStatus === "in_progress" ? "running" : (rawStatus as ProjectCrawlStatus);
  const showControls = crawlStatus !== "done";

  if (isDone) {
    return (
      <AnalysisSuccess
        url={url}
        projectId={projectId}
        crawlJobId={crawlJobId}
        pagesCount={totalPages}
        issuesCount={totalIssues}
        basicPagesCount={totalBasic}
        internalPagesCount={totalInternal}
        isMetricsLoading={isMetricsLoading}
        onViewProject={onViewProject}
      />
    );
  }

  return (
    <AnalysisLoading
      {...loadingProps}
      actions={
        showControls ? (
          <div className="w-full">
            <ProjectCrawlControls
              projectId={projectId}
              crawlJobId={crawlJobId}
              crawlStatus={crawlStatus}
              actionsOnly={isActiveCrawlStatus(crawlStatus)}
            />
          </div>
        ) : undefined
      }
    />
  );
}
