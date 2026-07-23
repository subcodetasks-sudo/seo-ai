export type PlanId = string;

export type PlanFeatures = {
  requests_limit?: number | null;
  api_token_limit?: number | null;
  max_websites?: number | null;
  crawling_enabled?: boolean;
  support_priority?: string | null;
  display_name?: string | null;
  highlights?: string[] | null;
  [key: string]: unknown;
};

export type DiscountType = "percent" | "fixed" | null;
export type DiscountScope = "project" | "month" | "year" | null;

/** Active plan from the public `GET /api/v1/plans` catalog. */
export type PublicPlan = {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number | null;
  price_yearly: number | null;
  max_projects: number;
  features: PlanFeatures | null;
  discount_type: DiscountType;
  discount_value: number | null;
  discount_scope: DiscountScope;
};

export type PublicPlansData = {
  plans: PublicPlan[];
  total: number;
};

/**
 * @deprecated Legacy billing-plans shape. Prefer `PublicPlan`.
 * Kept so older settings payloads that still embed plan limits compile.
 */
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
};
