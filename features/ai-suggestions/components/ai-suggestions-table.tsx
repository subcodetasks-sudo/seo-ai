"use client";

import { MoreVertical, SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
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
import { cn, decodeUrlForDisplay } from "@/lib/utils";
import type { AiSuggestion, ImpactLevel } from "../types";

type AiSuggestionsTableProps = {
  items: AiSuggestion[];
  selectedIds: Set<string>;
  emptyMessage: string;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onIgnore: (id: string) => void;
};

const levelStyles: Record<ImpactLevel, string> = {
  high: "bg-error-50 text-error-600 border border-error-200",
  medium: "bg-warning-50 text-warning-600 border border-warning-200",
  low: "bg-neutral-100 text-neutral-500 border border-neutral-200",
};

export function AiSuggestionsTable({
  items,
  selectedIds,
  emptyMessage,
  onToggleSelect,
  onToggleSelectAll,
  onApprove,
  onReject,
  onIgnore,
}: AiSuggestionsTableProps) {
  const t = useTranslations("aiSuggestions");

  const typeLabels: Record<string, string> = {
    meta: t("types.meta"),
    og_title: t("types.og_title"),
    og_description: t("types.og_description"),
    schema: t("types.schema"),
    faq: t("types.faq"),
    redirect: t("types.redirect"),
    alt_text: t("types.alt_text"),
    internal_link: t("types.internal_link"),
    h1: t("types.h1"),
  };

  const selectableCount = items.filter((item) => item.status === "pending").length;
  const allSelected = selectableCount > 0 && selectedIds.size === selectableCount;
  const someSelected = selectedIds.size > 0 && selectedIds.size < selectableCount;

  function ActionButtons({ item }: { item: AiSuggestion }) {
    const isPending = item.status === "pending";
    return (
      <div className="flex items-center justify-end gap-2">
        {isPending && (
          <Button
            type="button"
            size="sm"
            onClick={() => onApprove(item.id)}
            className="gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm font-medium"
          >
            {t("approve")}
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          asChild
          className="gap-1.5 border-neutral-200 text-neutral-500 hover:bg-neutral-50 text-label-sm"
        >
          <Link href={`/dashboard/ai-suggestions/${item.id}`}>
            <SquarePen className="size-3.5" aria-hidden="true" />
            {t("review")}
          </Link>
        </Button>
        {isPending && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                aria-label={t("table.moreActions")}
                className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
              >
                <MoreVertical className="size-3.5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onReject(item.id)} variant="destructive">
                {t("reject")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onIgnore(item.id)}>{t("ignore")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      {/* Mobile: card layout */}
      <div className="flex flex-col divide-y divide-neutral-200 md:hidden">
        {items.length === 0 && <EmptyState title={emptyMessage} fullPage={false} className="border-0 py-10" />}
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedIds.has(item.id)}
                onCheckedChange={() => onToggleSelect(item.id)}
                disabled={item.status !== "pending"}
                className="mt-0.5 shrink-0"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <span className="text-label-sm wrap-break-word text-neutral-600">
                  <bdi dir="ltr">{decodeUrlForDisplay(item.url)}</bdi>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-label-xs text-neutral-400">{t("table.priority")}</span>
                    <span
                      className={cn(
                        "inline-flex w-fit rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                        levelStyles[item.priority],
                      )}
                    >
                      {t(`priority.${item.priority}`)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-label-xs text-neutral-400">{t("table.type")}</span>
                    <span className="text-label-sm font-medium text-secondary-500">
                      {typeLabels[item.type] ?? item.type}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-label-xs text-neutral-400">{t("table.impact")}</span>
                    <span
                      className={cn(
                        "inline-flex w-fit rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                        levelStyles[item.impact],
                      )}
                    >
                      {t(`impact.${item.impact}`)}
                    </span>
                  </div>
                </div>
                <ActionButtons item={item} />
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
              <TableHead className="w-12 px-3! py-3">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={onToggleSelectAll}
                  />
                </div>
              </TableHead>
              <TableHead className="text-label-sm text-start font-medium text-neutral-500 py-3 px-4">
                {t("table.url")}
              </TableHead>
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("table.priority")}
              </TableHead>
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("table.type")}
              </TableHead>
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("table.impact")}
              </TableHead>
              <TableHead className="text-label-sm text-end font-medium text-neutral-500 py-3 px-4">
                {t("table.action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && <TableEmptyRow colSpan={6} title={emptyMessage} />}
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={cn(
                  "border-neutral-200",
                  selectedIds.has(item.id) && "bg-primary-50/40",
                )}
              >
                <TableCell className="w-12 px-3! py-3">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => onToggleSelect(item.id)}
                      disabled={item.status !== "pending"}
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate py-3 px-4 text-start text-label-sm text-neutral-600">
                  <bdi dir="ltr">{decodeUrlForDisplay(item.url)}</bdi>
                </TableCell>
                <TableCell className="py-3 px-4 text-center">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                      levelStyles[item.priority],
                    )}
                  >
                    {t(`priority.${item.priority}`)}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-4 text-center text-label-sm font-medium text-secondary-500">
                  {typeLabels[item.type] ?? item.type}
                </TableCell>
                <TableCell className="py-3 px-4 text-center">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-label-xs font-medium",
                      levelStyles[item.impact],
                    )}
                  >
                    {t(`impact.${item.impact}`)}
                  </span>
                </TableCell>

                <TableCell className="py-3 px-4">
                  <ActionButtons item={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
