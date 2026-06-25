"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, SquarePen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { useRouter } from "@/i18n/navigation";
import { useSelectedProject } from "@/features/home";
import { cn } from "@/lib/utils";
import { aiSuggestionDetailQueryOptions } from "../queries/queries";
import { useApproveSuggestion, useRejectSuggestion } from "../queries/mutations";
import type { ImpactLevel, SuggestionStatus, SuggestionType } from "../types";

const IDEAL_LENGTHS: Partial<Record<SuggestionType, { min: number; max: number }>> = {
  meta: { min: 50, max: 60 },
  og_title: { min: 60, max: 70 },
  og_description: { min: 150, max: 160 },
  alt_text: { min: 10, max: 125 },
};

const STATUS_STYLES: Record<SuggestionStatus, string> = {
  pending: "bg-warning-50 text-warning-700 border border-warning-200",
  approved: "bg-success-50 text-success-700 border border-success-200",
  rejected: "bg-error-50 text-error-700 border border-error-200",
  applied: "bg-blue-50 text-blue-700 border border-blue-200",
  failed: "bg-neutral-100 text-neutral-600 border border-neutral-200",
};

const IMPACT_STYLES: Record<ImpactLevel, string> = {
  high: "bg-error-50 text-error-600 border border-error-200",
  medium: "bg-warning-50 text-warning-600 border border-warning-200",
  low: "bg-neutral-100 text-neutral-500 border border-neutral-200",
};

type SuggestionReviewProps = {
  suggestionId: string;
};

export function SuggestionReview({ suggestionId }: SuggestionReviewProps) {
  const t = useTranslations("aiSuggestions");
  const dir = useDirection();
  const router = useRouter();
  const isRtl = dir === "rtl";
  const { selectedProjectId } = useSelectedProject();

  const { data: suggestion, isLoading, isError } = useQuery(
    aiSuggestionDetailQueryOptions(selectedProjectId ?? "", suggestionId),
  );

  const approveMutation = useApproveSuggestion();
  const rejectMutation = useRejectSuggestion();

  const [editedValue, setEditedValue] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const typeLabels: Record<string, string> = {
    meta: t("types.meta"),
    og_title: t("types.og_title"),
    og_description: t("types.og_description"),
    schema: t("types.schema"),
    faq: t("types.faq"),
    redirect: t("types.redirect"),
    alt_text: t("types.alt_text"),
    internal_link: t("types.internal_link"),
  };

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8">
        <p className="text-label-md text-neutral-500">{t("noProject")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8">
        <p className="text-label-md text-neutral-500">{t("loading")}</p>
      </div>
    );
  }

  if (isError || !suggestion) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8">
        <p className="text-label-md text-neutral-500">{t("reviewPage.notFound")}</p>
      </div>
    );
  }

  // editedValue is initialized lazily on first edit so we always reflect server data
  const displayValue = editedValue ?? suggestion.suggestedText;
  const idealLength = IDEAL_LENGTHS[suggestion.type as SuggestionType] ?? null;
  const charCount = displayValue.length;
  const isIdealLength = idealLength
    ? charCount >= idealLength.min && charCount <= idealLength.max
    : false;

  function handleSave() {
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedValue(null);
    setIsEditing(false);
  }

  function handleApprove() {
    if (!selectedProjectId) return;
    approveMutation.mutate(
      { projectId: selectedProjectId, suggestionId },
      { onSuccess: () => router.back() },
    );
  }

  function handleReject() {
    if (!selectedProjectId) return;
    rejectMutation.mutate(
      { projectId: selectedProjectId, suggestionId },
      { onSuccess: () => router.back() },
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-col gap-3 text-start">
          <div>
            <h1 className="text-h1 font-semibold text-secondary-500">{t("reviewPage.title")}</h1>
            <p className="text-label-md text-neutral-500">{suggestion.url}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-warning-50 px-3 py-1 text-label-xs font-medium text-warning-700">
              {typeLabels[suggestion.type] ?? suggestion.type}
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-label-xs font-medium",
                IMPACT_STYLES[suggestion.priority],
              )}
            >
              {t(`reviewPage.impactLevel.${suggestion.priority}`)}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-xs font-medium",
                STATUS_STYLES[suggestion.status],
              )}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-current opacity-80" aria-hidden="true" />
              {t(`status.${suggestion.status}`)}
            </span>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Current Value */}
          <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-label-sm font-medium text-neutral-500">
                {t("reviewPage.currentValue")}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                <span className="text-label-xs text-neutral-500">{t("reviewPage.currentVersion")}</span>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
              <p className="min-h-16 text-label-md leading-relaxed wrap-break-word text-neutral-600">
                {suggestion.currentText || (
                  <span className="text-neutral-300 italic">{t("reviewPage.noCurrentValue")}</span>
                )}
              </p>
            </div>
            <span className="text-end text-label-xs text-neutral-400">
              {t("reviewPage.chars", { count: suggestion.currentText.length })}
            </span>
          </div>

          {/* AI Suggestion */}
          <div className="flex flex-col gap-4 rounded-xl border border-primary-200 bg-primary-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                <span className="text-label-sm font-medium text-secondary-500">
                  {t("reviewPage.aiSuggestion")}
                </span>
              </div>
              <span className="rounded-full bg-primary-300 px-2.5 py-0.5 text-label-xs font-bold text-secondary-500">
                AI
              </span>
            </div>
            <div className="rounded-lg border border-primary-100 bg-white p-4">
              {isEditing ? (
                <textarea
                  value={displayValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-primary-200 bg-neutral-50 p-3 text-label-md text-secondary-500 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30"
                />
              ) : (
                <p className="min-h-16 text-label-md leading-relaxed wrap-break-word text-secondary-500">
                  {displayValue}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-label-xs text-neutral-400">
                {t("reviewPage.chars", { count: charCount })}
              </span>
              {idealLength ? (
                <span
                  className={cn(
                    "flex items-center gap-1 text-label-xs font-medium",
                    isIdealLength ? "text-success-600" : "text-neutral-400",
                  )}
                >
                  {t("reviewPage.idealLength", { min: idealLength.min, max: idealLength.max })}
                  {isIdealLength ? <Check className="size-3.5" aria-hidden="true" /> : null}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Info grid */}
        {(suggestion.explanation || suggestion.keywords.length > 0) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {suggestion.keywords.length > 0 ? (
              <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                  <span className="text-label-sm font-medium text-secondary-500">
                    {t("reviewPage.keywords")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestion.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-label-xs text-secondary-500"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {suggestion.explanation ? (
              <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <Info className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
                  <span className="text-label-sm font-medium text-secondary-500">
                    {t("reviewPage.whyGenerated")}
                  </span>
                </div>
                <p className="text-label-sm leading-relaxed text-neutral-500">{suggestion.explanation}</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Action bar */}
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-label-sm text-neutral-500 transition-colors hover:text-secondary-500"
          >
            {isRtl ? (
              <>
                {t("reviewPage.back")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            ) : (
              <>
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t("reviewPage.back")}
              </>
            )}
          </button>

          <div className="flex flex-wrap flex-row-reverse items-center gap-2 sm:justify-end">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                >
                  {t("reviewPage.cancel")}
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="bg-primary-300 font-medium text-secondary-500 hover:bg-primary-400"
                >
                  {t("reviewPage.save")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleApprove}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  className="bg-primary-300 font-medium text-secondary-500 hover:bg-primary-400 disabled:opacity-50"
                >
                  {t("approve")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-2 border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                >
                  <SquarePen className="size-4" aria-hidden="true" />
                  {t("reviewPage.edit")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReject}
                  disabled={rejectMutation.isPending || approveMutation.isPending}
                  className="border-error-200 bg-error-50 text-error-700 hover:bg-error-100 disabled:opacity-50"
                >
                  {t("reject")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
