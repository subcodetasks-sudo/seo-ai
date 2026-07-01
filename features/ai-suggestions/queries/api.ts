import { apiClient } from "@/lib/client";
import type {
  ApiSuggestion,
  ApiSuggestionsResponse,
  BackendResponse,
  SuggestionPatchPayload,
  UnknownPatchPayload,
} from "../types";

type FetchSuggestionsParams = {
  projectId: string;
  page: number;
  perPage: number;
  type?: string;
  status?: string;
};

export async function fetchAiSuggestions({
  projectId,
  page,
  perPage,
  type,
  status,
}: FetchSuggestionsParams): Promise<ApiSuggestionsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (type && type !== "all") params.set("type", type);
  if (status && status !== "all") params.set("status", status);

  const response = await apiClient<BackendResponse<ApiSuggestionsResponse>>(
    `projects/${projectId}/ai/suggestions?${params.toString()}`,
  );
  return response.data;
}

export async function fetchSuggestionDetail(
  projectId: string,
  suggestionId: string,
): Promise<ApiSuggestion> {
  const response = await apiClient<BackendResponse<ApiSuggestion>>(
    `projects/${projectId}/ai/suggestions/${suggestionId}`,
  );
  return response.data;
}

export async function approveSuggestionBatch(projectId: string, ids: string[]): Promise<void> {
  return apiClient(`projects/${projectId}/ai/suggestions/approve-batch`, {
    method: "POST",
    body: JSON.stringify({ ids: ids }),
  });
}

export async function rejectSuggestionBatch(projectId: string, ids: string[]): Promise<void> {
  return apiClient(`projects/${projectId}/ai/suggestions/reject-batch`, {
    method: "POST",
    body: JSON.stringify({ ids: ids }),
  });
}

export async function approveAllSuggestions(projectId: string): Promise<void> {
  return apiClient(`projects/${projectId}/ai/suggestions/approve-all`, {
    method: "POST",
  });
}

export async function rejectAllSuggestions(projectId: string): Promise<void> {
  return apiClient(`projects/${projectId}/ai/suggestions/reject-all`, {
    method: "POST",
  });
}

export async function approveSuggestion(projectId: string, suggestionId: string): Promise<void> {
  return apiClient(`projects/${projectId}/ai/suggestions/${suggestionId}/approve`, {
    method: "POST",
  });
}

export async function rejectSuggestion(projectId: string, suggestionId: string): Promise<void> {
  return apiClient(`projects/${projectId}/ai/suggestions/${suggestionId}/reject`, {
    method: "POST",
  });
}

export async function ignoreSuggestion(projectId: string, suggestionId: string): Promise<void> {
  return apiClient(`projects/${projectId}/ai/suggestions/${suggestionId}/ignore`, {
    method: "POST",
  });
}

export async function editSuggestion(
  projectId: string,
  suggestionId: string,
  suggestedValue: SuggestionPatchPayload["suggested_value"] | UnknownPatchPayload["suggested_value"],
): Promise<ApiSuggestion> {
  const response = await apiClient<BackendResponse<ApiSuggestion>>(
    `projects/${projectId}/ai/suggestions/${suggestionId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ suggested_value: suggestedValue }),
    },
  );
  return response.data;
}
