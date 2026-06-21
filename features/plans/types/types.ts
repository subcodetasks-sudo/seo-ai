export type PlanId = string;

export type Plan = {
  id: string;
  name: string;
  max_projects: number;
  max_pages_per_crawl: number;
  max_crawls_per_month: number;
  max_ai_pages_per_month: number;
  ai_model: string;
  crawl_schedule: string;
  price_monthly_usd: string;
  price_monthly_sar: string;
}
