import type { ChangelogPeriod } from "../types";

export const changelogKeys = {
  all: ["changelog"] as const,
  list: (projectId: string, period: ChangelogPeriod, page: number) =>
    [...changelogKeys.all, "list", projectId, period, page] as const,
};
