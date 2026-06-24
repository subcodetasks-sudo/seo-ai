"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useDirection } from "@/components/ui/direction";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedProject } from "@/features/home";
import { ProblemsTable } from "./problems-table";
import { issueSummaryQueryOptions } from "../queries/queries";
import type { ProblemFilter, ProblemSeverity } from "../types";

const PAGE_SIZE = 10;

const FILTER_TABS: ProblemFilter[] = ["all", "critical", "high", "medium", "low"];

export function ProblemsContent() {
  const t = useTranslations("problems");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();
  const [filter, setFilter] = useState<ProblemFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery(
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-1 text-start">
          <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
          <p className="text-label-md text-neutral-500">
            {t("subtitle", { count: data?.total_issues ?? 0 })}
          </p>
        </div>

        <Tabs value={filter} onValueChange={handleFilterChange}>
          <TabsList>
            {FILTER_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="gap-1.5">
                {t(`tabs.${tab}`)}
                {tab !== "all" && (
                  <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-label-xs leading-none text-neutral-600">
                    {counts[tab as ProblemSeverity]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-neutral-500">{t("loading")}</p>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-error-500">{t("error")}</p>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-neutral-500">{t("empty")}</p>
          </div>
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
