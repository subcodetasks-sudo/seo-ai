export type ProjectCrawlStatus = "queued" | "running" | "done" | "stopped" | "failed";

export type ProjectListItem = {
  id: string;
  name: string;
  domain: string;
  platform: "wordpress" | "salla" | "custom";
  sitemap_url: string | null;
  url_filter: string[];
  verification_token: string;
  verification_method: string | null;
  is_verified: boolean;
  verified_at: string | null;
  health_score: number;
  last_crawl_at: string;
  pages_crawled: number;
  total_issues: number;
  total_404_pages: number;
  is_archived: boolean;
  preferred_language: string;
  created_at: string;
  setup_token: string;
  setup_link: string;
  setup_token_used: boolean;
  /** UUID of the most recent crawl job; null if never crawled */
  crawl_job_id?: string | null;
  /** Status of the most recent crawl; null if never crawled */
  crawl_status?: ProjectCrawlStatus | null;
};

export type AllProjectsResponse = {
  status: boolean;
  message: string;
  data: {
    items: ProjectListItem[];
  };
};

/* get project */
export type Project = {
  id: string;
  name: string;
  domain: string;
  platform: "wordpress" | "salla" | "custom";
  sitemap_url?: string;
  url_filter: string;
  verification_token: string;
  verification_method: string;
  is_verified: boolean;
  verified_at: string;
  health_score?: number;
  last_crawl_at?: string;
  is_archived: boolean;
  preferred_language: string;
  created_at: string;
  setup_token?: string;
  setup_link?: string;
  setup_token_used: boolean;
};

/* get project dashboard */
export type LastChange = {
  page_url: string;
  change_type: string;
  applied_at: string;
  status: string;
};

export type TopIssue = {
  type: string;
  count: number;
  severity: string;
};

export type ProjectDashboard = {
  health_score: number;
  last_crawl_at: string;
  pages_crawled: number;
  issues_critical: number;
  issues_high: number;
  issues_medium: number;
  issues_low: number;
  total_issues: number;
  total_404_pages: number;
  trend_vs_prev: unknown;
  pending_suggestions: number;
  top_issues: TopIssue[];
  ga_sessions: number | null;
  ga_users: number | null;
  ga_bounce_rate: number | null;
  ga_avg_session_duration: number | null;
  last_changes: LastChange[];
};

export type VerificationToken = {
  token: string;
  meta_tag: string;
  dns_txt: string;
  html_file_url: string;
  html_file_content: string;
};

export type VerificationTokenResponse = {
  status: boolean;
  message: string;
  data: VerificationToken;
};

/* create/update project */
export type CreateProjectRequest = {
  name: string;
  domain: string;
  platform: "wordpress" | "salla" | "custom";
  sitemap_url: string | null;
  url_filter: string[] | string | null;
};

export type UpdateProjectRequest = {
  name?: string;
  domain?: string;
  platform?: "wordpress" | "salla" | "custom";
  sitemap_url?: string;
  url_filter?: string[] | string | null;
};

/* get site sections */

export type ProjectSections = {
  domain: string;
  sitemap_found: boolean;
  message: string;
  sections: Section[];
};

export type Section = {
  prefix: string;
  count: number;
  label: string;
};

export type ProjectSectionsRequest = {
  domain: string;
};

export type ProjectSectionsApiResponse = {
  status: boolean;
  message: string;
  data: ProjectSections;
};

/* get crawl pages */

export type CrawlPagesSummary = {
  total_pages: number;
  total_issues: number;
  total_basic: number;
  total_internal: number;
};

export type CrawlPagesResponse = {
  status: boolean;
  message: string;
  data: CrawlPagesSummary;
};
