import type { ChangelogPeriod } from "../types";

export const changelogKeys = {
  all: ["changelog"] as const,
  list: (projectId: string, period: ChangelogPeriod) =>
    [...changelogKeys.all, "list", projectId, period] as const,
};
