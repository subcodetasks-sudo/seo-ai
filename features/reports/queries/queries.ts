import { queryOptions } from "@tanstack/react-query";

import type { ReportsPeriod } from "../types";
import { getReportsAnalytics, getScanLog } from "./api";
import { reportsKeys } from "./query-keys";

export function reportsAnalyticsQueryOptions(projectId: string, period: ReportsPeriod) {
  return queryOptions({
    queryKey: reportsKeys.analytics(projectId, period),
    queryFn: () => getReportsAnalytics(projectId, period),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function scanLogQueryOptions(projectId: string, period: ReportsPeriod) {
  return queryOptions({
    queryKey: reportsKeys.scanLog(projectId, period),
    queryFn: () => getScanLog(projectId, period),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}
