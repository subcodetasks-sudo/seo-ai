import { queryOptions } from "@tanstack/react-query";

import type { ChangelogPeriod, ChangelogResponse } from "../types";
import { fetchChangelog } from "./api";
import { changelogKeys } from "./query-keys";

export function changelogQueryOptions(projectId: string, period: ChangelogPeriod, page: number) {
  return queryOptions<ChangelogResponse>({
    queryKey: changelogKeys.list(projectId, period, page),
    queryFn: () => fetchChangelog(projectId, period, page),
    enabled: !!projectId,
  });
}
