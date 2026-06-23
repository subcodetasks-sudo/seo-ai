export type ProjectListItem = {
  id: string;
  name: string;
  domain: string;
  platform: "wordpress" | "salla" | "custom";
  sitemap_url: string | null;
  url_filter: string | null;
  verification_token: string;
  verification_method: string | null;
  is_verified: boolean;
  verified_at: string | null;
  health_score: number | null;
  last_crawl_at: string | null;
  is_archived: boolean;
  preferred_language: string;
  created_at: string;
  setup_token: string | null;
  setup_link: string | null;
  setup_token_used: boolean;
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
export type ProjectDashboard = {
  health_score: number;
  last_crawl_at: string;
  pages_crawled: number;
  issues_critical: number;
  issues_high: number;
  issues_medium: number;
  issues_low: number;
  trend_vs_prev: unknown;
  pending_suggestions: number;
  top_issues: TopIssue[];
};

export type TopIssue = {
  type: string;
  count: number;
  severity: string;
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
