"use client";

import { useState } from "react";
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
import type { Problem, ProblemFilter } from "../types";

const PAGE_SIZE = 10;

const MOCK_PROBLEMS: Problem[] = [
  { id: "1", type: "missing_meta_title", affected_pages: 12, severity: "high" },
  { id: "2", type: "missing_meta_description", affected_pages: 8, severity: "high" },
  { id: "3", type: "duplicate_title", affected_pages: 5, severity: "high" },
  { id: "4", type: "missing_alt_text", affected_pages: 23, severity: "high" },
  { id: "5", type: "slow_page_speed", affected_pages: 3, severity: "medium" },
  { id: "6", type: "missing_schema", affected_pages: 18, severity: "medium" },
  { id: "7", type: "broken_internal_links", affected_pages: 2, severity: "low" },
];

const FILTER_TABS: ProblemFilter[] = ["all", "high", "medium", "low"];

export function ProblemsContent() {
  const t = useTranslations("problems");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();
  const [filter, setFilter] = useState<ProblemFilter>("all");
  const [page, setPage] = useState(1);

  const counts = {
    high: MOCK_PROBLEMS.filter((p) => p.severity === "high").length,
    medium: MOCK_PROBLEMS.filter((p) => p.severity === "medium").length,
    low: MOCK_PROBLEMS.filter((p) => p.severity === "low").length,
  };

  const filteredItems =
    filter === "all" ? MOCK_PROBLEMS : MOCK_PROBLEMS.filter((p) => p.severity === filter);

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
            {t("subtitle", { count: MOCK_PROBLEMS.length, domain: "www.example.com" })}
          </p>
        </div>

        <Tabs value={filter} onValueChange={handleFilterChange}>
          <TabsList>
            {FILTER_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="gap-1.5">
                {t(`tabs.${tab}`)}
                {tab !== "all" && (
                  <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-label-xs leading-none text-neutral-600">
                    {counts[tab]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {paginatedItems.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-neutral-500">{t("empty")}</p>
          </div>
        ) : (
          <ProblemsTable items={paginatedItems} />
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
