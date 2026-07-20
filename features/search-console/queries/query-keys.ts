export const searchConsoleKeys = {
  all: ["search-console"] as const,
  status: (projectId: string) => [...searchConsoleKeys.all, "status", projectId] as const,
  sites: (projectId: string) => [...searchConsoleKeys.all, "sites", projectId] as const,
  overview: (projectId: string, days: number) => [...searchConsoleKeys.all, "overview", projectId, days] as const,
  queries: (projectId: string, days: number, limit: number) =>
    [...searchConsoleKeys.all, "queries", projectId, days, limit] as const,
  pages: (projectId: string, days: number, limit: number) =>
    [...searchConsoleKeys.all, "pages", projectId, days, limit] as const,
  countries: (projectId: string, days: number, limit: number) =>
    [...searchConsoleKeys.all, "countries", projectId, days, limit] as const,
  devices: (projectId: string, days: number) => [...searchConsoleKeys.all, "devices", projectId, days] as const,
  sitemaps: (projectId: string) => [...searchConsoleKeys.all, "sitemaps", projectId] as const,
};
