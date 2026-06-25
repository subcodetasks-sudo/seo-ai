import type { ReportsAnalytics, ReportsPeriod, ScanLogEntry } from "../types";
import { reportsAnalyticsSchema, scanLogResponseSchema } from "../schemas/reports.schema";
import { MOCK_ANALYTICS_BY_PERIOD, MOCK_SCAN_LOG } from "./mock-data";

// TODO: replace mock when backend exposes GET projects/{id}/reports?period={n}
export async function getReportsAnalytics(
  projectId: string,
  period: ReportsPeriod,
): Promise<ReportsAnalytics> {
  void projectId;
  const data = MOCK_ANALYTICS_BY_PERIOD[period];
  return reportsAnalyticsSchema.parse(data);
}

// TODO: replace mock when backend exposes GET projects/{id}/crawls for scan log
export async function getScanLog(
  projectId: string,
  period: ReportsPeriod,
): Promise<ScanLogEntry[]> {
  void projectId;
  void period;
  return scanLogResponseSchema.parse(MOCK_SCAN_LOG);
}
