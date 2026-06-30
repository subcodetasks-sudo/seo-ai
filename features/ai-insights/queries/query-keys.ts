export const aiInsightsKeys = {
  all: ["ai-insights"] as const,
  summary: (projectId: string, period: number) =>
    [...aiInsightsKeys.all, "summary", projectId, period] as const,
};
