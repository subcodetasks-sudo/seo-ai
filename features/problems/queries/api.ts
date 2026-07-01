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

export const SCHEMA_PAGE_TYPES = [
  "Article",
  "Product",
  "FAQPage",
  "Organization",
  "BreadcrumbList",
  "WebPage",
  "LocalBusiness",
  "BlogPost",
] as const;

export type SchemaPageType = (typeof SCHEMA_PAGE_TYPES)[number];

type GenerateSuggestionParams = {
  projectId: string;
  suggestionType: string;
  pageUrl: string;
  pageType?: string | null;
  imageUrl?: string | null;
};

export async function generateSuggestion({
  projectId,
  suggestionType,
  pageUrl,
  pageType,
  imageUrl,
}: GenerateSuggestionParams): Promise<void> {
  const payload: Record<string, string | null> = {
    suggestion_type: suggestionType,
    page_url: pageUrl,
  };

  if (suggestionType === "schema") {
    if (!pageType || !SCHEMA_PAGE_TYPES.includes(pageType as SchemaPageType)) {
      throw new Error(`page_type must be one of: ${SCHEMA_PAGE_TYPES.join(", ")}`);
    }
    payload.page_type = pageType;
  } else if (suggestionType === "alt_text") {
    payload.image_url = imageUrl ?? null;
  }

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
