import { z } from "zod";

export const chartPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const reportsAnalyticsSchema = z.object({
  healthScoreTrend: z.array(chartPointSchema),
  seoIssuesTrend: z.array(chartPointSchema),
  notFoundTrend: z.array(chartPointSchema),
  weeklyChanges: z.array(chartPointSchema),
});

const trendPointSchema = z.object({ date: z.string(), value: z.number() });

export const reportsTrendsResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    health_score_trend: z.array(trendPointSchema),
    issues_trend: z.array(trendPointSchema),
    broken_pages_trend: z.array(trendPointSchema),
    applied_changes_weekly: z.array(trendPointSchema),
  }),
});

export const scanLogStatusSchema = z.enum(["completed", "done", "running", "failed"]);

export const scanLogEntrySchema = z.object({
  id: z.string(),
  status: scanLogStatusSchema,
  trigger: z.string(),
  pages_crawled: z.number(),
  created_at: z.string(),
  finished_at: z.string(),
  health_score: z.number().nullable(),
});

export const scanLogResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    total: z.number(),
    page: z.number(),
    per_page: z.number(),
    total_pages: z.number(),
    items: z.array(scanLogEntrySchema),
  }),
});
