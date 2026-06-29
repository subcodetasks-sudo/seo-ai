export type ReportsPeriod = 7 | 30 | 90;

export type ChartPoint = {
  label: string;
  value: number;
};

export type ReportsAnalytics = {
  healthScoreTrend: ChartPoint[];
  seoIssuesTrend: ChartPoint[];
  notFoundTrend: ChartPoint[];
  weeklyChanges: ChartPoint[];
};

export type ScanLogStatus = "completed" | "running" | "failed" | "done";

export type ScanLogEntry = {
  id: string;
  status: ScanLogStatus;
  trigger: string;
  pages_crawled: number;
  created_at: string;
  finished_at: string;
  health_score: number | null;
};
