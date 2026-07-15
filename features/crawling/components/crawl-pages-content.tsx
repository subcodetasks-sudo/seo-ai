"use client";

import { useMemo, useState } from "react";
import { FileStack, FileText, Layers, Link2, TriangleAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import BackLink from "@/components/back-link";
import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import SelectProjectState from "@/components/select-project-state";
import { TablePagination } from "@/components/table-pagination";
import { useDirection } from "@/components/ui/direction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSelectedProject } from "@/features/home";
import { CrawlPageCard } from "./crawl-page-card";
import { FilterTab, FilterTabsGroup } from "./filter-tabs";
import { crawlPagesQueryOptions } from "../queries/queries";
import { isNotFoundStatus } from "../services/page-status";

const PAGE_SIZE = 10;

type CrawlPagesContentProps = {
  crawlId: string;
};

type ResultFilter = "all" | "issues" | "notFound";

function parseResultFilter(value: string | null): ResultFilter {
  if (value === "issues" || value === "notFound" || value === "all") return value;
  return "all";
}

function SummaryStat({
  icon: Icon,
  value,
  label,
  tooltip,
}: {
  icon: typeof FileText;
  value: string;
  label: string;
  tooltip: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            tabIndex={0}
            className="flex cursor-help items-center gap-2.5 rounded-lg border border-neutral-200 bg-white px-4 py-3 outline-none focus-visible:border-primary-300 focus-visible:ring-2 focus-visible:ring-primary-200"
          >
            <Icon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
            <div className="flex min-w-0 flex-col">
              <span className="text-h4 font-semibold leading-tight text-secondary-500">{value}</span>
              <span className="truncate text-label-sm text-neutral-500">{label}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6} className="max-w-56 text-center leading-relaxed">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function CrawlPagesContent({ crawlId }: CrawlPagesContentProps) {
  const t = useTranslations("crawlHistory.pages");
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const locale = useLocale();
  const numberFormatter = new Intl.NumberFormat(locale);
  const { selectedProjectId } = useSelectedProject();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(() => Number(searchParams.get("page") ?? "1") || 1);
  const [filter, setFilter] = useState<ResultFilter>(() =>
    parseResultFilter(searchParams.get("filter")),
  );

  const { data, isLoading, isError, refetch } = useQuery(
    crawlPagesQueryOptions(selectedProjectId ?? "", crawlId, page, PAGE_SIZE),
  );

  const items = useMemo(() => data?.items ?? [], [data]);
  // Filters are applied client-side on the current page only, so API total_pages
  // does not reflect the filtered set — hide pagination while a filter is active.
  const totalPages = filter === "all" ? (data?.total_pages ?? 1) : 1;

  const issuesCount = items.filter((item) => item.issues.length > 0).length;
  const notFoundCount = items.filter((item) => isNotFoundStatus(item.status_code)).length;

  const filteredItems = items.filter((item) => {
    if (filter === "issues") return item.issues.length > 0;
    if (filter === "notFound") return isNotFoundStatus(item.status_code);
    return true;
  });

  function updateListUrl(nextPage: number, nextFilter: ResultFilter) {
    const params = new URLSearchParams();
    if (nextPage > 1) params.set("page", String(nextPage));
    if (nextFilter !== "all") params.set("filter", nextFilter);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handlePageChange(next: number) {
    setPage(next);
    updateListUrl(next, filter);
  }

  function handleFilterChange(next: ResultFilter) {
    setFilter(next);
    setPage(1);
    updateListUrl(1, next);
  }

  function buildDetailHref(pageId: string, tab: "issues" | "internal" | "external") {
    return `/dashboard/crawl-history/${crawlId}/pages/${pageId}?listPage=${page}&pageSize=${PAGE_SIZE}&tab=${tab}`;
  }

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <SelectProjectState />
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4 text-start">
          <BackLink href="/dashboard/crawl-history">{t("backToList")}</BackLink>

          <div className="flex flex-col gap-1">
            <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
            <p className="text-label-md text-neutral-500">{t("subtitle", { count: data?.total ?? 0 })}</p>
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryStat
              icon={FileText}
              value={numberFormatter.format(data.total)}
              label={t("metrics.pages")}
              tooltip={t("metrics.tooltips.pages")}
            />
            <SummaryStat
              icon={FileStack}
              value={numberFormatter.format(data.total_basic)}
              label={t("metrics.basic")}
              tooltip={t("metrics.tooltips.basic")}
            />
            <SummaryStat
              icon={Link2}
              value={numberFormatter.format(data.total_internal)}
              label={t("metrics.internal")}
              tooltip={t("metrics.tooltips.internal")}
            />
            <SummaryStat
              icon={TriangleAlert}
              value={numberFormatter.format(data.total_issues)}
              label={t("metrics.issues")}
              tooltip={t("metrics.tooltips.issues")}
            />
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <FilterTabsGroup label={t("filter.label")}>
            <FilterTab
              active={filter === "all"}
              onClick={() => handleFilterChange("all")}
              label={t("filter.all")}
              count={items.length}
              icon={Layers}
              activeClassName="bg-secondary-500 text-white"
            />
            <FilterTab
              active={filter === "issues"}
              onClick={() => handleFilterChange("issues")}
              label={t("filter.issues")}
              count={issuesCount}
              icon={TriangleAlert}
              activeClassName="bg-warning-400 text-white"
            />
            <FilterTab
              active={filter === "notFound"}
              onClick={() => handleFilterChange("notFound")}
              label={t("filter.notFound")}
              count={notFoundCount}
              activeClassName="bg-error-500 text-white"
            />
          </FilterTabsGroup>
        )}

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            title={t("error")}
            retryLabel={tCommon("retry")}
            onRetry={() => refetch()}
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title={items.length === 0 ? t("empty") : t("filter.noResults")}
            fullPage={false}
            className="rounded-xl border border-neutral-200 bg-white p-10"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredItems.map((item) => (
              <CrawlPageCard
                key={item.id}
                page={item}
                detailHref={(tab) => buildDetailHref(item.id, tab)}
              />
            ))}
          </div>
        )}

        <TablePagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
