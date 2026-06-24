"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { ReportsPeriod } from "../types";

const PERIODS: ReportsPeriod[] = [7, 30, 90];

type ReportsHeaderProps = {
  domain: string;
  period: ReportsPeriod;
  onPeriodChange: (period: ReportsPeriod) => void;
  onCreateReport: () => void;
};

export function ReportsHeader({
  domain,
  period,
  onPeriodChange,
  onCreateReport,
}: ReportsHeaderProps) {
  const t = useTranslations("reports");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 text-start">
          <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
          <p className="text-label-md text-neutral-500">{t("subtitle", { domain })}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
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
          <Button
            type="button"
            size="sm"
            onClick={onCreateReport}
            className="shrink-0 bg-primary-300 text-secondary-500 hover:bg-primary-400 font-medium text-label-sm"
          >
            {t("createReport")}
          </Button>
        </div>
      </div>
    </div>
  );
}
