import { apiClient } from "@/lib/client";

export const startCrawl = (project_id: string) =>
  apiClient(`projects/${project_id}/crawls`, {
    method: "POST",
  });

export const listCrawls = (
  project_id: string,
  page: number,
  page_size: number,
) =>
  apiClient(
    `projects/${project_id}/crawls?page=${page}&page_size=${page_size}`,
    { method: "GET" },
  );

export const getCrawlStatus = (project_id: string, crawl_id: string) =>
  apiClient(`projects/${project_id}/crawls/${crawl_id}`, {
    method: "GET",
  });

export const getCrawlPages = (project_id: string, crawl_id: string, page: number, page_size: number) =>
  apiClient(
    `projects/${project_id}/crawls/${crawl_id}/pages?page=${page}&page_size=${page_size}`,
    {
      method: "GET",
    },
  );
