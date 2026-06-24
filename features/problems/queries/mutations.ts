import { useMutation } from "@tanstack/react-query";

import { generateSuggestion } from "./api";

type GenerateForLinksVars = {
  projectId: string;
  suggestionType: string;
  pageUrls: string[];
};

export function useGenerateSuggestionsForLinks() {
  return useMutation({
    mutationFn: ({ projectId, suggestionType, pageUrls }: GenerateForLinksVars) =>
      Promise.all(pageUrls.map((url) => generateSuggestion(projectId, suggestionType, url))),
  });
}
