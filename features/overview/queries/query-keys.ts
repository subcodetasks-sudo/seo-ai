export const overviewKeys = {
  all: ["overview"] as const,
  dashboard: (projectId: string) =>
    [...overviewKeys.all, "dashboard", projectId] as const,
};
