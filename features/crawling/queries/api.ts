import { apiClient } from "@/lib/client";
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
