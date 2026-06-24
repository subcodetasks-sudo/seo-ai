export const aiSuggestionsKeys = {
  all: ["ai-suggestions"] as const,
  list: (projectId: string, page: number, perPage: number, type?: string, status?: string) =>
    [...aiSuggestionsKeys.all, "list", projectId, page, perPage, type, status] as const,
  detail: (projectId: string, suggestionId: string) =>
    [...aiSuggestionsKeys.all, "detail", projectId, suggestionId] as const,
};
