import { apiClient } from "@/lib/client";
import type { CrawlPagesResponse, IssueSummaryResponse } from "../types";

type FetchIssueSummaryParams = {
  projectId: string;
  severity?: string;
};

export async function fetchIssueSummary({
  projectId,
  severity,
}: FetchIssueSummaryParams): Promise<IssueSummaryResponse> {
  const params = new URLSearchParams();
  if (severity && severity !== "all") params.set("severity", severity);
  const query = params.toString();

  return apiClient<IssueSummaryResponse>(
    `projects/${projectId}/ai/issue-summary${query ? `?${query}` : ""}`,
  );
}
// app\api\projects\[project_id]\ai\issue-summary\route.ts

type FetchCrawlPagesParams = {
  projectId: string;
  crawlId: string;
  page: number;
  pageSize: number;
  severity?: string;
  issueType?: string;
};

export async function fetchCrawlPages({
  projectId,
  crawlId,
  page,
  pageSize,
  severity,
  issueType,
}: FetchCrawlPagesParams): Promise<CrawlPagesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (severity && severity !== "all") params.set("severity", severity);
  if (issueType && issueType !== "all") params.set("issue_type", issueType);

  return apiClient<CrawlPagesResponse>(
    `projects/${projectId}/crawls/${crawlId}/pages?${params.toString()}`,
  );
}

export async function generateSuggestion(
  projectId: string,
  suggestionType: string,
  pageUrl: string,
): Promise<void> {
  return apiClient(`projects/${projectId}/ai/generate`, {
    method: "POST",
    body: JSON.stringify({ suggestion_type: suggestionType, page_url: pageUrl }),
  });
}
