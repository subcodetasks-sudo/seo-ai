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
};

export type AnalysisLoadingProps = {
  url: string;
  steps?: Partial<Record<AnalysisStepId, AnalysisStepState>>;
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
  isLast: boolean;
};

function AnalysisStepRow({
  stepId,
  status,
  pageCount,
  isLast,
}: AnalysisStepRowProps) {
  const t = useTranslations("home.projectAnalysis.loading");
  const locale = useLocale();

  const formattedPageCount =
    pageCount !== undefined
      ? new Intl.NumberFormat(locale).format(pageCount)
      : undefined;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-5",
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
      </div>

      <div className="flex shrink-0 items-center gap-2">
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
            {formattedPageCount !== undefined && (
              <span className="text-label-sm font-medium text-success-400">
                {t("pages", { count: formattedPageCount })}
              </span>
            )}
          </>
        )}

        {status === "pending" && (
          <>
            <PendingDot />
            <span className="text-label-sm text-neutral-400">{t("waiting")}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function AnalysisLoading({ url, steps }: AnalysisLoadingProps) {
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
              isLast={index === STEP_ORDER.length - 1}
            />
          );
        })}
      </div>

      <p className="max-w-md text-center text-label-sm text-neutral-500">
        {t("footer")}
      </p>
    </div>
  );
}
