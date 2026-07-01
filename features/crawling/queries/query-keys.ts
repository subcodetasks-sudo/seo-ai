export const crawlingKeys = {
  all: ["crawling"] as const,
  crawls: (projectId: string, page: number, pageSize: number) =>
    [...crawlingKeys.all, "crawls", projectId, page, pageSize] as const,
  pages: (projectId: string, crawlId: string, page: number, pageSize: number) =>
    [...crawlingKeys.all, "pages", projectId, crawlId, page, pageSize] as const,
};
