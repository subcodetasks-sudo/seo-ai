"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

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
};

export function AiInsightsHeader({ period, onPeriodChange }: AiInsightsHeaderProps) {
  const t = useTranslations("aiInsights");

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1 text-start">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-0.5 text-label-xs font-medium text-primary-700">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("badge")}
          </span>
        </div>
        <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
        <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
      </div>

      <Select
        value={String(period)}
        onValueChange={(v) => onPeriodChange(Number(v) as AiInsightsPeriod)}
      >
        <SelectTrigger className="h-9 w-auto gap-1 border-neutral-200 bg-white px-3 text-label-sm text-secondary-500">
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
  );
}
