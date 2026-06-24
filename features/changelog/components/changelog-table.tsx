"use client";

import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ChangelogEntry, ChangelogStatus } from "../types";

const statusStyles: Record<ChangelogStatus, string> = {
  applied: "bg-success-50 text-success-700 border border-success-200",
  pending: "bg-warning-50 text-warning-700 border border-warning-200",
  failed: "bg-error-50 text-error-700 border border-error-200",
  reverted: "bg-neutral-100 text-neutral-600 border border-neutral-200",
};

type ChangelogTableProps = {
  items: ChangelogEntry[];
};

export function ChangelogTable({ items }: ChangelogTableProps) {
  const t = useTranslations("changelog");

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Mobile: card layout */}
      <div className="flex flex-col divide-y divide-neutral-200 md:hidden">
        {items.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-label-xs text-neutral-400">{entry.date}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                  statusStyles[entry.status],
                )}
              >
                {t(`status.${entry.status}`)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-xs text-neutral-400">{t("table.url")}</span>
              <span className="text-label-sm text-secondary-500 break-all">{entry.url}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-xs text-neutral-400">{t("table.field")}</span>
              <span className="text-label-sm font-medium text-secondary-500">{entry.field}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-label-xs text-neutral-400">{t("table.oldValue")}</span>
                <span className="text-label-sm text-neutral-500 line-clamp-2">{entry.old_value || "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-label-xs text-neutral-400">{t("table.newValue")}</span>
                <span className="text-label-sm text-secondary-500 line-clamp-2">{entry.new_value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-200 bg-neutral-50">
              <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                {t("table.date")}
              </TableHead>
              <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                {t("table.url")}
              </TableHead>
              <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                {t("table.field")}
              </TableHead>
              <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                {t("table.oldValue")}
              </TableHead>
              <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                {t("table.newValue")}
              </TableHead>
              <TableHead className="text-label-sm text-end font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                {t("table.status")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((entry) => (
              <TableRow key={entry.id} className="border-neutral-200">
                <TableCell className="py-3 px-4 text-label-sm text-neutral-500 whitespace-nowrap">
                  {entry.date}
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-secondary-500 max-w-[140px] truncate">
                  {entry.url}
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm font-medium text-secondary-500 whitespace-nowrap">
                  {entry.field}
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-neutral-500 max-w-[140px] truncate">
                  {entry.old_value || "—"}
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-secondary-500 max-w-[200px] truncate">
                  {entry.new_value}
                </TableCell>
                <TableCell className="py-3 px-4 text-end">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                      statusStyles[entry.status],
                    )}
                  >
                    {t(`status.${entry.status}`)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
