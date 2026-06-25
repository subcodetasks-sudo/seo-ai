import type { ProjectDashboard } from "../types";

export function getSeoErrorsTotal(dashboard: ProjectDashboard): number {
  return (
    dashboard.issues_critical +
    dashboard.issues_high +
    dashboard.issues_medium +
    dashboard.issues_low
  );
}
