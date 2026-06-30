"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { aiSuggestionsQueryOptions } from "@/features/ai-suggestions/queries/queries";
import { useApproveSuggestion } from "@/features/ai-suggestions/queries/mutations";
import type { IssueSummary, IssueSummaryRecommendation } from "../types";

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-error-100 text-error-700",
  high: "bg-warning-100 text-warning-700",
  medium: "bg-primary-100 text-primary-700",
  low: "bg-neutral-100 text-neutral-500",
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
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-label-xs font-semibold",
            priorityStyle,
          )}
        >
          {t(`priority.${rec.priority}`)}
        </span>
        {typeof rec.confidence === "number" && (
          <span className="text-label-xs text-neutral-400">
            {rec.confidence}% {t("confidence")}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-label-md font-semibold text-secondary-500">{rec.title}</h3>
        <p className="text-label-sm text-neutral-500">{rec.description}</p>
      </div>

      {rec.expected_impact && (
        <p className="rounded-lg bg-neutral-50 px-3 py-2 text-label-xs text-neutral-600">
          {t("expectedImpact")}: {rec.expected_impact}
        </p>
      )}

      {onAction && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            disabled={actionPending}
            onClick={() => onAction(rec.id)}
            className="gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
          >
            {t("implement")}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      )}
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
            priority:
              item.priority === "high"
                ? "urgent"
                : item.priority === "medium"
                  ? "high"
                  : "medium",
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
};

export function RecommendationsTab({
  data,
  isLoading,
  isError,
  projectId,
}: RecommendationsTabProps) {
  const t = useTranslations("aiInsights.recommendations");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const aiRecs = data?.recommendations ?? [];
  const rootCauses = data?.root_cause_analysis ?? [];
  const confidenceRate = data?.confidence_rate;

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

  void expandedId;
  void setExpandedId;

  const hasAiRecs = aiRecs.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* AI-generated strategic recommendations */}
      {hasAiRecs ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-label-md font-semibold text-secondary-500">
            {t("keyRecommendations")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {aiRecs.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-label-md font-semibold text-secondary-500">
            {t("keyRecommendations")}
          </h2>
          <SuggestionsAsRecommendations projectId={projectId} />
        </div>
      )}

      {/* Root Cause Analysis */}
      {rootCauses.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-label-md font-semibold text-secondary-500">
            {t("rootCauseAnalysis")}
          </h2>
          <ul className="flex flex-col gap-3">
            {rootCauses.map((rc, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between gap-3 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-label-sm font-medium text-secondary-500">{rc.issue}</p>
                  <p className="text-label-xs text-neutral-500">{rc.cause}</p>
                </div>
                {rc.priority && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-label-xs font-medium",
                      PRIORITY_STYLES[rc.priority] ?? PRIORITY_STYLES.low,
                    )}
                  >
                    {t(`priority.${rc.priority}`)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confidence Rate */}
      {typeof confidenceRate === "number" && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-3 text-label-md font-semibold text-secondary-500">
            {t("confidenceRate")}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="absolute inset-y-0 start-0 rounded-full bg-primary-400 transition-all"
                style={{ width: `${confidenceRate}%` }}
              />
            </div>
            <span className="shrink-0 text-label-sm font-semibold text-secondary-500">
              {confidenceRate}%
            </span>
          </div>
        </div>
      )}

      {/* Follow-up CTA */}
      <div className="flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50 p-5">
        <p className="text-label-sm font-medium text-secondary-500">{t("followUp")}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 border-secondary-500 text-secondary-500 hover:bg-secondary-50 text-label-sm"
        >
          {t("viewAll")}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
