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

export type ScanLogStatus = "completed" | "running" | "failed";

export type ScanLogEntry = {
  id: string;
  date: string;
  pages: number;
  issues: number;
  durationSeconds: number;
  status: ScanLogStatus;
};
