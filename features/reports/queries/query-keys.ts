import type { ReportsPeriod } from "../types";

export const reportsKeys = {
  all: ["reports"] as const,
  analytics: (projectId: string, period: ReportsPeriod) =>
    [...reportsKeys.all, "analytics", projectId, period] as const,
  scanLog: (projectId: string, period: ReportsPeriod) =>
    [...reportsKeys.all, "scanLog", projectId, period] as const,
};
