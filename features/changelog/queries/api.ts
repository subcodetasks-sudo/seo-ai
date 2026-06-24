import { apiClient } from "@/lib/client";
import type { ChangelogEntry, ChangelogPeriod } from "../types";

export async function fetchChangelog(
  projectId: string,
  period: ChangelogPeriod,
): Promise<ChangelogEntry[]> {
  return apiClient<ChangelogEntry[]>(
    `projects/${projectId}/changelog?period=${period}`,
  );
}

export async function generateReport(
  projectId: string,
  payload: { title: string; email: string; period: ChangelogPeriod },
): Promise<void> {
  return apiClient(`projects/${projectId}/changelog/report`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
