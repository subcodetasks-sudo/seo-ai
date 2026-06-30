"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AiInsightsTab, IssueSummary } from "../types";

type AnalysisTabProps = {
  data: IssueSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  onNavigateTab?: (tab: AiInsightsTab) => void;
};

function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

const SEVERITY_STYLES: Record<string, string> = {
  medium: "bg-warning-100 text-warning-700",
  critical: "bg-error-100 text-error-700",
  positive: "bg-success-100 text-success-700",
};

const SEVERITY_DOT: Record<string, string> = {
  high: "bg-error-500",
  medium: "bg-warning-500",
};

const POTENTIAL_STYLES: Record<string, string> = {
  high: "bg-success-50 text-success-700",
  medium: "bg-warning-50 text-warning-700",
};

export function AnalysisTab({ data, isLoading, isError, onNavigateTab }: AnalysisTabProps) {
  const t = useTranslations("aiInsights.analysis");
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const smartInsights = data?.smart_insights ?? [];
  const rootCauseDetails = data?.root_cause_details ?? [];
  const growthOpportunities = data?.growth_opportunities ?? [];

  if (isLoading) return <AnalysisSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-label-md text-neutral-500">{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Smart Insights */}
      {smartInsights.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-label-md font-semibold text-secondary-500">{t("smartInsights")}</h2>
            <span className="text-label-xs text-neutral-400">
              {t("insightsFound", { count: smartInsights.length })}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {smartInsights.map((insight, idx) => (
              <div key={idx} className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-label-xs text-neutral-400">{insight.category}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-label-xs font-medium",
                      SEVERITY_STYLES[insight.severity],
                    )}
                  >
                    {t(`severity.${insight.severity}`)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-label-md font-semibold text-secondary-500">{insight.title}</h3>
                  <p className="text-label-sm text-neutral-500">{insight.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insight.metrics.map((metric, mIdx) => (
                    <span
                      key={mIdx}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-label-xs font-medium",
                        metric.value.startsWith("-") ? "bg-error-50 text-error-600" : "bg-success-50 text-success-600",
                      )}
                    >
                      {metric.value} {metric.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Root Cause Analysis */}
      {rootCauseDetails.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-label-md font-semibold text-secondary-500">{t("rootCauseAnalysis")}</h2>
          {rootCauseDetails.map((rc, idx) => {
            const id = `${idx}-${rc.issue}`;
            const isExpanded = expandedIssue === null ? idx === 0 : expandedIssue === id;
            const hasCauses = rc.causes.length > 0;
            return (
              <div key={id} className="rounded-lg border border-neutral-100">
                <button
                  type="button"
                  onClick={() => hasCauses && setExpandedIssue(isExpanded ? "" : id)}
                  disabled={!hasCauses}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start disabled:cursor-default"
                >
                  <div className="flex items-center gap-2">
                    {hasCauses && (
                      <ChevronDown
                        className={cn("size-4 text-neutral-400 transition-transform", isExpanded && "rotate-180")}
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-label-sm font-medium text-secondary-500">{rc.issue}</span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-label-xs font-semibold",
                      rc.cause.startsWith("-") ? "bg-error-50 text-error-700" : "bg-success-50 text-success-700",
                    )}
                  >
                    {rc.cause}
                  </span>
                </button>

                {hasCauses && isExpanded && (
                  <div className="flex flex-col gap-3 border-t border-neutral-100 px-4 py-3">
                    <p className="text-label-xs text-neutral-400">
                      {t("possibleCauses", { count: rc.causes.length })}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {rc.causes.map((cause, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-2">
                          <span className={cn("h-4 w-1 shrink-0 rounded-full", SEVERITY_DOT[cause.severity])} />
                          <span className="text-label-sm text-neutral-600">{cause.text}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-label-xs text-neutral-400">{t("affectedPages")}:</span>
                        {rc.affectedPages.map((page) => (
                          <span key={page} className="rounded-full bg-neutral-100 px-2 py-0.5 text-label-xs text-neutral-600">
                            {page}
                          </span>
                        ))}
                      </div>
                      <span className="rounded-full bg-primary-50 px-2 py-0.5 text-label-xs font-medium text-primary-700">
                        {t("confidenceLevel")}: {t(`confidence.${rc.confidenceLevel}`)} {rc.confidence}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Growth Opportunities */}
      {growthOpportunities.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-label-md font-semibold text-secondary-500">{t("growthOpportunities")}</h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-label-xs text-neutral-500">
              {t("untappedOpportunities")}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {growthOpportunities.map((opp, idx) => (
              <div key={idx} className="flex flex-col gap-3 rounded-xl border border-success-200 bg-success-50/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-label-xs font-medium", POTENTIAL_STYLES[opp.potential])}>
                    {t(`potential.${opp.potential}`)}
                  </span>
                  <span className="rounded-full bg-success-100 px-2 py-0.5 text-label-xs font-medium text-success-700">
                    {t("growthOpportunity")}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-label-md font-semibold text-secondary-500">{opp.title}</h3>
                  <p className="text-label-sm text-neutral-500">{opp.description}</p>
                </div>
                <div className="flex items-center justify-between gap-3 text-label-xs">
                  <span className="text-success-700">
                    {t("expectedImpact")}: <span className="font-semibold">{opp.expectedImpact}</span>
                  </span>
                  <span className="text-neutral-500">
                    {t("difficulty")}: {t(`difficulty.${opp.difficulty}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={() => onNavigateTab?.("recommendations")}
        className="w-fit gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
      >
        <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
        {t("goToRecommendations")}
      </Button>
    </div>
  );
}
