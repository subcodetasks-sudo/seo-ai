export type CrawlStatus = "queued" | "running" | "in_progress" | "done" | "failed";

export type CrawlListItem = {
  crawl_job_id: string;
  project_id: string;
  status: CrawlStatus;
  trigger: string;
  pages_limit: number;
  pages_crawled: number;
  pages_total_est: number;
  started_at: string | null;
  finished_at: string | null;
  error_message: string | null;
  created_at: string;
  progress_pct: number;
};

export type CrawlListData = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: CrawlListItem[];
};

export type CrawlListResponse = {
  status: boolean;
  message: string;
  data: CrawlListData;
};

export type CrawlPageIssue = {
  type: string;
  severity: string;
  detail: string;
  points_deducted: number;
  suggestion_type?: string;
  page_type: string | null;
  ignored?: boolean;
};

export type CrawlPageSeoData = {
  meta_title: string;
  meta_title_length: number;
  meta_description?: string;
  meta_description_length: number;
  h1: string;
  h1_count: number;
  h2s: string[];
  h3s: string[];
  h4s: string[];
  h5s: string[];
  h6s: string[];
  canonical_url: string;
  robots_meta: string;
  is_noindex: boolean;
  images_total: number;
  images_missing_alt: number;
  images: unknown[];
  internal_links: number;
  external_links: number;
  internal_link_urls: string[];
  external_link_urls: string[];
  word_count: number;
  body_text: string;
  schema_types: unknown[];
  content_hash: string;
  og_title: string;
  og_description?: string;
  og_image?: string;
  hreflang: unknown[];
  has_viewport: boolean;
  page_size_bytes: number;
};

export type CrawlPageItem = {
  id: string;
  url: string;
  status_code: number;
  health_score: number;
  crawled_at: string;
  response_time_ms: number;
  is_redirect: boolean;
  issues: CrawlPageIssue[];
  seo_data: CrawlPageSeoData;
};

export type CrawlPagesData = {
  crawl_job_id: string;
  total: number;
  total_basic: number;
  total_internal: number;
  page: number;
  page_size: number;
  total_pages: number;
  total_issues: number;
  items: CrawlPageItem[];
};

export type CrawlPagesResponse = {
  status: boolean;
  message: string;
  data: CrawlPagesData;
};
