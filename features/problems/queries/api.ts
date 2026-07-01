import { apiClient } from "@/lib/client";
import type { CrawlPagesResponse, IssueSummaryApiResponse } from "../types";

type FetchIssueSummaryParams = {
  projectId: string;
  severity?: string;
};

export async function fetchIssueSummary({
  projectId,
  severity,
}: FetchIssueSummaryParams): Promise<IssueSummaryApiResponse> {
  const params = new URLSearchParams();
  if (severity && severity !== "all") params.set("severity", severity);
  const query = params.toString();

  return apiClient<IssueSummaryApiResponse>(
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

type GenerateSuggestionParams = {
  projectId: string;
  suggestionType: string;
  pageUrl: string;
};

export async function generateSuggestion({
  projectId,
  suggestionType,
  pageUrl,
}: GenerateSuggestionParams): Promise<void> {
  const payload = {
    suggestion_type: suggestionType,
    page_url: pageUrl,
  };

  return apiClient(`projects/${projectId}/ai/generate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function ignoreIssue(
  projectId: string,
  issueType: string,
  pageUrl: string,
): Promise<void> {
  return apiClient(`projects/${projectId}/issues/ignore`, {
    method: "POST",
    body: JSON.stringify({ page_url: pageUrl, issue_type: issueType }),
  });
}
