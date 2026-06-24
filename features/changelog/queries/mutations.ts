import { useMutation } from "@tanstack/react-query";

import type { ChangelogPeriod } from "../types";
import { generateReport } from "./api";

export function useGenerateReport(projectId: string, period: ChangelogPeriod) {
  return useMutation({
    mutationFn: (payload: { title: string; email: string }) =>
      generateReport(projectId, { ...payload, period }),
  });
}
