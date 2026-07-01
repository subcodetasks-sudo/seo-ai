import { queryOptions } from "@tanstack/react-query";
import type { BrokenPageStatus } from "../types";
import { getBrokenPageDetail, getBrokenPages } from "./api";
import { notFoundProblemsKeys } from "./query-keys";

export function brokenPagesQueryOptions(
  projectId: string,
  status: BrokenPageStatus,
  page: number,
  pageSize: number = 20,
) {
  return queryOptions({
    queryKey: notFoundProblemsKeys.list(projectId, status, page),
    queryFn: () => getBrokenPages(projectId, status, page, pageSize),
    enabled: !!projectId,
  });
}

export function brokenPageDetailQueryOptions(projectId: string, pageId: string) {
  return queryOptions({
    queryKey: notFoundProblemsKeys.detail(projectId, pageId),
    queryFn: () => getBrokenPageDetail(projectId, pageId),
    enabled: !!projectId && !!pageId,
  });
}
