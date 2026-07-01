import { apiClient } from "@/lib/client";
import type {
  BrokenPageDetailResponse,
  BrokenPageStatus,
  BrokenPagesResponse,
} from "../types";

export function getBrokenPages(
  projectId: string,
  status: BrokenPageStatus,
  page: number,
  pageSize: number = 20,
) {
  return apiClient<BrokenPagesResponse>(
    `projects/${projectId}/broken-pages?status=${status}&page=${page}&page_size=${pageSize}`,
  );
}

export function getBrokenPageDetail(projectId: string, brokenPageId: string) {
  return apiClient<BrokenPageDetailResponse>(
    `projects/${projectId}/broken-pages/${brokenPageId}`,
  );
}

export function redirectBrokenPage(
  projectId: string,
  brokenPageId: string,
  targetUrl: string,
) {
  return apiClient(
    `projects/${projectId}/broken-pages/${brokenPageId}/redirect`,
    {
      method: "POST",
      body: JSON.stringify({ target_url: targetUrl }),
    },
  );
}
