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
import { formatDuration } from "../services/format-duration";
import type { ScanLogEntry, ScanLogStatus } from "../types";

const statusStyles: Record<ScanLogStatus, string> = {
  completed: "bg-success-50 text-success-700 border border-success-200",
  done: "bg-success-50 text-success-700 border border-success-200",
  running: "bg-warning-50 text-warning-700 border border-warning-200",
  failed: "bg-error-50 text-error-700 border border-error-200",
};

function computeDurationSeconds(createdAt: string, finishedAt: string): number {
  return Math.round(
    (new Date(finishedAt).getTime() - new Date(createdAt).getTime()) / 1000,
  );
}

type ScanLogTableProps = {
  items: ScanLogEntry[];
};

export function ScanLogTable({ items }: ScanLogTableProps) {
  const t = useTranslations("reports.scanLog");

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-start text-h4 font-semibold text-secondary-500">
        {t("title")}
      </h3>
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        {/* Mobile: card layout */}
        <div className="flex flex-col divide-y divide-neutral-200 md:hidden">
          {items.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-label-xs text-neutral-400">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                    statusStyles[entry.status],
                  )}
                >
                  {t(`status.${entry.status}`)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-label-xs text-neutral-400">{t("table.pages")}</span>
                  <span className="text-label-sm font-medium text-secondary-500">
                    {entry.pages_crawled}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-label-xs text-neutral-400">{t("table.trigger")}</span>
                  <span className="text-label-sm font-medium text-secondary-500">
                    {t(`trigger.${entry.trigger}`)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-label-xs text-neutral-400">{t("table.duration")}</span>
                  <span className="text-label-sm text-secondary-500">
                    {formatDuration(computeDurationSeconds(entry.created_at, entry.finished_at))}
                  </span>
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
                  {t("table.pages")}
                </TableHead>
                <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                  {t("table.trigger")}
                </TableHead>
                <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                  {t("table.duration")}
                </TableHead>
                <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4 whitespace-nowrap">
                  {t("table.status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((entry) => (
                <TableRow key={entry.id} className="border-neutral-200">
                  <TableCell className="text-label-sm text-secondary-500 py-3 px-4 whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-label-sm text-secondary-500 py-3 px-4 whitespace-nowrap">
                    {entry.pages_crawled}
                  </TableCell>
                  <TableCell className="text-label-sm text-secondary-500 py-3 px-4 whitespace-nowrap">
                    {t(`trigger.${entry.trigger}`)}
                  </TableCell>
                  <TableCell className="text-label-sm text-secondary-500 py-3 px-4 whitespace-nowrap">
                    {formatDuration(computeDurationSeconds(entry.created_at, entry.finished_at))}
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-label-xs font-medium",
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
    </div>
  );
}
