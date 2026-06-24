"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSelectedProject } from "@/features/home";
import { changelogQueryOptions } from "../queries/queries";
import { useGenerateReport } from "../queries/mutations";
import type { ChangelogPeriod, GenerateReportFormValues } from "../types";
import { ChangelogTable } from "./changelog-table";
import { GenerateReportDialog } from "./generate-report-dialog";

const PAGE_SIZE = 10;
const PERIODS: ChangelogPeriod[] = [7, 30, 90];

export function ChangelogContent() {
  const t = useTranslations("changelog");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();

  const [period, setPeriod] = useState<ChangelogPeriod>(7);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: entries = [], isLoading } = useQuery(
    changelogQueryOptions(selectedProjectId ?? "", period),
  );

  const { mutate: generateReport, isPending: isGenerating } = useGenerateReport(
    selectedProjectId ?? "",
    period,
  );

  const total = entries.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginatedItems = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handlePeriodChange(p: ChangelogPeriod) {
    setPeriod(p);
    setPage(1);
  }

  function handleReportSubmit(values: GenerateReportFormValues) {
    generateReport(values, {
      onSuccess: () => setDialogOpen(false),
    });
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

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 text-start">
            <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
            <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="shrink-0 bg-primary-300 text-secondary-500 hover:bg-primary-400 font-medium text-label-sm"
          >
            {t("createReport")}
          </Button>
        </div>

        {/* Period filter */}
        <div className="flex items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePeriodChange(p)}
              className={
                period === p
                  ? "rounded-lg bg-primary-300 px-4 py-1.5 text-label-sm font-medium text-secondary-500"
                  : "rounded-lg border border-neutral-200 bg-white px-4 py-1.5 text-label-sm text-neutral-500 hover:bg-neutral-50 transition-colors"
              }
            >
              {t("period", { days: p })}
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-neutral-400">{t("loading")}</p>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-neutral-500">{t("empty")}</p>
          </div>
        ) : (
          <ChangelogTable items={paginatedItems} />
        )}

        {/* Pagination */}
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
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                      className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={(e) => { e.preventDefault(); setPage(p); }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>

      <GenerateReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleReportSubmit}
        isPending={isGenerating}
      />
    </div>
  );
}
