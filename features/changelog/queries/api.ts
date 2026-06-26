import { apiClient } from "@/lib/client";
import type { ChangelogPeriod, ChangelogResponse, GenerateReportFormValues } from "../types";

const PER_PAGE = 20;

export async function fetchChangelog(
  projectId: string,
  days: ChangelogPeriod,
  page: number,
): Promise<ChangelogResponse> {
  return apiClient<ChangelogResponse>(
    `projects/${projectId}/changelog?page=${page}&per_page=${PER_PAGE}&days=${days}`,
  );
}

export async function generateReport(
  projectId: string,
  payload: GenerateReportFormValues & { period: ChangelogPeriod },
): Promise<void> {
  return apiClient(`projects/${projectId}/changelog/report`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
