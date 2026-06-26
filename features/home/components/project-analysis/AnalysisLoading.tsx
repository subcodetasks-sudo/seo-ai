"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useDirection } from "@/components/ui/direction";
import { cn } from "@/lib/utils";

export function AnalysisSpinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "size-6 shrink-0 animate-spin rounded-full border-2 border-success-100 border-t-success-300",
        className,
      )}
    />
  );
}

export function AnalysisCheck({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full bg-success-300 text-white",
        className,
      )}
      aria-hidden="true"
    >
      <Check className="size-3.5 stroke-[3px]" />
    </div>
  );
}

export type AnalysisStepId = "queued" | "crawling" | "analysis" | "aiSuggestions";

export type AnalysisStepStatus = "completed" | "active" | "pending";

export type AnalysisStepState = {
  status: AnalysisStepStatus;
  pageCount?: number;
  pagesTotalEst?: number;
  progressPct?: number;
};

export type AnalysisLoadingProps = {
  url: string;
  steps?: Partial<Record<AnalysisStepId, AnalysisStepState>>;
  errorMessage?: string | null;
};

const STEP_ORDER: AnalysisStepId[] = [
  "queued",
  "crawling",
  "analysis",
  "aiSuggestions",
];

// Default shown before any crawl data has arrived — a genuine loading state
// (first step spinning, the rest waiting), not a mocked progress snapshot.
const DEFAULT_STEPS: Record<AnalysisStepId, AnalysisStepState> = {
  queued: { status: "active" },
  crawling: { status: "pending" },
  analysis: { status: "pending" },
  aiSuggestions: { status: "pending" },
};

function PendingDot() {
  return (
    <span
      className="size-6 shrink-0 rounded-full bg-neutral-200"
      aria-hidden="true"
    />
  );
}

type AnalysisStepRowProps = {
  stepId: AnalysisStepId;
  status: AnalysisStepStatus;
  pageCount?: number;
  pagesTotalEst?: number;
  progressPct?: number;
  isLast: boolean;
};

function AnalysisStepRow({
  stepId,
  status,
  pageCount,
  pagesTotalEst,
  progressPct,
  isLast,
}: AnalysisStepRowProps) {
  const t = useTranslations("home.projectAnalysis.loading");
  const locale = useLocale();
  const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);

  const showProgress = status === "active" && (progressPct ?? 0) > 0;
  const showPageCount = status === "active" && pageCount !== undefined && pageCount > 0;

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 py-5",
        !isLast && "border-b border-neutral-200",
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-label-md font-semibold text-secondary-500">
          {t(`steps.${stepId}.title`)}
        </p>
        <p className="text-label-sm text-neutral-500">
          {t(`steps.${stepId}.description`)}
        </p>

        {showPageCount && (
          <p className="text-label-sm text-neutral-400">
            {pagesTotalEst && pagesTotalEst > 0
              ? t("pagesProgress", { crawled: fmt(pageCount!), total: fmt(pagesTotalEst) })
              : t("pages", { count: fmt(pageCount!) })}
          </p>
        )}

        {showProgress && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-success-300 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        {status === "completed" && (
          <>
            <AnalysisCheck />
            <span className="rounded-full border border-success-100 bg-success-50 px-2.5 py-0.5 text-label-sm font-medium text-success-400">
              {t("completed")}
            </span>
          </>
        )}

        {status === "active" && (
          <>
            <AnalysisSpinner />
            <span className="text-label-sm tabular-nums text-neutral-400">
              {showProgress ? `${progressPct}%` : t("waiting")}
            </span>
          </>
        )}

        {status === "pending" && (
          <>
            <PendingDot />
            <span className="text-label-sm text-neutral-300">{t("waiting")}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function AnalysisLoading({ url, steps, errorMessage }: AnalysisLoadingProps) {
  const dir = useDirection();
  const t = useTranslations("home.projectAnalysis.loading");

  const resolvedSteps = { ...DEFAULT_STEPS, ...steps };

  return (
    <div
      className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4"
      dir={dir}
    >
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-label-sm text-secondary-400">
          <span
            className="size-2 rounded-full bg-success-300"
            aria-hidden="true"
          />
          {t("statusBadge")}
        </span>

        <div className="space-y-3">
          <h1 className="text-h1 font-semibold text-secondary-500">
            {t("title")}
          </h1>
          <p className="rounded-lg border border-neutral-200 bg-neutral-75 px-4 py-2.5 text-label-md text-neutral-500">
            {url}
          </p>
        </div>
      </div>

      <div className="w-full rounded-xl border border-neutral-200 bg-white px-5">
        {STEP_ORDER.map((stepId, index) => {
          const step = resolvedSteps[stepId];

          return (
            <AnalysisStepRow
              key={stepId}
              stepId={stepId}
              status={step.status}
              pageCount={step.pageCount}
              pagesTotalEst={step.pagesTotalEst}
              progressPct={step.progressPct}
              isLast={index === STEP_ORDER.length - 1}
            />
          );
        })}
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="w-full rounded-xl border border-error-200 bg-error-50 px-5 py-4"
        >
          <p className="text-label-sm font-semibold text-error-500">
            {t("errorLabel")}
          </p>
          <p className="mt-0.5 text-label-sm text-error-400">{errorMessage}</p>
        </div>
      )}

      <p className="max-w-md text-center text-label-sm text-neutral-500">
        {t("footer")}
      </p>
    </div>
  );
}
