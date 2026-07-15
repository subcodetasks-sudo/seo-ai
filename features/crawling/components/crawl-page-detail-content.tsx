"use client";

import { Clock, ExternalLink, EyeOff, Link2, Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { arSA, enUS } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/back-link";
import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import SelectProjectState from "@/components/select-project-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/navigation";
import { useSelectedProject, CrawlGuardDialog, parseCrawlGuardError } from "@/features/home";
import type { CrawlGuardError } from "@/features/home/services/crawl-guard";
import { cn, getDisplayPathname } from "@/lib/utils";
import { HealthScoreRing } from "./health-score-ring";
import { LinksList } from "./links-list";
import { useGenerateIssueSuggestion, useIgnoreIssue } from "../queries/mutations";
import { crawlPagesQueryOptions } from "../queries/queries";
import {
  getSeverityBadgeClassName,
  getStatusCodeBadgeClassName,
  getStatusCodeLabel,
  isNotFoundStatus,
} from "../services/page-status";
import type { CrawlPageIssue } from "../types";

type CrawlPageDetailContentProps = {
  crawlId: string;
  pageId: string;
};

export function CrawlPageDetailContent({ crawlId, pageId }: CrawlPageDetailContentProps) {
  const t = useTranslations("crawlHistory.pageDetail");
  const tCard = useTranslations("crawlHistory.pageCard");
  const tProblems = useTranslations("problems");
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;
  const numberFormatter = new Intl.NumberFormat(locale);
  const { selectedProjectId } = useSelectedProject();
  const searchParams = useSearchParams();
  const router = useRouter();
  const suggestMutation = useGenerateIssueSuggestion();
  const ignoreMutation = useIgnoreIssue();
  const [pendingSuggestKey, setPendingSuggestKey] = useState<number | "redirect" | null>(null);
  const [pendingIgnoreIndex, setPendingIgnoreIndex] = useState<number | null>(null);
  const [crawlGuard, setCrawlGuard] = useState<CrawlGuardError | null>(null);

  const listPage = Number(searchParams.get("listPage") ?? "1") || 1;
  const pageSize = Number(searchParams.get("pageSize") ?? "10") || 10;
  const defaultTab = searchParams.get("tab") ?? "issues";
  const backHref = `/dashboard/crawl-history/${crawlId}?page=${listPage}`;

  const { data, isLoading, isError, refetch } = useQuery(
    crawlPagesQueryOptions(selectedProjectId ?? "", crawlId, listPage, pageSize),
  );

  const item = data?.items.find((page) => page.id === pageId);

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <SelectProjectState />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
        <LoadingState />
      </div>
    );
  }

  if (isError) {
    return (
      <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
        <ErrorState title={t("error")} retryLabel={tCommon("retry")} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!item) {
    return (
      <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
          <EmptyState
            title={t("notFound")}
            fullPage={false}
            className="rounded-xl border border-neutral-200 bg-white p-10"
          />
          <BackLink href={backHref}>{t("backToPages")}</BackLink>
        </div>
      </div>
    );
  }

  const notFound = isNotFoundStatus(item.status_code);
  const pageUrl = item.url;
  const crawledRelative = formatDistanceToNow(new Date(item.crawled_at), {
    addSuffix: true,
    locale: dateLocale,
  });

  function handleSuggest(issue: CrawlPageIssue, index: number) {
    if (!selectedProjectId || !issue.suggestion_type) return;
    setPendingSuggestKey(index);
    suggestMutation.mutate(
      {
        projectId: selectedProjectId,
        suggestionType: issue.suggestion_type,
        pageUrl,
        pageType: issue.page_type,
        imageUrl: issue.image_url,
      },
      {
        onSuccess: (suggestion) => {
          toast.success(t("aiSuggestSuccess"));
          router.push(`/dashboard/ai-suggestions/${suggestion.suggestion_id}`);
        },
        onError: (error) => {
          const guard = parseCrawlGuardError(error);
          if (guard) setCrawlGuard(guard);
        },
        onSettled: () => setPendingSuggestKey(null),
      },
    );
  }

  function handleSuggestRedirect() {
    if (!selectedProjectId) return;
    setPendingSuggestKey("redirect");
    suggestMutation.mutate(
      { projectId: selectedProjectId, suggestionType: "redirect", pageUrl },
      {
        onSuccess: (suggestion) => {
          toast.success(t("aiSuggestSuccess"));
          router.push(`/dashboard/ai-suggestions/${suggestion.suggestion_id}`);
        },
        onError: (error) => {
          const guard = parseCrawlGuardError(error);
          if (guard) setCrawlGuard(guard);
        },
        onSettled: () => setPendingSuggestKey(null),
      },
    );
  }

  function handleIgnore(issueType: string, index: number) {
    if (!selectedProjectId) return;
    setPendingIgnoreIndex(index);
    ignoreMutation.mutate(
      { projectId: selectedProjectId, issueType, pageUrl },
      {
        onSuccess: () => toast.success(t("ignoreSuccess")),
        onSettled: () => setPendingIgnoreIndex(null),
      },
    );
  }

  const isSuggestingRedirect = suggestMutation.isPending && pendingSuggestKey === "redirect";

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <CrawlGuardDialog
        projectId={selectedProjectId}
        guard={crawlGuard}
        open={crawlGuard !== null}
        onOpenChange={(open) => {
          if (!open) setCrawlGuard(null);
        }}
      />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
        <BackLink href={backHref}>{t("backToPages")}</BackLink>

        <div
          className={cn(
            "flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between",
            notFound ? "border-error-200 bg-error-50/40" : "border-neutral-200 bg-white",
          )}
        >
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getStatusCodeBadgeClassName(item.status_code)}>
                {getStatusCodeLabel(item.status_code, tCard)}
              </Badge>
              {item.is_redirect && (
                <Badge variant="outline" className="border-neutral-200 text-neutral-500">
                  {tCard("redirect")}
                </Badge>
              )}
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-label-lg font-medium text-secondary-500 hover:text-primary-600"
              title={item.url}
            >
              <bdi dir="ltr" className="truncate">
                {getDisplayPathname(item.url)}
              </bdi>
              <ExternalLink className="size-4 shrink-0 text-neutral-300" aria-hidden="true" />
            </a>
            <p className="flex items-center gap-1.5 text-label-sm text-neutral-400">
              <Clock className="size-3.5 shrink-0" aria-hidden="true" />
              {t("crawledAt", { time: crawledRelative })}
              {" · "}
              {t("responseTime", { ms: numberFormatter.format(item.response_time_ms) })}
            </p>
          </div>

          <HealthScoreRing
            score={item.health_score}
            size={72}
            stroke={6}
            label={tCard("score", { score: item.health_score ?? "—" })}
            ringClassName={notFound ? "text-error-500" : undefined}
            className="shrink-0"
          />
        </div>

        <Tabs defaultValue={defaultTab} className="flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="issues" className="flex-1 gap-1.5">
              <TriangleAlert className="size-3.5" aria-hidden="true" />
              {t("tabs.issues")}
              <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-label-xs leading-none text-neutral-600">
                {item.issues.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="internal" className="flex-1 gap-1.5">
              <Link2 className="size-3.5" aria-hidden="true" />
              {t("tabs.internal")}
              <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-label-xs leading-none text-neutral-600">
                {item.seo_data?.internal_links ?? 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="external" className="flex-1 gap-1.5">
              <ExternalLink className="size-3.5" aria-hidden="true" />
              {t("tabs.external")}
              <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-label-xs leading-none text-neutral-600">
                {item.seo_data?.external_links ?? 0}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="mt-4 flex flex-col gap-3">
            {notFound && (
              <div className="flex flex-col gap-3 rounded-xl border border-error-200 bg-error-50/40 p-4">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="size-4 shrink-0 text-error-500" aria-hidden="true" />
                  <span className="text-label-md font-medium text-secondary-500">
                    {t("notFoundIssueTitle")}
                  </span>
                </div>
                <p className="text-label-sm text-neutral-600">{t("notFoundIssueDetail")}</p>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSuggestRedirect}
                  disabled={isSuggestingRedirect}
                  className="w-fit gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm"
                >
                  {isSuggestingRedirect ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="size-3.5" aria-hidden="true" />
                  )}
                  {isSuggestingRedirect ? t("aiSuggestPending") : t("aiSuggestRedirect")}
                </Button>
              </div>
            )}

            {item.issues.length === 0 ? (
              !notFound && (
                <EmptyState
                  title={t("noIssues")}
                  fullPage={false}
                  className="rounded-xl border border-neutral-200 bg-white py-8"
                />
              )
            ) : (
              <ul className="flex flex-col gap-3">
                {item.issues.map((issue, index) => {
                  const isSuggesting = suggestMutation.isPending && pendingSuggestKey === index;
                  const isIgnoring = ignoreMutation.isPending && pendingIgnoreIndex === index;

                  return (
                    <li
                      key={`${issue.type}-${index}`}
                      className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-label-md font-medium text-secondary-500">
                          {tProblems.has(`problemTypes.${issue.type}`)
                            ? tProblems(`problemTypes.${issue.type}`)
                            : issue.type}
                        </span>
                        <div className="flex items-center gap-2">
                          {issue.ignored && (
                            <Badge variant="outline" className="border-neutral-200 text-neutral-500">
                              {t("ignored")}
                            </Badge>
                          )}
                          <Badge className={getSeverityBadgeClassName(issue.severity)}>
                            {tProblems.has(`severity.${issue.severity}`)
                              ? tProblems(`severity.${issue.severity}`)
                              : issue.severity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-label-sm text-neutral-600">{issue.detail}</p>
                      {!issue.ignored && (
                        <div className="flex flex-wrap items-center gap-2">
                          {issue.suggestion_type && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleSuggest(issue, index)}
                              disabled={isSuggesting}
                              className="w-fit gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm"
                            >
                              {isSuggesting ? (
                                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                              ) : (
                                <Sparkles className="size-3.5" aria-hidden="true" />
                              )}
                              {isSuggesting ? t("aiSuggestPending") : t("aiSuggest")}
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleIgnore(issue.type, index)}
                            disabled={isIgnoring}
                            className="w-fit gap-1.5 border-neutral-200 text-secondary-500 hover:border-neutral-300 hover:bg-neutral-50 text-label-sm"
                          >
                            {isIgnoring ? (
                              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <EyeOff className="size-3.5" aria-hidden="true" />
                            )}
                            {isIgnoring ? t("ignorePending") : t("ignore")}
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="internal" className="mt-4">
            <LinksList
              links={item.seo_data?.internal_link_urls ?? []}
              emptyLabel={t("noLinks")}
              searchPlaceholder={t("search")}
            />
          </TabsContent>

          <TabsContent value="external" className="mt-4">
            <LinksList
              links={item.seo_data?.external_link_urls ?? []}
              emptyLabel={t("noLinks")}
              searchPlaceholder={t("search")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
