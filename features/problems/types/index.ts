export type ProblemSeverity = "critical" | "high" | "medium" | "low";
export type ProblemFilter = "all" | ProblemSeverity;

export type IssueSummaryItem = {
  type: string;
  severity: ProblemSeverity;
  count: number;
  affected_pages: number;
};

export type IssueSummaryResponse = {
  project_id: string;
  crawl_job_id: string;
  total_issues: number;
  items: IssueSummaryItem[];
};

export type PageIssue = {
  type: string;
  severity: ProblemSeverity;
  detail: string;
  points_deducted: number;
};

export type CrawlPageItem = {
  id: string;
  url: string;
  status_code: number;
  health_score: number;
  issues: PageIssue[];
};

export type CrawlPagesData = {
  crawl_job_id: string;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: CrawlPageItem[];
};

export type CrawlPagesResponse = {
  status: boolean;
  message: string;
  data: CrawlPagesData;
};
