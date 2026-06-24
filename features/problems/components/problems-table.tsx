"use client";

import { ChevronRight, EyeOff, Lightbulb, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Problem } from "../types";

type ProblemsTableProps = {
  items: Problem[];
};

const severityStyles: Record<string, string> = {
  high: "bg-error-50 text-error-600 border border-error-200",
  medium: "bg-warning-50 text-warning-600 border border-warning-200",
  low: "bg-neutral-100 text-neutral-500 border border-neutral-200",
};

export function ProblemsTable({ items }: ProblemsTableProps) {
  const t = useTranslations("problems");

  const problemLabels: Record<string, string> = {
    missing_meta_title: t("problemTypes.missing_meta_title"),
    missing_meta_description: t("problemTypes.missing_meta_description"),
    duplicate_title: t("problemTypes.duplicate_title"),
    missing_alt_text: t("problemTypes.missing_alt_text"),
    slow_page_speed: t("problemTypes.slow_page_speed"),
    missing_schema: t("problemTypes.missing_schema"),
    broken_internal_links: t("problemTypes.broken_internal_links"),
    missing_h1: t("problemTypes.missing_h1"),
  };

  function getProblemLabel(type: string) {
    return problemLabels[type] ?? type;
  }

  function ActionButtons({ item }: { item: Problem }) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
        >
          <Lightbulb className="size-3.5" aria-hidden="true" />
          {t("table.suggestFix")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="gap-1.5 text-neutral-500 hover:text-neutral-700 text-label-sm"
        >
          <EyeOff className="size-3.5" aria-hidden="true" />
          {t("table.ignore")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="gap-1.5 text-neutral-500 hover:text-neutral-700 text-label-sm"
        >
          {t("table.viewPages")}
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Mobile: card layout */}
      <div className="flex flex-col divide-y divide-neutral-200 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-warning-500 shrink-0" aria-hidden="true" />
              <span className="text-label-sm font-medium text-secondary-500">
                {getProblemLabel(item.type)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-label-xs text-neutral-400">{t("table.affectedPages")}</span>
                <span className="text-label-sm text-neutral-600">
                  {t("table.pageCount", { count: item.affected_pages })}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-label-xs text-neutral-400">{t("table.priority")}</span>
                <span
                  className={cn(
                    "inline-flex w-fit rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                    severityStyles[item.severity],
                  )}
                >
                  {t(`severity.${item.severity}`)}
                </span>
              </div>
            </div>
            <ActionButtons item={item} />
          </div>
        ))}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-200 bg-neutral-50">
              <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4">
                {t("table.problem")}
              </TableHead>
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("table.affectedPages")}
              </TableHead>
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("table.priority")}
              </TableHead>
              <TableHead className="text-label-sm text-end font-medium text-neutral-500 py-3 px-4">
                {t("table.action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-neutral-200">
                <TableCell className="py-3 px-4 text-start">
                  <div className="flex items-center gap-2">
                    <TriangleAlert className="size-4 text-warning-500 shrink-0" aria-hidden="true" />
                    <span className="text-label-sm font-medium text-secondary-500">
                      {getProblemLabel(item.type)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-neutral-600 text-center">
                  {t("table.pageCount", { count: item.affected_pages })}
                </TableCell>
                <TableCell className="py-3 px-4 text-center">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                      severityStyles[item.severity],
                    )}
                  >
                    {t(`severity.${item.severity}`)}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <ActionButtons item={item} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
