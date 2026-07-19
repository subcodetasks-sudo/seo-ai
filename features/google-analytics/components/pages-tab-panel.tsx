"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Link2, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { googleAnalyticsPagesQueryOptions } from "../queries/queries";
import type { GoogleAnalyticsPeriod, PageSortMode, TopPageRow } from "../types";

const PAGE_SIZE = 5;
const EMPTY_PAGES: TopPageRow[] = [];

function getBounceRateClass(rate: number) {
  if (rate <= 20) return "text-success-600";
  if (rate <= 30) return "text-[#D97706]";
  return "text-destructive";
}

type PagesTabPanelProps = {
  projectId: string;
  period: GoogleAnalyticsPeriod;
};

export function PagesTabPanel({ projectId, period }: PagesTabPanelProps) {
  const t = useTranslations("googleAnalytics.pagesDashboard");
  const tCommon = useTranslations("common.state");
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");

  const { data, isLoading, isError, refetch } = useQuery(
    googleAnalyticsPagesQueryOptions(projectId, period),
  );

  const [sortMode, setSortMode] = useState<PageSortMode>("views");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pages = data?.pages ?? EMPTY_PAGES;

  const filteredPages = useMemo(() => {
    const query = search.trim().toLowerCase();

    const sorted = [...pages].sort((a, b) => {
      if (sortMode === "bounceRate") {
        return b.bounceRate - a.bounceRate;
      }
      return b.views - a.views;
    });

    if (!query) {
      return sorted;
    }

    return sorted.filter(
      (item) => item.title.toLowerCase().includes(query) || item.path.toLowerCase().includes(query),
    );
  }, [pages, search, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filteredPages.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredPages.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const rangeStart = filteredPages.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredPages.length);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSortChange(mode: PageSortMode) {
    setSortMode(mode);
    setPage(1);
  }

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !data) {
    return (
      <ErrorState
        title={tCommon("errorTitle")}
        retryLabel={tCommon("retry")}
        onRetry={() => refetch()}
        fullPage={false}
      />
    );
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-start text-h4 font-semibold text-secondary-500">{t("title")}</h3>

        <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
          <button
            type="button"
            onClick={() => handleSortChange("views")}
            className={cn(
              "rounded-md px-4 py-2 text-label-sm font-medium transition-colors",
              sortMode === "views"
                ? "bg-white text-secondary-500 shadow-sm"
                : "text-neutral-500 hover:text-secondary-500",
            )}
          >
            {t("sortByViews")}
          </button>
          <button
            type="button"
            onClick={() => handleSortChange("bounceRate")}
            className={cn(
              "rounded-md px-4 py-2 text-label-sm font-medium transition-colors",
              sortMode === "bounceRate"
                ? "bg-white text-secondary-500 shadow-sm"
                : "text-neutral-500 hover:text-secondary-500",
            )}
          >
            {t("sortByBounceRate")}
          </button>
        </div>
      </div>

      <div className="relative mb-5">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 border-neutral-200 bg-neutral-50 ps-10"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start text-label-sm text-neutral-500">
              {t("table.page")}
            </TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">
              {t("table.views")}
            </TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">
              {t("table.avgTime")}
            </TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">
              {t("table.bounceRate")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="py-4">
                <div className="flex flex-col gap-1 text-start">
                  <p className="text-label-sm font-medium text-secondary-500">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-label-xs text-neutral-400" dir="ltr">
                      {item.path}
                    </p>
                    <button
                      type="button"
                      className="text-neutral-400 hover:text-neutral-600"
                      aria-label={t("copyPath")}
                    >
                      <Link2 className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                {formatter.format(item.views)}
              </TableCell>
              <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                {item.avgTime}
              </TableCell>
              <TableCell
                className={cn(
                  "py-4 text-end text-label-sm font-medium",
                  getBounceRateClass(item.bounceRate),
                )}
              >
                {item.bounceRate}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label-sm text-neutral-500">
          {t("pagination", {
            start: rangeStart,
            end: rangeEnd,
            total: filteredPages.length,
          })}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 border-neutral-200"
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            aria-label={t("previousPage")}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;

            return (
              <Button
                key={pageNumber}
                type="button"
                variant="outline"
                size="icon"
                className={cn(
                  "size-9 border-neutral-200",
                  currentPage === pageNumber && "border-primary-300 bg-primary-50 text-primary-700",
                )}
                onClick={() => setPage(pageNumber)}
                aria-label={t("pageNumber", { page: pageNumber })}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 border-neutral-200"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            aria-label={t("nextPage")}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
