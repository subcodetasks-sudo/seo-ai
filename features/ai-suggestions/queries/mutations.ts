import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  approveAllSuggestions,
  approveSuggestion,
  approveSuggestionBatch,
  editSuggestion,
  ignoreSuggestion,
  rejectAllSuggestions,
  rejectSuggestion,
  rejectSuggestionBatch,
} from "./api";
import { aiSuggestionsKeys } from "./query-keys";

type SuggestionMutationVars = { projectId: string; suggestionId: string };
type BatchMutationVars = { projectId: string; ids: string[] };
type ProjectMutationVars = { projectId: string };

export function useApproveSuggestionBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, ids }: BatchMutationVars) => approveSuggestionBatch(projectId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSuggestionsKeys.all });
    },
  });
}

export function useRejectSuggestionBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, ids }: BatchMutationVars) => rejectSuggestionBatch(projectId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSuggestionsKeys.all });
    },
  });
}

export function useApproveAllSuggestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId }: ProjectMutationVars) => approveAllSuggestions(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSuggestionsKeys.all });
    },
  });
}

export function useRejectAllSuggestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId }: ProjectMutationVars) => rejectAllSuggestions(projectId),
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

export function useIgnoreSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, suggestionId }: SuggestionMutationVars) =>
      ignoreSuggestion(projectId, suggestionId),
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
