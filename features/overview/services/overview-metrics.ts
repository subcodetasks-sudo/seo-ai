import type { ProjectDashboard } from "../types";

export function getSeoErrorsTotal(dashboard: ProjectDashboard): number {
  return dashboard.total_issues;
}
