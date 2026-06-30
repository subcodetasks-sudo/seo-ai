import { queryOptions } from "@tanstack/react-query";

import { fetchIssueSummary } from "./api";
import { aiInsightsKeys } from "./query-keys";

export function issueSummaryQueryOptions(projectId: string, period: number) {
  return queryOptions({
    queryKey: aiInsightsKeys.summary(projectId, period),
    queryFn: () => fetchIssueSummary(projectId, period),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}
