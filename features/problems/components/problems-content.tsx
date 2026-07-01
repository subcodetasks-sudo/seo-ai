"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useDirection } from "@/components/ui/direction";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedProject } from "@/features/home";
import { ProblemsTable } from "./problems-table";
import { issueSummaryQueryOptions } from "../queries/queries";
import type { ProblemFilter, ProblemSeverity } from "../types";

const PAGE_SIZE = 10;

const FILTER_TABS: ProblemFilter[] = ["all", "critical", "high", "medium", "low"];

export function ProblemsContent() {
  const t = useTranslations("problems");
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();
  const [filter, setFilter] = useState<ProblemFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery(
    issueSummaryQueryOptions({ projectId: selectedProjectId ?? "" }),
  );

  const items = data?.items ?? [];
  const crawlJobId = data?.crawl_job_id ?? "";

  const counts: Record<Exclude<ProblemFilter, "all">, number> = {
    critical: items.filter((p) => p.severity === "critical").length,
    high: items.filter((p) => p.severity === "high").length,
    medium: items.filter((p) => p.severity === "medium").length,
    low: items.filter((p) => p.severity === "low").length,
  };

  const filteredItems =
    filter === "all" ? items : items.filter((p) => p.severity === filter);

  const total = filteredItems.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(value: string) {
    setFilter(value as ProblemFilter);
    setPage(1);
  }

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <p className="text-label-md text-neutral-500">{t("noProject")}</p>
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1 text-start">
          <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
          <p className="text-label-md text-neutral-500">
            {t("subtitle", { count: data?.total_issues ?? 0 })}
          </p>
        </div>

        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="h-9 w-fit min-w-40 gap-1 self-start border-neutral-200 bg-white px-3 text-label-sm text-secondary-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_TABS.map((tab) => (
              <SelectItem key={tab} value={tab}>
                {t(`tabs.${tab}`)}
                {tab !== "all" && ` (${counts[tab as ProblemSeverity]})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            title={t("error")}
            retryLabel={tCommon("retry")}
            onRetry={() => refetch()}
          />
        ) : paginatedItems.length === 0 ? (
          <EmptyState title={t("empty")} />
        ) : (
          <ProblemsTable items={paginatedItems} crawlJobId={crawlJobId} />
        )}

        {total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-label-sm text-neutral-500">
              {t("pagination.showing", { shown: paginatedItems.length, total })}
            </p>
            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) setPage(page + 1);
                      }}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
