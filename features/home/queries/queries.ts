import { queryOptions } from "@tanstack/react-query";

import {
  detectLanguage,
  getAllProjects,
  getBrokenPages,
  getCrawlPages,
  getPageDetails,
  getProjectDashboard,
  getSingleProject,
  getSiteSections,
  getVerificationToken,
  getCrawlStatus,
} from "./api";
import { homeKeys } from "./query-keys";

export const allProjectsQueryOptions = () =>
  queryOptions({
    queryKey: homeKeys.projects(),
    queryFn: getAllProjects,
  });

export const projectQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: homeKeys.project(projectId),
    queryFn: () => getSingleProject(projectId),
  });

export const projectDashboardQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: homeKeys.dashboard(projectId),
    queryFn: () => getProjectDashboard(projectId),
  });

export const verificationTokenQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: homeKeys.verificationToken(projectId),
    queryFn: () => getVerificationToken(projectId),
  });

export const pageDetailsQueryOptions = (projectId: string, domain: string) =>
  queryOptions({
    queryKey: homeKeys.pageDetails(projectId, domain),
    queryFn: () => getPageDetails(projectId, domain),
  });

export const brokenPagesQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: homeKeys.brokenPages(projectId),
    queryFn: () => getBrokenPages(projectId),
  });

export const siteSectionsQueryOptions = (domain: string) =>
  queryOptions({
    queryKey: homeKeys.siteSections(domain),
    queryFn: () => getSiteSections({ domain }),
  });

export const languageDetectionQueryOptions = (domain: string) =>
  queryOptions({
    queryKey: homeKeys.languageDetection(domain),
    queryFn: () => detectLanguage(domain),
  });

export const crawlStatusQueryOptions = (projectId: string, crawlId: string) =>
  queryOptions({
    queryKey: homeKeys.crawl(projectId, crawlId),
    queryFn: () => getCrawlStatus(projectId, crawlId),
    enabled: !!projectId && !!crawlId,
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      return status === "done" || status === "failed" ? false : 2000;
    },
  });

export const crawlPagesQueryOptions = (projectId: string, crawlId: string, enabled: boolean) =>
  queryOptions({
    queryKey: homeKeys.crawlPages(projectId, crawlId),
    queryFn: () => getCrawlPages(projectId, crawlId),
    enabled: !!projectId && !!crawlId && enabled,
  });
