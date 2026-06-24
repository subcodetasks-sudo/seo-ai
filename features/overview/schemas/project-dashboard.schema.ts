import { z } from "zod";

const topIssueSchema = z.object({
  type: z.string(),
  count: z.number(),
  severity: z.string(),
});

export const projectDashboardSchema = z.object({
  health_score: z.number(),
  last_crawl_at: z.string(),
  pages_crawled: z.number(),
  issues_critical: z.number(),
  issues_high: z.number(),
  issues_medium: z.number(),
  issues_low: z.number(),
  trend_vs_prev: z.unknown(),
  pending_suggestions: z.number(),
  top_issues: z.array(topIssueSchema),
});

export const projectDashboardApiResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: projectDashboardSchema,
});
