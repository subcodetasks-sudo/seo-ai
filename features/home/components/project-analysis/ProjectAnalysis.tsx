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
  const { isDone, crawlData, loadingProps } = useCrawlProgress({
    projectId,
    crawlId: crawlJobId,
    url,
  });

  if (isDone) {
    // Metrics come from the crawl status response — it only carries page
    // counts, so issues/suggestions stay at 0 until those endpoints are wired.
    return (
      <AnalysisSuccess
        url={url}
        pagesCount={crawlData?.pages_crawled ?? 0}
        issuesCount={0}
        aiSuggestionsCount={0}
        onViewIssues={onViewIssues}
        onViewProject={onViewProject}
      />
    );
  }

  return <AnalysisLoading {...loadingProps} />;
}
