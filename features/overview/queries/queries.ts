import { queryOptions } from "@tanstack/react-query";

import { getBrokenPages } from "@/features/not-found-problems/queries/api";
import { getOverviewDashboard } from "./api";
import { overviewKeys } from "./query-keys";

export function overviewDashboardQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: overviewKeys.dashboard(projectId),
    queryFn: () => getOverviewDashboard(projectId),
    enabled: !!projectId,
    select: (response) => response.data,
  });
}

export function overviewBrokenPagesCountQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: overviewKeys.brokenPagesCount(projectId),
    queryFn: () => getBrokenPages(projectId, "new", 1, 1),
    enabled: !!projectId,
    select: (response) => response.data.total,
  });
}
