"use client";

import { useCrawlProgress } from "../../hooks/useCrawlProgress";
import AnalysisLoading from "./AnalysisLoading";
import AnalysisSuccess from "./AnalysisSuccess";

type ProjectAnalysisProps = {
  projectId: string;
  crawlJobId: string;
  url: string;
  onViewIssues: () => void;
  onViewProject: () => void;
};

export default function ProjectAnalysis({
  projectId,
  crawlJobId,
  url,
  onViewIssues,
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
        pagesCount={totalPages}
        issuesCount={totalIssues}
        basicPagesCount={totalBasic}
        internalPagesCount={totalInternal}
        isMetricsLoading={isMetricsLoading}
        onViewIssues={onViewIssues}
        onViewProject={onViewProject}
      />
    );
  }

  return <AnalysisLoading {...loadingProps} />;
}
