import { z } from "zod";

const topIssueSchema = z.object({
  type: z.string(),
  count: z.number(),
  severity: z.string(),
});

const lastChangeSchema = z.object({
  page_url: z.string(),
  change_type: z.string(),
  applied_at: z.string(),
  status: z.string(),
});

export const projectDashboardSchema = z.object({
  health_score: z.number(),
  last_crawl_at: z.string(),
  pages_crawled: z.number(),
  issues_critical: z.number(),
  issues_high: z.number(),
  issues_medium: z.number(),
  issues_low: z.number(),
  total_issues: z.number(),
  total_404_pages: z.number(),
  trend_vs_prev: z.unknown(),
  pending_suggestions: z.number(),
  top_issues: z.array(topIssueSchema),
  ga_sessions: z.number().nullable(),
  ga_users: z.number().nullable(),
  ga_bounce_rate: z.number().nullable(),
  ga_avg_session_duration: z.number().nullable(),
  last_changes: z.array(lastChangeSchema),
});

export const projectDashboardApiResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: projectDashboardSchema,
});
