export const overviewKeys = {
  all: ["overview"] as const,
  dashboard: (projectId: string) =>
    [...overviewKeys.all, "dashboard", projectId] as const,
  brokenPagesCount: (projectId: string) =>
    [...overviewKeys.all, "broken-pages-count", projectId] as const,
};
