export const homeKeys = {
  all: ["home"] as const,
  projects: () => [...homeKeys.all, "projects"] as const,
  project: (projectId: string) => [...homeKeys.all, "projects", projectId] as const,
  dashboard: (projectId: string) => [...homeKeys.project(projectId), "dashboard"] as const,
  verificationToken: (projectId: string) =>
    [...homeKeys.project(projectId), "verification-token"] as const,
  pageDetails: (projectId: string, domain: string) =>
    [...homeKeys.project(projectId), "pages", domain] as const,
  brokenPages: (projectId: string) =>
    [...homeKeys.project(projectId), "broken-pages"] as const,
  siteSections: (domain: string) => [...homeKeys.all, "site-sections", domain] as const,
  languageDetection: (domain: string) =>
    [...homeKeys.all, "language-detection", domain] as const,
  crawl: (projectId: string, crawlId: string) =>
    [...homeKeys.project(projectId), "crawl", crawlId] as const,
};