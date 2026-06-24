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

export const scanLogStatusSchema = z.enum(["completed", "running", "failed"]);

export const scanLogEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  pages: z.number(),
  issues: z.number(),
  durationSeconds: z.number(),
  status: scanLogStatusSchema,
});

export const scanLogResponseSchema = z.array(scanLogEntrySchema);
