import { useMutation, useQueryClient } from "@tanstack/react-query";

import { approveSuggestion, approveSuggestionBatch, editSuggestion, rejectSuggestion } from "./api";
import { aiSuggestionsKeys } from "./query-keys";

type SuggestionMutationVars = { projectId: string; suggestionId: string };
type BatchApproveMutationVars = { projectId: string; ids: string[] };

export function useApproveSuggestionBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, ids }: BatchApproveMutationVars) =>
      approveSuggestionBatch(projectId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSuggestionsKeys.all });
    },
  });
}


export function useApproveSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, suggestionId }: SuggestionMutationVars) =>
      approveSuggestion(projectId, suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSuggestionsKeys.all });
    },
  });
}

export function useRejectSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, suggestionId }: SuggestionMutationVars) =>
      rejectSuggestion(projectId, suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSuggestionsKeys.all });
    },
  });
}

type EditSuggestionVars = SuggestionMutationVars & {
  suggestedValue: Record<string, unknown>;
};

export function useEditSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, suggestionId, suggestedValue }: EditSuggestionVars) =>
      editSuggestion(projectId, suggestionId, suggestedValue),
    onSuccess: (_data, { projectId, suggestionId }) => {
      queryClient.invalidateQueries({
        queryKey: aiSuggestionsKeys.detail(projectId, suggestionId),
      });
    },
  });
}
