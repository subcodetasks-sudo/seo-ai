"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { reportsAnalyticsQueryOptions, scanLogQueryOptions } from "@/features/reports/queries/queries";
import type { ReportsPeriod } from "@/features/reports/types";
import type { AiInsightsPeriod } from "../types";

function periodToReportsPeriod(period: AiInsightsPeriod): ReportsPeriod {
  if (period === 7 || period === 30 || period === 90) return period;
  return 30;
}

type MetricStat = {
  label: string;
  value: string | number;
  change?: number;
};

function MetricCard({ label, value, change }: MetricStat) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-label-xs text-neutral-500">{label}</p>
      <p className="text-h3 font-semibold text-secondary-500">{value}</p>
      {typeof change === "number" && (
        <p className={change >= 0 ? "text-label-xs font-medium text-success-600" : "text-label-xs font-medium text-error-500"}>
          {change >= 0 ? "+" : ""}{change}%
        </p>
      )}
    </div>
  );
}

function TrendChart({ data, label }: { data: { label: string; value: number }[]; label: string }) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((p) => p.value), 1);
  const w = 560;
  const h = 120;
  const pad = { top: 8, right: 8, bottom: 20, left: 8 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const points = data.map((p, i) => ({
    x: pad.left + (i / Math.max(data.length - 1, 1)) * innerW,
    y: pad.top + (1 - p.value / max) * innerH,
  }));

  const pathD = points
    .map((pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`))
    .join(" ");

  const areaD = [
    ...points.map((pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`)),
    `L ${points[points.length - 1].x} ${h - pad.bottom}`,
    `L ${points[0].x} ${h - pad.bottom}`,
    "Z",
  ].join(" ");

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-label-sm font-semibold text-secondary-500">{label}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#84cc16" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between text-label-xs text-neutral-400">
        {[data[0], data[Math.floor(data.length / 2)], data[data.length - 1]]
          .filter(Boolean)
          .map((p, i) => (
            <span key={i}>{p.label}</span>
          ))}
      </div>
    </div>
  );
}

function PerformanceSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-52 w-full rounded-xl" />
    </div>
  );
}

type PerformanceTabProps = {
  projectId: string;
  period: AiInsightsPeriod;
};

export function PerformanceTab({ projectId, period }: PerformanceTabProps) {
  const t = useTranslations("aiInsights.performance");
  const reportsPeriod = periodToReportsPeriod(period);

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery(
    reportsAnalyticsQueryOptions(projectId, reportsPeriod),
  );

  const { data: scanLog = [], isLoading: isScanLogLoading } = useQuery(
    scanLogQueryOptions(projectId, reportsPeriod),
  );

  if (isAnalyticsLoading || isScanLogLoading) return <PerformanceSkeleton />;

  const healthTrend = analytics?.healthScoreTrend ?? [];
  const issuesTrend = analytics?.seoIssuesTrend ?? [];

  const latestHealth = healthTrend[healthTrend.length - 1]?.value ?? 0;
  const prevHealth = healthTrend[0]?.value ?? 0;
  const healthChange = prevHealth > 0 ? Math.round(((latestHealth - prevHealth) / prevHealth) * 100) : 0;

  const latestIssues = issuesTrend[issuesTrend.length - 1]?.value ?? 0;
  const totalApplied = analytics?.weeklyChanges?.reduce((s, p) => s + p.value, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Time Trend Chart */}
      {healthTrend.length > 0 && (
        <TrendChart data={healthTrend} label={t("timeTrends")} />
      )}

      {/* Metrics Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t("healthScore")} value={latestHealth} change={healthChange} />
        <MetricCard label={t("totalIssues")} value={latestIssues} />
        <MetricCard label={t("appliedChanges")} value={totalApplied} />
        <MetricCard label={t("scansTotal")} value={scanLog.length} />
      </div>

      {/* Issues trend chart */}
      {issuesTrend.length > 0 && (
        <TrendChart data={issuesTrend} label={t("issuesTrend")} />
      )}

      {/* AI Learning Log (Scan Log) */}
      {scanLog.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-label-md font-semibold text-secondary-500">{t("aiLearningLog")}</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {scanLog.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-label-sm font-medium text-secondary-500">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-label-xs text-neutral-500">
                    {entry.pages_crawled} {t("pages")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      entry.status === "completed" || entry.status === "done"
                        ? "text-label-xs font-medium text-success-600"
                        : entry.status === "running"
                          ? "text-label-xs font-medium text-warning-600"
                          : "text-label-xs font-medium text-error-500"
                    }
                  >
                    {t(`scanStatus.${entry.status}`)}
                  </span>
                  {entry.health_score !== null && (
                    <span className="text-label-xs font-semibold text-secondary-500">
                      {entry.health_score}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
