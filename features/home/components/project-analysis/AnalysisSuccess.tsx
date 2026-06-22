"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { cn } from "@/lib/utils";

export type AnalysisSuccessProps = {
  url: string;
  aiSuggestionsCount: number;
  issuesCount: number;
  pagesCount: number;
  onViewIssues?: () => void;
  onViewProject?: () => void;
};

type MetricCardProps = {
  value: string;
  label: string;
  valueClassName?: string;
};

function MetricCard({ value, label, valueClassName }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-4">
      <span
        className={cn(
          "text-h3 font-semibold tabular-nums",
          valueClassName ?? "text-secondary-500",
        )}
      >
        {value}
      </span>
      <span className="text-center text-label-sm text-neutral-500">{label}</span>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div
      className="flex size-16 items-center justify-center rounded-full bg-success-300 text-white"
      aria-hidden="true"
    >
      <Check className="size-8 stroke-[2.5px]" />
    </div>
  );
}

export default function AnalysisSuccess({
  url,
  aiSuggestionsCount,
  issuesCount,
  pagesCount,
  onViewIssues,
  onViewProject,
}: AnalysisSuccessProps) {
  const dir = useDirection();
  const locale = useLocale();
  const t = useTranslations("home.projectAnalysis.success");

  const countFormatter = new Intl.NumberFormat(locale);
  const compactFormatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const metrics: MetricCardProps[] = [
    {
      value: countFormatter.format(aiSuggestionsCount),
      label: t("metrics.aiSuggestions"),
      valueClassName: "text-error-300",
    },
    {
      value: countFormatter.format(issuesCount),
      label: t("metrics.issues"),
      valueClassName: "text-error-300",
    },
    {
      value: compactFormatter.format(pagesCount),
      label: t("metrics.pages"),
    },
  ];

  return (
    <div
      className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4"
      dir={dir}
    >
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <SuccessIcon />

        <div className="space-y-2">
          <h1 className="text-h1 font-semibold text-secondary-500">
            {t("title")}
          </h1>
          <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
        </div>

        <p className="rounded-lg border border-neutral-200 bg-neutral-75 px-4 py-2.5 text-label-md text-neutral-500">
          {url}
        </p>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button
          type="button"
          onClick={onViewIssues}
          className="h-12 w-full rounded-[10px] bg-primary-300 text-body font-semibold text-secondary-500 transition-all hover:bg-primary-300/90 active:translate-y-px"
        >
          {t("viewIssues")}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onViewProject}
          className="h-12 w-full rounded-[10px] border-neutral-200 bg-white text-body font-semibold text-secondary-500 hover:bg-neutral-50"
        >
          {t("viewProject")}
        </Button>
      </div>
    </div>
  );
}
