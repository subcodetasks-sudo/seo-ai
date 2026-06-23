import { queryOptions } from "@tanstack/react-query";
import type { BrokenPageStatus } from "../types";
import { getBrokenPages } from "./api";
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
