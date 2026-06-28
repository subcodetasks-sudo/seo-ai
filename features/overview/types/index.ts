import type { ProjectDashboard } from "@/features/home/types";

export type { ProjectDashboard, TopIssue, LastChange } from "@/features/home/types";

export type ChartPoint = {
  label: string;
  value: number;
};

export type HealthStatusLevel = "excellent" | "good" | "fair" | "poor";

export type HealthStatus = {
  level: HealthStatusLevel;
  badgeClassName: string;
};

export type OverviewMetrics = {
  seoErrorsTotal: number;
};

export type ProjectDashboardApiResponse = {
  status: boolean;
  message: string;
  data: ProjectDashboard;
};
