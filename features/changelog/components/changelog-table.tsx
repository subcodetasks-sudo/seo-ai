"use client";

import { format } from "date-fns";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import { TableEmptyRow } from "@/components/table-empty-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, decodeUrlForDisplay } from "@/lib/utils";
import type { ChangelogEntry, ChangelogStatus } from "../types";

const statusStyles: Record<ChangelogStatus, string> = {
  applied: "bg-success-50 text-success-700 border border-success-200",
  pending: "bg-warning-50 text-warning-700 border border-warning-200",
  failed: "bg-error-50 text-error-700 border border-error-200",
  reverted: "bg-neutral-100 text-neutral-600 border border-neutral-200",
};

function formatChangeType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(iso: string): string {
  try {
    return format(new Date(iso), "yyyy-MM-dd");
  } catch {
    return iso;
  }
}

type StatusBadgeProps = {
  status: ChangelogStatus;
  errorMessage: string | null;
  label: string;
};

function StatusBadge({ status, errorMessage, label }: StatusBadgeProps) {
  const badge = (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-label-xs font-medium",
        statusStyles[status],
      )}
    >
      {label}
    </span>
  );

  if (status === "failed" && errorMessage) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent className="max-w-xs text-label-xs">{errorMessage}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

type ChangelogTableProps = {
  items: ChangelogEntry[];
  emptyMessage: string;
};

export function ChangelogTable({ items, emptyMessage }: ChangelogTableProps) {
  const t = useTranslations("changelog");

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Mobile: card layout */}
      <div className="flex flex-col divide-y divide-neutral-200 md:hidden">
        {items.length === 0 && <EmptyState title={emptyMessage} fullPage={false} className="border-0 py-10" />}
        {items.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-label-xs text-neutral-400">{formatDate(entry.applied_at)}</span>
              <StatusBadge
                status={entry.status}
                errorMessage={entry.error_message}
                label={t(`status.${entry.status}`)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-xs text-neutral-400">{t("table.url")}</span>
              <span className="text-label-sm text-secondary-500 break-all">
                <bdi dir="ltr">{decodeUrlForDisplay(entry.page_url)}</bdi>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-xs text-neutral-400">{t("table.field")}</span>
              <span className="text-label-sm font-medium text-secondary-500">
                {formatChangeType(entry.change_type)}
              </span>
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
            {items.length === 0 && <TableEmptyRow colSpan={6} title={emptyMessage} />}
            {items.map((entry) => (
              <TableRow key={entry.id} className="border-neutral-200">
                <TableCell className="py-3 px-4 text-label-sm text-neutral-500 whitespace-nowrap">
                  {formatDate(entry.applied_at)}
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-secondary-500 max-w-35 truncate">
                  <bdi dir="ltr">{decodeUrlForDisplay(entry.page_url)}</bdi>
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm font-medium text-secondary-500 whitespace-nowrap">
                  {formatChangeType(entry.change_type)}
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-neutral-500 max-w-35 truncate">
                  {entry.old_value || "—"}
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-secondary-500 max-w-50 truncate">
                  {entry.new_value}
                </TableCell>
                <TableCell className="py-3 px-4 text-end">
                  <StatusBadge
                    status={entry.status}
                    errorMessage={entry.error_message}
                    label={t(`status.${entry.status}`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
