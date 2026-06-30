"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { aiSuggestionsQueryOptions } from "@/features/ai-suggestions/queries/queries";
import { useApproveSuggestion } from "@/features/ai-suggestions/queries/mutations";
import type { AiInsightsTab, IssueSummary, IssueSummaryRecommendation } from "../types";

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-error-100 text-error-700",
  medium: "bg-warning-100 text-warning-700",
  low: "bg-neutral-100 text-neutral-500",
};

const PRIORITY_ORDER: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];

const TRACKING_STATUS_STYLES: Record<string, string> = {
  completed: "bg-success-100 text-success-700",
  in_progress: "bg-primary-100 text-primary-700",
  not_started: "bg-neutral-100 text-neutral-500",
};

type RecommendationCardProps = {
  rec: IssueSummaryRecommendation;
  onAction?: (id: string) => void;
  actionPending?: boolean;
};

function RecommendationCard({ rec, onAction, actionPending }: RecommendationCardProps) {
  const t = useTranslations("aiInsights.recommendations");
  const priorityStyle = PRIORITY_STYLES[rec.priority] ?? PRIORITY_STYLES.low;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-label-xs font-semibold", priorityStyle)}>
            {t(`priority.${rec.priority}`)}
          </span>
          {rec.category && (
            <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-label-xs text-neutral-500">
              {rec.category}
            </span>
          )}
        </div>
        {onAction && (
          <Button
            type="button"
            size="sm"
            disabled={actionPending}
            onClick={() => onAction(rec.id)}
            className="shrink-0 gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
          >
            {t("implement")}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-label-md font-semibold text-secondary-500">{rec.title}</h3>
        <p className="text-label-sm text-neutral-500">{rec.description}</p>
      </div>

      {rec.why && (
        <p className="rounded-lg border border-success-200 bg-success-50 px-3 py-2 text-label-xs text-success-700">
          <span className="font-semibold">{t("why")}:</span> {rec.why}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3 sm:grid-cols-5">
        <div className="flex flex-col gap-0.5">
          <p className="text-label-xs text-neutral-400">{t("priorityLabel")}</p>
          <p className="text-label-sm font-medium text-secondary-500">{t(`priority.${rec.priority}`)}</p>
        </div>
        {rec.effort && (
          <div className="flex flex-col gap-0.5">
            <p className="text-label-xs text-neutral-400">{t("estimatedDifficulty")}</p>
            <p className="text-label-sm font-medium text-secondary-500">{t(`difficulty.${rec.effort}`)}</p>
          </div>
        )}
        {rec.expected_impact && (
          <div className="flex flex-col gap-0.5">
            <p className="text-label-xs text-neutral-400">{t("expectedImpact")}</p>
            <p className="text-label-sm font-medium text-success-600">{rec.expected_impact}</p>
          </div>
        )}
        {rec.estimatedTime && (
          <div className="flex flex-col gap-0.5">
            <p className="text-label-xs text-neutral-400">{t("estimatedTime")}</p>
            <p className="text-label-sm font-medium text-secondary-500">{rec.estimatedTime}</p>
          </div>
        )}
        {rec.affectedPage && (
          <div className="flex flex-col gap-0.5">
            <p className="text-label-xs text-neutral-400">{t("affectedPage")}</p>
            <p className="text-label-sm font-medium text-secondary-500">{rec.affectedPage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendationsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}

type SuggestionsAsRecommendationsProps = {
  projectId: string;
};

function SuggestionsAsRecommendations({ projectId }: SuggestionsAsRecommendationsProps) {
  const t = useTranslations("aiInsights.recommendations");
  const approveMutation = useApproveSuggestion();

  const { data, isLoading, isError } = useQuery(
    aiSuggestionsQueryOptions({
      projectId,
      page: 1,
      perPage: 10,
      status: "pending",
    }),
  );

  const items = data?.items ?? [];

  function handleApprove(id: string) {
    approveMutation.mutate({ projectId, suggestionId: id });
  }

  if (isLoading) return <RecommendationsSkeleton />;

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-label-md text-neutral-500">{t("error")}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-label-md text-neutral-500">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <RecommendationCard
          key={item.id}
          rec={{
            id: item.id,
            title: item.type,
            description: item.url,
            priority: item.priority,
          }}
          onAction={handleApprove}
          actionPending={approveMutation.isPending}
        />
      ))}
    </div>
  );
}

type RecommendationsTabProps = {
  data: IssueSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  projectId: string;
  onNavigateTab?: (tab: AiInsightsTab) => void;
};

export function RecommendationsTab({
  data,
  isLoading,
  isError,
  projectId,
  onNavigateTab,
}: RecommendationsTabProps) {
  const t = useTranslations("aiInsights.recommendations");

  const aiRecs = data?.recommendations ?? [];
  const tracking = data?.recommendation_tracking ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <RecommendationsSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-label-md text-neutral-500">{t("error")}</p>
      </div>
    );
  }

  const hasAiRecs = aiRecs.length > 0;
  const groups = PRIORITY_ORDER.map((priority) => ({
    priority,
    items: aiRecs.filter((rec) => rec.priority === priority),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* AI-generated strategic recommendations, grouped by priority */}
      {hasAiRecs ? (
        groups.map((group) => (
          <div key={group.priority} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-label-md font-semibold text-secondary-500">
                {t(`priorityGroup.${group.priority}`)}
              </h2>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-label-xs font-semibold",
                  PRIORITY_STYLES[group.priority],
                )}
              >
                {t("recommendationsCount", { count: group.items.length })}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {group.items.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-label-md font-semibold text-secondary-500">
            {t("keyRecommendations")}
          </h2>
          <SuggestionsAsRecommendations projectId={projectId} />
        </div>
      )}

      {/* Recommendation tracking */}
      {tracking.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-label-md font-semibold text-secondary-500">{t("tracking.title")}</h2>
          <ul className="flex flex-col divide-y divide-neutral-100">
            {tracking.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-label-sm font-medium text-secondary-500">{item.title}</p>
                  <p className="text-label-xs text-neutral-400">{item.category}</p>
                </div>

                {item.status === "completed" && typeof item.before === "number" && typeof item.after === "number" ? (
                  <div className="flex items-center gap-2 text-label-xs">
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-500">{item.before}%</span>
                    <ArrowRight className="size-3.5 text-neutral-400 rtl:rotate-180" aria-hidden="true" />
                    <span className="rounded-full bg-success-100 px-2 py-0.5 font-semibold text-success-700">
                      {item.after}%
                    </span>
                  </div>
                ) : item.status === "in_progress" && typeof item.progress === "number" ? (
                  <div className="flex w-32 items-center gap-2">
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="absolute inset-y-0 start-0 rounded-full bg-primary-400"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-label-xs font-medium text-secondary-500">{item.progress}%</span>
                  </div>
                ) : null}

                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-label-xs font-semibold",
                    TRACKING_STATUS_STYLES[item.status],
                  )}
                >
                  {t(`tracking.status.${item.status}`)}
                </span>

                <div className="flex items-center gap-2 text-label-xs text-neutral-400">
                  <span>{item.assignee}</span>
                  <span>{item.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        type="button"
        onClick={() => onNavigateTab?.("performance")}
        className="w-fit gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
      >
        <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
        {t("goToPerformance")}
      </Button>
    </div>
  );
}
