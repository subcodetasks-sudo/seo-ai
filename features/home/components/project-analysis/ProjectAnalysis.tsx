"use client";

import { useCrawlProgress } from "../../hooks/useCrawlProgress";
import AnalysisLoading from "./AnalysisLoading";
import AnalysisSuccess from "./AnalysisSuccess";

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

  return <AnalysisLoading {...loadingProps} />;
}
