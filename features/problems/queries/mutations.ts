import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateSuggestion, ignoreIssue } from "./api";
import { problemsKeys } from "./query-keys";

type GenerateForLinksVars = {
  projectId: string;
  suggestionType: string;
  pageUrls: string[];
  pageType?: string | null;
  imageUrl?: string | null;
};

export function useGenerateSuggestionsForLinks() {
  return useMutation({
    mutationFn: ({ projectId, suggestionType, pageUrls, pageType, imageUrl }: GenerateForLinksVars) =>
      Promise.all(
        pageUrls.map((pageUrl) =>
          generateSuggestion({ projectId, suggestionType, pageUrl, pageType, imageUrl }),
        ),
      ),
  });
}

const IGNORE_REQUEST_DELAY_MS = 300;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type IgnoreIssueForLinksVars = {
  projectId: string;
  issueType: string;
  pageUrls: string[];
};

export function useIgnoreIssueForLinks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, issueType, pageUrls }: IgnoreIssueForLinksVars) => {
      const failedUrls: string[] = [];

      for (let i = 0; i < pageUrls.length; i++) {
        await ignoreIssue(projectId, issueType, pageUrls[i])
          .catch(() => {
            failedUrls.push(pageUrls[i]);
          });

        if (i < pageUrls.length - 1) await delay(IGNORE_REQUEST_DELAY_MS);
      }

      if (failedUrls.length > 0) {
        throw new Error(`Failed to ignore ${failedUrls.length} of ${pageUrls.length} pages`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: problemsKeys.all });
    },
  });
}
