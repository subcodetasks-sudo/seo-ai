"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReportsPeriod } from "../types";

const PERIODS: ReportsPeriod[] = [7, 30, 90];

type ReportsHeaderProps = {
  domain: string;
  period: ReportsPeriod;
  onPeriodChange: (period: ReportsPeriod) => void;
  onOpenExportDialog: () => void;
  onDownload: () => void;
  canDownload: boolean;
};

export function ReportsHeader({
  domain,
  period,
  onPeriodChange,
  onOpenExportDialog,
  onDownload,
  canDownload,
}: ReportsHeaderProps) {
  const t = useTranslations("reports");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1 text-start">
        <h1 className="text-h2 font-semibold text-secondary-500 sm:text-h1">{t("title")}</h1>
        <p className="text-label-md wrap-break-word text-neutral-500">
          {t("subtitle", { domain })}
        </p>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:items-end">
        <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:items-center">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={cn(
                "rounded-lg px-2 py-1.5 text-label-sm transition-colors sm:px-4",
                period === p
                  ? "bg-primary-300 font-medium text-secondary-500"
                  : "border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50",
              )}
            >
              {t("period", { days: p })}
            </button>
          ))}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          {/* Direct download button — disabled for now, generation happens via the export dialog below.
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={!canDownload}
            title={canDownload ? undefined : t("downloadUnavailable")}
            className="flex-1 gap-1.5 border-neutral-200 text-label-sm font-medium text-neutral-600 hover:bg-neutral-50 sm:flex-none"
          >
            <Download size={16} />
            {t("download")}
          </Button>
          */}
          <Button
            type="button"
            size="sm"
            onClick={onOpenExportDialog}
            className="flex-1 bg-primary-300 text-label-sm font-medium text-secondary-500 hover:bg-primary-400 sm:flex-none"
          >
            {t("createReport")}
          </Button>
        </div>
      </div>
    </div>
  );
}
