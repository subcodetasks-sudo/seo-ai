import { useMutation, useQueryClient } from "@tanstack/react-query";

import { approveSuggestion, rejectSuggestion } from "./api";
import { aiSuggestionsKeys } from "./query-keys";

type SuggestionMutationVars = { projectId: string; suggestionId: string };

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
