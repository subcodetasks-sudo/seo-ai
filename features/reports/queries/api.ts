import { apiClient } from "@/lib/client";
import type {
  ExportReportPdfPayload,
  ExportReportPdfResponse,
  ReportsAnalytics,
  ReportsPeriod,
  ScanLogEntry,
} from "../types";
import { reportsTrendsResponseSchema, scanLogResponseSchema } from "../schemas/reports.schema";

export async function getReportsAnalytics(
  projectId: string,
  period: ReportsPeriod,
): Promise<ReportsAnalytics> {
  const response = await apiClient(
    `projects/${projectId}/reports/trends?days=${period}`,
    {},
    "Failed to fetch reports trends",
  );
  const { data } = reportsTrendsResponseSchema.parse(response);
  const toChartPoints = (arr: { date: string; value: number }[]) =>
    arr.map(({ date, value }) => ({ label: date, value }));
  return {
    healthScoreTrend: toChartPoints(data.health_score_trend),
    seoIssuesTrend: toChartPoints(data.issues_trend),
    notFoundTrend: toChartPoints(data.broken_pages_trend),
    weeklyChanges: toChartPoints(data.applied_changes_weekly),
  };
}

export async function getScanLog(
  projectId: string,
  _period: ReportsPeriod,
): Promise<ScanLogEntry[]> {
  const response = await apiClient(
    `projects/${projectId}/reports/scan-log?page=1&per_page=10`,
    {},
    "Failed to fetch scan log",
  );
  return scanLogResponseSchema.parse(response).data.items;
}

export async function exportReportPdf(
  projectId: string,
  payload: ExportReportPdfPayload,
): Promise<ExportReportPdfResponse> {
  return apiClient<ExportReportPdfResponse>(
    `projects/${projectId}/reports/export-pdf`,
    { method: "POST", body: JSON.stringify(payload) },
    "Failed to export report",
  );
}
