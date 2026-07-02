import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateIssueSuggestion, ignoreIssue } from "./api";
import { crawlingKeys } from "./query-keys";

type GenerateIssueSuggestionVars = {
  projectId: string;
  suggestionType: string;
  pageUrl: string;
  pageType?: string | null;
  imageUrl?: string;
};

export function useGenerateIssueSuggestion() {
  return useMutation({
    mutationFn: (vars: GenerateIssueSuggestionVars) => generateIssueSuggestion(vars),
  });
}

type IgnoreIssueVars = {
  projectId: string;
  issueType: string;
  pageUrl: string;
};

export function useIgnoreIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: IgnoreIssueVars) => ignoreIssue(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crawlingKeys.all });
    },
  });
}
