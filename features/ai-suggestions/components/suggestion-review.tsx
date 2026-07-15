"use client";

import { useState } from "react";
import { Info, Loader2, SquarePen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import BackLink from "@/components/back-link";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import SelectProjectState from "@/components/select-project-state";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDirection } from "@/components/ui/direction";
import { useRouter } from "@/i18n/navigation";
import { useSelectedProject } from "@/features/home";
import { cn, decodeUrlForDisplay } from "@/lib/utils";
import { aiSuggestionDetailQueryOptions } from "../queries/queries";
import { useApproveSuggestion, useIgnoreSuggestion, useRejectSuggestion } from "../queries/mutations";
import { EditSuggestionModal } from "./edit-suggestion-modal";
import SuggestionProcessingPanel from "./suggestion-processing-panel";
import { SuggestionDisplay } from "./suggestion-display";
import type { ImpactLevel, SuggestionStatus } from "../types";

const STATUS_STYLES: Record<SuggestionStatus, string> = {
  pending: "bg-warning-50 text-warning-700 border border-warning-200",
  queued: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  processing: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  approved: "bg-success-50 text-success-700 border border-success-200",
  rejected: "bg-error-50 text-error-700 border border-error-200",
  applied: "bg-blue-50 text-blue-700 border border-blue-200",
  skipped: "bg-neutral-50 text-neutral-400 border border-neutral-200",
  ignored: "bg-neutral-50 text-neutral-400 border border-neutral-200",
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
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const router = useRouter();
  const { selectedProjectId } = useSelectedProject();

  const { data: suggestion, isLoading, isError, refetch } = useQuery(
    aiSuggestionDetailQueryOptions(selectedProjectId ?? "", suggestionId),
  );

  const approveMutation = useApproveSuggestion();
  const rejectMutation = useRejectSuggestion();
  const ignoreMutation = useIgnoreSuggestion();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const typeLabels: Record<string, string> = {
    meta: t("types.meta"),
    og_title: t("types.og_title"),
    og_description: t("types.og_description"),
    schema: t("types.schema"),
    faq: t("types.faq"),
    redirect: t("types.redirect"),
    alt_text: t("types.alt_text"),
    internal_link: t("types.internal_link"),
    h1: t("types.h1"),
    content: t("types.content"),
  };

  const consentBenefits: Record<string, string> = {
    meta: t("reviewPage.consentNotice.benefits.meta"),
    og_title: t("reviewPage.consentNotice.benefits.og_title"),
    og_description: t("reviewPage.consentNotice.benefits.og_description"),
    schema: t("reviewPage.consentNotice.benefits.schema"),
    faq: t("reviewPage.consentNotice.benefits.faq"),
    redirect: t("reviewPage.consentNotice.benefits.redirect"),
    alt_text: t("reviewPage.consentNotice.benefits.alt_text"),
    internal_link: t("reviewPage.consentNotice.benefits.internal_link"),
    h1: t("reviewPage.consentNotice.benefits.h1"),
    content: t("reviewPage.consentNotice.benefits.content"),
  };

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8">
        <SelectProjectState />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col bg-neutral-75 px-6 py-8">
        <LoadingState />
      </div>
    );
  }

  if (isError || !suggestion) {
    return (
      <div className="flex flex-1 flex-col bg-neutral-75 px-6 py-8">
        <ErrorState
          title={t("reviewPage.notFound")}
          retryLabel={tCommon("retry")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const isPending = suggestion.status === "pending";
  const isProcessing =
    suggestion.status === "queued" || suggestion.status === "processing";

  const consentBenefit = consentBenefits[suggestion.type];
  const consentText = consentBenefit
    ? `${t("reviewPage.consentNotice.base")} ${consentBenefit}`
    : t("reviewPage.consentNotice.default");

  function handleApprove() {
    if (!selectedProjectId) return;
    approveMutation.mutate(
      { projectId: selectedProjectId, suggestionId },
      {
        onSuccess: () => {
          void refetch();
        },
      },
    );
  }

  function handleReject() {
    if (!selectedProjectId) return;
    rejectMutation.mutate(
      { projectId: selectedProjectId, suggestionId },
      { onSuccess: () => router.back() },
    );
  }

  function handleIgnore() {
    if (!selectedProjectId) return;
    ignoreMutation.mutate(
      { projectId: selectedProjectId, suggestionId },
      { onSuccess: () => router.back() },
    );
  }

  const isMutating = approveMutation.isPending || rejectMutation.isPending || ignoreMutation.isPending;

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-col gap-3 text-start">
          <div>
            <h1 className="text-h1 font-semibold text-secondary-500">{t("reviewPage.title")}</h1>
            <p className="text-label-md text-neutral-500">
              <bdi dir="ltr">{decodeUrlForDisplay(suggestion.url)}</bdi>
            </p>
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
              {isProcessing ? (
                <Loader2 className="size-3 shrink-0 animate-spin" aria-hidden="true" />
              ) : (
                <span className="size-1.5 shrink-0 rounded-full bg-current opacity-80" aria-hidden="true" />
              )}
              {t(`status.${suggestion.status}`)}
            </span>
          </div>
        </div>

        {suggestion.status === "queued" || suggestion.status === "processing" ? (
          <SuggestionProcessingPanel status={suggestion.status} />
        ) : (
          <>
            {/* Type-specific content */}
            <SuggestionDisplay suggestion={suggestion} />

            {/* Info grid */}
            {((suggestion.type !== "redirect" && suggestion.keywords.length > 0) || suggestion.explanation) && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {suggestion.type !== "redirect" && suggestion.keywords.length > 0 ? (
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

            {/* Consent notice */}
            {isPending && (
              <div className="flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50/50 p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-primary-500" aria-hidden="true" />
                <p className="text-label-sm leading-relaxed text-secondary-500">{consentText}</p>
              </div>
            )}

            {/* Action bar */}
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <BackLink onClick={() => router.back()}>{t("reviewPage.back")}</BackLink>

              <div className="flex flex-wrap flex-row-reverse items-center gap-2 sm:justify-end">
                {isPending ? (
                  <Button
                    type="button"
                    onClick={handleApprove}
                    disabled={isMutating}
                    className="bg-primary-300 font-medium text-secondary-500 hover:bg-primary-400 disabled:opacity-50"
                  >
                    {t("approve")}
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex">
                          <Button
                            type="button"
                            disabled
                            className="bg-primary-100 font-medium text-secondary-300"
                          >
                            {t("approve")}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{t("reviewPage.actionPendingOnly")}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {isPending ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditModalOpen(true)}
                    className="gap-2 border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                  >
                    <SquarePen className="size-4" aria-hidden="true" />
                    {t("reviewPage.edit")}
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex">
                          <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="gap-2 border-neutral-200 text-neutral-400"
                          >
                            <SquarePen className="size-4" aria-hidden="true" />
                            {t("reviewPage.edit")}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{t("reviewPage.editPendingOnly")}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {isPending ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReject}
                    disabled={isMutating}
                    className="border-error-200 bg-error-50 text-error-700 hover:bg-error-100 disabled:opacity-50"
                  >
                    {t("reject")}
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex">
                          <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="border-neutral-200 text-neutral-400"
                          >
                            {t("reject")}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{t("reviewPage.actionPendingOnly")}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {isPending ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleIgnore}
                    disabled={isMutating}
                    className="border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                  >
                    {t("ignore")}
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex">
                          <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="border-neutral-200 text-neutral-400"
                          >
                            {t("ignore")}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{t("reviewPage.actionPendingOnly")}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </>
        )}

        {isProcessing && (
          <BackLink onClick={() => router.back()}>{t("reviewPage.back")}</BackLink>
        )}
      </div>

      {selectedProjectId && !isProcessing && (
        <EditSuggestionModal
          open={editModalOpen}
          suggestion={suggestion}
          projectId={selectedProjectId}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}
