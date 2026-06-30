"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IssueSummary } from "../types";

type OverviewTabProps = {
  data: IssueSummary | undefined;
  isLoading: boolean;
  isError: boolean;
};

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

export function OverviewTab({ data, isLoading, isError }: OverviewTabProps) {
  const t = useTranslations("aiInsights.overview");

  if (isLoading) return <OverviewSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-label-md text-neutral-500">{t("error")}</p>
      </div>
    );
  }

  const trends = data.trends ?? [];
  const keyMetrics = data.key_metrics ?? [];
  const score = data.performance_score;
  const rootCauses = data.root_cause_analysis ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Summary */}
      {data.executive_summary && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-2 text-label-md font-semibold text-secondary-500">
            {t("executiveSummary")}
          </h2>
          <p className="text-label-sm leading-relaxed text-neutral-600">
            {data.executive_summary}
          </p>
        </div>
      )}

      {/* Trend cards */}
      {trends.length > 0 && (
        <div className={cn("grid gap-3", trends.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4")}>
          {trends.map((trend, idx) => {
            const isUp = trend.direction === "up";
            return (
              <div
                key={idx}
                className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4"
              >
                <p className="text-label-xs text-neutral-500">{trend.metric}</p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-h3 font-semibold",
                    isUp ? "text-success-600" : "text-error-500",
                  )}
                >
                  {isUp ? (
                    <TrendingUp className="size-4" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="size-4" aria-hidden="true" />
                  )}
                  <span>
                    {isUp ? "+" : "-"}
                    {trend.value}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Key Metrics */}
      {keyMetrics.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-label-md font-semibold text-secondary-500">
            {t("keyMetrics")}
          </h2>
          <div
            className={cn(
              "grid gap-4",
              keyMetrics.length <= 3
                ? "sm:grid-cols-3"
                : keyMetrics.length === 4
                  ? "sm:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-2 lg:grid-cols-5",
            )}
          >
            {keyMetrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col gap-1 border-s border-primary-200 ps-3">
                <p className="text-label-xs text-neutral-500">{metric.label}</p>
                <p className="text-h3 font-semibold text-secondary-500">
                  {metric.unit && metric.unit !== "%" ? `${metric.value}${metric.unit}` : metric.unit === "%" ? `${metric.value}%` : metric.value}
                </p>
                {typeof metric.change === "number" && (
                  <p
                    className={cn(
                      "text-label-xs font-medium",
                      metric.change >= 0 ? "text-success-600" : "text-error-500",
                    )}
                  >
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Score + Root Causes */}
      <div className="grid gap-4 lg:grid-cols-2">
        {typeof score === "number" && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-label-md font-semibold text-secondary-500">
              {t("performanceScore")}
            </h2>
            <div className="relative flex size-32 items-center justify-center">
              <svg viewBox="0 0 36 36" className="size-32 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="3"
                  strokeDasharray={`${score} ${100 - score}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-h2 font-bold text-secondary-500">{score}</span>
                <span className="text-label-xs text-neutral-400">{t("outOf100")}</span>
              </div>
            </div>
          </div>
        )}

        {rootCauses.length > 0 && (
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-label-md font-semibold text-secondary-500">
              {t("rootCauseAnalysis")}
            </h2>
            <ul className="flex flex-col gap-3">
              {rootCauses.slice(0, 5).map((rc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {rc.priority && (
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-label-xs font-medium",
                        rc.priority === "urgent"
                          ? "bg-error-100 text-error-700"
                          : rc.priority === "high"
                            ? "bg-warning-100 text-warning-700"
                            : "bg-neutral-100 text-neutral-600",
                      )}
                    >
                      {rc.priority}
                    </span>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <p className="text-label-sm font-medium text-secondary-500">{rc.issue}</p>
                    <p className="text-label-xs text-neutral-500">{rc.cause}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
