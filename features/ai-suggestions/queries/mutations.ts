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
import type { SuggestionPatchPayload, UnknownPatchPayload } from "../types";

type SuggestionMutationVars = { projectId: string; suggestionId: string };
type BatchMutationVars = { projectId: string; ids: string[] };

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
    mutationFn: ({ projectId, ids }: BatchMutationVars) => approveAllSuggestions(projectId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiSuggestionsKeys.all });
    },
  });
}

export function useRejectAllSuggestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, ids }: BatchMutationVars) => rejectAllSuggestions(projectId, ids),
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
    onSuccess: (_data, { projectId, suggestionId }) => {
      queryClient.invalidateQueries({ queryKey: aiSuggestionsKeys.all });
      queryClient.invalidateQueries({
        queryKey: aiSuggestionsKeys.detail(projectId, suggestionId),
      });
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
  suggestedValue: SuggestionPatchPayload["suggested_value"] | UnknownPatchPayload["suggested_value"];
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
