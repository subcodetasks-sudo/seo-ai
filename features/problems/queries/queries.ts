import { queryOptions } from "@tanstack/react-query";

import { problemsKeys } from "./query-keys";
import { fetchCrawlPages, fetchIssueSummary } from "./api";

type IssueSummaryParams = {
  projectId: string;
  severity?: string;
};

export function issueSummaryQueryOptions({ projectId, severity }: IssueSummaryParams) {
  return queryOptions({
    queryKey: problemsKeys.issueSummary(projectId, severity),
    queryFn: () => fetchIssueSummary({ projectId, severity }),
    select: (response) => response.data,
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 2,
  });
}

type CrawlPagesParams = {
  projectId: string;
  crawlId: string;
  page: number;
  pageSize: number;
  severity?: string;
  issueType?: string;
};

export function crawlPagesQueryOptions({
  projectId,
  crawlId,
  page,
  pageSize,
  severity,
  issueType,
}: CrawlPagesParams) {
  return queryOptions({
    queryKey: problemsKeys.pages(projectId, crawlId, page, severity, issueType),
    queryFn: () => fetchCrawlPages({ projectId, crawlId, page, pageSize, severity, issueType }),
    select: (response) => response.data,
    enabled: Boolean(projectId) && Boolean(crawlId),
    staleTime: 1000 * 60 * 2,
  });
}
