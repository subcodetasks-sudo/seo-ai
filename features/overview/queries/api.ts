import { apiClient } from "@/lib/client";
import { projectDashboardApiResponseSchema } from "../schemas/project-dashboard.schema";
import type { ProjectDashboardApiResponse } from "../types";

export async function getOverviewDashboard(projectId: string) {
  const response = await apiClient<ProjectDashboardApiResponse>(
    `projects/${projectId}/dashboard`,
    { method: "GET" },
  );

  return projectDashboardApiResponseSchema.parse(response);
}
