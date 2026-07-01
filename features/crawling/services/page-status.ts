export function getHealthScoreBadgeClassName(score: number): string {
  if (score >= 80) return "border-primary-100 bg-primary-50 text-primary-600";
  if (score >= 60) return "border-success-100 bg-success-50 text-success-600";
  if (score >= 40) return "border-warning-100 bg-warning-50 text-warning-600";
  return "border-error-100 bg-error-50 text-error-600";
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
