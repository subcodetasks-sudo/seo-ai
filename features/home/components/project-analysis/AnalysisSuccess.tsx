"use client";

import { ArrowRight, Check, FileStack, FileText, FolderOpen, Globe, Link2, Sparkles, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDirection } from "@/components/ui/direction";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type AnalysisSuccessProps = {
  url: string;
  // aiSuggestionsCount: number;
  issuesCount: number;
  pagesCount: number;
  basicPagesCount: number;
  internalPagesCount: number;
  isMetricsLoading?: boolean;
  onViewIssues?: () => void;
  onViewProject?: () => void;
};

type MetricCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
  iconClassName?: string;
  isLoading?: boolean;
};

function MetricCard({ icon: Icon, value, label, iconClassName, isLoading }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-4 text-center">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-full bg-white text-neutral-400",
          iconClassName,
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>

      {isLoading ? (
        <span className="h-6 w-10 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
      ) : (
        <span className="text-h4 font-semibold tabular-nums text-secondary-500">{value}</span>
      )}
      <span className="text-center text-label-sm text-neutral-500">{label}</span>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div
      className="flex size-16 items-center justify-center rounded-full bg-success-300 text-white ring-8 ring-success-50"
      aria-hidden="true"
    >
      <Check className="size-8 stroke-[2.5px]" />
    </div>
  );
}

export default function AnalysisSuccess({
  url,
  // aiSuggestionsCount,
  issuesCount,
  pagesCount,
  basicPagesCount,
  internalPagesCount,
  isMetricsLoading,
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
      icon: TriangleAlert,
      value: countFormatter.format(issuesCount),
      label: t("metrics.issues"),
      iconClassName: "text-error-300",
      isLoading: isMetricsLoading,
    },
    {
      icon: FileText,
      value: compactFormatter.format(pagesCount),
      label: t("metrics.pages"),
      iconClassName: "text-secondary-400",
      isLoading: isMetricsLoading,
    },
    {
      icon: FileStack,
      value: compactFormatter.format(basicPagesCount),
      label: t("metrics.basic"),
      iconClassName: "text-neutral-500",
      isLoading: isMetricsLoading,
    },
    {
      icon: Link2,
      value: compactFormatter.format(internalPagesCount),
      label: t("metrics.internal"),
      iconClassName: "text-primary-500",
      isLoading: isMetricsLoading,
    },
    // {
    //   icon: Sparkles,
    //   value: countFormatter.format(aiSuggestionsCount),
    //   label: t("metrics.aiSuggestions"),
    //   iconClassName: "text-primary-500",
    //   isLoading: isMetricsLoading,
    // },
  ];

  return (
    <div className="mx-auto w-full max-w-xl px-4" dir={dir}>
      <Card className="items-center gap-6 rounded-2xl border-neutral-200 bg-white p-6 shadow-sm ring-0 sm:p-8">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <SuccessIcon />

          <div className="space-y-2">
            <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
            <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
          </div>

          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-neutral-200 bg-neutral-75 px-4 py-2 text-label-md text-neutral-500">
            <Globe className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
            <span className="truncate">{url}</span>
          </span>
        </div>

        <Separator className="bg-neutral-100" />

        <CardContent className="w-full p-0">
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </CardContent>

        <div className="flex w-full flex-col gap-3">
          <Button
            type="button"
            onClick={onViewIssues}
            className="h-12 w-full gap-2 rounded-[10px] bg-primary-300 text-body font-semibold text-secondary-500 hover:bg-primary-400"
          >
            {t("viewIssues")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onViewProject}
            className="h-12 w-full gap-2 rounded-[10px] border-neutral-200 bg-white text-body font-semibold text-secondary-500 hover:bg-neutral-50"
          >
            <FolderOpen className="size-4" aria-hidden="true" />
            {t("viewProject")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
