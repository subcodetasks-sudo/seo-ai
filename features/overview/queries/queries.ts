import { queryOptions } from "@tanstack/react-query";

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
