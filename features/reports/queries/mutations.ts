import { useMutation } from "@tanstack/react-query";

import type { ExportReportPdfPayload } from "../types";
import { exportReportPdf } from "./api";

export function useExportReportPdf(projectId: string) {
  return useMutation({
    mutationFn: (payload: ExportReportPdfPayload) => exportReportPdf(projectId, payload),
  });
}
