import { apiClient } from "@/lib/client";
import type { IssueSummary, IssueSummaryResponse } from "../types";

// TODO: set to false and delete mock-data.ts when the backend is ready
const USE_MOCK_SUMMARY = true;

export async function fetchIssueSummary(
  projectId: string,
  period: number,
): Promise<IssueSummary> {
  if (USE_MOCK_SUMMARY) {
    const { MOCK_ISSUE_SUMMARY } = await import("./mock-data");
    return { ...MOCK_ISSUE_SUMMARY, period_days: period };
  }

  const response = await apiClient<IssueSummaryResponse>(
    `projects/${projectId}/ai/issue-summary?days=${period}`,
    {},
    "Failed to fetch AI insights summary",
  );
  return response.data;
}
