import { apiClient } from "@/lib/client";
import type { BackendResponse, GenerateSuggestionResult } from "@/features/ai-suggestions/types";
import type { CrawlListResponse, CrawlPagesResponse } from "../types";

export function listCrawls(projectId: string, page: number, pageSize: number) {
  return apiClient<CrawlListResponse>(
    `projects/${projectId}/crawls?page=${page}&page_size=${pageSize}`,
    { method: "GET" },
  );
}

export function getCrawlPages(
  projectId: string,
  crawlId: string,
  page: number,
  pageSize: number,
) {
  return apiClient<CrawlPagesResponse>(
    `projects/${projectId}/crawls/${crawlId}/pages?page=${page}&page_size=${pageSize}`,
    { method: "GET" },
  );
}

type GenerateIssueSuggestionParams = {
  projectId: string;
  suggestionType: string;
  pageUrl: string;
  pageType?: string | null;
  imageUrl?: string;
};

export async function generateIssueSuggestion({
  projectId,
  suggestionType,
  pageUrl,
  pageType,
  imageUrl,
}: GenerateIssueSuggestionParams): Promise<GenerateSuggestionResult> {
  const body: Record<string, string> = { suggestion_type: suggestionType, page_url: pageUrl };
  if (suggestionType === "schema" && pageType) body.page_type = pageType;
  if (suggestionType === "alt_text" && imageUrl) body.image_url = imageUrl;

  const response = await apiClient<BackendResponse<GenerateSuggestionResult>>(
    `projects/${projectId}/ai/generate`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
  return response.data;
}

type IgnoreIssueParams = {
  projectId: string;
  issueType: string;
  pageUrl: string;
};

export function ignoreIssue({ projectId, issueType, pageUrl }: IgnoreIssueParams) {
  return apiClient(`projects/${projectId}/issues/ignore`, {
    method: "POST",
    body: JSON.stringify({ page_url: pageUrl, issue_type: issueType }),
  });
}
