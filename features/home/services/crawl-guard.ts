import { ApiError } from "@/lib/errors";

export type CrawlGuardCode = "crawl_in_progress" | "crawl_not_finished";

export type CrawlGuardError = {
  code: CrawlGuardCode;
  crawlJobId: string | null;
  canContinue: boolean;
  message: string;
};

function readErrorField(errors: Record<string, unknown>, key: string): unknown {
  return errors[key];
}

function asString(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
}

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  return false;
}

export function parseCrawlGuardError(error: unknown): CrawlGuardError | null {
  if (!(error instanceof ApiError) || !error.errors) return null;

  const code = asString(readErrorField(error.errors, "error"));
  if (code !== "crawl_in_progress" && code !== "crawl_not_finished") return null;

  return {
    code,
    crawlJobId: asString(readErrorField(error.errors, "crawl_job_id")),
    canContinue: asBoolean(readErrorField(error.errors, "can_continue")),
    message: error.message,
  };
}

export function isCrawlGuardError(error: unknown): boolean {
  return parseCrawlGuardError(error) !== null;
}

export function isActiveCrawlStatus(status: string | null | undefined): boolean {
  return status === "queued" || status === "running" || status === "in_progress";
}

export function isTerminalCrawlStatus(status: string | null | undefined): boolean {
  return status === "done" || status === "failed" || status === "stopped";
}
