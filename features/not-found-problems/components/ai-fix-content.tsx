"use client";

import { useState, type ReactNode } from "react";
import { CircleCheck, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { cn, getDisplayPathname } from "@/lib/utils";
import { approveRedirectSuggestion, createRedirectSuggestion, redirectBrokenPage } from "../queries/api";
import { brokenPageDetailQueryOptions } from "../queries/queries";
import { notFoundProblemsKeys } from "../queries/query-keys";

type InfoCardProps = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

function InfoCard({ label, value, valueClassName }: InfoCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4">
      <span className="text-label-xs text-neutral-400 text-start">{label}</span>
      <span className={cn("text-label-md font-medium text-start", valueClassName ?? "text-secondary-500")}>
        {value}
      </span>
    </div>
  );
}

export function AiFixContent() {
  const t = useTranslations("notFoundProblems.aifix");
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [manualUrl, setManualUrl] = useState("");
  const isRtl = dir === "rtl";

  const projectId = searchParams.get("projectId") ?? "";
  const pageId = searchParams.get("pageId") ?? "";

  const detailQuery = useQuery(brokenPageDetailQueryOptions(projectId, pageId));
  const page = detailQuery.data?.data;
  const suggestion = page?.redirect_suggestion ?? null;
  const isSuggestionPending = suggestion?.status === "pending";

  const redirectMutation = useMutation({
    mutationFn: (targetUrl: string) => redirectBrokenPage(projectId, pageId, targetUrl),
    onSuccess: () => {
      router.back();
    },
  });

  const approveMutation = useMutation({
    mutationFn: (suggestionId: string) => approveRedirectSuggestion(projectId, suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notFoundProblemsKeys.detail(projectId, pageId),
      });
    },
  });

  const generateMutation = useMutation({
    mutationFn: () => createRedirectSuggestion(projectId, page?.url ?? ""),
    onSuccess: (suggestion) => {
      queryClient.invalidateQueries({
        queryKey: notFoundProblemsKeys.detail(projectId, pageId),
      });
      router.push(`/dashboard/ai-suggestions/${suggestion.suggestion_id}`);
    },
  });

  function handleApprove() {
    if (!suggestion || !isSuggestionPending) return;
    approveMutation.mutate(suggestion.suggestion_id);
  }

  function handleGenerate() {
    generateMutation.mutate();
  }

  function handleApply() {
    if (!manualUrl.trim()) return;
    redirectMutation.mutate(manualUrl.trim());
  }

  const isPending = redirectMutation.isPending;

  if (!projectId || !pageId) {
    return (
      <div dir={dir} className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8">
        <p className="text-label-md text-neutral-500">{t("missingPage")}</p>
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8">
        <LoadingState />
      </div>
    );
  }

  if (detailQuery.isError || !page) {
    return (
      <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8">
        <ErrorState
          title={t("loadError")}
          retryLabel={tCommon("retry")}
          onRetry={() => detailQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">

        <h1 className="text-h1 font-semibold text-secondary-500 text-start">{t("title")}</h1>

        {/* Row 1: Referrer + Broken URL */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard
            label={t("referrer")}
            value={
              page.referrer_url ? (
                <bdi dir="ltr">{getDisplayPathname(page.referrer_url)}</bdi>
              ) : (
                t("noReferrer")
              )
            }
          />
          <InfoCard
            label={t("brokenUrl")}
            value={<bdi dir="ltr">{getDisplayPathname(page.url)}</bdi>}
            valueClassName="text-error-500"
          />
        </div>

        {/* Row 2: Status + Detected At */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard label={t("status")} value={t(`statusValues.${page.status}`)} />
          <InfoCard
            label={t("detectedAt")}
            value={formatDistanceToNow(new Date(page.first_detected_at), {
              addSuffix: true,
              locale: dateLocale,
            })}
          />
        </div>

        {/* AI Redirect Suggestion */}
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-start gap-2">
              <Sparkles className="size-4 text-primary-400" aria-hidden="true" />
              <span className="text-label-md font-semibold text-secondary-500">{t("aiSuggestion")}</span>
            </div>
            {suggestion && (
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                  suggestion.status === "approved" && "bg-success-50 text-success-700",
                  suggestion.status === "rejected" && "bg-error-50 text-error-700",
                  suggestion.status === "pending" && "bg-warning-50 text-warning-700",
                  suggestion.status === "queued" && "bg-neutral-100 text-neutral-600",
                )}
              >
                {t(`suggestionStatus.${suggestion.status}`)}
              </span>
            )}
          </div>

          {suggestion ? (
            <div className="flex flex-col gap-2 rounded-lg bg-neutral-100 p-3">
              <span className="text-label-xs text-neutral-400 text-start">{t("suggestedUrl")}</span>
              <span className="font-mono text-label-md font-semibold text-secondary-500 text-start">
                {suggestion.target_url}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-label-sm font-semibold text-error-500 text-start">{t("reason")}</span>
                <p className="text-label-sm text-secondary-400 text-start leading-relaxed">
                  {suggestion.reason}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-label-sm text-neutral-500 text-start">{t("noSuggestion")}</p>
          )}

          {!suggestion ? (
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="w-full gap-2 bg-primary-300 text-secondary-500 hover:bg-primary-400 h-11"
            >
              <CircleCheck className="size-4" aria-hidden="true" />
              {generateMutation.isPending ? t("generating") : t("generate")}
            </Button>
          ) : isSuggestionPending ? (
            <Button
              type="button"
              onClick={handleApprove}
              disabled={approveMutation.isPending}
              className="w-full gap-2 bg-primary-300 text-secondary-500 hover:bg-primary-400 h-11"
            >
              <CircleCheck className="size-4" aria-hidden="true" />
              {t("approve")}
            </Button>
          ) : null}
        </div>

        {/* Manual Entry */}
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
          <span className="text-label-md font-medium text-secondary-500 text-start">
            {t("enterManually")}
          </span>
          <div className="flex gap-2">
            <Input
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder={t("manualPlaceholder")}
              className="h-10 flex-1"
              disabled={isPending}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleApply}
              disabled={isPending || !manualUrl.trim()}
              className="shrink-0 border-neutral-200 bg-white text-secondary-500 hover:bg-neutral-50"
            >
              {t("apply")}
            </Button>
          </div>
        </div>

        {/* Back link */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-label-sm text-neutral-500 hover:text-secondary-500 transition-colors self-start"
        >
          {isRtl ? (
            <>
              {t("back")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t("back")}
            </>
          )}
        </button>

      </div>
    </div>
  );
}
