"use client";

import { Plus, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AiInsightsPeriod } from "../types";

const PERIODS: AiInsightsPeriod[] = [7, 30, 90];

type AiInsightsHeaderProps = {
  period: AiInsightsPeriod;
  onPeriodChange: (period: AiInsightsPeriod) => void;
  onReanalyze?: () => void;
};

export function AiInsightsHeader({ period, onPeriodChange, onReanalyze }: AiInsightsHeaderProps) {
  const t = useTranslations("aiInsights");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 text-start">
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
            <span className="flex size-6 items-center justify-center rounded-full border border-primary-300 text-primary-600">
              <Plus className="size-3.5" aria-hidden="true" />
            </span>
          </div>
          <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          onClick={onReanalyze}
          className="gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          {t("reanalyze")}
        </Button>

        <Select
          value={String(period)}
          onValueChange={(v) => onPeriodChange(Number(v) as AiInsightsPeriod)}
        >
          <SelectTrigger className="h-8 w-auto gap-1 border-neutral-200 bg-white px-3 text-label-sm text-secondary-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((p) => (
              <SelectItem key={p} value={String(p)}>
                {t("period", { days: p })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
