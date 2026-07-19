export const googleAnalyticsKeys = {
  all: ["google-analytics"] as const,
  status: (projectId: string) => [...googleAnalyticsKeys.all, "status", projectId] as const,
  properties: (projectId: string) => [...googleAnalyticsKeys.all, "properties", projectId] as const,
  overview: (projectId: string, days: number) => [...googleAnalyticsKeys.all, "overview", projectId, days] as const,
  ecommerce: (projectId: string, days: number) => [...googleAnalyticsKeys.all, "ecommerce", projectId, days] as const,
  trafficSources: (projectId: string, days: number) =>
    [...googleAnalyticsKeys.all, "traffic-sources", projectId, days] as const,
  pages: (projectId: string, days: number, limit: number) =>
    [...googleAnalyticsKeys.all, "pages", projectId, days, limit] as const,
  audience: (projectId: string, days: number) => [...googleAnalyticsKeys.all, "audience", projectId, days] as const,
  events: (projectId: string, days: number) => [...googleAnalyticsKeys.all, "events", projectId, days] as const,
  conversions: (projectId: string, days: number) =>
    [...googleAnalyticsKeys.all, "conversions", projectId, days] as const,
};
