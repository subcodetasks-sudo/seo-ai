export const problemsKeys = {
  all: ["problems"] as const,
  issueSummary: (projectId: string, severity?: string) =>
    [...problemsKeys.all, "issue-summary", projectId, severity ?? "all"] as const,
  pages: (
    projectId: string,
    crawlId: string,
    page: number,
    severity?: string,
    issueType?: string,
  ) =>
    [
      ...problemsKeys.all,
      "pages",
      projectId,
      crawlId,
      page,
      severity ?? "all",
      issueType ?? "all",
    ] as const,
};
