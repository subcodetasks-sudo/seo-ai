import { apiClient } from "@/lib/client";
import type {
  AllProjectsResponse,
  CreateProjectRequest,
  CrawlPagesResponse,
  Project,
  ProjectSectionsApiResponse,
  ProjectSectionsRequest,
  UpdateProjectRequest,
  VerificationTokenResponse,
} from "../types";

export const createProject = (body: CreateProjectRequest) =>
  apiClient<{ status: boolean; message: string; data: Project }>("projects", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateProject = (body: UpdateProjectRequest, project_id: string) =>
  apiClient<{ status: boolean; message: string; data: Project }>(`projects/${project_id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteProject = (project_id: string) =>
  apiClient(`projects/${project_id}`, {
    method: "DELETE",
  });

export const getSiteSections = (body: ProjectSectionsRequest) =>
  apiClient<ProjectSectionsApiResponse>("projects/sections", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getAllProjects = () =>
  apiClient<AllProjectsResponse>("projects", {
    method: "GET",
  });

export const getSingleProject = (project_id: string) =>
  apiClient<{ status: boolean; message: string; data: Project }>(`projects/${project_id}`, {
    method: "GET",
  });

export const getProjectDashboard = (project_id: string) =>
  apiClient(`projects/${project_id}/dashboard`, {
    method: "GET",
  });

export const getVerificationToken = (project_id: string) =>
  apiClient<VerificationTokenResponse>(`projects/${project_id}/verify/token`, {
    method: "GET",
  });

export const verifyDomain = (method: string, project_id: string) =>
  apiClient(`projects/${project_id}/verify`, {
    method: "POST",
    body: JSON.stringify({ method }),
  });

export const getPageDetails = (project_id: string, domain: string) =>
  apiClient(`projects/${project_id}/pages/${domain}`, {
    method: "GET",
  });

export const getBrokenPages = (project_id: string) =>
  apiClient(
    `projects/${project_id}/broken-pages?status=new&page=1&page_size=20`,
    {
      method: "GET",
    },
  );

export const detectLanguage = (domain: string) =>
  apiClient("projects/detect-language", {
    method: "POST",
    body: JSON.stringify({ domain }),
  });

export type CrawlJobStatus =
  | "queued"
  | "running"
  | "in_progress"
  | "done"
  | "stopped"
  | "failed";

export type CrawlJobData = {
  crawl_job_id: string;
  project_id: string;
  status: CrawlJobStatus;
  pages_limit: number;
  pages_crawled?: number;
  pages_total_est?: number | null;
  progress_pct?: number | null;
  created_at?: string;
  started_at?: string | null;
  finished_at?: string | null;
  error_message?: string | null;
  message?: string;
};

export type CrawlJobResponse = {
  status: boolean;
  message: string;
  data: CrawlJobData;
};

export const startCrawl = (project_id: string) =>
  apiClient<CrawlJobResponse>(`projects/${project_id}/crawls`, {
    method: "POST",
  });

export const getCrawlStatus = (project_id: string, crawl_id: string) =>
  apiClient<CrawlJobResponse>(`projects/${project_id}/crawls/${crawl_id}`, {
    method: "GET",
  });

export const stopCrawl = (project_id: string, crawl_id: string) =>
  apiClient<CrawlJobResponse>(`projects/${project_id}/crawls/${crawl_id}/stop`, {
    method: "POST",
  });

export const continueCrawl = (project_id: string, crawl_id: string) =>
  apiClient<CrawlJobResponse>(`projects/${project_id}/crawls/${crawl_id}/continue`, {
    method: "POST",
  });

export const getCrawlPages = (project_id: string, crawl_id: string) =>
  apiClient<CrawlPagesResponse>(
    `projects/${project_id}/crawls/${crawl_id}/pages?page=1&page_size=1`,
    { method: "GET" },
  );
