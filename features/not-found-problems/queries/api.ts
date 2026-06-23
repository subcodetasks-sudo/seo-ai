import { apiClient } from "@/lib/client";
import type { BrokenPageStatus, BrokenPagesResponse } from "../types";

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
