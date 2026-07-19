"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Square } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { crawlingKeys } from "@/features/crawling/queries/query-keys";
import {
  useContinueCrawl,
  useStartCrawl,
  useStopCrawl,
} from "@/features/home/queries/mutations";
import { crawlStatusQueryOptions } from "@/features/home/queries/queries";
import { homeKeys } from "@/features/home/queries/query-keys";
import {
  isActiveCrawlStatus,
  isTerminalCrawlStatus,
} from "@/features/home/services/crawl-guard";
import type { ProjectCrawlStatus } from "@/features/home/types";

type ProjectCrawlControlsProps = {
  projectId: string;
  crawlJobId: string | null;
  crawlStatus: ProjectCrawlStatus | null;
  /** When true, show a compact inline layout (e.g. overview header actions). */
  compact?: boolean;
  /** When true, only render action buttons (no progress panel) for active crawls. */
  actionsOnly?: boolean;
  /** When true, only render status/progress (no action buttons). */
  statusOnly?: boolean;
  className?: string;
  onCrawlStarted?: (crawlJobId: string) => void;
};

const PRIMARY_BTN =
  "h-9 gap-2 bg-primary-300 px-4 text-secondary-500 hover:bg-primary-400 disabled:opacity-60";
const STOP_BTN =
  "h-9 gap-2 border-neutral-200 bg-white px-4 text-neutral-600 hover:border-error-200 hover:bg-error-50 hover:text-error-600";

function StopButton({
  onStop,
  disabled,
  isStopping,
}: {
  onStop: () => void;
  disabled: boolean;
  isStopping: boolean;
}) {
  const t = useTranslations("home.projects.crawl");
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onStop}
      disabled={disabled}
      className={STOP_BTN}
    >
      {isStopping ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Square className="size-3.5 fill-current" aria-hidden="true" />
      )}
      {isStopping ? t("stopping") : t("stop")}
    </Button>
  );
}

function ContinueButton({
  onContinue,
  disabled,
  isContinuing,
}: {
  onContinue: () => void;
  disabled: boolean;
  isContinuing: boolean;
}) {
  const t = useTranslations("home.projects.crawl");
  return (
    <Button
      type="button"
      onClick={onContinue}
      disabled={disabled}
      className={PRIMARY_BTN}
    >
      {isContinuing ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : null}
      {isContinuing ? t("continuing") : t("continue")}
    </Button>
  );
}

function RetryButton({
  onRetry,
  disabled,
  isRetrying,
}: {
  onRetry: () => void;
  disabled: boolean;
  isRetrying: boolean;
}) {
  const t = useTranslations("home.projects.crawl");
  return (
    <Button
      type="button"
      onClick={onRetry}
      disabled={disabled}
      className={PRIMARY_BTN}
    >
      <RefreshCw
        className={cn("size-4", isRetrying && "animate-spin")}
        aria-hidden="true"
      />
      {isRetrying ? t("retrying") : t("retry")}
    </Button>
  );
}

export default function ProjectCrawlControls({
  projectId,
  crawlJobId,
  crawlStatus,
  compact = false,
  actionsOnly = false,
  statusOnly = false,
  className,
  onCrawlStarted,
}: ProjectCrawlControlsProps) {
  const t = useTranslations("home.projects.crawl");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const numberFormatter = new Intl.NumberFormat(locale);

  const [status, setStatus] = useState<ProjectCrawlStatus | null>(crawlStatus);
  const [jobId, setJobId] = useState<string | null>(crawlJobId);
  const [pagesCrawled, setPagesCrawled] = useState(0);
  const [pagesTotalEst, setPagesTotalEst] = useState<number | null>(null);
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(crawlStatus);
    setJobId(crawlJobId);
  }, [crawlStatus, crawlJobId]);

  const isActive = isActiveCrawlStatus(status);
  const shouldFetch = !!projectId && !!jobId && status !== null && status !== "done";

  const { data: pollData } = useQuery({
    ...crawlStatusQueryOptions(projectId, jobId ?? ""),
    enabled: shouldFetch,
    refetchInterval: (query) => {
      if (!isActive) return false;
      const polled = query.state.data?.data.status;
      if (polled && isTerminalCrawlStatus(polled)) return false;
      return 4000;
    },
  });

  useEffect(() => {
    const data = pollData?.data;
    if (!data) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(data.status as ProjectCrawlStatus);
    setPagesCrawled(data.pages_crawled ?? 0);
    setPagesTotalEst(data.pages_total_est ?? null);
    setProgressPct(data.progress_pct ?? null);
    setErrorMessage(data.error_message ?? null);

    if (isTerminalCrawlStatus(data.status)) {
      void queryClient.invalidateQueries({ queryKey: homeKeys.projects() });
      void queryClient.invalidateQueries({ queryKey: crawlingKeys.all });
    }
  }, [pollData, queryClient]);

  const { mutate: stopCrawl, isPending: isStopping } = useStopCrawl();
  const { mutate: continueCrawl, isPending: isContinuing } = useContinueCrawl();
  const { mutate: startCrawl, isPending: isRetrying } = useStartCrawl();

  const actionInFlight = isStopping || isContinuing || isRetrying;

  function handleStop() {
    if (!jobId || actionInFlight) return;
    stopCrawl(
      { projectId, crawlJobId: jobId },
      {
        onSuccess: (response) => {
          setStatus("stopped");
          setPagesCrawled(response.data.pages_crawled ?? pagesCrawled);
          setPagesTotalEst(response.data.pages_total_est ?? pagesTotalEst);
        },
      },
    );
  }

  function handleContinue() {
    if (!jobId || actionInFlight) return;
    continueCrawl(
      { projectId, crawlJobId: jobId },
      {
        onSuccess: (response) => {
          setStatus("queued");
          setJobId(response.data.crawl_job_id);
          setPagesCrawled(response.data.pages_crawled ?? pagesCrawled);
          setPagesTotalEst(response.data.pages_total_est ?? pagesTotalEst);
          setProgressPct(null);
        },
      },
    );
  }

  function handleRetry() {
    if (actionInFlight) return;
    startCrawl(projectId, {
      onSuccess: (response) => {
        setJobId(response.data.crawl_job_id);
        setStatus("queued");
        setPagesCrawled(0);
        setPagesTotalEst(response.data.pages_total_est ?? null);
        setProgressPct(null);
        setErrorMessage(null);
        onCrawlStarted?.(response.data.crawl_job_id);
      },
    });
  }

  if (!status || !jobId || status === "done") {
    return null;
  }

  const crawledLabel = numberFormatter.format(pagesCrawled);
  const totalLabel =
    pagesTotalEst && pagesTotalEst > 0
      ? numberFormatter.format(pagesTotalEst)
      : "—";

  if (isActive) {
    if (actionsOnly) {
      return (
        <div className={cn(className)}>
          <StopButton onStop={handleStop} disabled={actionInFlight} isStopping={isStopping} />
        </div>
      );
    }

    if (statusOnly) {
      return (
        <div className={cn("min-w-0 space-y-2", className)}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-label-sm text-neutral-500">
              {status === "queued" ? t("queued") : t("running")}
              <span className="text-neutral-400">
                {" · "}
                {t("pagesProgress", { crawled: crawledLabel, total: totalLabel })}
              </span>
            </p>
            {progressPct != null && (
              <span className="text-label-sm tabular-nums text-secondary-500">
                {progressPct}%
              </span>
            )}
          </div>
          <Progress value={progressPct ?? 0} className="h-1.5 bg-neutral-100" />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-3",
          compact && "sm:flex-row sm:items-end sm:justify-between sm:gap-4",
          className,
        )}
      >
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-label-sm text-neutral-500">
              {status === "queued" ? t("queued") : t("running")}
              <span className="text-neutral-400">
                {" · "}
                {t("pagesProgress", { crawled: crawledLabel, total: totalLabel })}
              </span>
            </p>
            {progressPct != null && (
              <span className="text-label-sm tabular-nums text-secondary-500">
                {progressPct}%
              </span>
            )}
          </div>
          <Progress value={progressPct ?? 0} className="h-1.5 bg-neutral-100" />
        </div>
        <StopButton onStop={handleStop} disabled={actionInFlight} isStopping={isStopping} />
      </div>
    );
  }

  if (status === "stopped") {
    if (statusOnly) {
      return (
        <p className={cn("text-label-sm text-neutral-500", className)}>
          {t("incomplete", { crawled: crawledLabel, total: totalLabel })}
        </p>
      );
    }

    if (actionsOnly) {
      return (
        <div className={cn(className)}>
          <ContinueButton onContinue={handleContinue} disabled={actionInFlight} isContinuing={isContinuing} />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-3",
          compact && "sm:flex-row sm:items-center sm:justify-between sm:gap-4",
          className,
        )}
      >
        <p className="text-label-sm text-neutral-500">
          {t("incomplete", { crawled: crawledLabel, total: totalLabel })}
        </p>
        <ContinueButton onContinue={handleContinue} disabled={actionInFlight} isContinuing={isContinuing} />
      </div>
    );
  }

  if (status === "failed") {
    if (statusOnly) {
      return (
        <div className={cn("min-w-0 space-y-0.5", className)}>
          <p className="text-label-sm text-error-600">{t("failed")}</p>
          {errorMessage && (
            <p className="truncate text-label-xs text-neutral-400">{errorMessage}</p>
          )}
        </div>
      );
    }

    if (actionsOnly) {
      return (
        <div className={cn(className)}>
          <RetryButton onRetry={handleRetry} disabled={actionInFlight} isRetrying={isRetrying} />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-3",
          compact && "sm:flex-row sm:items-center sm:justify-between sm:gap-4",
          className,
        )}
      >
        <div className="min-w-0 space-y-0.5">
          <p className="text-label-sm text-error-600">{t("failed")}</p>
          {errorMessage && (
            <p className="truncate text-label-xs text-neutral-400">{errorMessage}</p>
          )}
        </div>
        <RetryButton onRetry={handleRetry} disabled={actionInFlight} isRetrying={isRetrying} />
      </div>
    );
  }

  return null;
}
