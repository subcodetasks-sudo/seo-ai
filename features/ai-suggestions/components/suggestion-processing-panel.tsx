"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SuggestionProcessingPanelProps = {
  status: "queued" | "processing";
};

function useFakeProgress() {
  const [value, setValue] = useState(8);

  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((prev) => {
        if (prev >= 93) return 12;
        const step = prev < 35 ? 2.4 : prev < 65 ? 1.2 : 0.5;
        return Math.min(93, prev + step);
      });
    }, 380);

    return () => window.clearInterval(id);
  }, []);

  return Math.round(value);
}

const STEP_KEYS = ["queued", "processing", "finishing"] as const;

export default function SuggestionProcessingPanel({ status }: SuggestionProcessingPanelProps) {
  const t = useTranslations("aiSuggestions.reviewPage.processingState");
  const progress = useFakeProgress();
  const activeIndex = status === "queued" ? 0 : 1;

  return (
    <div className="flex flex-col gap-6" aria-live="polite" aria-busy="true">
      <div className="flex flex-col gap-5 rounded-xl border border-primary-200 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3 text-start">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
            <Sparkles className="size-5 text-primary-600" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-h4 font-semibold text-secondary-500">
              {status === "queued" ? t("queuedTitle") : t("processingTitle")}
            </h2>
            <p className="text-label-sm leading-relaxed text-neutral-500">
              {status === "queued" ? t("queuedDescription") : t("processingDescription")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 text-label-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-secondary-500">
              <Loader2 className="size-3.5 animate-spin text-primary-600" aria-hidden="true" />
              {t("progressLabel")}
            </span>
            <span className="tabular-nums text-neutral-500" dir="ltr">
              {progress}%
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-primary-100"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={t("progressLabel")}
          >
            <div
              className="h-full rounded-full bg-primary-400 transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-label-xs text-neutral-400">{t("hint")}</p>
        </div>

        <ol className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
          {STEP_KEYS.map((stepKey, index) => {
            const isActive = index === activeIndex;
            const isDone = index < activeIndex;

            return (
              <li key={stepKey} className="flex items-center gap-2.5 text-start">
                {isDone ? (
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-600"
                    aria-hidden="true"
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                  </span>
                ) : isActive ? (
                  <Loader2
                    className="size-5 shrink-0 animate-spin text-primary-600"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="size-5 shrink-0 rounded-full border border-neutral-200 bg-neutral-50"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "text-label-sm",
                    isActive && "font-medium text-secondary-500",
                    isDone && "text-neutral-500",
                    !isActive && !isDone && "text-neutral-400",
                  )}
                >
                  {t(`steps.${stepKey}`)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-32 bg-neutral-100" />
          <Skeleton className="h-4 w-16 bg-neutral-100" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg bg-neutral-100" />
        <Skeleton className="h-24 w-full rounded-lg bg-neutral-100" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Skeleton className="h-16 w-full rounded-lg bg-neutral-100" />
          <Skeleton className="h-16 w-full rounded-lg bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
