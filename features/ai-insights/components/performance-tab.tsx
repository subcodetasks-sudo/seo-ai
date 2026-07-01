"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import ErrorState from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { AiInsightsTab, IssueSummary, TimelineEvent } from "../types";

const TREND_COLOR = "#84cc16";

const PERIOD_TABS = ["day", "week", "month", "quarter", "year"] as const;
type PeriodTab = (typeof PERIOD_TABS)[number];

const TIMELINE_DOT: Record<TimelineEvent["tag"], string> = {
  result: "bg-success-500",
  event: "bg-warning-500",
  recommendation: "bg-primary-500",
  seo: "bg-secondary-500",
  update: "bg-neutral-400",
  campaign: "bg-error-500",
};

const TIMELINE_TAG_STYLES: Record<TimelineEvent["tag"], string> = {
  result: "bg-success-50 text-success-700",
  event: "bg-warning-50 text-warning-700",
  recommendation: "bg-primary-50 text-primary-700",
  seo: "bg-secondary-50 text-secondary-700",
  update: "bg-neutral-100 text-neutral-500",
  campaign: "bg-error-50 text-error-700",
};

const COMPARISON_STATUS_STYLES: Record<string, string> = {
  improved: "bg-success-50 text-success-700",
  declined: "bg-error-50 text-error-700",
  stable: "bg-neutral-100 text-neutral-500",
};

function MetricCard({ label, value, change }: { label: string; value: string | number; change?: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-label-xs text-neutral-500">{label}</p>
      <p className="text-h3 font-semibold text-secondary-500">{value}</p>
      {typeof change === "number" && (
        <p className={cn("text-label-xs font-medium", change >= 0 ? "text-success-600" : "text-error-500")}>
          {change >= 0 ? "+" : ""}
          {change}%
        </p>
      )}
    </div>
  );
}

function PerformanceSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-52 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

type PerformanceTabProps = {
  data: IssueSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  onNavigateTab?: (tab: AiInsightsTab) => void;
};

export function PerformanceTab({ data, isLoading, isError, onRetry, onNavigateTab }: PerformanceTabProps) {
  const t = useTranslations("aiInsights.performance");
  const tCommon = useTranslations("common.state");
  const [periodTab, setPeriodTab] = useState<PeriodTab>("month");

  if (isLoading) return <PerformanceSkeleton />;

  if (isError || !data) {
    return <ErrorState title={t("error")} retryLabel={tCommon("retry")} onRetry={onRetry} fullPage={false} />;
  }

  const history = data.performance_history;
  const chartData = history?.chartData ?? [];
  const metrics = history?.metrics ?? [];
  const timeline = history?.timeline ?? [];
  const comparison = history?.comparison ?? [];
  const learningStats = history?.learningStats;

  const chartConfig = {
    value: { label: t("historicalTrends"), color: TREND_COLOR },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Period sub-tabs */}
      <div className="flex w-fit items-center gap-1 rounded-full border border-neutral-200 bg-white p-1">
        {PERIOD_TABS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriodTab(p)}
            className={cn(
              "rounded-full px-3 py-1.5 text-label-xs font-medium transition-colors",
              periodTab === p
                ? "bg-primary-300 text-secondary-500"
                : "text-neutral-500 hover:text-secondary-500",
            )}
          >
            {t(`periods.${p}`)}
          </button>
        ))}
      </div>

      {/* Historical trends chart */}
      {chartData.length > 0 && (
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-label-md font-semibold text-secondary-500">{t("historicalTrends")}</h2>
          <ChartContainer config={chartConfig} className="aspect-[3/1] h-64 w-full">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="performanceTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TREND_COLOR} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={TREND_COLOR} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={TREND_COLOR}
                strokeWidth={2}
                fill="url(#performanceTrendFill)"
                dot={false}
                activeDot={{ r: 4, fill: TREND_COLOR }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}

      {/* Metrics row */}
      {metrics.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => (
            <MetricCard key={idx} label={metric.label} value={metric.value} change={metric.change} />
          ))}
        </div>
      )}

      {/* Growth timeline */}
      {timeline.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-label-md font-semibold text-secondary-500">{t("growthTimeline")}</h2>
          <ul className="flex flex-col gap-4">
            {timeline.map((event, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", TIMELINE_DOT[event.tag])} />
                <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-label-xs font-medium", TIMELINE_TAG_STYLES[event.tag])}>
                      {t(`timelineTag.${event.tag}`)}
                    </span>
                    <span className="text-label-sm text-secondary-500">{event.title}</span>
                  </div>
                  <span className="text-label-xs text-neutral-400">{event.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Performance comparison */}
      {comparison.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-label-md font-semibold text-secondary-500">{t("performanceComparison")}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {comparison.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-3 rounded-lg border border-neutral-100 p-3">
                <span
                  className={cn(
                    "w-fit rounded-full px-2 py-0.5 text-label-xs font-semibold",
                    COMPARISON_STATUS_STYLES[col.status],
                  )}
                >
                  {t(`comparisonStatus.${col.status}`)}
                </span>
                <ul className="flex flex-col gap-2">
                  {col.rows.map((row, rIdx) => (
                    <li key={rIdx} className="flex items-center justify-between gap-2 text-label-sm">
                      <span className="text-neutral-500">{row.label}</span>
                      <span className="font-medium text-secondary-500">{row.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI learning log */}
      {learningStats && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-label-md font-semibold text-secondary-500">{t("aiLearningLog")}</h2>
            <span className="text-label-xs text-neutral-400">{learningStats.periodLabel}</span>
          </div>
          <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <div className="flex flex-col gap-0.5 rounded-lg border border-neutral-100 p-3">
              <p className="text-label-xs text-neutral-500">{t("conversionLift")}</p>
              <p className="text-label-md font-semibold text-success-600">{learningStats.conversionLift}</p>
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg border border-neutral-100 p-3">
              <p className="text-label-xs text-neutral-500">{t("revenueLift")}</p>
              <p className="text-label-md font-semibold text-success-600">{learningStats.revenueLift}</p>
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg border border-neutral-100 p-3">
              <p className="text-label-xs text-neutral-500">{t("successfulRecs")}</p>
              <p className="text-label-md font-semibold text-secondary-500">{learningStats.successfulRecs}</p>
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg border border-neutral-100 p-3">
              <p className="text-label-xs text-neutral-500">{t("appliedRecs")}</p>
              <p className="text-label-md font-semibold text-secondary-500">{learningStats.appliedRecs}</p>
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg border border-neutral-100 p-3">
              <p className="text-label-xs text-neutral-500">{t("generatedRecs")}</p>
              <p className="text-label-md font-semibold text-secondary-500">{learningStats.generatedRecs}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="shrink-0 text-label-xs text-neutral-500">{t("successRate")}</p>
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="absolute inset-y-0 start-0 rounded-full bg-primary-400 transition-all"
                style={{ width: `${learningStats.successRate}%` }}
              />
            </div>
            <span className="shrink-0 text-label-sm font-semibold text-secondary-500">
              {learningStats.successRate}%
            </span>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={() => onNavigateTab?.("overview")}
        className="w-fit gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
      >
        <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
        {t("backToOverview")}
      </Button>
    </div>
  );
}
