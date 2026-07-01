import type { BrokenPageStatus } from "../types";

export const notFoundProblemsKeys = {
  all: ["not-found-problems"] as const,
  list: (projectId: string, status: BrokenPageStatus, page: number) =>
    [...notFoundProblemsKeys.all, projectId, status, page] as const,
  detail: (projectId: string, pageId: string) =>
    [...notFoundProblemsKeys.all, projectId, "detail", pageId] as const,
};
