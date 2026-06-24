import { queryOptions } from "@tanstack/react-query";

import type { AiSuggestion, ApiSuggestionsResponse, SuggestionStatus } from "../types";
import { scoreToLevel, transformSuggestionDetail } from "../services/transform-detail";
import { aiSuggestionsKeys } from "./query-keys";
import { fetchAiSuggestions, fetchSuggestionDetail } from "./api";

type TransformedList = {
  items: AiSuggestion[];
  total: number;
  page: number;
  per_page: number;
};

function transformList(response: ApiSuggestionsResponse): TransformedList {
  return {
    items: response.suggestions.map((s) => ({
      id: s.id,
      url: s.page_url,
      type: s.suggestion_type,
      priority: scoreToLevel(s.confidence_score),
      impact: scoreToLevel(s.confidence_score),
      status: s.status as SuggestionStatus,
    })),
    total: response.total,
    page: response.page,
    per_page: response.per_page,
  };
}

type ListParams = {
  projectId: string;
  page: number;
  perPage: number;
  type?: string;
  status?: string;
};

export function aiSuggestionsQueryOptions({ projectId, page, perPage, type, status }: ListParams) {
  return queryOptions({
    queryKey: aiSuggestionsKeys.list(projectId, page, perPage, type, status),
    queryFn: () => fetchAiSuggestions({ projectId, page, perPage, type, status }),
    select: transformList,
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 2,
  });
}

export function aiSuggestionDetailQueryOptions(projectId: string, suggestionId: string) {
  return queryOptions({
    queryKey: aiSuggestionsKeys.detail(projectId, suggestionId),
    queryFn: () => fetchSuggestionDetail(projectId, suggestionId),
    select: transformSuggestionDetail,
    enabled: Boolean(projectId) && Boolean(suggestionId),
    staleTime: 1000 * 60 * 5,
  });
}
