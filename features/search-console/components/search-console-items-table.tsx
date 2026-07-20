"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Link2, Search } from "lucide-react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { SearchConsoleItemRow, SearchConsoleSortMode } from "../types";

const PAGE_SIZE = 5;

type SearchConsoleItemsTableProps = {
  title: string;
  rows: SearchConsoleItemRow[];
  labelHeader: string;
  clicksHeader: string;
  impressionsHeader: string;
  ctrHeader: string;
  avgPositionHeader: string;
  sortByClicksLabel: string;
  sortByCtrLabel: string;
  searchPlaceholder: string;
  paginationLabel: (start: number, end: number, total: number) => string;
  previousPageLabel: string;
  nextPageLabel: string;
  pageNumberLabel: (page: number) => string;
  copyLabel?: string;
  ltrLabel?: boolean;
};

export function SearchConsoleItemsTable({
  title,
  rows,
  labelHeader,
  clicksHeader,
  impressionsHeader,
  ctrHeader,
  avgPositionHeader,
  sortByClicksLabel,
  sortByCtrLabel,
  searchPlaceholder,
  paginationLabel,
  previousPageLabel,
  nextPageLabel,
  pageNumberLabel,
  copyLabel,
  ltrLabel = false,
}: SearchConsoleItemsTableProps) {
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");

  const [sortMode, setSortMode] = useState<SearchConsoleSortMode>("clicks");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    const sorted = [...rows].sort((a, b) => (sortMode === "ctr" ? b.ctr - a.ctr : b.clicks - a.clicks));

    if (!query) return sorted;

    return sorted.filter((item) => item.label.toLowerCase().includes(query));
  }, [rows, search, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filteredRows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredRows.length);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSortChange(mode: SearchConsoleSortMode) {
    setSortMode(mode);
    setPage(1);
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-start text-h4 font-semibold text-secondary-500">{title}</h3>

        <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
          <button
            type="button"
            onClick={() => handleSortChange("clicks")}
            className={cn(
              "rounded-md px-4 py-2 text-label-sm font-medium transition-colors",
              sortMode === "clicks" ? "bg-white text-secondary-500 shadow-sm" : "text-neutral-500 hover:text-secondary-500",
            )}
          >
            {sortByClicksLabel}
          </button>
          <button
            type="button"
            onClick={() => handleSortChange("ctr")}
            className={cn(
              "rounded-md px-4 py-2 text-label-sm font-medium transition-colors",
              sortMode === "ctr" ? "bg-white text-secondary-500 shadow-sm" : "text-neutral-500 hover:text-secondary-500",
            )}
          >
            {sortByCtrLabel}
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
          placeholder={searchPlaceholder}
          className="h-11 border-neutral-200 bg-neutral-50 ps-10"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start text-label-sm text-neutral-500">{labelHeader}</TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">{clicksHeader}</TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">{impressionsHeader}</TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">{ctrHeader}</TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">{avgPositionHeader}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <p className={cn("truncate text-label-sm font-medium text-secondary-500", ltrLabel && "text-start")} dir={ltrLabel ? "ltr" : undefined}>
                    {item.label}
                  </p>
                  {copyLabel ? (
                    <button type="button" className="shrink-0 text-neutral-400 hover:text-neutral-600" aria-label={copyLabel}>
                      <Link2 className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="py-4 text-end text-label-sm text-secondary-500">{formatter.format(item.clicks)}</TableCell>
              <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                {formatter.format(item.impressions)}
              </TableCell>
              <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                {formatter.format(Math.round(item.ctr * 10) / 10)}%
              </TableCell>
              <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                {formatter.format(Math.round(item.avgPosition * 10) / 10)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label-sm text-neutral-500">{paginationLabel(rangeStart, rangeEnd, filteredRows.length)}</p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 border-neutral-200"
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            aria-label={previousPageLabel}
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
                aria-label={pageNumberLabel(pageNumber)}
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
            aria-label={nextPageLabel}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
