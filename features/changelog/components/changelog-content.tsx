"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import LoadingState from "@/components/loading-state";
import SelectProjectState from "@/components/select-project-state";
import { TablePagination } from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { useSelectedProject } from "@/features/home";
import { changelogQueryOptions } from "../queries/queries";
import { useGenerateReport } from "../queries/mutations";
import type { ChangelogPeriod, GenerateReportFormValues } from "../types";
import { ChangelogTable } from "./changelog-table";
import { GenerateReportDialog } from "./generate-report-dialog";

const PERIODS: ChangelogPeriod[] = [7, 30, 90];

export function ChangelogContent() {
  const t = useTranslations("changelog");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();

  const [period, setPeriod] = useState<ChangelogPeriod>(30);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useQuery(
    changelogQueryOptions(selectedProjectId ?? "", period, page),
  );

  const { mutate: generateReport, isPending: isGenerating } = useGenerateReport(
    selectedProjectId ?? "",
    period,
  );

  const items = data?.data.items ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = data?.data.total_pages ?? 1;

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
        <SelectProjectState />
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">

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
          <LoadingState />
        ) : (
          <ChangelogTable items={items} emptyMessage={t("empty")} />
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-label-sm text-neutral-500">
              {t("pagination.showing", { shown: items.length, total })}
            </p>
            <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
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
