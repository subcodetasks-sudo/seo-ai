export function getHealthScoreRingClassName(score: number): string {
  if (score >= 80) return "text-primary-400";
  if (score >= 60) return "text-success-500";
  if (score >= 40) return "text-warning-500";
  return "text-error-500";
}

export function getStatusCodeBadgeClassName(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) {
    return "border-success-100 bg-success-50 text-success-600";
  }
  if (statusCode >= 300 && statusCode < 400) {
    return "border-warning-100 bg-warning-50 text-warning-600";
  }
  return "border-error-100 bg-error-50 text-error-600";
}

export function isNotFoundStatus(statusCode: number): boolean {
  return statusCode === 404;
}

export function getStatusCodeLabel(statusCode: number, t: (key: string) => string): string {
  if (isNotFoundStatus(statusCode)) return t("statusNotFound");
  if (statusCode >= 200 && statusCode < 300) return t("statusOk");
  return String(statusCode);
}

export function getCrawlStatusBadgeClassName(status: string): string {
  switch (status) {
    case "done":
      return "border-success-100 bg-success-50 text-success-600";
    case "failed":
      return "border-error-100 bg-error-50 text-error-600";
    case "running":
    case "in_progress":
      return "border-primary-100 bg-primary-50 text-primary-600";
    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-500";
  }
}

export function getSeverityBadgeClassName(severity: string): string {
  switch (severity) {
    case "critical":
    case "high":
      return "border-error-100 bg-error-50 text-error-600";
    case "medium":
      return "border-warning-100 bg-warning-50 text-warning-600";
    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-500";
  }
}
