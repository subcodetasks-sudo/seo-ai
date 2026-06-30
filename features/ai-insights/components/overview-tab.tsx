"use client";

import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AiInsightsTab, IssueSummary } from "../types";

type OverviewTabProps = {
  data: IssueSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  onNavigateTab?: (tab: AiInsightsTab) => void;
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

const TREND_TONE_STYLES: Record<string, string> = {
  positive: "bg-success-50 text-success-700",
  negative: "bg-error-50 text-error-700",
  warning: "bg-warning-50 text-warning-700",
};

const SEVERITY_DOT: Record<string, string> = {
  positive: "bg-success-500",
  negative: "bg-error-500",
};

function Sparkline({ data, isUp }: { data: { label: string; value: number }[]; isUp: boolean }) {
  if (data.length === 0) return null;
  const color = isUp ? "#16a34a" : "#ef4444";

  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sparkline-${isUp ? "up" : "down"}-${data.length}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sparkline-${isUp ? "up" : "down"}-${data.length})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OverviewTab({ data, isLoading, isError, onNavigateTab }: OverviewTabProps) {
  const t = useTranslations("aiInsights.overview");
  const locale = useLocale();

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
  const workPerformance = data.work_performance;
  const criticalInsights = data.critical_insights ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Summary */}
      {data.executive_summary && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-label-md font-semibold text-secondary-500">
              {t("executiveSummary")}
            </h2>
            {data.generated_at && (
              <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-label-xs text-neutral-500">
                {t("updatedAgo", {
                  time: formatDistanceToNow(new Date(data.generated_at), {
                    addSuffix: false,
                    locale: locale === "ar" ? ar : enUS,
                  }),
                })}
              </span>
            )}
          </div>
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
                className={cn(
                  "flex flex-col gap-2 rounded-xl p-4",
                  TREND_TONE_STYLES[trend.tone ?? (isUp ? "positive" : "negative")],
                )}
              >
                <div className="flex items-center gap-1 text-h3 font-semibold">
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
                <p className="text-label-xs font-medium">{trend.metric}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Key Metrics */}
      {keyMetrics.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-1 text-label-md font-semibold text-secondary-500">
            {t("keyMetrics")}
          </h2>
          <p className="mb-4 text-label-xs text-neutral-400">{t("keyMetricsSubtitle", { days: data.period_days ?? 30 })}</p>
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
            {keyMetrics.map((metric, idx) => {
              const isUp = typeof metric.change === "number" ? metric.change >= 0 : true;
              return (
                <div key={idx} className="flex flex-col gap-2 rounded-xl border border-neutral-100 p-3">
                  <p className="text-label-xs text-neutral-500">{metric.label}</p>
                  <p className="text-h3 font-semibold text-secondary-500">
                    {metric.unit && metric.unit !== "%" ? `${metric.value}${metric.unit}` : metric.unit === "%" ? `${metric.value}%` : metric.value}
                  </p>
                  {typeof metric.change === "number" && (
                    <p className={cn("text-label-xs font-medium", isUp ? "text-success-600" : "text-error-500")}>
                      {isUp ? "+" : ""}
                      {metric.change}%{" "}
                      <span className="text-neutral-400">{metric.previousPeriodLabel}</span>
                    </p>
                  )}
                  {metric.sparkline && <Sparkline data={metric.sparkline} isUp={isUp} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Work Performance Indicator */}
      {workPerformance && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-label-md font-semibold text-secondary-500">
              {t("performanceScore")}
            </h2>
            <span className="text-label-xs text-neutral-400">{t("overallHealth")}</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-100 p-3">
                <p className="mb-2 text-label-xs font-medium text-error-600">{t("weaknesses")}</p>
                <ul className="flex flex-col gap-1.5">
                  {workPerformance.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-label-sm text-neutral-600">
                      <span className="size-1.5 shrink-0 rounded-full bg-error-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-neutral-100 p-3">
                <p className="mb-2 text-label-xs font-medium text-success-600">{t("strengths")}</p>
                <ul className="flex flex-col gap-1.5">
                  {workPerformance.strengths.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-label-sm text-neutral-600">
                      <span className="size-1.5 shrink-0 rounded-full bg-success-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-neutral-100 p-3">
                <p className="mb-2 text-label-xs text-neutral-500">{t("confidenceScore")}</p>
                <div className="flex items-center gap-2">
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="absolute inset-y-0 start-0 rounded-full bg-primary-400"
                      style={{ width: `${workPerformance.confidence}%` }}
                    />
                  </div>
                  <span className="text-label-sm font-semibold text-secondary-500">
                    {workPerformance.confidence}%
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-neutral-100 p-3">
                <p className="mb-2 text-label-xs text-neutral-500">{t("growthTrend")}</p>
                <p className="flex items-center gap-1 text-label-md font-semibold text-success-600">
                  <TrendingUp className="size-4" aria-hidden="true" />+{workPerformance.growthTrend}%
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="relative flex size-28 items-center justify-center">
                <svg viewBox="0 0 36 36" className="size-28 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="3"
                    strokeDasharray={`${score} ${100 - (score ?? 0)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-h2 font-bold text-secondary-500">{score}</span>
                  <span className="text-label-xs text-neutral-400">{t("outOf100")}</span>
                </div>
              </div>
              <span className="rounded-full bg-success-100 px-2.5 py-0.5 text-label-xs font-semibold text-success-700">
                {workPerformance.status}
              </span>
              <p className="text-label-xs text-neutral-400">
                {t("confidenceLevel", { value: workPerformance.confidence })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Critical Insights */}
      {criticalInsights.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-label-md font-semibold text-secondary-500">
            {t("criticalInsights")}
          </h2>
          <ul className="flex flex-col divide-y divide-neutral-100">
            {criticalInsights.map((insight, idx) => (
              <li key={idx} className="flex items-center gap-3 py-3">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-label-xs font-semibold",
                    insight.tone === "positive" ? "bg-success-50 text-success-700" : "bg-error-50 text-error-700",
                  )}
                >
                  {insight.change >= 0 ? "+" : ""}
                  {insight.change}%
                </span>
                <span className={cn("size-1.5 shrink-0 rounded-full", SEVERITY_DOT[insight.tone])} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-label-sm font-medium text-secondary-500">{insight.title}</p>
                  <p className="text-label-xs text-neutral-400">{insight.category}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        type="button"
        onClick={() => onNavigateTab?.("analysis")}
        className="w-fit gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
      >
        <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
        {t("viewFullAnalysis")}
      </Button>
    </div>
  );
}
