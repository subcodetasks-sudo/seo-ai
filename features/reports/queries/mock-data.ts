import type { ReportsAnalytics, ReportsPeriod, ScanLogEntry } from "../types";

const ANALYTICS_7_DAYS: ReportsAnalytics = {
  healthScoreTrend: [
    { label: "May 9", value: 5 },
    { label: "May 12", value: 6 },
    { label: "May 16", value: 7 },
    { label: "May 20", value: 6 },
    { label: "May 24", value: 7 },
    { label: "May 28", value: 8 },
    { label: "Jun 1", value: 7 },
  ],
  seoIssuesTrend: [
    { label: "May 9", value: 5 },
    { label: "May 12", value: 4 },
    { label: "May 16", value: 6 },
    { label: "May 20", value: 3 },
    { label: "May 24", value: 5 },
    { label: "May 28", value: 4 },
    { label: "Jun 1", value: 3 },
  ],
  notFoundTrend: [
    { label: "May 9", value: 3 },
    { label: "May 12", value: 5 },
    { label: "May 16", value: 4 },
    { label: "May 20", value: 6 },
    { label: "May 24", value: 5 },
    { label: "May 28", value: 7 },
    { label: "Jun 1", value: 6 },
  ],
  weeklyChanges: [
    { label: "Apr W3", value: 3 },
    { label: "Apr W4", value: 5 },
    { label: "May W1", value: 4 },
    { label: "May W2", value: 6 },
    { label: "May W3", value: 5 },
    { label: "May W4", value: 7 },
    { label: "Jun W1", value: 6 },
  ],
};

const ANALYTICS_30_DAYS: ReportsAnalytics = {
  healthScoreTrend: [
    { label: "May 1", value: 4 },
    { label: "May 5", value: 5 },
    { label: "May 9", value: 5 },
    { label: "May 13", value: 6 },
    { label: "May 17", value: 7 },
    { label: "May 21", value: 6 },
    { label: "May 25", value: 7 },
    { label: "May 29", value: 8 },
    { label: "Jun 1", value: 7 },
  ],
  seoIssuesTrend: [
    { label: "May 1", value: 6 },
    { label: "May 5", value: 5 },
    { label: "May 9", value: 5 },
    { label: "May 13", value: 4 },
    { label: "May 17", value: 6 },
    { label: "May 21", value: 3 },
    { label: "May 25", value: 5 },
    { label: "May 29", value: 4 },
    { label: "Jun 1", value: 3 },
  ],
  notFoundTrend: [
    { label: "May 1", value: 4 },
    { label: "May 5", value: 3 },
    { label: "May 9", value: 3 },
    { label: "May 13", value: 5 },
    { label: "May 17", value: 4 },
    { label: "May 21", value: 6 },
    { label: "May 25", value: 5 },
    { label: "May 29", value: 7 },
    { label: "Jun 1", value: 6 },
  ],
  weeklyChanges: [
    { label: "Apr W1", value: 2 },
    { label: "Apr W2", value: 4 },
    { label: "Apr W3", value: 3 },
    { label: "Apr W4", value: 5 },
    { label: "May W1", value: 4 },
    { label: "May W2", value: 6 },
    { label: "May W3", value: 5 },
    { label: "May W4", value: 7 },
    { label: "Jun W1", value: 6 },
  ],
};

const ANALYTICS_90_DAYS: ReportsAnalytics = {
  healthScoreTrend: [
    { label: "Mar", value: 3 },
    { label: "Apr", value: 5 },
    { label: "May", value: 7 },
    { label: "Jun", value: 8 },
  ],
  seoIssuesTrend: [
    { label: "Mar", value: 6 },
    { label: "Apr", value: 5 },
    { label: "May", value: 4 },
    { label: "Jun", value: 3 },
  ],
  notFoundTrend: [
    { label: "Mar", value: 5 },
    { label: "Apr", value: 4 },
    { label: "May", value: 6 },
    { label: "Jun", value: 5 },
  ],
  weeklyChanges: [
    { label: "Mar W2", value: 2 },
    { label: "Mar W4", value: 3 },
    { label: "Apr W2", value: 4 },
    { label: "Apr W4", value: 5 },
    { label: "May W2", value: 6 },
    { label: "May W4", value: 7 },
    { label: "Jun W1", value: 6 },
  ],
};

export const MOCK_ANALYTICS_BY_PERIOD: Record<ReportsPeriod, ReportsAnalytics> = {
  7: ANALYTICS_7_DAYS,
  30: ANALYTICS_30_DAYS,
  90: ANALYTICS_90_DAYS,
};

export const MOCK_SCAN_LOG: ScanLogEntry[] = [
  {
    id: "1",
    date: "2026-05-31",
    pages: 142,
    issues: 38,
    durationSeconds: 252,
    status: "completed",
  },
  {
    id: "2",
    date: "2026-05-24",
    pages: 138,
    issues: 45,
    durationSeconds: 241,
    status: "completed",
  },
  {
    id: "3",
    date: "2026-05-17",
    pages: 135,
    issues: 52,
    durationSeconds: 235,
    status: "completed",
  },
  {
    id: "4",
    date: "2026-05-10",
    pages: 130,
    issues: 61,
    durationSeconds: 228,
    status: "completed",
  },
  {
    id: "5",
    date: "2026-05-03",
    pages: 128,
    issues: 68,
    durationSeconds: 220,
    status: "completed",
  },
];
