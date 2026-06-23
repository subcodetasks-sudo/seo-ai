"use client";

import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BrokenPage } from "../types";

type BrokenPagesTableProps = {
  items: BrokenPage[];
};

function getPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export function BrokenPagesTable({ items }: BrokenPagesTableProps) {
  const t = useTranslations("notFoundProblems.table");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-200 bg-neutral-50">
            <TableHead className="text-label-sm font-medium text-neutral-500 py-3 px-4">
              {t("brokenUrl")}
            </TableHead>
            <TableHead className="text-label-sm font-medium text-neutral-500 py-3 px-4">
              {t("source")}
            </TableHead>
            <TableHead className="text-label-sm font-medium text-neutral-500 py-3 px-4">
              {t("detectedAt")}
            </TableHead>
            <TableHead className="text-label-sm font-medium text-neutral-500 py-3 px-4">
              {t("action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-neutral-200">
              <TableCell className="py-3 px-4 font-medium text-error-500 text-label-sm">
                {getPathname(item.url)}
              </TableCell>
              <TableCell className="py-3 px-4 text-label-sm text-neutral-600">
                {item.referrer_url ? getPathname(item.referrer_url) : t("noReferrer")}
              </TableCell>
              <TableCell className="py-3 px-4 text-label-sm text-neutral-500">
                {formatDistanceToNow(new Date(item.first_detected_at), {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </TableCell>
              <TableCell className="py-3 px-4">
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm"
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  {t("fixWithAi")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
